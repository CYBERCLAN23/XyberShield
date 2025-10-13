const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../database/xybershield.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

// Initialize database tables
const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        // Users table
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                pseudo TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                profile_picture TEXT DEFAULT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_login DATETIME DEFAULT NULL,
                is_active BOOLEAN DEFAULT 1,
                email_verified BOOLEAN DEFAULT 0
            )
        `;

        // User sessions table for tracking logins
        const createSessionsTable = `
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token_hash TEXT NOT NULL,
                ip_address TEXT,
                user_agent TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                expires_at DATETIME NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        `;

        // User activity log
        const createUserActivityTable = `
            CREATE TABLE IF NOT EXISTS user_activity (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                activity_type TEXT NOT NULL,
                description TEXT,
                ip_address TEXT,
                user_agent TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `;

        // Reports table for incident reports
        const createReportsTable = `
            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                reference_number TEXT UNIQUE NOT NULL,
                user_id INTEGER,
                
                -- Personal Information
                full_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                organization TEXT,
                
                -- Incident Details
                incident_type TEXT NOT NULL,
                incident_date DATETIME NOT NULL,
                incident_location TEXT,
                description TEXT NOT NULL,
                impact_level TEXT NOT NULL,
                affected_systems TEXT,
                
                -- Additional Information
                previous_incidents BOOLEAN DEFAULT 0,
                security_measures TEXT,
                additional_comments TEXT,
                
                -- System Information
                ip_address TEXT,
                user_agent TEXT,
                status TEXT DEFAULT 'pending',
                priority TEXT DEFAULT 'medium',
                assigned_to TEXT,
                
                -- Timestamps
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `;

        // Report files table for file attachments
        const createReportFilesTable = `
            CREATE TABLE IF NOT EXISTS report_files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                report_id INTEGER NOT NULL,
                filename TEXT NOT NULL,
                original_name TEXT NOT NULL,
                file_path TEXT NOT NULL,
                file_size INTEGER,
                mime_type TEXT,
                uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (report_id) REFERENCES reports (id) ON DELETE CASCADE
            )
        `;

        db.serialize(() => {
            db.run(createUsersTable, (err) => {
                if (err) {
                    console.error('❌ Error creating users table:', err.message);
                    reject(err);
                } else {
                    console.log('✅ Users table ready');
                }
            });

            db.run(createSessionsTable, (err) => {
                if (err) {
                    console.error('❌ Error creating sessions table:', err.message);
                    reject(err);
                } else {
                    console.log('✅ Sessions table ready');
                }
            });

            db.run(createUserActivityTable, (err) => {
                if (err) {
                    console.error('❌ Error creating activity table:', err.message);
                    reject(err);
                } else {
                    console.log('✅ Activity table ready');
                }
            });

            db.run(createReportsTable, (err) => {
                if (err) {
                    console.error('❌ Error creating reports table:', err.message);
                    reject(err);
                } else {
                    console.log('✅ Reports table ready');
                }
            });

            db.run(createReportFilesTable, (err) => {
                if (err) {
                    console.error('❌ Error creating report files table:', err.message);
                    reject(err);
                } else {
                    console.log('✅ Report files table ready');
                    resolve();
                }
            });
        });
    });
};

// Database helper functions
const dbHelpers = {
    // Get user by email
    getUserByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Get user by pseudo
    getUserByPseudo: (pseudo) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE pseudo = ?', [pseudo], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Get user by ID
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT id, name, pseudo, email, profile_picture, created_at, last_login, email_verified FROM users WHERE id = ? AND is_active = 1', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    // Create new user
    createUser: (userData) => {
        return new Promise((resolve, reject) => {
            const { name, pseudo, email, password } = userData;
            db.run(
                'INSERT INTO users (name, pseudo, email, password) VALUES (?, ?, ?, ?)',
                [name, pseudo, email, password],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...userData });
                }
            );
        });
    },

    // Update user last login
    updateLastLogin: (userId) => {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                [userId],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    },

    // Log user activity
    logActivity: (userId, activityType, description, ipAddress) => {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO user_activity (user_id, activity_type, description, ip_address) VALUES (?, ?, ?, ?)',
                [userId, activityType, description, ipAddress],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    },

    // Get user activity
    getUserActivity: (userId, limit = 10) => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM user_activity WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
                [userId, limit],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    // Create session
    createSession: (sessionData) => {
        return new Promise((resolve, reject) => {
            const { userId, tokenHash, ipAddress, userAgent, expiresAt } = sessionData;
            db.run(
                'INSERT INTO user_sessions (user_id, token_hash, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)',
                [userId, tokenHash, ipAddress, userAgent, expiresAt],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID });
                }
            );
        });
    },

    // Invalidate session
    invalidateSession: (tokenHash) => {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE user_sessions SET is_active = 0 WHERE token_hash = ?',
                [tokenHash],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    },

    // === REPORTS FUNCTIONS ===

    // Create a new report
    createReport: (reportData) => {
        return new Promise((resolve, reject) => {
            const {
                referenceNumber, userId, fullName, email, phone, organization,
                incidentType, incidentDate, incidentLocation, description,
                impactLevel, affectedSystems, previousIncidents, securityMeasures,
                additionalComments, ipAddress, userAgent
            } = reportData;

            const sql = `
                INSERT INTO reports (
                    reference_number, user_id, full_name, email, phone, organization,
                    incident_type, incident_date, incident_location, description,
                    impact_level, affected_systems, previous_incidents, security_measures,
                    additional_comments, ip_address, user_agent
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.run(sql, [
                referenceNumber, userId, fullName, email, phone, organization,
                incidentType, incidentDate, incidentLocation, description,
                impactLevel, affectedSystems, previousIncidents, securityMeasures,
                additionalComments, ipAddress, userAgent
            ], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, referenceNumber });
            });
        });
    },

    // Get report by reference number
    getReportByReference: (referenceNumber) => {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM reports WHERE reference_number = ?',
                [referenceNumber],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    },

    // Get reports by user ID
    getReportsByUserId: (userId, limit = 10) => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
                [userId, limit],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    // Get all reports (admin function)
    getAllReports: (limit = 50, offset = 0) => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM reports ORDER BY created_at DESC LIMIT ? OFFSET ?',
                [limit, offset],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    // Update report status
    updateReportStatus: (reportId, status, assignedTo = null) => {
        return new Promise((resolve, reject) => {
            const sql = assignedTo 
                ? 'UPDATE reports SET status = ?, assigned_to = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
                : 'UPDATE reports SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            
            const params = assignedTo ? [status, assignedTo, reportId] : [status, reportId];

            db.run(sql, params, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    // Add file to report
    addReportFile: (fileData) => {
        return new Promise((resolve, reject) => {
            const { reportId, filename, originalName, filePath, fileSize, mimeType } = fileData;
            
            db.run(
                'INSERT INTO report_files (report_id, filename, original_name, file_path, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?)',
                [reportId, filename, originalName, filePath, fileSize, mimeType],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID });
                }
            );
        });
    },

    // Get files for a report
    getReportFiles: (reportId) => {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM report_files WHERE report_id = ? ORDER BY uploaded_at DESC',
                [reportId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    // Generate unique reference number
    generateReferenceNumber: () => {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `XS-${timestamp}-${random}`;
    }
};

module.exports = {
    db,
    initializeDatabase,
    ...dbHelpers
};
