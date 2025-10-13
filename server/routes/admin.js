const express = require('express');
const { getAllReports, getReportFiles, updateReportStatus } = require('../database/db');
const router = express.Router();

// Simple admin auth (replace with proper auth in production)
const adminAuth = (req, res, next) => next();

// GET all reports
router.get('/reports', adminAuth, async (req, res) => {
    try {
        const reports = await getAllReports(100);
        const formatted = reports.map(r => ({
            id: r.id,
            referenceNumber: r.reference_number,
            fullName: r.full_name,
            email: r.email,
            incidentType: r.incident_type,
            incidentLocation: r.incident_location,
            status: r.status,
            priority: r.priority || 'medium',
            createdAt: r.created_at
        }));
        
        res.json({ success: true, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching reports' });
    }
});

// GET report details
router.get('/reports/:id', adminAuth, async (req, res) => {
    try {
        const reports = await getAllReports(1000);
        const report = reports.find(r => r.id == req.params.id);
        
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }
        
        const files = await getReportFiles(report.id);
        
        res.json({
            success: true,
            data: {
                ...report,
                files: files.map(f => ({
                    id: f.id,
                    filename: f.filename,
                    originalName: f.original_name,
                    fileSize: f.file_size
                }))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching report' });
    }
});

// Update report status
router.put('/reports/:id/status', adminAuth, async (req, res) => {
    try {
        const { status, priority } = req.body;
        await updateReportStatus(req.params.id, { status, priority });
        res.json({ success: true, message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating status' });
    }
});

// Get files for a report
router.get('/files/:reportId', adminAuth, async (req, res) => {
    try {
        const files = await getReportFiles(req.params.reportId);
        const formatted = files.map(f => ({
            id: f.id,
            filename: f.filename,
            originalName: f.original_name,
            fileSize: f.file_size,
            mimeType: f.mime_type,
            uploadedAt: f.uploaded_at
        }));
        res.json({ success: true, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching files' });
    }
});

// Download file
router.get('/files/download/:fileId', adminAuth, async (req, res) => {
    try {
        const path = require('path');
        const fs = require('fs');
        
        // Get all reports to find the file
        const reports = await getAllReports(1000);
        let targetFile = null;
        
        for (const report of reports) {
            const files = await getReportFiles(report.id);
            targetFile = files.find(f => f.id == req.params.fileId);
            if (targetFile) break;
        }
        
        if (!targetFile) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }
        
        const filePath = path.resolve(targetFile.file_path);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'File not found on disk' });
        }
        
        res.setHeader('Content-Disposition', `attachment; filename="${targetFile.original_name}"`);
        res.setHeader('Content-Type', targetFile.mime_type);
        
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error downloading file' });
    }
});

// Get stats
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const reports = await getAllReports(1000);
        const stats = {
            total: reports.length,
            pending: reports.filter(r => r.status === 'pending').length,
            resolved: reports.filter(r => r.status === 'resolved').length,
            critical: reports.filter(r => r.priority === 'critical').length
        };
        res.json({ success: true, data: stats });
    } catch (error) {
        res.json({ success: true, data: { total: 0, pending: 0, resolved: 0, critical: 0 } });
    }
});

module.exports = router;
