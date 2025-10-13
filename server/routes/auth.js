const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const rateLimit = require('express-rate-limit');
const { 
    getUserByEmail, 
    getUserByPseudo, 
    getUserById,
    createUser, 
    updateLastLogin, 
    logActivity,
    createSession,
    invalidateSession
} = require('../database/db');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs for auth
    message: { success: false, message: 'Too many authentication attempts, please try again later.' }
});

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'xybershield_super_secret_key_change_in_production';

// Helper function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Helper function to hash token for storage
const hashToken = (token) => {
    return bcrypt.hashSync(token, 10);
};

// Register endpoint
router.post('/register', authLimiter, async (req, res) => {
    try {
        const { name, pseudo, email, password, confirmPassword } = req.body;

        // Validation
        if (!name || !pseudo || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Check if user already exists
        const existingUserByEmail = await getUserByEmail(email);
        if (existingUserByEmail) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const existingUserByPseudo = await getUserByPseudo(pseudo);
        if (existingUserByPseudo) {
            return res.status(400).json({
                success: false,
                message: 'Username (pseudo) already taken'
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = await createUser({
            name: name.trim(),
            pseudo: pseudo.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        // Generate JWT token
        const token = generateToken(newUser.id);
        const tokenHash = hashToken(token);

        // Create session
        await createSession({
            userId: newUser.id,
            tokenHash,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });

        // Log activity
        await logActivity(newUser.id, 'REGISTER', 'User registered successfully', req.ip);

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                pseudo: newUser.pseudo,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// Login endpoint
router.post('/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await getUserByEmail(email.toLowerCase().trim());
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            // Log failed login attempt
            await logActivity(user.id, 'LOGIN_FAILED', 'Invalid password attempt', req.ip);
            
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken(user.id);
        const tokenHash = hashToken(token);

        // Create session
        await createSession({
            userId: user.id,
            tokenHash,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        });

        // Update last login
        await updateLastLogin(user.id);

        // Log successful login
        await logActivity(user.id, 'LOGIN', 'User logged in successfully', req.ip);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                pseudo: user.pseudo,
                email: user.email,
                lastLogin: user.last_login
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (token) {
            const tokenHash = hashToken(token);
            await invalidateSession(tokenHash);
        }

        res.json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await getUserById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                pseudo: user.pseudo,
                email: user.email,
                lastLogin: user.last_login
            }
        });

    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
});

module.exports = router;
