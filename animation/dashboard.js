// Dashboard JavaScript
class Dashboard {
    constructor() {
        this.apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:5000/api'
            : `${window.location.origin}/api`;
        
        this.token = localStorage.getItem('token');
        this.user = null;
        
        this.init();
    }

    async init() {
        // Check if user is authenticated
        if (!this.token) {
            this.showNotification('No authentication token found. Please login.', 'error');
            setTimeout(() => this.redirectToLogin(), 2000);
            return;
        }

        // Try to get user data from localStorage first
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                this.user = JSON.parse(savedUser);
                this.updateUserProfile(this.user);
                this.updateBasicStats();
            } catch (e) {
                console.error('Error parsing saved user data:', e);
            }
        }

        try {
            // Try to verify token and get fresh data from backend
            await this.verifyToken();
            await this.loadDashboardData();
        } catch (error) {
            console.error('Dashboard initialization error:', error);
            
            // If we have saved user data, show it with a warning
            if (this.user) {
                this.showNotification('Backend unavailable. Showing cached data.', 'error');
                this.updateOfflineMode();
            } else {
                this.showNotification('Session expired. Please login again.', 'error');
                setTimeout(() => this.redirectToLogin(), 3000);
            }
        }
    }

    async verifyToken() {
        const response = await fetch(`${this.apiUrl}/auth/verify`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Token verification failed');
        }

        const data = await response.json();
        this.user = data.user;
        return data;
    }

    async loadDashboardData() {
        try {
            // Load user profile and dashboard data
            const [profileResponse, dashboardResponse, activityResponse] = await Promise.all([
                fetch(`${this.apiUrl}/user/profile`, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                }),
                fetch(`${this.apiUrl}/user/dashboard`, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                }),
                fetch(`${this.apiUrl}/user/activity?limit=10`, {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                })
            ]);

            const profileData = await profileResponse.json();
            const dashboardData = await dashboardResponse.json();
            const activityData = await activityResponse.json();

            if (profileData.success) {
                this.updateUserProfile(profileData.user);
            }

            if (dashboardData.success) {
                this.updateDashboardStats(dashboardData.dashboard);
            }

            if (activityData.success) {
                this.updateActivityList(activityData.activities);
            }

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showNotification('Error loading dashboard data', 'error');
        }
    }

    updateUserProfile(user) {
        // Update header user info
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const welcomeName = document.getElementById('welcomeName');

        if (userAvatar) {
            userAvatar.textContent = (user.name || user.pseudo || 'U').charAt(0).toUpperCase();
        }

        if (userName) {
            userName.textContent = user.name || user.pseudo || 'User';
        }

        if (userEmail) {
            userEmail.textContent = user.email || 'No email';
        }

        if (welcomeName) {
            welcomeName.textContent = user.name || user.pseudo || 'User';
        }

        // Update profile section
        const profileName = document.getElementById('profileName');
        const profilePseudo = document.getElementById('profilePseudo');
        const profileEmail = document.getElementById('profileEmail');
        const profileId = document.getElementById('profileId');

        if (profileName) profileName.textContent = user.name || 'Not specified';
        if (profilePseudo) profilePseudo.textContent = user.pseudo || 'Not specified';
        if (profileEmail) profileEmail.textContent = user.email || 'Not specified';
        if (profileId) profileId.textContent = `#${user.id}` || 'Unknown';
    }

    updateDashboardStats(dashboard) {
        const user = dashboard.user;
        const stats = dashboard.stats;

        // Update member since
        const memberSince = document.getElementById('memberSince');
        if (memberSince && user.memberSince) {
            const date = new Date(user.memberSince);
            memberSince.textContent = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        // Update last login
        const lastLogin = document.getElementById('lastLogin');
        if (lastLogin && user.lastLogin) {
            const date = new Date(user.lastLogin);
            lastLogin.textContent = this.formatRelativeTime(date);
        } else if (lastLogin) {
            lastLogin.textContent = 'First login';
        }

        // Update email status
        const emailStatus = document.getElementById('emailStatus');
        if (emailStatus) {
            emailStatus.textContent = stats.emailVerified ? 'Verified' : 'Not Verified';
            emailStatus.style.color = stats.emailVerified ? '#00ff66' : '#ff6666';
        }

        // Update account status
        const accountStatus = document.getElementById('accountStatus');
        if (accountStatus) {
            accountStatus.textContent = 'Active';
            accountStatus.style.color = '#00ff66';
        }
    }

    updateActivityList(activities) {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        if (!activities || activities.length === 0) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-type">No Activity</div>
                        <div class="activity-description">No recent activity found</div>
                    </div>
                </div>
            `;
            return;
        }

        const activityHTML = activities.map(activity => {
            const icon = this.getActivityIcon(activity.type);
            const time = new Date(activity.timestamp);
            
            return `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-type">${this.formatActivityType(activity.type)}</div>
                        <div class="activity-description">${activity.description || 'No description'}</div>
                        <div class="activity-time">${this.formatRelativeTime(time)}</div>
                    </div>
                </div>
            `;
        }).join('');

        activityList.innerHTML = activityHTML;
    }

    updateBasicStats() {
        if (!this.user) return;

        // Update basic user info without backend data
        const memberSince = document.getElementById('memberSince');
        const lastLogin = document.getElementById('lastLogin');
        const emailStatus = document.getElementById('emailStatus');
        const accountStatus = document.getElementById('accountStatus');

        if (memberSince) {
            memberSince.textContent = 'Recently joined';
        }

        if (lastLogin) {
            lastLogin.textContent = 'Current session';
        }

        if (emailStatus) {
            emailStatus.textContent = 'Unknown';
            emailStatus.style.color = '#ffa500';
        }

        if (accountStatus) {
            accountStatus.textContent = 'Active';
            accountStatus.style.color = '#00ff66';
        }
    }

    updateOfflineMode() {
        // Show offline activity
        const activityList = document.getElementById('activityList');
        if (activityList) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-wifi" style="color: #ffa500;"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-type">Offline Mode</div>
                        <div class="activity-description">Backend unavailable. Start the server to see live data.</div>
                        <div class="activity-time">Now</div>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-sign-in-alt"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-type">Login</div>
                        <div class="activity-description">Successfully logged in</div>
                        <div class="activity-time">Current session</div>
                    </div>
                </div>
            `;
        }
    }

    getActivityIcon(type) {
        const icons = {
            'LOGIN': 'fa-sign-in-alt',
            'REGISTER': 'fa-user-plus',
            'LOGOUT': 'fa-sign-out-alt',
            'PROFILE_ACCESS': 'fa-user',
            'DASHBOARD_ACCESS': 'fa-tachometer-alt',
            'LOGIN_FAILED': 'fa-exclamation-triangle'
        };
        return icons[type] || 'fa-circle';
    }

    formatActivityType(type) {
        const types = {
            'LOGIN': 'Login',
            'REGISTER': 'Registration',
            'LOGOUT': 'Logout',
            'PROFILE_ACCESS': 'Profile Access',
            'DASHBOARD_ACCESS': 'Dashboard Access',
            'LOGIN_FAILED': 'Failed Login'
        };
        return types[type] || type;
    }

    formatRelativeTime(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        if (!notification) return;

        notification.textContent = message;
        notification.className = `notification ${type} show`;

        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    async logout() {
        try {
            // Call logout endpoint
            await fetch(`${this.apiUrl}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.showNotification('Logged out successfully', 'success');
            setTimeout(() => this.redirectToLogin(), 1000);
        }
    }

    redirectToLogin() {
        window.location.href = 'login.html';
    }

    async refreshData() {
        this.showNotification('Refreshing data...', 'success');
        try {
            await this.loadDashboardData();
            this.showNotification('Data refreshed successfully', 'success');
        } catch (error) {
            this.showNotification('Error refreshing data', 'error');
        }
    }
}

// Global functions for button clicks
function logout() {
    if (window.dashboardInstance) {
        window.dashboardInstance.logout();
    }
}

function refreshData() {
    if (window.dashboardInstance) {
        window.dashboardInstance.refreshData();
    }
}

function goToHome() {
    window.location.href = 'index.html';
}

function goToReports() {
    window.location.href = 'report.html';
}

function goToEducation() {
    window.location.href = 'Education.html';
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardInstance = new Dashboard();
});

// Handle page visibility change to refresh data when user returns
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.dashboardInstance) {
        window.dashboardInstance.refreshData();
    }
});
