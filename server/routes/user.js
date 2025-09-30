const express = require('express');
const jwt = require('jsonwebtoken');
const { getUserById, getUserActivity, logActivity } = require('../database/db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'xybershield_super_secret_key_change_in_production';

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await getUserById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Token authentication error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        
        // Log profile access
        await logActivity(user.id, 'PROFILE_ACCESS', 'User accessed profile', req.ip);

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                pseudo: user.pseudo,
                email: user.email,
                profilePicture: user.profile_picture,
                createdAt: user.created_at,
                lastLogin: user.last_login,
                emailVerified: user.email_verified
            }
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile'
        });
    }
});

// Get user activity log
router.get('/activity', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const limit = parseInt(req.query.limit) || 20;
        
        const activities = await getUserActivity(user.id, limit);

        res.json({
            success: true,
            activities: activities.map(activity => ({
                id: activity.id,
                type: activity.activity_type,
                description: activity.description,
                ipAddress: activity.ip_address,
                timestamp: activity.created_at
            }))
        });

    } catch (error) {
        console.error('Activity fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching activity'
        });
    }
});

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        
        // Get recent activity
        const recentActivity = await getUserActivity(user.id, 5);
        
        // Log dashboard access
        await logActivity(user.id, 'DASHBOARD_ACCESS', 'User accessed dashboard', req.ip);

        // Calculate account age
        const accountAge = Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24));

        res.json({
            success: true,
            dashboard: {
                user: {
                    id: user.id,
                    name: user.name,
                    pseudo: user.pseudo,
                    email: user.email,
                    profilePicture: user.profile_picture,
                    memberSince: user.created_at,
                    lastLogin: user.last_login,
                    accountAge: accountAge
                },
                stats: {
                    totalLogins: recentActivity.filter(a => a.activity_type === 'LOGIN').length,
                    accountAge: accountAge,
                    emailVerified: user.email_verified
                },
                recentActivity: recentActivity.map(activity => ({
                    type: activity.activity_type,
                    description: activity.description,
                    timestamp: activity.created_at
                }))
            }
        });

    } catch (error) {
        console.error('Dashboard fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching dashboard'
        });
    }
});

module.exports = router;
