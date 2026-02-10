// Firebase Authentication System
class FirebaseAuthManager {
    constructor() {
        this.auth = firebase.auth();
        this.database = firebase.database();
        this.init();
    }

    init() {
        // Listen for auth state changes
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('✅ User is signed in:', user.email);
                this.loadUserData(user);
            } else {
                console.log('🔒 User is signed out');
                this.redirectToLogin();
            }
        });
    }

    // Sign in with email and password
    async signIn(email, password) {
        try {
            const loading = document.getElementById('loading');
            if (loading) loading.style.display = 'block';

            const result = await this.auth.signInWithEmailAndPassword(email, password);
            
            // Load user data
            await this.loadUserData(result.user);
            
            // Redirect to main page
            window.location.href = 'Project Records.html';
            
            return { success: true, user: result.user };
        } catch (error) {
            console.error('❌ Sign in error:', error);
            this.showError(error.message);
            return { success: false, error: error.message };
        } finally {
            const loading = document.getElementById('loading');
            if (loading) loading.style.display = 'none';
        }
    }

    // Sign up new user
    async signUp(email, password, username, role = 'user') {
        try {
            const loading = document.getElementById('loading');
            if (loading) loading.style.display = 'block';

            const result = await this.auth.createUserWithEmailAndPassword(email, password);
            
            // Save user data to database
            await this.database.ref(`users/${result.user.uid}`).set({
                email: email,
                username: username,
                role: role,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });
            
            this.showSuccess('Account created successfully! Redirecting...');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'Project Records.html';
            }, 2000);
            
            return { success: true, user: result.user };
        } catch (error) {
            console.error('❌ Sign up error:', error);
            this.showError(error.message);
            return { success: false, error: error.message };
        } finally {
            const loading = document.getElementById('loading');
            if (loading) loading.style.display = 'none';
        }
    }

    // Load user data from database
    async loadUserData(user) {
        try {
            const snapshot = await this.database.ref(`users/${user.uid}`).once('value');
            let userData = snapshot.val();
            
            if (!userData) {
                // Create basic user data if not exists
                userData = {
                    email: user.email,
                    username: user.email.split('@')[0],
                    role: 'user',
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                };
                
                await this.database.ref(`users/${user.uid}`).set(userData);
            } else {
                // Update last login
                await this.database.ref(`users/${user.uid}`).update({
                    lastLogin: new Date().toISOString()
                });
            }
            
            // Store in localStorage for backward compatibility
            localStorage.setItem('currentUser', JSON.stringify({
                uid: user.uid,
                email: user.email,
                username: userData.username,
                role: userData.role,
                loginTime: new Date().toLocaleString(),
                lastLogin: userData.lastLogin
            }));
            
            return userData;
        } catch (error) {
            console.error('❌ Load user data error:', error);
            return null;
        }
    }

    // Sign out
    async signOut() {
        try {
            await this.auth.signOut();
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('❌ Sign out error:', error);
        }
    }

    // Password reset
    async resetPassword(email) {
        try {
            await this.auth.sendPasswordResetEmail(email);
            this.showSuccess('Password reset email sent! Check your inbox.');
            return { success: true };
        } catch (error) {
            console.error('❌ Password reset error:', error);
            this.showError(error.message);
            return { success: false, error: error.message };
        }
    }

    // Get current user
    getCurrentUser() {
        const user = this.auth.currentUser;
        if (user) {
            return {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            };
        }
        return null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.auth.currentUser !== null;
    }

    // Update user profile
    async updateProfile(updates) {
        try {
            const user = this.auth.currentUser;
            if (user) {
                await user.updateProfile(updates);
                
                // Update database
                await this.database.ref(`users/${user.uid}`).update(updates);
                
                // Update localStorage
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                Object.assign(currentUser, updates);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                this.showSuccess('Profile updated successfully!');
                return { success: true };
            }
            return { success: false, error: 'No user signed in' };
        } catch (error) {
            console.error('❌ Update profile error:', error);
            this.showError(error.message);
            return { success: false, error: error.message };
        }
    }

    // Redirect to login if not authenticated
    redirectToLogin() {
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    }

    // Show notification
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
            animation: slideIn 0.3s ease-out;
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
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }
}

// Initialize Firebase Auth Manager
window.firebaseAuth = new FirebaseAuthAuthManager();

// Update login form to use Firebase
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                window.firebaseAuth.showError('Please enter email and password');
                return;
            }
            
            await window.firebaseAuth.signIn(email, password);
        });
    }
});

// Enhanced forgot password with Firebase
function showForgotPassword() {
    const modal = document.createElement('div');
    modal.className = 'password-modal';
    modal.innerHTML = `
        <div class="password-modal-content">
            <div class="password-modal-header">
                <h3><i class="fas fa-key"></i> Forgot Password</h3>
                <button class="close-btn" onclick="this.closest('.password-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="forgotPasswordForm">
                <div class="form-group">
                    <label for="resetEmail">Email Address *</label>
                    <div class="input-with-icon">
                        <i class="fas fa-envelope"></i>
                        <input type="email" id="resetEmail" name="resetEmail" placeholder="Enter your email address" required>
                    </div>
                </div>
                
                <div class="password-form-actions">
                    <button type="button" class="cancel-btn" onclick="this.closest('.password-modal').remove()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button type="submit" class="change-password-btn">
                        <i class="fas fa-paper-plane"></i> Send Reset Link
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('forgotPasswordForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;
        
        if (!email) {
            window.firebaseAuth.showError('Please enter your email address');
            return;
        }
        
        await window.firebaseAuth.resetPassword(email);
    });
}

console.log('✅ Firebase Auth Manager loaded');
