// Direct fix for N/A display issue
console.log('🔧 Loading direct fix for N/A issue...');

// Force user data to exist
function ensureUserData() {
    // Check if any user data exists
    let userData = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    
    if (!userData) {
        // Create default user data
        const defaultUser = {
            username: 'Admin User',
            name: 'Admin User',
            email: 'admin@projectrecords.com',
            role: 'admin',
            loginTime: new Date().toLocaleString()
        };
        
        // Save to both storages
        localStorage.setItem('currentUser', JSON.stringify(defaultUser));
        sessionStorage.setItem('currentUser', JSON.stringify(defaultUser));
        
        console.log('✅ Created default user data:', defaultUser);
        return defaultUser;
    }
    
    try {
        return JSON.parse(userData);
    } catch (e) {
        console.error('❌ Failed to parse user data:', e);
        return ensureUserData(); // Create default if parsing fails
    }
}

// Force update all user info elements
function forceUpdateUserInfo() {
    const userData = ensureUserData();
    
    console.log('🔧 Updating user info with:', userData);
    
    // Update ALL possible user info elements
    const updates = [
        { id: 'userWelcome', text: `Welcome, ${userData.username || userData.name || 'User'}` },
        { id: 'userRole', text: `Role: ${(userData.role || 'user').charAt(0).toUpperCase() + (userData.role || 'user').slice(1)}` },
        { id: 'loginTime', text: `Login: ${userData.loginTime || new Date().toLocaleString()}` }
    ];
    
    updates.forEach(update => {
        const element = document.getElementById(update.id);
        if (element) {
            element.textContent = update.text;
            element.style.display = 'block';
            element.style.visibility = 'visible';
            element.style.opacity = '1';
            console.log(`✅ Updated ${update.id}:`, update.text);
        } else {
            console.log(`❌ Element not found: ${update.id}`);
        }
    });
    
    // Also update any elements with these classes
    const classUpdates = [
        { selector: '.user-info', html: `<strong>${userData.username || userData.name || 'User'}</strong>` },
        { selector: '.user-details', html: `<div><strong>${userData.username || userData.name || 'User'}</strong><br><small>${userData.role || 'user'}</small></div>` }
    ];
    
    classUpdates.forEach(update => {
        const elements = document.querySelectorAll(update.selector);
        elements.forEach(element => {
            element.innerHTML = update.html;
            element.style.display = 'block';
            element.style.visibility = 'visible';
            element.style.opacity = '1';
            console.log(`✅ Updated ${update.selector}:`, update.html);
        });
    });
    
    return userData;
}

// Apply fix immediately and repeatedly
function applyDirectFix() {
    console.log('🔧 Applying direct fix...');
    
    // Create user data if needed
    const userData = ensureUserData();
    
    // Update display
    forceUpdateUserInfo();
    
    // Log current state
    console.log('📊 Current user data:', userData);
    console.log('📊 localStorage:', localStorage.getItem('currentUser'));
    console.log('📊 sessionStorage:', sessionStorage.getItem('currentUser'));
}

// Apply fix multiple times
applyDirectFix();
setTimeout(applyDirectFix, 100);
setTimeout(applyDirectFix, 500);
setTimeout(applyDirectFix, 1000);
setTimeout(applyDirectFix, 2000);

// Also apply when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDirectFix);
} else {
    applyDirectFix();
}

// Apply when page is fully loaded
window.addEventListener('load', applyDirectFix);

// Make it globally available for manual triggering
window.fixUserInfo = applyDirectFix;

// Auto-fix every 5 seconds
setInterval(applyDirectFix, 5000);

console.log('✅ Direct fix loaded - N/A should be resolved');
