// Project Records - Professional Media Management System

// Login and Authentication System
// Check if enhanced auth manager is available, otherwise use fallback
const AuthManager = window.enhancedAuthManager || {
    checkLogin() {
        try {
            let userData = window.storageManager ? 
                window.storageManager.loadData('currentUser', 'session') : 
                sessionStorage.getItem('currentUser');
            
            if (!userData && window.storageManager) {
                userData = window.storageManager.loadData('currentUser', 'local');
            }
            
            if (!userData) {
                userData = localStorage.getItem('currentUser');
            }
            
            if (userData) {
                const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
                this.updateUserInfo(user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Invalid user session:', error);
            this.logout();
            return false;
        }
    },
    
    updateUserInfo(user) {
        const welcomeEl = document.getElementById('userWelcome');
        const roleEl = document.getElementById('userRole');
        const timeEl = document.getElementById('loginTime');
        
        if (welcomeEl) welcomeEl.textContent = `Welcome, ${user.name}`;
        if (roleEl) roleEl.textContent = `Role: ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`;
        if (timeEl) {
            const loginTime = new Date(user.loginTime);
            const now = new Date();
            const diff = Math.floor((now - loginTime) / 1000 / 60); // minutes
            
            if (diff < 1) {
                timeEl.textContent = 'Logged in: Just now';
            } else if (diff < 60) {
                timeEl.textContent = `Logged in: ${diff} minute${diff > 1 ? 's' : ''} ago`;
            } else {
                const hours = Math.floor(diff / 60);
                timeEl.textContent = `Logged in: ${hours} hour${hours > 1 ? 's' : ''} ago`;
            }
        }
    },
    
    logout() {
        if (window.storageManager) {
            window.storageManager.removeData('currentUser', 'session');
            window.storageManager.removeData('currentUser', 'local');
        } else {
            sessionStorage.removeItem('currentUser');
            localStorage.removeItem('currentUser');
        }
        window.location.href = 'login.html';
    },
    
    getCurrentUser() {
        let currentUser = null;
        if (window.storageManager) {
            currentUser = window.storageManager.loadData('currentUser', 'session') || 
                         window.storageManager.loadData('currentUser', 'local');
        }
        if (!currentUser) {
            currentUser = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
        }
        return currentUser ? (typeof currentUser === 'string' ? JSON.parse(currentUser) : currentUser) : null;
    }
};

// Global logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        AuthManager.logout();
    }
}

// Back to login details function
function backToLogin() {
    if (confirm('Are you sure you want to go back to login details?')) {
        // Clear current session before redirecting
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('currentUser');
        
        // Force redirect
        window.location.replace('login.html');
    }
}

// Show change password modal
function showChangePasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'password-modal';
    modal.innerHTML = `
        <div class="password-modal-content">
            <div class="password-modal-header">
                <h3><i class="fas fa-key"></i> Change Password</h3>
                <button class="close-btn" onclick="this.closest('.password-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="changePasswordForm">
                <div class="form-group">
                    <label for="currentPassword">Current Password</label>
                    <div class="input-with-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="currentPassword" name="currentPassword" placeholder="Enter current password" required>
                        <button type="button" class="password-toggle" onclick="togglePassword('currentPassword', this)" title="Show/Hide Password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="newPassword">New Password</label>
                    <div class="input-with-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="newPassword" name="newPassword" placeholder="Enter new password" required minlength="6">
                        <button type="button" class="password-toggle" onclick="togglePassword('newPassword', this)" title="Show/Hide Password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="password-requirements">
                        <small>Password must be at least 6 characters long</small>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="confirmPassword">Confirm New Password</label>
                    <div class="input-with-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm new password" required minlength="6">
                        <button type="button" class="password-toggle" onclick="togglePassword('confirmPassword', this)" title="Show/Hide Password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="error-message" id="changePasswordError" style="display: none;"></div>
                <div class="success-message" id="changePasswordSuccess" style="display: none;"></div>
                
                <div class="password-form-actions">
                    <button type="button" class="cancel-btn" onclick="this.closest('.password-modal').remove()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button type="submit" class="change-password-btn">
                        <i class="fas fa-key"></i> Change Password
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleChangePasswordInSystem();
    });
}

// Toggle password visibility (for main system)
function togglePassword(inputId, button) {
    const passwordInput = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
        button.classList.add('showing');
        button.title = 'Hide Password';
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
        button.classList.remove('showing');
        button.title = 'Show Password';
    }
}

// Handle password change in main system
function handleChangePasswordInSystem() {
    const currentUser = AuthManager.getCurrentUser();
    if (!currentUser) {
        alert('Session expired. Please login again.');
        AuthManager.logout();
        return;
    }
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const errorEl = document.getElementById('changePasswordError');
    const successEl = document.getElementById('changePasswordSuccess');
    
    // Hide previous messages
    errorEl.style.display = 'none';
    successEl.style.display = 'none';
    
    // For demo purposes, we'll simulate password validation
    // In production, this would validate against actual user data
    if (currentPassword === 'demo') {
        if (newPassword !== confirmPassword) {
            errorEl.textContent = 'New passwords do not match.';
            errorEl.style.display = 'block';
            return;
        }
        
        if (newPassword.length < 6) {
            errorEl.textContent = 'New password must be at least 6 characters long.';
            errorEl.style.display = 'block';
            return;
        }
        
        // Show success message
        successEl.textContent = 'Password changed successfully! (Demo: In production, this would update your actual password)';
        successEl.style.display = 'block';
        
        // Clear form
        document.getElementById('changePasswordForm').reset();
        
        // Close modal after delay
        setTimeout(() => {
            document.querySelector('.password-modal').remove();
        }, 3000);
    } else {
        errorEl.textContent = 'Current password is incorrect. (Demo: Use "demo" as current password for testing)';
        errorEl.style.display = 'block';
    }
}

// Check login on page load
document.addEventListener('DOMContentLoaded', function() {
    AuthManager.checkLogin();
});

class ProjectManager {
    constructor(businessType) {
        this.businessType = businessType;
        this.projects = [];
        this.currentEditId = null;
        this.currentCurrency = 'USD';
        this.init();
    }

    init() {
        try {
            this.loadProjects();
            this.loadCurrency();
            this.setupEventListeners();
            this.updateProjectTypes();
            this.updateDashboard();
            this.renderProjects();
            this.populateFilters();
        } catch (error) {
            console.error('Error initializing ProjectManager:', error);
            this.showNotification('Error initializing system. Please refresh the page.', 'error');
        }
    }

    setupEventListeners() {
        // Form submission
        const projectForm = document.getElementById('projectForm');
        if (projectForm) {
            projectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // Currency selector
        const mainCurrencySelect = document.getElementById('currency');
        if (mainCurrencySelect) {
            mainCurrencySelect.addEventListener('change', (e) => {
                this.currentCurrency = e.target.value;
                this.saveCurrency();
                this.updateDashboard();
                this.renderProjects();
            });
        }

        // Calculate balance on input
        const priceInput = document.getElementById('totalPrice');
        const upfrontInput = document.getElementById('upfrontPayment');
        if (priceInput && upfrontInput) {
            [priceInput, upfrontInput].forEach(input => {
                input.addEventListener('input', () => this.calculateBalance());
            });
        }

        // Calculate total expenses on input
        const expenseInputs = ['transport', 'food', 'accommodation', 'airtime', 'internet', 'stationary']
            .map(id => document.getElementById(id))
            .filter(Boolean);
        
        expenseInputs.forEach(input => {
            input.addEventListener('input', () => this.calculateTotalExpenses());
        });

        // Sync expense currencies with main currency
        if (mainCurrencySelect) {
            mainCurrencySelect.addEventListener('change', (e) => {
                // Update all expense currency selectors to match
                const expenseCurrencies = ['transportCurrency', 'foodCurrency', 'accommodationCurrency', 'airtimeCurrency', 'internetCurrency', 'stationaryCurrency'];
                expenseCurrencies.forEach(id => {
                    const selector = document.getElementById(id);
                    if (selector) {
                        selector.value = e.target.value;
                    }
                });
            });
        }

        // Filters
        const searchInput = document.getElementById('searchInput');
        const typeFilter = document.getElementById('typeFilter');
        const statusFilter = document.getElementById('statusFilter');
        
        if (searchInput) searchInput.addEventListener('input', () => this.filterProjects());
        if (typeFilter) typeFilter.addEventListener('change', () => this.filterProjects());
        if (statusFilter) statusFilter.addEventListener('change', () => this.filterProjects());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N: New project
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                document.getElementById('clientName')?.focus();
            }
            
            // Ctrl/Cmd + S: Save/Submit form
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                projectForm?.dispatchEvent(new Event('submit'));
            }
            
            // Escape: Reset form
            if (e.key === 'Escape') {
                this.resetForm();
            }
        });
    }

    updateProjectTypes() {
        const projectTypeSelect = document.getElementById('projectType');
        if (!projectTypeSelect) return;

        const types = this.businessType === 'digitalFootprints' ? [
            { value: 'photography', label: 'Photography' },
            { value: 'videography', label: 'Videography' },
            { value: 'design', label: 'Graphic Design' },
            { value: 'web', label: 'Web Development' },
            { value: 'branding', label: 'Branding' },
            { value: 'marketing', label: 'Digital Marketing' },
            { value: 'other', label: 'Other' }
        ] : [
            { value: 'film', label: 'Film Production' },
            { value: 'documentary', label: 'Documentary' },
            { value: 'commercial', label: 'Commercial' },
            { value: 'music-video', label: 'Music Video' },
            { value: 'consulting', label: 'Production Consulting' },
            { value: 'location-scouting', label: 'Location Scouting' },
            { value: 'other', label: 'Other' }
        ];

        projectTypeSelect.innerHTML = '<option value="">Select type</option>';
        types.forEach(type => {
            projectTypeSelect.innerHTML += `<option value="${type.value}">${type.label}</option>`;
        });
    }

    calculateBalance() {
        const totalPrice = parseFloat(document.getElementById('totalPrice').value) || 0;
        const upfrontPayment = parseFloat(document.getElementById('upfrontPayment').value) || 0;
        const balance = totalPrice - upfrontPayment;
        
        const balanceInput = document.getElementById('balance');
        if (balanceInput) {
            balanceInput.value = balance.toFixed(2);
        }
        
        return balance;
    }

    calculateTotalExpenses() {
        const expenses = ['transport', 'food', 'accommodation', 'airtime', 'internet', 'stationary'];
        const total = expenses.reduce((sum, id) => {
            return sum + (parseFloat(document.getElementById(id).value) || 0);
        }, 0);
        return total;
    }

    handleFormSubmit() {
        const formData = new FormData(document.getElementById('projectForm'));
        const project = {
            id: this.currentEditId || Date.now().toString(),
            clientName: formData.get('clientName'),
            clientPhone: formData.get('clientPhone'),
            projectName: formData.get('projectName'),
            projectDate: formData.get('projectDate'),
            location: formData.get('location'),
            projectType: formData.get('projectType'),
            totalPrice: parseFloat(formData.get('totalPrice')) || 0,
            upfrontPayment: parseFloat(formData.get('upfrontPayment')) || 0,
            balance: 0,
            currency: formData.get('currency') || this.currentCurrency,
            expenses: {},
            totalExpenses: 0,
            projectDetails: formData.get('projectDetails'),
            businessType: this.businessType,
            createdAt: this.currentEditId ? 
                this.projects.find(p => p.id === this.currentEditId)?.createdAt || new Date().toISOString() : 
                new Date().toISOString()
        };

        // Calculate expenses
        const expenseFields = ['transport', 'food', 'accommodation', 'airtime', 'internet', 'stationary'];
        expenseFields.forEach(field => {
            project.expenses[field] = {
                amount: parseFloat(formData.get(field)) || 0,
                currency: formData.get(`${field}Currency`) || this.currentCurrency
            };
        });
        
        project.totalExpenses = Object.values(project.expenses).reduce((sum, expense) => sum + expense.amount, 0);
        project.balance = project.totalPrice - project.upfrontPayment;

        if (this.currentEditId) {
            // Update existing project
            const index = this.projects.findIndex(p => p.id === this.currentEditId);
            if (index !== -1) {
                this.projects[index] = project;
                this.showNotification('Project updated successfully!', 'success');
            }
        } else {
            // Add new project
            this.projects.unshift(project);
            this.showNotification('Project added successfully!', 'success');
        }

        this.saveProjects();
        this.updateDashboard();
        this.renderProjects();
        this.populateFilters();
        this.resetForm();
    }

    editProject(id) {
        const project = this.projects.find(p => p.id === id);
        if (!project) return;

        this.currentEditId = id;
        
        // Populate form
        document.getElementById('clientName').value = project.clientName || '';
        document.getElementById('clientPhone').value = project.clientPhone || '';
        document.getElementById('projectName').value = project.projectName || '';
        document.getElementById('projectDate').value = project.projectDate || '';
        document.getElementById('location').value = project.location || '';
        document.getElementById('projectType').value = project.projectType || '';
        document.getElementById('totalPrice').value = project.totalPrice || '';
        document.getElementById('upfrontPayment').value = project.upfrontPayment || '';
        document.getElementById('currency').value = project.currency || this.currentCurrency;
        document.getElementById('projectDetails').value = project.projectDetails || '';
        
        // Populate expenses
        const expenseFields = ['transport', 'food', 'accommodation', 'airtime', 'internet', 'stationary'];
        expenseFields.forEach(field => {
            const amountElement = document.getElementById(field);
            const currencyElement = document.getElementById(`${field}Currency`);
            if (amountElement && project.expenses && project.expenses[field]) {
                amountElement.value = project.expenses[field].amount || '';
                if (currencyElement) {
                    currencyElement.value = project.expenses[field].currency || this.currentCurrency;
                }
            } else if (amountElement) {
                amountElement.value = '';
                if (currencyElement) {
                    currencyElement.value = this.currentCurrency;
                }
            }
        });
        
        this.calculateBalance();
        
        // Change button text
        const submitBtn = document.querySelector('#projectForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Project';
        }
        
        // Scroll to form
        document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
    }

    deleteProject(id) {
        if (!confirm('Are you sure you want to delete this project?')) return;
        
        this.projects = this.projects.filter(p => p.id !== id);
        this.saveProjects();
        this.updateDashboard();
        this.renderProjects();
        this.populateFilters();
        this.showNotification('Project deleted successfully!', 'success');
    }

    resetForm() {
        document.getElementById('projectForm').reset();
        this.currentEditId = null;
        
        // Reset currency to current selection
        document.getElementById('currency').value = this.currentCurrency;
        
        // Reset balance field
        const balanceInput = document.getElementById('balance');
        if (balanceInput) {
            balanceInput.value = '';
        }
        
        // Clear expense fields
        const expenseFields = ['transport', 'food', 'accommodation', 'airtime', 'internet', 'stationary'];
        expenseFields.forEach(field => {
            const amountElement = document.getElementById(field);
            const currencyElement = document.getElementById(`${field}Currency`);
            if (amountElement) {
                amountElement.value = '';
            }
            if (currencyElement) {
                currencyElement.value = this.currentCurrency;
            }
        });
        
        // Reset button text
        const submitBtn = document.querySelector('#projectForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Project';
        }
    }

    updateDashboard() {
        // Calculate revenue in current business currency
        const totalRevenue = this.projects.reduce((sum, p) => sum + p.totalPrice, 0);
        const monthlyRevenue = this.projects
            .filter(p => {
                const projectDate = new Date(p.projectDate);
                const now = new Date();
                return projectDate.getMonth() === now.getMonth() && 
                       projectDate.getFullYear() === now.getFullYear();
            })
            .reduce((sum, p) => sum + p.totalPrice, 0);
        const totalProjects = this.projects.length;
        const totalExpenses = this.projects.reduce((sum, p) => sum + (p.totalExpenses || 0), 0);
        const totalProfit = totalRevenue - totalExpenses;

        document.getElementById('totalRevenue').textContent = this.formatCurrency(totalRevenue, this.currentCurrency);
        document.getElementById('monthlyRevenue').textContent = this.formatCurrency(monthlyRevenue, this.currentCurrency);
        document.getElementById('totalProjects').textContent = totalProjects;
        document.getElementById('totalProfit').textContent = this.formatCurrency(totalProfit, this.currentCurrency);

        // Update dashboard stat card titles and icons based on business type
        const revenueCard = document.querySelector('#totalRevenue').closest('.stat-card').querySelector('h3');
        const profitCard = document.querySelector('#totalProfit').closest('.stat-card').querySelector('h3');
        const revenueIcon = revenueCard?.querySelector('i');
        const profitIcon = profitCard?.querySelector('i');
        
        if (this.businessType === 'filmFixer') {
            if (revenueCard) revenueCard.innerHTML = '<i class="fas fa-film"></i> Film Revenue';
            if (profitCard) profitCard.innerHTML = '<i class="fas fa-video"></i> Film Profit';
        } else {
            if (revenueCard) revenueCard.innerHTML = '<i class="fas fa-dollar-sign"></i> Total Revenue';
            if (profitCard) profitCard.innerHTML = '<i class="fas fa-chart-line"></i> Profit';
        }
    }

    renderProjects(projectsToRender = null) {
        const tbody = document.getElementById('projectsTableBody');
        if (!tbody) return;

        const projects = projectsToRender || this.projects;
        
        if (projects.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="13" style="text-align: center; padding: 3rem; color: var(--grey-500);">
                        <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                        No projects found. Add your first project above!
                    </td>
                </tr>
            `;
            return;
        }

        // Format expenses with currency info
        const formatExpenses = (project) => {
            if (!project.expenses || Object.keys(project.expenses).length === 0) {
                return this.formatCurrency(0, project.currency);
            }
            
            const expenseList = Object.entries(project.expenses)
                .filter(([_, expense]) => expense.amount > 0)
                .map(([name, expense]) => `${this.formatCurrency(expense.amount, expense.currency)}`)
                .join(' + ');
            
            return expenseList || this.formatCurrency(0, project.currency);
        };

        tbody.innerHTML = projects.map(project => `
            <tr>
                <td><strong>${project.clientName || 'N/A'}</strong></td>
                <td>${project.clientPhone || 'N/A'}</td>
                <td>${project.projectName || 'N/A'}</td>
                <td>${this.formatDate(project.projectDate)}</td>
                <td>${project.location || 'N/A'}</td>
                <td><span class="status-badge" style="background: var(--orange-100); color: var(--orange-700);">${this.getProjectTypeLabel(project.projectType)}</span></td>
                <td><strong>${this.formatCurrency(project.totalPrice, project.currency)}</strong></td>
                <td>${this.formatCurrency(project.upfrontPayment, project.currency)}</td>
                <td><strong style="color: ${project.balance <= 0 ? 'var(--orange-600)' : 'var(--grey-700)'}">${this.formatCurrency(project.balance, project.currency)}</strong></td>
                <td><strong style="color: ${project.totalExpenses > 0 ? 'var(--orange-600)' : 'var(--grey-700)'}">${formatExpenses(project)}</strong></td>
                <td style="max-width: 200px; word-wrap: break-word;">${project.projectDetails || '-'}</td>
                <td>${this.getStatusBadge(project.balance)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="currentManager.editProject('${project.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="currentManager.deleteProject('${project.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    filterProjects() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const typeFilter = document.getElementById('typeFilter')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';

        let filtered = this.projects;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.clientName?.toLowerCase().includes(searchTerm) ||
                p.clientPhone?.toLowerCase().includes(searchTerm) ||
                p.projectName?.toLowerCase().includes(searchTerm) ||
                p.location?.toLowerCase().includes(searchTerm) ||
                p.projectDetails?.toLowerCase().includes(searchTerm)
            );
        }

        // Type filter
        if (typeFilter) {
            filtered = filtered.filter(p => p.projectType === typeFilter);
        }

        // Status filter
        if (statusFilter) {
            filtered = filtered.filter(p => {
                if (statusFilter === 'paid') return p.balance <= 0;
                if (statusFilter === 'partial') return p.balance > 0 && p.balance < p.totalPrice * 0.5;
                if (statusFilter === 'unpaid') return p.balance >= p.totalPrice * 0.5;
                return true;
            });
        }

        this.renderProjects(filtered);
    }

    populateFilters() {
        const types = [...new Set(this.projects.map(p => p.projectType).filter(Boolean))];
        const typeFilter = document.getElementById('typeFilter');
        
        if (typeFilter) {
            const currentValue = typeFilter.value;
            typeFilter.innerHTML = '<option value="">All Types</option>';
            types.forEach(type => {
                typeFilter.innerHTML += `<option value="${type}">${this.getProjectTypeLabel(type)}</option>`;
            });
            typeFilter.value = currentValue;
        }
    }

    getProjectTypeLabel(type) {
        if (this.businessType === 'digitalFootprints') {
            const labels = {
                photography: 'Photography',
                videography: 'Videography',
                design: 'Graphic Design',
                web: 'Web Development',
                branding: 'Branding',
                marketing: 'Digital Marketing',
                other: 'Other'
            };
            return labels[type] || type || 'N/A';
        } else {
            const labels = {
                film: 'Film Production',
                documentary: 'Documentary',
                commercial: 'Commercial',
                'music-video': 'Music Video',
                consulting: 'Production Consulting',
                'location-scouting': 'Location Scouting',
                other: 'Other'
            };
            return labels[type] || type || 'N/A';
        }
    }

    getStatusBadge(balance) {
        if (balance <= 0) {
            return '<span class="status-badge status-paid">Paid</span>';
        } else if (balance < this.projects.find(p => p.balance === balance)?.totalPrice * 0.5) {
            return '<span class="status-badge status-partial">Partial</span>';
        } else {
            return '<span class="status-badge status-unpaid">Unpaid</span>';
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    formatCurrency(amount, currency = this.currentCurrency) {
        const symbols = {
            USD: '$',
            MWK: 'K',
            GBP: '£',
            EUR: '€',
            ZAR: 'R'
        };
        
        const symbol = symbols[currency] || '$';
        
        // Format based on currency
        if (currency === 'MWK') {
            // Malawian Kwacha - no decimal places typically
            return `${symbol}${amount.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            })}`;
        } else {
            // Other currencies - 2 decimal places
            return `${symbol}${amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }
    }

    // Analytics Dashboard Methods
    showAnalytics() {
        const analyticsSection = document.getElementById('analyticsDashboard');
        const projectsSection = document.querySelector('.table-section');
        
        if (analyticsSection && projectsSection) {
            analyticsSection.style.display = 'block';
            projectsSection.style.display = 'none';
            
            this.updateAnalytics();
            this.showNotification('Analytics dashboard loaded', 'success');
        }
    }
    
    hideAnalytics() {
        const analyticsSection = document.getElementById('analyticsDashboard');
        const projectsSection = document.querySelector('.table-section');
        
        if (analyticsSection && projectsSection) {
            analyticsSection.style.display = 'none';
            projectsSection.style.display = 'block';
        }
    }
    
    updateAnalytics() {
        const period = document.getElementById('analyticsPeriod')?.value || 'month';
        const analytics = this.calculateAnalytics(period);
        
        // Update summary values
        document.getElementById('analyticsTotalRevenue').textContent = this.formatCurrency(analytics.totalRevenue, this.currentCurrency);
        document.getElementById('analyticsAvgProject').textContent = this.formatCurrency(analytics.averageProjectValue, this.currentCurrency);
        document.getElementById('analyticsTotalExpenses').textContent = this.formatCurrency(analytics.totalExpenses, this.currentCurrency);
        document.getElementById('analyticsProfitMargin').textContent = analytics.profitMargin + '%';
        document.getElementById('analyticsTotalClients').textContent = analytics.totalClients;
        document.getElementById('analyticsRepeatClients').textContent = analytics.repeatClients;
        document.getElementById('analyticsPopularType').textContent = analytics.mostPopularType;
        document.getElementById('analyticsTotalTypes').textContent = analytics.totalTypes;
        
        // Update charts
        this.renderRevenueChart(analytics.revenueData);
        this.renderProjectTypeChart(analytics.projectTypeData);
        this.renderExpenseChart(analytics.expenseData);
        this.renderTopClients(analytics.topClients);
    }
    
    calculateAnalytics(period) {
        const now = new Date();
        const filteredProjects = this.filterProjectsByPeriod(this.projects, period);
        
        // Revenue Analytics
        const totalRevenue = filteredProjects.reduce((sum, p) => sum + p.totalPrice, 0);
        const averageProjectValue = filteredProjects.length > 0 ? totalRevenue / filteredProjects.length : 0;
        
        // Revenue by month/quarter for chart
        const revenueData = this.groupRevenueByPeriod(filteredProjects, period);
        
        // Project Type Analytics
        const projectTypeCounts = {};
        filteredProjects.forEach(p => {
            const type = this.getProjectTypeLabel(p.projectType);
            projectTypeCounts[type] = (projectTypeCounts[type] || 0) + 1;
        });
        
        const projectTypeData = Object.entries(projectTypeCounts).map(([type, count]) => ({
            label: type,
            value: count,
            percentage: ((count / filteredProjects.length) * 100).toFixed(1)
        }));
        
        // Expense Analytics
        const totalExpenses = filteredProjects.reduce((sum, p) => sum + (p.totalExpenses || 0), 0);
        const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue * 100).toFixed(1) : 0;
        
        // Expense breakdown
        const expenseCategories = ['transport', 'food', 'accommodation', 'airtime', 'internet', 'stationary'];
        const expenseData = expenseCategories.map(category => {
            const total = filteredProjects.reduce((sum, p) => {
                return sum + (p.expenses?.[category]?.amount || 0);
            }, 0);
            return { category, total };
        });
        
        // Client Analytics
        const clientData = {};
        filteredProjects.forEach(p => {
            const client = p.clientName || 'Unknown';
            if (!clientData[client]) {
                clientData[client] = {
                    projects: 0,
                    totalRevenue: 0,
                    totalProjects: 0
                };
            }
            clientData[client].projects++;
            clientData[client].totalRevenue += p.totalPrice;
            clientData[client].totalProjects++;
        });
        
        const topClients = Object.entries(clientData)
            .sort(([,a], [,b]) => b.totalRevenue - a.totalRevenue)
            .slice(0, 5)
            .map(([name, data]) => ({
                name,
                projects: data.projects,
                revenue: data.totalRevenue,
                avgProjectValue: data.totalRevenue / data.projects
            }));
        
        const totalClients = Object.keys(clientData).length;
        const repeatClients = Object.values(clientData).filter(client => client.projects > 1).length;
        const mostPopularType = projectTypeData.length > 0 ? 
            projectTypeData.reduce((max, current) => current.value > max.value ? current : max).label : 'N/A';
        
        return {
            totalRevenue,
            averageProjectValue,
            totalExpenses,
            profitMargin,
            totalClients,
            repeatClients,
            mostPopularType,
            totalTypes: projectTypeData.length,
            revenueData,
            projectTypeData,
            expenseData,
            topClients
        };
    }
    
    filterProjectsByPeriod(projects, period) {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentQuarter = Math.floor(currentMonth / 3);
        
        switch (period) {
            case 'month':
                return projects.filter(p => {
                    const projectDate = new Date(p.projectDate);
                    return projectDate.getFullYear() === currentYear && 
                           projectDate.getMonth() === currentMonth;
                });
            case 'quarter':
                return projects.filter(p => {
                    const projectDate = new Date(p.projectDate);
                    const projectQuarter = Math.floor(projectDate.getMonth() / 3);
                    return projectDate.getFullYear() === currentYear && 
                           projectQuarter === currentQuarter;
                });
            case 'year':
                return projects.filter(p => {
                    const projectDate = new Date(p.projectDate);
                    return projectDate.getFullYear() === currentYear;
                });
            default:
                return projects;
        }
    }
    
    groupRevenueByPeriod(projects, period) {
        const revenueByPeriod = {};
        
        projects.forEach(p => {
            const projectDate = new Date(p.projectDate);
            let key;
            
            switch (period) {
                case 'month':
                    key = projectDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                    break;
                case 'quarter':
                    const quarter = Math.floor(projectDate.getMonth() / 3);
                    key = `Q${quarter + 1} ${projectDate.getFullYear()}`;
                    break;
                case 'year':
                    key = projectDate.getFullYear().toString();
                    break;
                default:
                    key = 'All Time';
            }
            
            revenueByPeriod[key] = (revenueByPeriod[key] || 0) + p.totalPrice;
        });
        
        return Object.entries(revenueByPeriod).map(([period, revenue]) => ({
            period,
            revenue
        }));
    }
    
    renderRevenueChart(data) {
        const canvas = document.getElementById('revenueChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        if (data.length === 0) {
            ctx.fillStyle = '#999';
            ctx.font = '14px Montserrat';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', width / 2, height / 2);
            return;
        }
        
        // Simple bar chart
        const maxValue = Math.max(...data.map(d => d.revenue));
        const barWidth = (width - 40) / data.length;
        const scale = (height - 40) / maxValue;
        
        data.forEach((item, index) => {
            const barHeight = item.revenue * scale;
            const x = 20 + index * barWidth;
            const y = height - barHeight - 20;
            
            // Draw bar
            ctx.fillStyle = '#fb923c';
            ctx.fillRect(x, y, barWidth - 5, barHeight);
            
            // Draw value
            ctx.fillStyle = '#333';
            ctx.font = '10px Montserrat';
            ctx.textAlign = 'center';
            ctx.fillText(this.formatCurrency(item.revenue, this.currentCurrency), x + barWidth / 2, y - 5);
        });
    }
    
    renderProjectTypeChart(data) {
        const canvas = document.getElementById('projectTypeChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        if (data.length === 0) {
            ctx.fillStyle = '#999';
            ctx.font = '14px Montserrat';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', width / 2, height / 2);
            return;
        }
        
        // Simple pie chart
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;
        
        const colors = ['#fb923c', '#f97316', '#fbbf24', '#4caf50', '#2196f3', '#9c27b0'];
        let currentAngle = -Math.PI / 2;
        
        data.forEach((item, index) => {
            const sliceAngle = (item.value / 100) * Math.PI * 2;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            
            ctx.fillStyle = '#fff';
            ctx.font = '10px Montserrat';
            ctx.textAlign = 'center';
            ctx.fillText(`${item.percentage}%`, labelX, labelY);
            
            currentAngle += sliceAngle;
        });
    }
    
    renderExpenseChart(data) {
        const canvas = document.getElementById('expenseChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        if (data.length === 0) {
            ctx.fillStyle = '#999';
            ctx.font = '14px Montserrat';
            ctx.textAlign = 'center';
            ctx.fillText('No data available', width / 2, height / 2);
            return;
        }
        
        // Simple horizontal bar chart
        const maxValue = Math.max(...data.map(d => d.total));
        const barHeight = (height - 40) / data.length;
        
        data.forEach((item, index) => {
            const barWidth = (item.total / maxValue) * (width - 60);
            const y = 20 + index * barHeight;
            
            // Draw bar
            ctx.fillStyle = '#ff9800';
            ctx.fillRect(40, y, barWidth, barHeight - 5);
            
            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = '10px Montserrat';
            ctx.textAlign = 'left';
            ctx.fillText(item.category, 5, y + barHeight / 2);
            
            // Draw value
            ctx.textAlign = 'right';
            ctx.fillText(this.formatCurrency(item.total, this.currentCurrency), barWidth + 35, y + barHeight / 2);
        });
    }
    
    renderTopClients(clients) {
        const container = document.getElementById('topClientsList');
        if (!container) return;
        
        if (clients.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No client data available</p>';
            return;
        }
        
        const clientHTML = clients.map((client, index) => `
            <div class="client-item">
                <div class="client-rank">${index + 1}</div>
                <div class="client-info">
                    <div class="client-name">${client.name}</div>
                    <div class="client-stats">
                        <span class="client-revenue">${this.formatCurrency(client.revenue, this.currentCurrency)}</span>
                        <span class="client-projects">${client.projects} projects</span>
                    </div>
                </div>
                <div class="client-avg">${this.formatCurrency(client.avgProjectValue, this.currentCurrency)} avg</div>
            </div>
        `).join('');
        
        container.innerHTML = clientHTML;
    }
    
    refreshAnalytics() {
        this.updateAnalytics();
        this.showNotification('Analytics refreshed successfully', 'success');
    }

    // Invoice System Methods
    showInvoiceSystem() {
        console.log('Invoice system button clicked!');
        
        try {
            const currentBusiness = this.businessType === 'digitalFootprints' ? 'Digital Footprints Multimedia' : 'Film Fixer Consultation';
            
            // Hide main content and show invoice system
            const tableSection = document.querySelector('.table-section');
            const formSection = document.querySelector('.form-section');
            
            if (tableSection) tableSection.style.display = 'none';
            if (formSection) formSection.style.display = 'none';
            
            // Create or show invoice system container
            let invoiceContainer = document.getElementById('invoiceSystemContainer');
            if (!invoiceContainer) {
                invoiceContainer = document.createElement('div');
                invoiceContainer.id = 'invoiceSystemContainer';
                invoiceContainer.className = 'invoice-system-container';
                document.querySelector('main').appendChild(invoiceContainer);
            }
            
            invoiceContainer.innerHTML = `
                <div class="invoice-header">
                    <h2><i class="fas fa-file-invoice"></i> Invoicing System</h2>
                    <div class="invoice-controls">
                        <button class="btn btn-secondary" onclick="currentManager.hideInvoiceSystem()">
                            <i class="fas fa-arrow-left"></i> Back to Projects
                        </button>
                        <button class="btn btn-primary" onclick="currentManager.createNewInvoice()">
                            <i class="fas fa-plus"></i> New Invoice
                        </button>
                    </div>
                </div>
                
                <div class="invoice-tabs">
                    <button class="invoice-tab active" onclick="currentManager.switchInvoiceTab('create')">Create Invoice</button>
                    <button class="invoice-tab" onclick="currentManager.switchInvoiceTab('manage')">Manage Invoices</button>
                    <button class="invoice-tab" onclick="currentManager.switchInvoiceTab('templates')">Templates</button>
                </div>
                
                <div id="invoiceContent" class="invoice-content">
                    ${this.getInvoiceCreateContent()}
                </div>
            `;
            
            invoiceContainer.style.display = 'block';
            this.loadInvoices();
            this.updateInvoiceAnalytics();
            
            console.log('Invoice system loaded successfully!');
        } catch (error) {
            console.error('Error loading invoice system:', error);
            alert('Error loading invoice system: ' + error.message);
        }
    }
    
    hideInvoiceSystem() {
        const invoiceContainer = document.getElementById('invoiceSystemContainer');
        if (invoiceContainer) {
            invoiceContainer.style.display = 'none';
        }
        document.querySelector('.table-section').style.display = 'block';
        document.querySelector('.form-section').style.display = 'block';
    }
    
    switchInvoiceTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.invoice-tab').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Update content
        const contentDiv = document.getElementById('invoiceContent');
        switch (tab) {
            case 'create':
                contentDiv.innerHTML = this.getInvoiceCreateContent();
                break;
            case 'manage':
                contentDiv.innerHTML = this.getInvoiceManageContent();
                this.renderInvoices();
                break;
            case 'templates':
                contentDiv.innerHTML = this.getInvoiceTemplatesContent();
                break;
        }
    }
    
    getInvoiceCreateContent() {
        const businessType = this.businessType === 'digitalFootprints' ? 'digitalFootprints' : 'filmFixer';
        const services = this.getInvoiceServices(businessType);
        
        return `
            <div class="invoice-form-container">
                <div class="invoice-form-section">
                    <h3>Client Information</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="invoiceClientName">Client Name *</label>
                            <input type="text" id="invoiceClientName" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="invoiceClientEmail">Email Address</label>
                            <input type="email" id="invoiceClientEmail" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="invoiceClientPhone">Phone Number</label>
                            <input type="tel" id="invoiceClientPhone" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="invoiceClientAddress">Address</label>
                            <textarea id="invoiceClientAddress" class="form-control" rows="2"></textarea>
                        </div>
                    </div>
                </div>
                
                <div class="invoice-form-section">
                    <h3>Invoice Details</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="invoiceNumber">Invoice Number *</label>
                            <input type="text" id="invoiceNumber" class="form-control" value="${this.generateInvoiceNumber()}" required>
                        </div>
                        <div class="form-group">
                            <label for="invoiceDate">Invoice Date *</label>
                            <input type="date" id="invoiceDate" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
                        </div>
                        <div class="form-group">
                            <label for="invoiceDueDate">Due Date *</label>
                            <input type="date" id="invoiceDueDate" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="invoiceCurrency">Currency *</label>
                            <select id="invoiceCurrency" class="form-control">
                                <option value="USD">USD ($)</option>
                                <option value="MWK">MWK (MK)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="ZAR">ZAR (R)</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="invoice-form-section">
                    <h3>Services & Items</h3>
                    <div class="invoice-items-container">
                        <div class="invoice-items-header">
                            <div>Service/Item</div>
                            <div>Description</div>
                            <div>Quantity</div>
                            <div>Unit Price</div>
                            <div>Total</div>
                            <div>Action</div>
                        </div>
                        <div id="invoiceItems" class="invoice-items">
                            ${this.getInvoiceItemRow(0)}
                        </div>
                        <button type="button" class="btn btn-secondary" onclick="currentManager.addInvoiceItem()">
                            <i class="fas fa-plus"></i> Add Item
                        </button>
                    </div>
                </div>
                
                <div class="invoice-form-section">
                    <h3>Additional Details</h3>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="invoiceNotes">Notes</label>
                            <textarea id="invoiceNotes" class="form-control" rows="3" placeholder="Payment terms, thank you notes, etc."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="invoiceProject">Related Project (Optional)</label>
                            <select id="invoiceProject" class="form-control">
                                <option value="">Select a project...</option>
                                ${this.projects.map(p => `<option value="${p.id}">${p.projectName} - ${p.clientName}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="invoice-summary">
                    <div class="invoice-total-row">
                        <span>Subtotal:</span>
                        <span id="invoiceSubtotal">$0.00</span>
                    </div>
                    <div class="invoice-total-row">
                        <span>Tax (${document.getElementById('invoiceTaxRate')?.value || 0}%):</span>
                        <span id="invoiceTax">$0.00</span>
                    </div>
                    <div class="invoice-total-row grand-total">
                        <span>Total:</span>
                        <span id="invoiceTotal">$0.00</span>
                    </div>
                </div>
                
                <div class="invoice-form-actions">
                    <button type="button" class="btn btn-secondary" onclick="currentManager.previewInvoice()">
                        <i class="fas fa-eye"></i> Preview Invoice
                    </button>
                    <button type="button" class="btn btn-success" onclick="currentManager.saveInvoice()">
                        <i class="fas fa-save"></i> Save Invoice
                    </button>
                    <button type="button" class="btn btn-primary" onclick="currentManager.generatePDF()">
                        <i class="fas fa-file-pdf"></i> Generate PDF
                    </button>
                    <button type="button" class="btn btn-info" onclick="currentManager.emailInvoice()">
                        <i class="fas fa-envelope"></i> Email Invoice
                    </button>
                </div>
            </div>
        `;
    }
    
    getInvoiceItemRow(index) {
        const businessType = this.businessType === 'digitalFootprints' ? 'digitalFootprints' : 'filmFixer';
        const services = this.getInvoiceServices(businessType);
        
        return `
            <div class="invoice-item-row" data-index="${index}">
                <select class="form-control invoice-service" onchange="currentManager.updateInvoiceItem(${index})">
                    <option value="">Select service...</option>
                    ${services.map(service => `<option value="${service.name}" data-price="${service.price}">${service.name}</option>`).join('')}
                    <option value="custom">Custom Service</option>
                </select>
                <input type="text" class="form-control invoice-description" placeholder="Description">
                <input type="number" class="form-control invoice-quantity" min="1" value="1" onchange="currentManager.updateInvoiceItem(${index})">
                <input type="number" class="form-control invoice-price" min="0" step="0.01" placeholder="0.00" onchange="currentManager.updateInvoiceItem(${index})">
                <span class="invoice-item-total">$0.00</span>
                <button type="button" class="btn btn-danger btn-sm" onclick="currentManager.removeInvoiceItem(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }
    
    getInvoiceServices(businessType) {
        if (businessType === 'digitalFootprints') {
            return [
                { name: 'Photography Session', price: 500 },
                { name: 'Videography Package', price: 1200 },
                { name: 'Graphic Design', price: 300 },
                { name: 'Web Development', price: 2500 },
                { name: 'Brand Identity Package', price: 1500 },
                { name: 'Social Media Management', price: 800 },
                { name: 'Photo Editing', price: 150 },
                { name: 'Video Editing', price: 400 },
                { name: 'Logo Design', price: 400 },
                { name: 'Marketing Materials', price: 600 }
            ];
        } else {
            return [
                { name: 'Film Production', price: 5000 },
                { name: 'Location Scouting', price: 800 },
                { name: 'Production Management', price: 2000 },
                { name: 'Equipment Rental', price: 500 },
                { name: 'Crew Coordination', price: 1500 },
                { name: 'Permit Assistance', price: 300 },
                { name: 'Transportation', price: 400 },
                { name: 'Catering Services', price: 600 },
                { name: 'Post-Production', price: 1200 },
                { name: 'Consulting Services', price: 1000 }
            ];
        }
    }
    
    getInvoiceManageContent() {
        return `
            <div class="invoice-manage-container">
                <div class="invoice-filters">
                    <input type="text" id="invoiceSearch" class="form-control" placeholder="Search invoices..." onkeyup="currentManager.filterInvoices()">
                    <select id="invoiceStatusFilter" class="form-control" onchange="currentManager.filterInvoices()">
                        <option value="">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                    </select>
                    <select id="invoiceDateFilter" class="form-control" onchange="currentManager.filterInvoices()">
                        <option value="">All Dates</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
                
                <div class="invoice-analytics">
                    <div class="invoice-stat-card">
                        <h4>Total Invoiced</h4>
                        <p id="totalInvoiced">$0.00</p>
                    </div>
                    <div class="invoice-stat-card">
                        <h4>Paid</h4>
                        <p id="totalPaid">$0.00</p>
                    </div>
                    <div class="invoice-stat-card">
                        <h4>Outstanding</h4>
                        <p id="totalOutstanding">$0.00</p>
                    </div>
                    <div class="invoice-stat-card">
                        <h4>Overdue</h4>
                        <p id="totalOverdue">$0.00</p>
                    </div>
                </div>
                
                <div class="invoice-table-container">
                    <table class="invoice-table">
                        <thead>
                            <tr>
                                <th>Invoice #</th>
                                <th>Client</th>
                                <th>Date</th>
                                <th>Due Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="invoiceTableBody">
                            <!-- Invoices will be rendered here -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    getInvoiceTemplatesContent() {
        return `
            <div class="invoice-templates-container">
                <div class="template-grid">
                    <div class="template-card">
                        <h3>Standard Invoice</h3>
                        <p>Clean, professional invoice template suitable for all business types</p>
                        <button class="btn btn-primary" onclick="currentManager.useTemplate('standard')">Use Template</button>
                    </div>
                    <div class="template-card">
                        <h3>Detailed Invoice</h3>
                        <p>Comprehensive template with detailed breakdowns and terms</p>
                        <button class="btn btn-primary" onclick="currentManager.useTemplate('detailed')">Use Template</button>
                    </div>
                    <div class="template-card">
                        <h3>Simple Invoice</h3>
                        <p>Minimal template for quick invoicing</p>
                        <button class="btn btn-primary" onclick="currentManager.useTemplate('simple')">Use Template</button>
                    </div>
                    <div class="template-card">
                        <h3>Custom Template</h3>
                        <p>Create your own invoice template</p>
                        <button class="btn btn-success" onclick="currentManager.createCustomTemplate()">Create Template</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateInvoiceNumber() {
        const prefix = this.businessType === 'digitalFootprints' ? 'DF' : 'FF';
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${date}-${random}`;
    }
    
    addInvoiceItem() {
        const itemsContainer = document.getElementById('invoiceItems');
        const currentIndex = itemsContainer.children.length;
        const newItem = document.createElement('div');
        newItem.innerHTML = this.getInvoiceItemRow(currentIndex);
        itemsContainer.appendChild(newItem);
    }
    
    removeInvoiceItem(index) {
        const item = document.querySelector(`.invoice-item-row[data-index="${index}"]`);
        if (item && document.querySelectorAll('.invoice-item-row').length > 1) {
            item.remove();
            this.updateInvoiceTotals();
        }
    }
    
    updateInvoiceItem(index) {
        const row = document.querySelector(`.invoice-item-row[data-index="${index}"]`);
        const serviceSelect = row.querySelector('.invoice-service');
        const quantity = parseFloat(row.querySelector('.invoice-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.invoice-price').value) || 0;
        const total = quantity * price;
        
        row.querySelector('.invoice-item-total').textContent = this.formatCurrency(total, this.getCurrentInvoiceCurrency());
        
        // Auto-fill description and price for predefined services
        if (serviceSelect.value && serviceSelect.value !== 'custom') {
            const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
            const defaultPrice = parseFloat(selectedOption.dataset.price) || 0;
            if (!row.querySelector('.invoice-price').value) {
                row.querySelector('.invoice-price').value = defaultPrice;
                this.updateInvoiceItem(index);
            }
        }
        
        this.updateInvoiceTotals();
    }
    
    updateInvoiceTotals() {
        const items = document.querySelectorAll('.invoice-item-row');
        let subtotal = 0;
        
        items.forEach(row => {
            const totalText = row.querySelector('.invoice-item-total').textContent;
            const total = parseFloat(totalText.replace(/[^0-9.-]+/g, '')) || 0;
            subtotal += total;
        });
        
        const taxRate = 0; // Can be made configurable
        const tax = subtotal * (taxRate / 100);
        const total = subtotal + tax;
        
        document.getElementById('invoiceSubtotal').textContent = this.formatCurrency(subtotal, this.getCurrentInvoiceCurrency());
        document.getElementById('invoiceTax').textContent = this.formatCurrency(tax, this.getCurrentInvoiceCurrency());
        document.getElementById('invoiceTotal').textContent = this.formatCurrency(total, this.getCurrentInvoiceCurrency());
    }
    
    getCurrentInvoiceCurrency() {
        const currencySelect = document.getElementById('invoiceCurrency');
        return currencySelect ? currencySelect.value : this.currentCurrency;
    }
    
    saveInvoice() {
        const invoice = this.collectInvoiceData();
        if (!this.validateInvoice(invoice)) {
            return;
        }
        
        // Save to local storage
        const invoices = this.getInvoices();
        invoices.push(invoice);
        localStorage.setItem(`${this.businessType}Invoices`, JSON.stringify(invoices));
        
        this.showNotification('Invoice saved successfully!', 'success');
        this.switchInvoiceTab('manage');
    }
    
    collectInvoiceData() {
        const items = [];
        document.querySelectorAll('.invoice-item-row').forEach(row => {
            const service = row.querySelector('.invoice-service').value;
            const description = row.querySelector('.invoice-description').value;
            const quantity = parseFloat(row.querySelector('.invoice-quantity').value) || 0;
            const price = parseFloat(row.querySelector('.invoice-price').value) || 0;
            
            if (service && quantity > 0 && price > 0) {
                items.push({ service, description, quantity, price, total: quantity * price });
            }
        });
        
        return {
            id: Date.now().toString(),
            invoiceNumber: document.getElementById('invoiceNumber').value,
            clientName: document.getElementById('invoiceClientName').value,
            clientEmail: document.getElementById('invoiceClientEmail').value,
            clientPhone: document.getElementById('invoiceClientPhone').value,
            clientAddress: document.getElementById('invoiceClientAddress').value,
            date: document.getElementById('invoiceDate').value,
            dueDate: document.getElementById('invoiceDueDate').value,
            currency: document.getElementById('invoiceCurrency').value,
            items: items,
            subtotal: parseFloat(document.getElementById('invoiceSubtotal').textContent.replace(/[^0-9.-]+/g, '')),
            tax: parseFloat(document.getElementById('invoiceTax').textContent.replace(/[^0-9.-]+/g, '')),
            total: parseFloat(document.getElementById('invoiceTotal').textContent.replace(/[^0-9.-]+/g, '')),
            notes: document.getElementById('invoiceNotes').value,
            projectId: document.getElementById('invoiceProject').value,
            status: 'draft',
            businessType: this.businessType,
            createdAt: new Date().toISOString()
        };
    }
    
    validateInvoice(invoice) {
        if (!invoice.clientName) {
            this.showNotification('Please enter client name', 'error');
            return false;
        }
        if (!invoice.invoiceNumber) {
            this.showNotification('Please enter invoice number', 'error');
            return false;
        }
        if (!invoice.date) {
            this.showNotification('Please enter invoice date', 'error');
            return false;
        }
        if (!invoice.dueDate) {
            this.showNotification('Please enter due date', 'error');
            return false;
        }
        if (invoice.items.length === 0) {
            this.showNotification('Please add at least one item', 'error');
            return false;
        }
        return true;
    }
    
    getInvoices() {
        const invoices = localStorage.getItem(`${this.businessType}Invoices`);
        return invoices ? JSON.parse(invoices) : [];
    }
    
    loadInvoices() {
        // Invoices are loaded when needed
    }
    
    renderInvoices() {
        const invoices = this.getInvoices();
        const tbody = document.getElementById('invoiceTableBody');
        
        if (invoices.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No invoices found. Create your first invoice!</td></tr>';
            return;
        }
        
        tbody.innerHTML = invoices.map(invoice => `
            <tr>
                <td>${invoice.invoiceNumber}</td>
                <td>${invoice.clientName}</td>
                <td>${invoice.date}</td>
                <td>${invoice.dueDate}</td>
                <td>${this.formatCurrency(invoice.total, invoice.currency)}</td>
                <td><span class="invoice-status ${invoice.status}">${invoice.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="currentManager.viewInvoice('${invoice.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="currentManager.editInvoice('${invoice.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="currentManager.deleteInvoice('${invoice.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    updateInvoiceAnalytics() {
        const invoices = this.getInvoices();
        const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
        const totalOutstanding = invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0);
        const totalOverdue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);
        
        // Update analytics if elements exist
        const totalInvoicedEl = document.getElementById('totalInvoiced');
        const totalPaidEl = document.getElementById('totalPaid');
        const totalOutstandingEl = document.getElementById('totalOutstanding');
        const totalOverdueEl = document.getElementById('totalOverdue');
        
        if (totalInvoicedEl) totalInvoicedEl.textContent = this.formatCurrency(totalInvoiced, this.currentCurrency);
        if (totalPaidEl) totalPaidEl.textContent = this.formatCurrency(totalPaid, this.currentCurrency);
        if (totalOutstandingEl) totalOutstandingEl.textContent = this.formatCurrency(totalOutstanding, this.currentCurrency);
        if (totalOverdueEl) totalOverdueEl.textContent = this.formatCurrency(totalOverdue, this.currentCurrency);
    }
    
    previewInvoice() {
        const invoice = this.collectInvoiceData();
        if (!this.validateInvoice(invoice)) {
            return;
        }
        
        // Create preview modal
        const modal = document.createElement('div');
        modal.className = 'invoice-preview-modal';
        modal.innerHTML = `
            <div class="invoice-preview-content">
                <div class="invoice-preview-header">
                    <h3>Invoice Preview</h3>
                    <button class="btn btn-secondary" onclick="this.closest('.invoice-preview-modal').remove()">Close</button>
                </div>
                <div class="invoice-preview-body">
                    ${this.generateInvoiceHTML(invoice)}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    generateInvoiceHTML(invoice) {
        const businessName = this.businessType === 'digitalFootprints' ? 'Digital Footprints Multimedia' : 'Film Fixer Consultation';
        
        return `
            <div class="invoice-document">
                <div class="invoice-header">
                    <div class="invoice-company">
                        <h2>${businessName}</h2>
                        <p>Professional Media Management</p>
                    </div>
                    <div class="invoice-details">
                        <h3>INVOICE</h3>
                        <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
                        <p><strong>Date:</strong> ${invoice.date}</p>
                        <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
                    </div>
                </div>
                
                <div class="invoice-bill-to">
                    <h4>Bill To:</h4>
                    <p><strong>${invoice.clientName}</strong></p>
                    ${invoice.clientEmail ? `<p>${invoice.clientEmail}</p>` : ''}
                    ${invoice.clientPhone ? `<p>${invoice.clientPhone}</p>` : ''}
                    ${invoice.clientAddress ? `<p>${invoice.clientAddress}</p>` : ''}
                </div>
                
                <table class="invoice-items-table">
                    <thead>
                        <tr>
                            <th>Service/Item</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items.map(item => `
                            <tr>
                                <td>${item.service}</td>
                                <td>${item.description}</td>
                                <td>${item.quantity}</td>
                                <td>${this.formatCurrency(item.price, invoice.currency)}</td>
                                <td>${this.formatCurrency(item.total, invoice.currency)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="invoice-totals">
                    <p><strong>Subtotal:</strong> ${this.formatCurrency(invoice.subtotal, invoice.currency)}</p>
                    <p><strong>Tax:</strong> ${this.formatCurrency(invoice.tax, invoice.currency)}</p>
                    <p><strong>Total:</strong> ${this.formatCurrency(invoice.total, invoice.currency)}</p>
                </div>
                
                ${invoice.notes ? `
                <div class="invoice-notes">
                    <h4>Notes:</h4>
                    <p>${invoice.notes}</p>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    createNewInvoice() {
        // Reset form and switch to create tab
        this.switchInvoiceTab('create');
        document.getElementById('invoiceNumber').value = this.generateInvoiceNumber();
        document.getElementById('invoiceDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('invoiceDueDate').value = '';
        document.getElementById('invoiceClientName').value = '';
        document.getElementById('invoiceClientEmail').value = '';
        document.getElementById('invoiceClientPhone').value = '';
        document.getElementById('invoiceClientAddress').value = '';
        document.getElementById('invoiceNotes').value = '';
        
        // Reset items
        document.getElementById('invoiceItems').innerHTML = this.getInvoiceItemRow(0);
        this.updateInvoiceTotals();
    }
    
    // Placeholder methods for future implementation
    generatePDF() {
        // Get current invoice data (this would need to be adapted based on how you collect invoice data)
        const invoiceData = this.collectCurrentInvoiceData();
        
        if (!invoiceData) {
            this.showNotification('Please create an invoice first', 'error');
            return;
        }
        
        // Create printable invoice HTML
        const businessName = this.businessType === 'digitalFootprints' ? 'Digital Footprints Multimedia' : 'Film Fixer Consultation';
        const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice ${invoiceData.invoiceNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .company-info { margin-bottom: 20px; }
        .invoice-details { margin-bottom: 30px; }
        .client-info { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .total-section { text-align: right; margin-top: 20px; }
        .total-row { margin: 5px 0; }
        .grand-total { font-size: 18px; font-weight: bold; color: #ff6b35; }
        .notes { margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>INVOICE</h1>
        <h2>${businessName}</h2>
    </div>
    
    <div class="company-info">
        <strong>${businessName}</strong><br>
        Creative Media & Production Services<br>
        Professional Media Solutions
    </div>
    
    <div class="invoice-details">
        <strong>Invoice Details:</strong><br>
        Invoice Number: ${invoiceData.invoiceNumber}<br>
        Date: ${invoiceData.date}<br>
        Due Date: ${invoiceData.dueDate}<br>
        Status: ${invoiceData.status || 'DRAFT'}
    </div>
    
    <div class="client-info">
        <strong>Bill To:</strong><br>
        ${invoiceData.clientName}<br>
        ${invoiceData.clientEmail}<br>
        ${invoiceData.clientPhone || ''}
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Service/Item</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${invoiceData.items.map(item => `
                <tr>
                    <td>${item.service}</td>
                    <td>${item.description || '-'}</td>
                    <td>${item.quantity}</td>
                    <td>${this.formatCurrency(item.price, invoiceData.currency)}</td>
                    <td>${this.formatCurrency(item.total, invoiceData.currency)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div class="total-section">
        <div class="total-row">Subtotal: ${this.formatCurrency(invoiceData.subtotal, invoiceData.currency)}</div>
        <div class="total-row">Tax: ${this.formatCurrency(invoiceData.tax, invoiceData.currency)}</div>
        <div class="total-row grand-total">Total: ${this.formatCurrency(invoiceData.total, invoiceData.currency)}</div>
    </div>
    
    ${invoiceData.notes ? `
    <div class="notes">
        <strong>Notes:</strong><br>
        ${invoiceData.notes}
    </div>
    ` : ''}
    
    <div class="footer">
        <p>Thank you for your business!</p>
        <p>This invoice was generated on ${new Date().toLocaleDateString()}</p>
    </div>
</body>
</html>
        `;
        
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
        
        // Wait for content to load, then print
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
            }, 500);
        };
        
        this.showNotification('PDF generation window opened. Use your browser\'s print function to save as PDF.', 'success');
    }
    
    emailInvoice() {
        // Get current invoice data
        const invoiceData = this.collectCurrentInvoiceData();
        
        if (!invoiceData) {
            this.showNotification('Please create an invoice first', 'error');
            return;
        }
        
        // Create email content
        const businessName = this.businessType === 'digitalFootprints' ? 'Digital Footprints Multimedia' : 'Film Fixer Consultation';
        const subject = `Invoice ${invoiceData.invoiceNumber} from ${businessName}`;
        const body = `
Dear ${invoiceData.clientName},

Please find invoice ${invoiceData.invoiceNumber} for ${this.formatCurrency(invoiceData.total, invoiceData.currency)}.

Invoice Details:
- Invoice Number: ${invoiceData.invoiceNumber}
- Date: ${invoiceData.date}
- Due Date: ${invoiceData.dueDate}
- Total Amount: ${this.formatCurrency(invoiceData.total, invoiceData.currency)}

Payment is due by ${invoiceData.dueDate}.

Thank you for your business!

Best regards,
${businessName}
        `.trim();
        
        // Create mailto link
        const mailtoLink = `mailto:${invoiceData.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open email client
        window.open(mailtoLink, '_blank');
        
        this.showNotification('Email client opened with invoice details.', 'success');
    }
    
    collectCurrentInvoiceData() {
        // This is a placeholder - you would need to implement this based on your invoice form structure
        // For now, return sample data or collect from form
        const clientName = document.getElementById('clientName')?.value;
        const clientEmail = document.getElementById('clientEmail')?.value;
        
        if (!clientName || !clientEmail) {
            return null;
        }
        
        return {
            invoiceNumber: 'INV-' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            clientName: clientName,
            clientEmail: clientEmail,
            clientPhone: document.getElementById('clientPhone')?.value || '',
            currency: this.getCurrentInvoiceCurrency(),
            items: [],
            subtotal: 0,
            tax: 0,
            total: 0,
            status: 'DRAFT',
            notes: document.getElementById('notes')?.value || ''
        };
    }
    
    viewInvoice(invoiceId) {
        this.showNotification('View invoice details coming soon!', 'info');
    }
    
    editInvoice(invoiceId) {
        this.showNotification('Edit invoice coming soon!', 'info');
    }
    
    deleteInvoice(invoiceId) {
        if (confirm('Are you sure you want to delete this invoice?')) {
            const invoices = this.getInvoices();
            const updatedInvoices = invoices.filter(inv => inv.id !== invoiceId);
            localStorage.setItem(`${this.businessType}Invoices`, JSON.stringify(updatedInvoices));
            this.renderInvoices();
            this.updateInvoiceAnalytics();
            this.showNotification('Invoice deleted successfully', 'success');
        }
    }
    
    filterInvoices() {
        // Implementation for invoice filtering
        this.renderInvoices();
    }
    
    useTemplate(templateType) {
        this.showNotification(`Using ${templateType} template`, 'info');
        this.switchInvoiceTab('create');
    }
    
    createCustomTemplate() {
        this.showNotification('Custom template creator coming soon!', 'info');
    }

    // Client Contact Database Methods
    showClientDatabase() {
        console.log('Client database button clicked!');
        
        try {
            // Hide main content and show client database
            const tableSection = document.querySelector('.table-section');
            const formSection = document.querySelector('.form-section');
            
            if (tableSection) tableSection.style.display = 'none';
            if (formSection) formSection.style.display = 'none';
            
            // Create or show client database container
            let clientContainer = document.getElementById('clientDatabaseContainer');
            if (!clientContainer) {
                clientContainer = document.createElement('div');
                clientContainer.id = 'clientDatabaseContainer';
                clientContainer.className = 'client-database-container';
                document.querySelector('main').appendChild(clientContainer);
            }
            
            clientContainer.innerHTML = `
                <div class="client-header">
                    <h2><i class="fas fa-address-book"></i> Client Contact Database</h2>
                    <div class="client-controls">
                        <button class="btn btn-secondary" onclick="currentManager.hideClientDatabase()">
                            <i class="fas fa-arrow-left"></i> Back to Projects
                        </button>
                        <button class="btn btn-primary" onclick="currentManager.addNewClient()">
                            <i class="fas fa-user-plus"></i> Add Client
                        </button>
                        <button class="btn btn-info" onclick="currentManager.importClients()">
                            <i class="fas fa-upload"></i> Import Clients
                        </button>
                        <button class="btn btn-success" onclick="currentManager.exportClients()">
                            <i class="fas fa-download"></i> Export Clients
                        </button>
                    </div>
                </div>
                
                <div class="client-tabs">
                    <button class="client-tab active" onclick="currentManager.switchClientTab('all')">All Clients</button>
                    <button class="client-tab" onclick="currentManager.switchClientTab('active')">Active</button>
                    <button class="client-tab" onclick="currentManager.switchClientTab('inactive')">Inactive</button>
                    <button class="client-tab" onclick="currentManager.switchClientTab('vip')">VIP Clients</button>
                </div>
                
                <div class="client-search-section">
                    <div class="search-filters">
                        <input type="text" id="clientSearch" class="form-control" placeholder="Search clients by name, email, phone, company..." onkeyup="currentManager.filterClients()">
                        <select id="clientTypeFilter" class="form-control" onchange="currentManager.filterClients()">
                            <option value="">All Types</option>
                            <option value="individual">Individual</option>
                            <option value="company">Company</option>
                            <option value="organization">Organization</option>
                        </select>
                        <select id="clientStatusFilter" class="form-control" onchange="currentManager.filterClients()">
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="vip">VIP</option>
                        </select>
                    </div>
                </div>
                
                <div id="clientContent" class="client-content">
                    ${this.getClientListContent()}
                </div>
            `;
            
            clientContainer.style.display = 'block';
            this.loadClients();
            this.updateClientAnalytics();
            this.renderClients();
            
            console.log('Client database loaded successfully!');
        } catch (error) {
            console.error('Error loading client database:', error);
            alert('Error loading client database: ' + error.message);
        }
    }
    
    hideClientDatabase() {
        const clientContainer = document.getElementById('clientDatabaseContainer');
        if (clientContainer) {
            clientContainer.style.display = 'none';
        }
        document.querySelector('.table-section').style.display = 'block';
        document.querySelector('.form-section').style.display = 'block';
    }
    
    switchClientTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.client-tab').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Update content
        const contentDiv = document.getElementById('clientContent');
        switch (tab) {
            case 'all':
                contentDiv.innerHTML = this.getClientListContent();
                break;
            case 'active':
                contentDiv.innerHTML = this.getClientListContent('active');
                break;
            case 'inactive':
                contentDiv.innerHTML = this.getClientListContent('inactive');
                break;
            case 'vip':
                contentDiv.innerHTML = this.getClientListContent('vip');
                break;
        }
        this.renderClients();
    }
    
    getClientListContent(filter = 'all') {
        return `
            <div class="client-analytics">
                <div class="client-stat-card">
                    <h4><i class="fas fa-users"></i> Total Clients</h4>
                    <p id="totalClients">0</p>
                </div>
                <div class="client-stat-card">
                    <h4><i class="fas fa-user-check"></i> Active</h4>
                    <p id="activeClients">0</p>
                </div>
                <div class="client-stat-card">
                    <h4><i class="fas fa-star"></i> VIP</h4>
                    <p id="vipClients">0</p>
                </div>
                <div class="client-stat-card">
                    <h4><i class="fas fa-chart-line"></i> New This Month</h4>
                    <p id="newClients">0</p>
                </div>
            </div>
            
            <div class="client-table-container">
                <table class="client-table">
                    <thead>
                        <tr>
                            <th onclick="currentManager.sortClients('name')">Name <i class="fas fa-sort"></i></th>
                            <th onclick="currentManager.sortClients('company')">Company <i class="fas fa-sort"></i></th>
                            <th onclick="currentManager.sortClients('email')">Email <i class="fas fa-sort"></i></th>
                            <th onclick="currentManager.sortClients('phone')">Phone <i class="fas fa-sort"></i></th>
                            <th onclick="currentManager.sortClients('type')">Type <i class="fas fa-sort"></i></th>
                            <th onclick="currentManager.sortClients('status')">Status <i class="fas fa-sort"></i></th>
                            <th onclick="currentManager.sortClients('projects')">Projects <i class="fas fa-sort"></i></th>
                            <th onclick="currentManager.sortClients('revenue')">Revenue <i class="fas fa-sort"></i></th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="clientTableBody">
                        <!-- Clients will be rendered here -->
                    </tbody>
                </table>
            </div>
        `;
    }
    
    addNewClient() {
        // Create modal for adding new client
        const modal = document.createElement('div');
        modal.className = 'client-modal';
        modal.innerHTML = `
            <div class="client-modal-content">
                <div class="client-modal-header">
                    <h3><i class="fas fa-user-plus"></i> Add New Client</h3>
                    <button class="btn btn-secondary" onclick="this.closest('.client-modal').remove()">Cancel</button>
                </div>
                <div class="client-modal-body">
                    <form id="clientForm">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="clientFirstName">First Name *</label>
                                <input type="text" id="clientFirstName" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="clientLastName">Last Name *</label>
                                <input type="text" id="clientLastName" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="clientCompany">Company/Organization</label>
                                <input type="text" id="clientCompany" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="clientEmail">Email Address *</label>
                                <input type="email" id="clientEmail" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="clientPhone">Phone Number</label>
                                <input type="tel" id="clientPhone" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="clientType">Client Type *</label>
                                <select id="clientType" class="form-control" required>
                                    <option value="">Select type...</option>
                                    <option value="individual">Individual</option>
                                    <option value="company">Company</option>
                                    <option value="organization">Organization</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="clientStatus">Status *</label>
                                <select id="clientStatus" class="form-control" required>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="vip">VIP</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="clientWebsite">Website</label>
                                <input type="url" id="clientWebsite" class="form-control" placeholder="https://">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="clientAddress">Address</label>
                            <textarea id="clientAddress" class="form-control" rows="2" placeholder="Street, City, Country"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="clientNotes">Notes</label>
                            <textarea id="clientNotes" class="form-control" rows="3" placeholder="Special requirements, preferences, important information..."></textarea>
                        </div>
                        
                        <div class="client-form-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.client-modal').remove()">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="currentManager.saveClient()">Save Client</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    saveClient() {
        const client = {
            id: Date.now().toString(),
            firstName: document.getElementById('clientFirstName').value,
            lastName: document.getElementById('clientLastName').value,
            company: document.getElementById('clientCompany').value,
            email: document.getElementById('clientEmail').value,
            phone: document.getElementById('clientPhone').value,
            type: document.getElementById('clientType').value,
            status: document.getElementById('clientStatus').value,
            website: document.getElementById('clientWebsite').value,
            address: document.getElementById('clientAddress').value,
            notes: document.getElementById('clientNotes').value,
            projects: 0,
            totalRevenue: 0,
            createdAt: new Date().toISOString(),
            lastContact: new Date().toISOString(),
            businessType: this.businessType
        };
        
        // Validation
        if (!client.firstName || !client.lastName || !client.email || !client.type) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Save to local storage
        const clients = this.getClients();
        clients.push(client);
        localStorage.setItem(`${this.businessType}Clients`, JSON.stringify(clients));
        
        // Close modal and refresh
        document.querySelector('.client-modal').remove();
        this.renderClients();
        this.updateClientAnalytics();
        this.showNotification('Client added successfully!', 'success');
    }
    
    getClients() {
        const clients = localStorage.getItem(`${this.businessType}Clients`);
        return clients ? JSON.parse(clients) : [];
    }
    
    loadClients() {
        // Clients are loaded when needed
    }
    
    updateClientAnalytics() {
        const clients = this.getClients();
        const activeClients = clients.filter(c => c.status === 'active').length;
        const vipClients = clients.filter(c => c.status === 'vip').length;
        
        // New clients this month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const newClients = clients.filter(c => {
            const createdDate = new Date(c.createdAt);
            return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
        }).length;
        
        // Update analytics elements if they exist
        const totalClientsEl = document.getElementById('totalClients');
        const activeClientsEl = document.getElementById('activeClients');
        const vipClientsEl = document.getElementById('vipClients');
        const newClientsEl = document.getElementById('newClients');
        
        if (totalClientsEl) totalClientsEl.textContent = clients.length;
        if (activeClientsEl) activeClientsEl.textContent = activeClients;
        if (vipClientsEl) vipClientsEl.textContent = vipClients;
        if (newClientsEl) newClientsEl.textContent = newClients;
    }
    
    renderClients(filter = 'all') {
        const clients = this.getClients();
        const tbody = document.getElementById('clientTableBody');
        
        let filteredClients = clients;
        if (filter !== 'all') {
            filteredClients = clients.filter(client => client.status === filter);
        }
        
        if (filteredClients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px;">No clients found. Add your first client!</td></tr>';
            return;
        }
        
        tbody.innerHTML = filteredClients.map(client => `
            <tr class="client-row" data-id="${client.id}">
                <td>
                    <div class="client-name">
                        <strong>${client.firstName} ${client.lastName}</strong>
                        ${client.notes ? '<i class="fas fa-sticky-note" title="Has notes" style="color: var(--orange-500); margin-left: 5px;"></i>' : ''}
                    </div>
                </td>
                <td>${client.company || '-'}</td>
                <td>
                    <a href="mailto:${client.email}" class="client-email">${client.email}</a>
                </td>
                <td>
                    <a href="tel:${client.phone}" class="client-phone">${client.phone || '-'}</a>
                </td>
                <td><span class="client-type ${client.type}">${client.type}</span></td>
                <td><span class="client-status ${client.status}">${client.status}</span></td>
                <td>${client.projects}</td>
                <td>${this.formatCurrency(client.totalRevenue, this.currentCurrency)}</td>
                <td>
                    <div class="client-actions">
                        <button class="btn btn-sm btn-primary" onclick="currentManager.viewClient('${client.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="currentManager.editClient('${client.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="currentManager.createInvoiceForClient('${client.id}')" title="Create Invoice">
                            <i class="fas fa-file-invoice"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="currentManager.deleteClient('${client.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    updateClientAnalytics() {
        const clients = this.getClients();
        const activeClients = clients.filter(c => c.status === 'active').length;
        const vipClients = clients.filter(c => c.status === 'vip').length;
        
        // New clients this month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const newClients = clients.filter(c => {
            const createdDate = new Date(c.createdAt);
            return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
        }).length;
        
        // Update analytics if elements exist
        const totalEl = document.getElementById('totalClients');
        const activeEl = document.getElementById('activeClients');
        const vipEl = document.getElementById('vipClients');
        const newEl = document.getElementById('newClients');
        
        if (totalEl) totalEl.textContent = clients.length;
        if (activeEl) activeEl.textContent = activeClients;
        if (vipEl) vipEl.textContent = vipClients;
        if (newEl) newEl.textContent = newClients;
    }
    
    viewClient(clientId) {
        const clients = this.getClients();
        const client = clients.find(c => c.id === clientId);
        
        if (!client) return;
        
        // Create view modal
        const modal = document.createElement('div');
        modal.className = 'client-modal';
        modal.innerHTML = `
            <div class="client-modal-content">
                <div class="client-modal-header">
                    <h3><i class="fas fa-user"></i> ${client.firstName} ${client.lastName}</h3>
                    <button class="btn btn-secondary" onclick="this.closest('.client-modal').remove()">Close</button>
                </div>
                <div class="client-modal-body">
                    <div class="client-details-grid">
                        <div class="detail-section">
                            <h4>Contact Information</h4>
                            <p><strong>Email:</strong> <a href="mailto:${client.email}">${client.email}</a></p>
                            <p><strong>Phone:</strong> <a href="tel:${client.phone}">${client.phone || 'Not provided'}</a></p>
                            <p><strong>Website:</strong> ${client.website ? `<a href="${client.website}" target="_blank">${client.website}</a>` : 'Not provided'}</p>
                            <p><strong>Address:</strong> ${client.address || 'Not provided'}</p>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Business Information</h4>
                            <p><strong>Company:</strong> ${client.company || 'Not provided'}</p>
                            <p><strong>Type:</strong> <span class="client-type ${client.type}">${client.type}</span></p>
                            <p><strong>Status:</strong> <span class="client-status ${client.status}">${client.status}</span></p>
                            <p><strong>Projects:</strong> ${client.projects}</p>
                            <p><strong>Total Revenue:</strong> ${this.formatCurrency(client.totalRevenue, this.currentCurrency)}</p>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Timeline</h4>
                            <p><strong>Client Since:</strong> ${new Date(client.createdAt).toLocaleDateString()}</p>
                            <p><strong>Last Contact:</strong> ${new Date(client.lastContact).toLocaleDateString()}</p>
                        </div>
                        
                        ${client.notes ? `
                        <div class="detail-section">
                            <h4>Notes</h4>
                            <p>${client.notes}</p>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="client-modal-actions">
                        <button class="btn btn-primary" onclick="currentManager.editClient('${client.id}'); this.closest('.client-modal').remove();">
                            <i class="fas fa-edit"></i> Edit Client
                        </button>
                        <button class="btn btn-info" onclick="currentManager.createInvoiceForClient('${client.id}'); this.closest('.client-modal').remove();">
                            <i class="fas fa-file-invoice"></i> Create Invoice
                        </button>
                        <button class="btn btn-success" onclick="currentManager.createProjectForClient('${client.id}'); this.closest('.client-modal').remove();">
                            <i class="fas fa-plus"></i> Create Project
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    editClient(clientId) {
        const clients = this.getClients();
        const client = clients.find(c => c.id === clientId);
        
        if (!client) return;
        
        // Create edit modal
        const modal = document.createElement('div');
        modal.className = 'client-modal';
        modal.innerHTML = `
            <div class="client-modal-content">
                <div class="client-modal-header">
                    <h3><i class="fas fa-edit"></i> Edit Client</h3>
                    <button class="btn btn-secondary" onclick="this.closest('.client-modal').remove()">Cancel</button>
                </div>
                <div class="client-modal-body">
                    <form id="editClientForm">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="editClientFirstName">First Name *</label>
                                <input type="text" id="editClientFirstName" class="form-control" value="${client.firstName}" required>
                            </div>
                            <div class="form-group">
                                <label for="editClientLastName">Last Name *</label>
                                <input type="text" id="editClientLastName" class="form-control" value="${client.lastName}" required>
                            </div>
                            <div class="form-group">
                                <label for="editClientCompany">Company/Organization</label>
                                <input type="text" id="editClientCompany" class="form-control" value="${client.company || ''}">
                            </div>
                            <div class="form-group">
                                <label for="editClientEmail">Email Address *</label>
                                <input type="email" id="editClientEmail" class="form-control" value="${client.email}" required>
                            </div>
                            <div class="form-group">
                                <label for="editClientPhone">Phone Number</label>
                                <input type="tel" id="editClientPhone" class="form-control" value="${client.phone || ''}">
                            </div>
                            <div class="form-group">
                                <label for="editClientType">Client Type *</label>
                                <select id="editClientType" class="form-control" required>
                                    <option value="individual" ${client.type === 'individual' ? 'selected' : ''}>Individual</option>
                                    <option value="company" ${client.type === 'company' ? 'selected' : ''}>Company</option>
                                    <option value="organization" ${client.type === 'organization' ? 'selected' : ''}>Organization</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="editClientStatus">Status *</label>
                                <select id="editClientStatus" class="form-control" required>
                                    <option value="active" ${client.status === 'active' ? 'selected' : ''}>Active</option>
                                    <option value="inactive" ${client.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                                    <option value="vip" ${client.status === 'vip' ? 'selected' : ''}>VIP</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="editClientWebsite">Website</label>
                                <input type="url" id="editClientWebsite" class="form-control" value="${client.website || ''}" placeholder="https://">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="editClientAddress">Address</label>
                            <textarea id="editClientAddress" class="form-control" rows="2">${client.address || ''}</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="editClientNotes">Notes</label>
                            <textarea id="editClientNotes" class="form-control" rows="3">${client.notes || ''}</textarea>
                        </div>
                        
                        <div class="client-form-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.client-modal').remove()">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="currentManager.updateClient('${client.id}')">Update Client</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    updateClient(clientId) {
        const clients = this.getClients();
        const clientIndex = clients.findIndex(c => c.id === clientId);
        
        if (clientIndex === -1) return;
        
        // Update client data
        clients[clientIndex] = {
            ...clients[clientIndex],
            firstName: document.getElementById('editClientFirstName').value,
            lastName: document.getElementById('editClientLastName').value,
            company: document.getElementById('editClientCompany').value,
            email: document.getElementById('editClientEmail').value,
            phone: document.getElementById('editClientPhone').value,
            type: document.getElementById('editClientType').value,
            status: document.getElementById('editClientStatus').value,
            website: document.getElementById('editClientWebsite').value,
            address: document.getElementById('editClientAddress').value,
            notes: document.getElementById('editClientNotes').value,
            updatedAt: new Date().toISOString()
        };
        
        // Save and refresh
        localStorage.setItem(`${this.businessType}Clients`, JSON.stringify(clients));
        document.querySelector('.client-modal').remove();
        this.renderClients();
        this.updateClientAnalytics();
        this.showNotification('Client updated successfully!', 'success');
    }
    
    deleteClient(clientId) {
        if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
            return;
        }
        
        const clients = this.getClients();
        const updatedClients = clients.filter(c => c.id !== clientId);
        localStorage.setItem(`${this.businessType}Clients`, JSON.stringify(updatedClients));
        
        this.renderClients();
        this.updateClientAnalytics();
        this.showNotification('Client deleted successfully', 'success');
    }
    
    createInvoiceForClient(clientId) {
        const clients = this.getClients();
        const client = clients.find(c => c.id === clientId);
        
        if (!client) return;
        
        // Open invoice system with pre-filled client info
        window.open(`invoice_system.html?clientId=${clientId}`, '_blank');
        this.showNotification('Opening invoice system with client information...', 'info');
    }
    
    createProjectForClient(clientId) {
        const clients = this.getClients();
        const client = clients.find(c => c.id === clientId);
        
        if (!client) return;
        
        // Hide client database and show project form with pre-filled client info
        this.hideClientDatabase();
        
        // Pre-fill the project form
        setTimeout(() => {
            document.getElementById('clientName').value = `${client.firstName} ${client.lastName}`;
            document.getElementById('clientPhone').value = client.phone || '';
            this.showNotification('Client information pre-filled in project form', 'info');
        }, 100);
    }
    
    filterClients() {
        const searchTerm = document.getElementById('clientSearch').value.toLowerCase();
        const typeFilter = document.getElementById('clientTypeFilter').value;
        const statusFilter = document.getElementById('clientStatusFilter').value;
        
        const clients = this.getClients();
        const filteredClients = clients.filter(client => {
            const matchesSearch = !searchTerm || 
                client.firstName.toLowerCase().includes(searchTerm) ||
                client.lastName.toLowerCase().includes(searchTerm) ||
                client.email.toLowerCase().includes(searchTerm) ||
                (client.phone && client.phone.includes(searchTerm)) ||
                (client.company && client.company.toLowerCase().includes(searchTerm));
            
            const matchesType = !typeFilter || client.type === typeFilter;
            const matchesStatus = !statusFilter || client.status === statusFilter;
            
            return matchesSearch && matchesType && matchesStatus;
        });
        
        // Render filtered clients
        const tbody = document.getElementById('clientTableBody');
        if (filteredClients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 40px;">No clients found matching your criteria.</td></tr>';
            return;
        }
        
        tbody.innerHTML = filteredClients.map(client => `
            <tr class="client-row" data-id="${client.id}">
                <td>
                    <div class="client-name">
                        <strong>${client.firstName} ${client.lastName}</strong>
                        ${client.notes ? '<i class="fas fa-sticky-note" title="Has notes" style="color: var(--orange-500); margin-left: 5px;"></i>' : ''}
                    </div>
                </td>
                <td>${client.company || '-'}</td>
                <td>
                    <a href="mailto:${client.email}" class="client-email">${client.email}</a>
                </td>
                <td>
                    <a href="tel:${client.phone}" class="client-phone">${client.phone || '-'}</a>
                </td>
                <td><span class="client-type ${client.type}">${client.type}</span></td>
                <td><span class="client-status ${client.status}">${client.status}</span></td>
                <td>${client.projects}</td>
                <td>${this.formatCurrency(client.totalRevenue, this.currentCurrency)}</td>
                <td>
                    <div class="client-actions">
                        <button class="btn btn-sm btn-primary" onclick="currentManager.viewClient('${client.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="currentManager.editClient('${client.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="currentManager.createInvoiceForClient('${client.id}')" title="Create Invoice">
                            <i class="fas fa-file-invoice"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="currentManager.deleteClient('${client.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    sortClients(field) {
        const clients = this.getClients();
        
        clients.sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];
            
            // Handle numeric fields
            if (field === 'projects' || field === 'revenue') {
                aVal = parseFloat(aVal) || 0;
                bVal = parseFloat(bVal) || 0;
                return bVal - aVal; // Descending for numbers
            }
            
            // Handle string fields
            aVal = (aVal || '').toString().toLowerCase();
            bVal = (bVal || '').toString().toLowerCase();
            
            if (aVal < bVal) return -1;
            if (aVal > bVal) return 1;
            return 0;
        });
        
        // Update local storage and re-render
        localStorage.setItem(`${this.businessType}Clients`, JSON.stringify(clients));
        this.renderClients();
    }
    
    importClients() {
        // Create import modal
        const modal = document.createElement('div');
        modal.className = 'client-modal';
        modal.innerHTML = `
            <div class="client-modal-content">
                <div class="client-modal-header">
                    <h3><i class="fas fa-upload"></i> Import Clients</h3>
                    <button class="btn btn-secondary" onclick="this.closest('.client-modal').remove()">Cancel</button>
                </div>
                <div class="client-modal-body">
                    <div class="import-options">
                        <div class="import-option">
                            <h4>Import from CSV</h4>
                            <p>Upload a CSV file with client information.</p>
                            <input type="file" id="csvFile" accept=".csv" class="form-control">
                            <button class="btn btn-primary" onclick="currentManager.importFromCSV()">Import CSV</button>
                        </div>
                        
                        <div class="import-option">
                            <h4>Import from Excel</h4>
                            <p>Upload an Excel file with client information.</p>
                            <input type="file" id="excelFile" accept=".xlsx,.xls" class="form-control">
                            <button class="btn btn-primary" onclick="currentManager.importFromExcel()">Import Excel</button>
                        </div>
                    </div>
                    
                    <div class="import-template">
                        <h4>Template</h4>
                        <p>Download our template to ensure proper formatting:</p>
                        <button class="btn btn-info" onclick="currentManager.downloadClientTemplate()">
                            <i class="fas fa-download"></i> Download Template
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    exportClients() {
        if (typeof XLSX === 'undefined') {
            this.showNotification('Excel export library not loaded', 'error');
            return;
        }
        
        const clients = this.getClients();
        const businessName = this.businessType === 'digitalFootprints' ? 'Digital Footprints Multimedia' : 'Film Fixer Consultation';
        
        // Prepare data for export
        const exportData = clients.map(client => ({
            'First Name': client.firstName,
            'Last Name': client.lastName,
            'Company': client.company || '',
            'Email': client.email,
            'Phone': client.phone || '',
            'Type': client.type,
            'Status': client.status,
            'Website': client.website || '',
            'Address': client.address || '',
            'Projects': client.projects,
            'Total Revenue': client.totalRevenue,
            'Created Date': new Date(client.createdAt).toLocaleDateString(),
            'Last Contact': new Date(client.lastContact).toLocaleDateString(),
            'Notes': client.notes || ''
        }));
        
        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Clients');
        
        // Download file
        XLSX.writeFile(wb, `${businessName}_Clients_${new Date().toISOString().split('T')[0]}.xlsx`);
        this.showNotification('Clients exported successfully!', 'success');
    }
    
    downloadClientTemplate() {
        if (typeof XLSX === 'undefined') {
            this.showNotification('Excel export library not loaded', 'error');
            return;
        }
        
        // Create template data
        const templateData = [
            {
                'First Name': 'John',
                'Last Name': 'Doe',
                'Company': 'Example Company',
                'Email': 'john@example.com',
                'Phone': '+1234567890',
                'Type': 'company',
                'Status': 'active',
                'Website': 'https://example.com',
                'Address': '123 Main St, City, Country',
                'Projects': '0',
                'Total Revenue': '0',
                'Created Date': new Date().toLocaleDateString(),
                'Last Contact': new Date().toLocaleDateString(),
                'Notes': 'Sample client notes'
            }
        ];
        
        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Template');
        
        // Download file
        XLSX.writeFile(wb, 'Client_Template.xlsx');
        this.showNotification('Template downloaded successfully!', 'success');
    }
    
    importFromCSV() {
        const fileInput = document.getElementById('csvFile');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Please select a CSV file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target.result;
                const lines = text.split('\n');
                const headers = lines[0].split(',').map(h => h.trim());
                
                const clients = [];
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i].trim()) {
                        const values = lines[i].split(',').map(v => v.trim());
                        const client = {
                            id: Date.now().toString() + i,
                            firstName: values[0] || '',
                            lastName: values[1] || '',
                            company: values[2] || '',
                            email: values[3] || '',
                            phone: values[4] || '',
                            type: values[5] || 'individual',
                            status: values[6] || 'active',
                            website: values[7] || '',
                            address: values[8] || '',
                            projects: parseInt(values[9]) || 0,
                            totalRevenue: parseFloat(values[10]) || 0,
                            createdAt: new Date().toISOString(),
                            lastContact: new Date().toISOString(),
                            notes: values[13] || '',
                            businessType: this.businessType
                        };
                        clients.push(client);
                    }
                }
                
                // Save clients
                const existingClients = this.getClients();
                const allClients = [...existingClients, ...clients];
                localStorage.setItem(`${this.businessType}Clients`, JSON.stringify(allClients));
                
                document.querySelector('.client-modal').remove();
                this.renderClients();
                this.updateClientAnalytics();
                this.showNotification(`Successfully imported ${clients.length} clients!`, 'success');
                
            } catch (error) {
                alert('Error importing CSV: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
    
    importFromExcel() {
        this.showNotification('Excel import coming soon!', 'info');
    }

    // Export/Import functionality
    exportData() {
        if (typeof XLSX === 'undefined') {
            this.showNotification('Excel export library not loaded. Please refresh the page.', 'error');
            return;
        }

        const businessName = this.businessType === 'digitalFootprints' ? 'Digital Footprints Multimedia' : 'Film Fixer Consultation';
        
        const projectsData = this.projects.map(project => ({
            'Client Name': project.clientName || '',
            'Client Phone Number': project.clientPhone || '',
            'Project Name': project.projectName || '',
            'Project Date': this.formatDate(project.projectDate),
            'Location': project.location || '',
            'Project Type': this.getProjectTypeLabel(project.projectType),
            'Currency': project.currency || 'USD',
            'Total Price': project.totalPrice || 0,
            'Upfront Payment': project.upfrontPayment || 0,
            'Balance': project.balance || 0,
            'Transport': project.expenses?.transport?.amount || 0,
            'Transport Currency': project.expenses?.transport?.currency || project.currency || 'USD',
            'Food': project.expenses?.food?.amount || 0,
            'Food Currency': project.expenses?.food?.currency || project.currency || 'USD',
            'Accommodation': project.expenses?.accommodation?.amount || 0,
            'Accommodation Currency': project.expenses?.accommodation?.currency || project.currency || 'USD',
            'Airtime': project.expenses?.airtime?.amount || 0,
            'Airtime Currency': project.expenses?.airtime?.currency || project.currency || 'USD',
            'Internet Bundle': project.expenses?.internet?.amount || 0,
            'Internet Currency': project.expenses?.internet?.currency || project.currency || 'USD',
            'Stationary': project.expenses?.stationary?.amount || 0,
            'Stationary Currency': project.expenses?.stationary?.currency || project.currency || 'USD',
            'Total Expenses': project.totalExpenses || 0,
            'Status': this.getStatusBadge(project.balance).replace(/<[^>]*>/g, ''),
            'Project Details': project.projectDetails || '',
            'Created Date': new Date(project.createdAt).toLocaleDateString()
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(projectsData);
        
        ws['!cols'] = [
            { wch: 20 }, { wch: 18 }, { wch: 25 }, { wch: 12 }, { wch: 20 },
            { wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
            { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 12 },
            { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 15 },
            { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 10 }, { wch: 30 }, { wch: 12 }
        ];

        XLSX.utils.book_append_sheet(wb, ws, businessName);

        const fileName = `${businessName.toLowerCase().replace(/\s+/g, '-')}-projects-${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
        
        this.showNotification('Data exported to Excel successfully!', 'success');
    }

    promptImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.importData(file);
            }
        };
        input.click();
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.projects && Array.isArray(data.projects)) {
                    // Only import projects matching current business type
                    this.projects = data.projects.filter(p => p.businessType === this.businessType);
                    this.saveProjects();
                }
                
                this.updateDashboard();
                this.renderProjects();
                this.populateFilters();
                
                this.showNotification('Data imported successfully!', 'success');
            } catch (error) {
                this.showNotification('Error importing data. Please check file format.', 'error');
            }
        };
        reader.readAsText(file);
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Local Storage Methods
    saveProjects() {
        const key = this.businessType === 'digitalFootprints' ? 'digitalFootprintsProjects' : 'filmFixerProjects';
        localStorage.setItem(key, JSON.stringify(this.projects));
    }

    loadProjects() {
        const key = this.businessType === 'digitalFootprints' ? 'digitalFootprintsProjects' : 'filmFixerProjects';
        const saved = localStorage.getItem(key);
        this.projects = saved ? JSON.parse(saved) : [];
        return this.projects;
    }

    saveCurrency() {
        const key = this.businessType === 'digitalFootprints' ? 'digitalFootprintsCurrency' : 'filmFixerCurrency';
        localStorage.setItem(key, this.currentCurrency);
    }

    loadCurrency() {
        const key = this.businessType === 'digitalFootprints' ? 'digitalFootprintsCurrency' : 'filmFixerCurrency';
        const saved = localStorage.getItem(key);
        this.currentCurrency = saved || 'USD';
        
        // Update the currency selector
        const currencySelect = document.getElementById('currency');
        if (currencySelect) {
            currencySelect.value = this.currentCurrency;
        }
        
        // Update all expense currency selectors
        const expenseCurrencies = ['transportCurrency', 'foodCurrency', 'accommodationCurrency', 'airtimeCurrency', 'internetCurrency', 'stationaryCurrency'];
        expenseCurrencies.forEach(id => {
            const selector = document.getElementById(id);
            if (selector) {
                selector.value = this.currentCurrency;
            }
        });
        
        return this.currentCurrency;
    }
}

// Global variables
let digitalFootprintsManager;
let filmFixerManager;
let currentManager;
let currentBusiness = 'digitalFootprints';

// Switch between businesses
function switchBusiness(businessType) {
    currentBusiness = businessType;
    
    // Update card selection
    document.querySelectorAll('.business-card').forEach(card => {
        card.classList.remove('active');
    });
    
    if (businessType === 'digitalFootprints') {
        document.getElementById('digitalFootprintsCard').classList.add('active');
        currentManager = digitalFootprintsManager;
        
        // Update titles
        document.getElementById('formTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Add New Project - Digital Footprints Multimedia';
        document.getElementById('tableTitle').innerHTML = '<i class="fas fa-list"></i> Digital Footprints Projects';
    } else {
        document.getElementById('filmFixerCard').classList.add('active');
        currentManager = filmFixerManager;
        
        // Update titles
        document.getElementById('formTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Add New Project - Film Fixer Consultation';
        document.getElementById('tableTitle').innerHTML = '<i class="fas fa-list"></i> Film Fixer Projects';
    }
    
    // Update project types, currency, and refresh data
    currentManager.updateProjectTypes();
    currentManager.loadCurrency();
    currentManager.updateDashboard();
    currentManager.renderProjects();
    currentManager.populateFilters();
    currentManager.resetForm();
}

// Initialize the system
function initSystem() {
    try {
        digitalFootprintsManager = new ProjectManager('digitalFootprints');
        filmFixerManager = new ProjectManager('filmFixer');
        currentManager = digitalFootprintsManager;
        
        // Make managers globally accessible
        window.digitalFootprintsManager = digitalFootprintsManager;
        window.filmFixerManager = filmFixerManager;
        window.currentManager = currentManager;
        window.switchBusiness = switchBusiness;
        
        console.log('System initialized successfully');
    } catch (error) {
        console.error('Error initializing system:', error);
        // Show user-friendly error message
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: 'Montserrat', sans-serif;">
                <div style="text-align: center; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <h2 style="color: var(--orange-600); margin-bottom: 1rem;">⚠️ System Error</h2>
                    <p style="color: var(--grey-700); margin-bottom: 1rem;">Unable to initialize the project management system.</p>
                    <button onclick="location.reload()" style="background: var(--orange-500); color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                        Reload Page
                    </button>
                </div>
            </div>
        `;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSystem);
} else {
    initSystem();
}
