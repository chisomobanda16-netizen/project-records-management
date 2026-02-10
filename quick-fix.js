// Quick fix for N/A display issue
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Applying quick fix for user info...');
    
    // Function to get user data from any source
    function getUserData() {
        // Try localStorage first
        let userData = localStorage.getItem('currentUser');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (e) {
                console.error('Failed to parse localStorage data:', e);
            }
        }
        
        // Try sessionStorage
        userData = sessionStorage.getItem('currentUser');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (e) {
                console.error('Failed to parse sessionStorage data:', e);
            }
        }
        
        // Return default data if nothing found
        return {
            username: 'Demo User',
            email: 'demo@example.com',
            role: 'user',
            loginTime: new Date().toLocaleString()
        };
    }
    
    // Function to update user info display
    function updateUserInfo() {
        const userData = getUserData();
        
        // Update userWelcome
        const welcomeEl = document.getElementById('userWelcome');
        if (welcomeEl) {
            welcomeEl.textContent = `Welcome, ${userData.username || userData.name || 'User'}`;
            welcomeEl.style.display = 'block';
        }
        
        // Update userRole
        const roleEl = document.getElementById('userRole');
        if (roleEl) {
            const roleText = userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'User';
            roleEl.textContent = `Role: ${roleText}`;
            roleEl.style.display = 'block';
        }
        
        // Update loginTime
        const timeEl = document.getElementById('loginTime');
        if (timeEl) {
            timeEl.textContent = `Login: ${userData.loginTime || 'Just now'}`;
            timeEl.style.display = 'block';
        }
        
        console.log('✅ User info updated:', userData);
    }
    
    // Apply fix immediately
    updateUserInfo();
    
    // Also apply after a short delay (in case other scripts load)
    setTimeout(updateUserInfo, 500);
    setTimeout(updateUserInfo, 2000);
    
    // Make it globally available
    window.updateUserInfo = updateUserInfo;
});

// Also apply fix when page is fully loaded
window.addEventListener('load', function() {
    setTimeout(function() {
        if (window.updateUserInfo) {
            window.updateUserInfo();
        }
    }, 1000);
});
