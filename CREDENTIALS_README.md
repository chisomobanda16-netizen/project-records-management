# 🔐 Official Credentials Management

## 📋 Current Official Credentials

Your login system is configured with the following official accounts:

### 👑 Administrator Accounts
- **Official User**: `official` / `official123`
- **Chisomo**: `chisomo` / `chisomo123`
- **System Admin**: `admin` / `admin123`

### 📊 Management Accounts
- **Manager**: `manager` / `manager123`

### 👤 User Accounts
- **Standard User**: `user` / `user123`
- **Guest**: `guest` / `guest123`

---

## �️ NEW: Password Visibility Feature

### 🔍 Show/Hide Password Toggle

Your login system now includes a **password visibility toggle** that allows users to:

- **👁️ Show Password**: Click the eye icon to reveal typed characters
- **🙈 Hide Password**: Click again to conceal the password
- **🎨 Visual Feedback**: Icon changes from eye to eye-slash when visible
- **🔄 Hover Effects**: Orange highlight when hovering over the toggle

### 📍 Where to Find It

**Login Form:**
- Password field has an eye icon on the right
- Click to toggle visibility while typing

**Change Password Modal:**
- All password fields (Current, New, Confirm) have toggles
- Helps ensure new passwords are entered correctly

**Main System Password Change:**
- Same toggle functionality in the user bar password change modal

### 💡 Benefits

- **🔤 Easy Typing**: See what you're typing to avoid mistakes
- **🔒 Security**: Password is hidden by default (secure)
- **✅ Confirmation**: Verify new passwords when changing them
- **♿ Accessibility**: Helps users with typing difficulties

---

## �🛠️ How to Update Your Credentials

### Method 1: Edit Config File (Recommended)

1. **Open the config file**: `config.js`
2. **Find your account** in the `OFFICIAL_CREDENTIALS` object
3. **Update your credentials**:

```javascript
// Example: Update Chisomo's account
chisomo: {
    username: 'chisomo',           // Change this if you want a different username
    password: 'yournewpassword123', // Change this to your new password
    role: 'admin',                 // Keep this for full access
    name: 'Chisomo'                // Update display name if needed
}
```

### Method 2: Use Password Change Feature

1. **Login** with your current credentials
2. **Click "Change Password"** in the user info bar
3. **Enter current password** and new password
4. **Save changes** (Note: This updates the session only)

---

## 🔑 Quick Login Shortcuts

Press these keyboard combinations for quick login:

- **Ctrl + 1**: Official account
- **Ctrl + 2**: Chisomo account  
- **Ctrl + 3**: Admin account
- **Ctrl + 4**: Manager account

---

## 🛡️ Security Best Practices

### ✅ Recommended Actions
- **Change default passwords** before deployment
- **Use strong passwords** (minimum 6 characters, mix letters and numbers)
- **Update passwords regularly** for security
- **Keep config.js secure** in production environments

### 🔐 Password Guidelines
- **Minimum length**: 6 characters
- **Recommended**: 8+ characters with numbers
- **Avoid**: Common words, personal info, simple patterns
- **Good example**: `MySecurePass123`

---

## 📚 Role Permissions

| Role | Access Level | Capabilities |
|------|-------------|--------------|
| **admin** | Full Access | All features, user management, system settings |
| **manager** | Management | Projects, clients, invoices, reports |
| **user** | Standard | View/edit own projects, basic features |
| **guest** | Limited | Read-only access to public features |

---

## 🚀 Deployment Notes

### For Production Use:
1. **Change all default passwords** in `config.js`
2. **Remove demo credentials** if not needed
3. **Set up proper authentication** (database, LDAP, etc.)
4. **Enable HTTPS** for secure login transmission
5. **Implement session timeout** for security

### For Development:
- Default credentials are fine for testing
- Use password change feature to test functionality
- Keyboard shortcuts help with quick testing

---

## 🆘 Troubleshooting

### Login Issues:
- **Check config.js** is properly loaded
- **Verify username/password** spelling
- **Clear browser cache** and try again
- **Check browser console** for errors

### Password Change Issues:
- **Current password** must match exactly
- **New passwords** must match each other
- **Minimum 6 characters** required
- **Use "demo"** as current password for testing in main system

---

## 📞 Need Help?

If you need assistance with credentials management:

1. **Check this README** for common solutions
2. **Review config.js** for proper formatting
3. **Test with different browsers** if issues persist
4. **Clear browser data** and retry login

---

*Last Updated: February 2026*
*System Version: Professional Media Management Suite*
