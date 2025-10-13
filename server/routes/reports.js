const express = require('express');
// const multer = require('multer'); // Temporairement commenté
const path = require('path');
const fs = require('fs');
const validator = require('validator');
const rateLimit = require('express-rate-limit');
const { 
    createReport, 
    getReportByReference, 
    getReportsByUserId, 
    getAllReports,
    updateReportStatus,
    addReportFile,
    getReportFiles,
    generateReferenceNumber,
    logActivity
} = require('../database/db');

const router = express.Router();

// Rate limiting for report endpoints
const reportRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum 5 reports per 15 minutes per IP
    message: {
        success: false,
        message: 'Too many reports submitted. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Configure multer for file uploads - TEMPORAIREMENT COMMENTÉ
/*
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/reports');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `report-${uniqueSuffix}${extension}`);
    }
});

// File filter for security
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, PDF, and documents are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 5 // Maximum 5 files
    }
});
*/

// Middleware temporaire pour remplacer multer
const upload = {
    array: (fieldName, maxCount) => (req, res, next) => {
        // Simuler multer sans traitement de fichiers
        req.files = [];
        next();
    }
};

// Middleware to extract user info from token (optional for anonymous reports)
const optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
        try {
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'xybershield_super_secret_key_change_in_production_please');
            req.user = decoded;
        } catch (error) {
            // Token invalid, but continue as anonymous
            req.user = null;
        }
    } else {
        req.user = null;
    }
    
    next();
};

// Validation helper functions
const validateReportData = (data) => {
    const errors = [];
    
    // Required fields validation
    if (!data.fullName || data.fullName.trim().length < 2) {
        errors.push('Full name is required and must be at least 2 characters');
    }
    
    if (!data.email || !validator.isEmail(data.email)) {
        errors.push('Valid email address is required');
    }
    
    if (data.phone && !validator.isMobilePhone(data.phone, 'any', { strictMode: false })) {
        errors.push('Invalid phone number format');
    }
    
    if (!data.incidentType || data.incidentType.trim().length === 0) {
        errors.push('Incident type is required');
    }
    
    if (!data.incidentDate || !validator.isISO8601(data.incidentDate)) {
        errors.push('Valid incident date is required');
    }
    
    if (!data.description || data.description.trim().length < 10) {
        errors.push('Description is required and must be at least 10 characters');
    }
    
    if (!data.impactLevel || !['low', 'medium', 'high', 'critical'].includes(data.impactLevel)) {
        errors.push('Valid impact level is required');
    }
    
    return errors;
};

// === ROUTES ===

// POST /api/reports - Submit a new report
router.post('/', reportRateLimit, optionalAuth, upload.array('files', 5), async (req, res) => {
    try {
        console.log('📝 New report submission received');
        
        // Parse form data
        const reportData = {
            fullName: req.body.fullName?.trim(),
            email: req.body.email?.trim().toLowerCase(),
            phone: req.body.phone?.trim(),
            organization: req.body.organization?.trim(),
            incidentType: req.body.incidentType?.trim(),
            incidentDate: req.body.incidentDate,
            incidentLocation: req.body.incidentLocation?.trim(),
            description: req.body.description?.trim(),
            impactLevel: req.body.impactLevel?.toLowerCase(),
            affectedSystems: req.body.affectedSystems?.trim(),
            previousIncidents: req.body.previousIncidents === 'true' || req.body.previousIncidents === true,
            securityMeasures: req.body.securityMeasures?.trim(),
            additionalComments: req.body.additionalComments?.trim()
        };
        
        // Validate input data
        const validationErrors = validateReportData(reportData);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }
        
        // Generate unique reference number
        const referenceNumber = generateReferenceNumber();
        
        // Get client info
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');
        
        // Prepare report data for database
        const dbReportData = {
            referenceNumber,
            userId: req.user?.userId || null,
            fullName: reportData.fullName,
            email: reportData.email,
            phone: reportData.phone,
            organization: reportData.organization,
            incidentType: reportData.incidentType,
            incidentDate: reportData.incidentDate,
            incidentLocation: reportData.incidentLocation,
            description: reportData.description,
            impactLevel: reportData.impactLevel,
            affectedSystems: reportData.affectedSystems,
            previousIncidents: reportData.previousIncidents,
            securityMeasures: reportData.securityMeasures,
            additionalComments: reportData.additionalComments,
            ipAddress,
            userAgent
        };
        
        // Create report in database
        const report = await createReport(dbReportData);
        
        // Handle file uploads if any
        const uploadedFiles = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const fileData = {
                    reportId: report.id,
                    filename: file.filename,
                    originalName: file.originalname,
                    filePath: file.path,
                    fileSize: file.size,
                    mimeType: file.mimetype
                };
                
                const fileRecord = await addReportFile(fileData);
                uploadedFiles.push({
                    id: fileRecord.id,
                    originalName: file.originalname,
                    size: file.size
                });
            }
        }
        
        // Log activity if user is authenticated
        if (req.user?.userId) {
            await logActivity({
                userId: req.user.userId,
                activityType: 'REPORT_SUBMITTED',
                description: `Submitted incident report: ${referenceNumber}`,
                ipAddress,
                userAgent
            });
        }
        
        console.log(`✅ Report created successfully: ${referenceNumber}`);
        
        res.status(201).json({
            success: true,
            message: 'Report submitted successfully',
            data: {
                referenceNumber: report.referenceNumber,
                reportId: report.id,
                status: 'pending',
                filesUploaded: uploadedFiles.length,
                files: uploadedFiles
            }
        });
        
    } catch (error) {
        console.error('❌ Error creating report:', error);
        
        // Clean up uploaded files on error
        if (req.files) {
            req.files.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.error('Error deleting file:', err);
                });
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Internal server error while processing report',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
});

// GET /api/reports/:reference - Get report by reference number
router.get('/:reference', async (req, res) => {
    try {
        const { reference } = req.params;
        
        if (!reference || reference.length < 5) {
            return res.status(400).json({
                success: false,
                message: 'Invalid reference number'
            });
        }
        
        const report = await getReportByReference(reference);
        
        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }
        
        // Get associated files
        const files = await getReportFiles(report.id);
        
        // Remove sensitive information for public access
        const publicReport = {
            referenceNumber: report.reference_number,
            incidentType: report.incident_type,
            incidentDate: report.incident_date,
            status: report.status,
            priority: report.priority,
            createdAt: report.created_at,
            updatedAt: report.updated_at,
            filesCount: files.length
        };
        
        res.json({
            success: true,
            data: publicReport
        });
        
    } catch (error) {
        console.error('❌ Error fetching report:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching report'
        });
    }
});

// GET /api/reports/user/my-reports - Get current user's reports (requires auth)
router.get('/user/my-reports', optionalAuth, async (req, res) => {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        
        const reports = await getReportsByUserId(req.user.userId, 20);
        
        // Format reports for response
        const formattedReports = reports.map(report => ({
            id: report.id,
            referenceNumber: report.reference_number,
            incidentType: report.incident_type,
            incidentDate: report.incident_date,
            status: report.status,
            priority: report.priority,
            createdAt: report.created_at,
            updatedAt: report.updated_at
        }));
        
        res.json({
            success: true,
            data: formattedReports,
            count: formattedReports.length
        });
        
    } catch (error) {
        console.error('❌ Error fetching user reports:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reports'
        });
    }
});

// GET /api/reports/stats - Get report statistics
router.get('/stats/overview', async (req, res) => {
    try {
        // This would typically require admin authentication
        // For now, we'll provide basic public stats
        
        const stats = {
            totalReports: 0,
            pendingReports: 0,
            resolvedReports: 0,
            criticalReports: 0
        };
        
        // You can implement actual database queries here
        // const totalReports = await db.get('SELECT COUNT(*) as count FROM reports');
        
        res.json({
            success: true,
            data: stats
        });
        
    } catch (error) {
        console.error('❌ Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics'
        });
    }
});

module.exports = router;
