// Enhanced Storage Manager for Cloudflare Pages
class StorageManager {
    constructor() {
        this.storageKey = 'projectRecordsData';
        this.sessionKey = 'projectRecordsSession';
        this.init();
    }

    init() {
        // Test storage availability
        this.testStorage();
    }

    testStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            this.localStorageAvailable = true;
        } catch (e) {
            this.localStorageAvailable = false;
            console.warn('localStorage not available, using fallback');
        }

        try {
            sessionStorage.setItem('test', 'test');
            sessionStorage.removeItem('test');
            this.sessionStorageAvailable = true;
        } catch (e) {
            this.sessionStorageAvailable = false;
            console.warn('sessionStorage not available, using fallback');
        }
    }

    // Save data with multiple fallbacks
    saveData(key, data, type = 'local') {
        try {
            const serializedData = JSON.stringify(data);
            
            if (type === 'local') {
                if (this.localStorageAvailable) {
                    localStorage.setItem(key, serializedData);
                } else {
                    // Fallback to sessionStorage
                    if (this.sessionStorageAvailable) {
                        sessionStorage.setItem(key, serializedData);
                    } else {
                        // Fallback to memory
                        this.memoryStorage = this.memoryStorage || {};
                        this.memoryStorage[key] = serializedData;
                    }
                }
            } else if (type === 'session') {
                if (this.sessionStorageAvailable) {
                    sessionStorage.setItem(key, serializedData);
                } else {
                    // Fallback to localStorage
                    if (this.localStorageAvailable) {
                        localStorage.setItem(key, serializedData);
                    } else {
                        // Fallback to memory
                        this.memoryStorage = this.memoryStorage || {};
                        this.memoryStorage[key] = serializedData;
                    }
                }
            }
            
            console.log('✅ Data saved successfully:', key);
            return true;
        } catch (error) {
            console.error('❌ Failed to save data:', error);
            return false;
        }
    }

    // Load data with multiple fallbacks
    loadData(key, type = 'local') {
        try {
            let data = null;
            
            if (type === 'local') {
                if (this.localStorageAvailable) {
                    data = localStorage.getItem(key);
                } else if (this.sessionStorageAvailable) {
                    data = sessionStorage.getItem(key);
                } else {
                    this.memoryStorage = this.memoryStorage || {};
                    data = this.memoryStorage[key];
                }
            } else if (type === 'session') {
                if (this.sessionStorageAvailable) {
                    data = sessionStorage.getItem(key);
                } else if (this.localStorageAvailable) {
                    data = localStorage.getItem(key);
                } else {
                    this.memoryStorage = this.memoryStorage || {};
                    data = this.memoryStorage[key];
                }
            }
            
            if (data) {
                return JSON.parse(data);
            }
            return null;
        } catch (error) {
            console.error('❌ Failed to load data:', error);
            return null;
        }
    }

    // Remove data
    removeData(key, type = 'local') {
        try {
            if (type === 'local') {
                if (this.localStorageAvailable) {
                    localStorage.removeItem(key);
                }
                if (this.sessionStorageAvailable) {
                    sessionStorage.removeItem(key);
                }
                if (this.memoryStorage && this.memoryStorage[key]) {
                    delete this.memoryStorage[key];
                }
            } else if (type === 'session') {
                if (this.sessionStorageAvailable) {
                    sessionStorage.removeItem(key);
                }
                if (this.localStorageAvailable) {
                    localStorage.removeItem(key);
                }
                if (this.memoryStorage && this.memoryStorage[key]) {
                    delete this.memoryStorage[key];
                }
            }
            console.log('✅ Data removed successfully:', key);
            return true;
        } catch (error) {
            console.error('❌ Failed to remove data:', error);
            return false;
        }
    }

    // Clear all data
    clearAll() {
        try {
            if (this.localStorageAvailable) {
                localStorage.clear();
            }
            if (this.sessionStorageAvailable) {
                sessionStorage.clear();
            }
            this.memoryStorage = {};
            console.log('✅ All data cleared successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to clear data:', error);
            return false;
        }
    }

    // Get storage info
    getStorageInfo() {
        const info = {
            localStorage: this.localStorageAvailable,
            sessionStorage: this.sessionStorageAvailable,
            memoryStorage: !!(this.memoryStorage && Object.keys(this.memoryStorage).length > 0)
        };
        console.log('Storage Info:', info);
        return info;
    }
}

// Global storage manager instance
window.storageManager = new StorageManager();

// Enhanced AuthManager with better storage
class EnhancedAuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkLogin();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for storage changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'currentUser') {
                this.checkLogin();
            }
        });

        // Listen for page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkLogin();
            }
        });
    }

    checkLogin() {
        try {
            // Try multiple storage methods
            let userData = window.storageManager.loadData('currentUser', 'session');
            
            if (!userData) {
                userData = window.storageManager.loadData('currentUser', 'local');
            }

            if (userData) {
                this.currentUser = userData;
                this.updateUserInfo();
                this.showLoggedInState();
                return true;
            } else {
                this.currentUser = null;
                this.showLoggedOutState();
                return false;
            }
        } catch (error) {
            console.error('Login check failed:', error);
            this.showLoggedOutState();
            return false;
        }
    }

    login(username, password, role = 'user') {
        try {
            const user = {
                username: username,
                role: role,
                loginTime: new Date().toLocaleString(),
                sessionId: this.generateSessionId()
            };

            // Save to multiple storage locations
            const savedToSession = window.storageManager.saveData('currentUser', user, 'session');
            const savedToLocal = window.storageManager.saveData('currentUser', user, 'local');

            if (savedToSession || savedToLocal) {
                this.currentUser = user;
                this.updateUserInfo();
                this.showLoggedInState();
                this.showNotification('Login successful!', 'success');
                return true;
            } else {
                this.showNotification('Login failed - storage error', 'error');
                return false;
            }
        } catch (error) {
            console.error('Login failed:', error);
            this.showNotification('Login failed', 'error');
            return false;
        }
    }

    logout() {
        try {
            window.storageManager.removeData('currentUser', 'session');
            window.storageManager.removeData('currentUser', 'local');
            this.currentUser = null;
            this.showLoggedOutState();
            this.showNotification('Logged out successfully', 'info');
            
            // Redirect to login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    generateSessionId() {
        return 'session_' + Math.random().toString(36).substring(2, 15) + Date.now();
    }

    updateUserInfo() {
        if (this.currentUser) {
            const userInfoElements = document.querySelectorAll('.user-info');
            userInfoElements.forEach(element => {
                if (element) {
                    element.innerHTML = `
                        <div class="user-details">
                            <strong>${this.currentUser.username}</strong>
                            <span class="user-role">${this.currentUser.role}</span>
                            <small class="login-time">Login: ${this.currentUser.loginTime}</small>
                        </div>
                    `;
                }
            });
        }
    }

    showLoggedInState() {
        const loginElements = document.querySelectorAll('.login-only');
        const userElements = document.querySelectorAll('.user-only');
        
        loginElements.forEach(el => el.style.display = 'none');
        userElements.forEach(el => el.style.display = 'block');
    }

    showLoggedOutState() {
        const loginElements = document.querySelectorAll('.login-only');
        const userElements = document.querySelectorAll('.user-only');
        
        loginElements.forEach(el => el.style.display = 'block');
        userElements.forEach(el => el.style.display = 'none');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        switch(type) {
            case 'success':
                notification.style.background = '#22c55e';
                break;
            case 'error':
                notification.style.background = '#ef4444';
                break;
            case 'info':
                notification.style.background = '#3b82f6';
                break;
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Initialize enhanced auth manager
window.enhancedAuthManager = new EnhancedAuthManager();

// Override the original AuthManager if it exists
if (typeof AuthManager !== 'undefined') {
    AuthManager = window.enhancedAuthManager;
}

console.log('✅ Enhanced Storage Manager loaded');
