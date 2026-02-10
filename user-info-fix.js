// Fix for user info display issues
class UserInfoFix {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.fixUserInfo());
        } else {
            this.fixUserInfo();
        }

        // Also fix after Firebase loads
        setTimeout(() => this.fixUserInfo(), 1000);
        setTimeout(() => this.fixUserInfo(), 3000);
    }

    fixUserInfo() {
        console.log('🔧 Fixing user info display...');
        
        // Try multiple methods to get user data
        let userData = this.getUserData();
        
        if (userData) {
            this.displayUserInfo(userData);
            console.log('✅ User info fixed:', userData);
        } else {
            console.log('❌ No user data found, showing default');
            this.showDefaultUserInfo();
        }
    }

    getUserData() {
        // Method 1: Firebase auth
        if (window.firebaseAuth && window.firebaseAuth.getCurrentUser()) {
            const firebaseUser = window.firebaseAuth.getCurrentUser();
            const localData = JSON.parse(localStorage.getItem('currentUser') || '{}');
            return {
                username: localData.username || firebaseUser.email?.split('@')[0] || 'User',
                email: firebaseUser.email || localData.email || 'N/A',
                role: localData.role || 'user',
                loginTime: localData.loginTime || new Date().toLocaleString()
            };
        }

        // Method 2: Local storage
        const localData = localStorage.getItem('currentUser');
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                return {
                    username: parsed.username || parsed.name || 'User',
                    email: parsed.email || 'N/A',
                    role: parsed.role || 'user',
                    loginTime: parsed.loginTime || new Date().toLocaleString()
                };
            } catch (e) {
                console.error('Failed to parse local storage data:', e);
            }
        }

        // Method 3: Session storage
        const sessionData = sessionStorage.getItem('currentUser');
        if (sessionData) {
            try {
                const parsed = JSON.parse(sessionData);
                return {
                    username: parsed.username || parsed.name || 'User',
                    email: parsed.email || 'N/A',
                    role: parsed.role || 'user',
                    loginTime: parsed.loginTime || new Date().toLocaleString()
                };
            } catch (e) {
                console.error('Failed to parse session storage data:', e);
            }
        }

        return null;
    }

    displayUserInfo(userData) {
        // Update userWelcome
        const welcomeEl = document.getElementById('userWelcome');
        if (welcomeEl) {
            welcomeEl.textContent = `Welcome, ${userData.username}`;
            welcomeEl.style.display = 'block';
        }

        // Update userRole
        const roleEl = document.getElementById('userRole');
        if (roleEl) {
            const roleText = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
            roleEl.textContent = `Role: ${roleText}`;
            roleEl.style.display = 'block';
        }

        // Update loginTime
        const timeEl = document.getElementById('loginTime');
        if (timeEl) {
            if (userData.loginTime) {
                const loginTime = new Date(userData.loginTime);
                const now = new Date();
                const diff = Math.floor((now - loginTime) / 1000 / 60); // minutes
                
                let timeText = 'Logged in: Just now';
                if (diff >= 1 && diff < 60) {
                    timeText = `Logged in: ${diff} minute${diff > 1 ? 's' : ''} ago`;
                } else if (diff >= 60) {
                    const hours = Math.floor(diff / 60);
                    timeText = `Logged in: ${hours} hour${hours > 1 ? 's' : ''} ago`;
                }
                
                timeEl.textContent = timeText;
            } else {
                timeEl.textContent = 'Logged in: Just now';
            }
            timeEl.style.display = 'block';
        }

        // Update any other user info elements
        const userInfoElements = document.querySelectorAll('.user-info, .user-details');
        userInfoElements.forEach(element => {
            if (element) {
                element.innerHTML = `
                    <div class="user-details">
                        <strong>${userData.username}</strong>
                        <span class="user-role">${userData.role}</span>
                        <small class="login-time">Login: ${userData.loginTime}</small>
                    </div>
                `;
                element.style.display = 'block';
            }
        });

        console.log('✅ User info displayed successfully');
    }

    showDefaultUserInfo() {
        const welcomeEl = document.getElementById('userWelcome');
        if (welcomeEl) {
            welcomeEl.textContent = 'Welcome, User';
            welcomeEl.style.display = 'block';
        }

        const roleEl = document.getElementById('userRole');
        if (roleEl) {
            roleEl.textContent = 'Role: User';
            roleEl.style.display = 'block';
        }

        const timeEl = document.getElementById('loginTime');
        if (timeEl) {
            timeEl.textContent = 'Logged in: Just now';
            timeEl.style.display = 'block';
        }
    }

    // Force refresh user info
    refreshUserInfo() {
        this.fixUserInfo();
    }
}

// Initialize the fix
window.userInfoFix = new UserInfoFix();

// Make it globally available
window.refreshUserInfo = () => window.userInfoFix.refreshUserInfo();

// Also fix when Firebase auth state changes
if (window.firebaseAuth) {
    window.firebaseAuth.auth.onAuthStateChanged((user) => {
        if (user) {
            setTimeout(() => window.userInfoFix.fixUserInfo(), 500);
        }
    });
}

console.log('✅ User Info Fix loaded');
