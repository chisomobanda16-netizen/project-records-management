// OFFICIAL CREDENTIALS CONFIGURATION
// Update this file with your actual username and password
// This file is loaded by the login system

const OFFICIAL_CREDENTIALS = {
    // Primary Official Account
    official: {
        username: 'official',
        password: 'official123',
        role: 'admin',
        name: 'Official User'
    },
    
    // Personal Account
    chisomo: {
        username: 'chisomo',
        password: 'chisomo123',
        role: 'admin',
        name: 'Chisomo'
    },
    
    // Backup Admin Account
    admin: {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'System Administrator'
    },
    
    // Manager Account
    manager: {
        username: 'manager',
        password: 'manager123',
        role: 'manager',
        name: 'Manager'
    },
    
    // Standard User Account
    user: {
        username: 'user',
        password: 'user123',
        role: 'user',
        name: 'User'
    },
    
    // Guest Account
    guest: {
        username: 'guest',
        password: 'guest123',
        role: 'guest',
        name: 'Guest User'
    }
};

// Instructions for updating credentials:
/*
TO UPDATE YOUR OFFICIAL CREDENTIALS:

1. CHANGE USERNAME:
   - Update the 'username' field in the desired account
   - Example: username: 'yourname'

2. CHANGE PASSWORD:
   - Update the 'password' field in the desired account
   - Example: password: 'yournewpassword123'

3. CHANGE DISPLAY NAME:
   - Update the 'name' field for how it appears in the system
   - Example: name: 'Your Full Name'

4. ADD NEW ACCOUNTS:
   - Copy an existing account structure
   - Update all fields with new values
   - Example: 
     newaccount: {
         username: 'newaccount',
         password: 'newpass123',
         role: 'admin',
         name: 'New Account'
     }

SECURITY NOTES:
- Passwords should be at least 6 characters long
- Use strong passwords with numbers and letters
- Change passwords regularly for security
- Keep this file secure in production

ROLE PERMISSIONS:
- 'admin': Full system access and management
- 'manager': Can manage projects and clients
- 'user': Basic access to view and edit own projects
- 'guest': Read-only access to public features
*/

// Export for use in login system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OFFICIAL_CREDENTIALS;
}
