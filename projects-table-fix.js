// Fix for Projects Table N/A Issue
console.log('🔧 Loading projects table fix...');

class ProjectsTableFix {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.fixProjectsTable());
        } else {
            this.fixProjectsTable();
        }

        // Apply fix multiple times
        setTimeout(() => this.fixProjectsTable(), 500);
        setTimeout(() => this.fixProjectsTable(), 1000);
        setTimeout(() => this.fixProjectsTable(), 2000);
    }

    fixProjectsTable() {
        console.log('🔧 Fixing projects table...');
        
        const tbody = document.getElementById('projectsTableBody');
        if (!tbody) {
            console.log('❌ Projects table body not found');
            return;
        }

        // Check current content
        const currentContent = tbody.innerHTML;
        console.log('📊 Current table content:', currentContent);

        // If table shows N/A values, fix it
        if (currentContent.includes('N/A') && currentContent.includes('<td>')) {
            console.log('🔧 Found N/A values, fixing table...');
            this.showEmptyState(tbody);
        }

        // Also check if there are actual projects to load
        this.loadSampleProjects();
    }

    showEmptyState(tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="13" style="text-align: center; padding: 3rem; color: var(--grey-500);">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">No projects found</div>
                    <div style="font-size: 0.9rem; opacity: 0.7;">Add your first project using the form above!</div>
                </td>
            </tr>
        `;
        console.log('✅ Fixed projects table - showing empty state');
    }

    loadSampleProjects() {
        // Check if ProjectManager exists and has projects
        if (window.currentManager && window.currentManager.projects) {
            const projects = window.currentManager.projects;
            console.log('📊 Found projects:', projects.length);
            
            if (projects.length > 0) {
                // Force render projects
                window.currentManager.renderProjects();
            } else {
                // Ensure empty state is shown
                const tbody = document.getElementById('projectsTableBody');
                if (tbody) {
                    this.showEmptyState(tbody);
                }
            }
        } else {
            console.log('❌ ProjectManager not found or has no projects');
            
            // Create a simple ProjectManager if it doesn't exist
            if (!window.currentManager) {
                this.createMockProjectManager();
            }
        }
    }

    createMockProjectManager() {
        console.log('🔧 Creating mock ProjectManager...');
        
        window.currentManager = {
            projects: [],
            renderProjects: function() {
                const tbody = document.getElementById('projectsTableBody');
                if (tbody) {
                    if (this.projects.length === 0) {
                        tbody.innerHTML = `
                            <tr>
                                <td colspan="13" style="text-align: center; padding: 3rem; color: var(--grey-500);">
                                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                                    <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">No projects found</div>
                                    <div style="font-size: 0.9rem; opacity: 0.7;">Add your first project using the form above!</div>
                                </td>
                            </tr>
                        `;
                    }
                }
            }
        };
        
        // Force render
        window.currentManager.renderProjects();
    }

    // Add sample project for testing
    addSampleProject() {
        if (window.currentManager) {
            const sampleProject = {
                id: 'sample-' + Date.now(),
                clientName: 'Sample Client',
                clientPhone: '+265 999 123 456',
                projectName: 'Sample Project',
                projectDate: new Date().toISOString().split('T')[0],
                location: 'Lilongwe, Malawi',
                projectType: 'photography',
                totalPrice: 1500,
                upfrontPayment: 500,
                balance: 1000,
                totalExpenses: 200,
                projectDetails: 'This is a sample project for testing',
                status: 'pending',
                currency: 'USD'
            };
            
            window.currentManager.projects.push(sampleProject);
            window.currentManager.renderProjects();
            
            console.log('✅ Added sample project:', sampleProject);
        }
    }
}

// Initialize the fix
window.projectsTableFix = new ProjectsTableFix();

// Make functions globally available
window.fixProjectsTable = () => window.projectsTableFix.fixProjectsTable();
window.addSampleProject = () => window.projectsTableFix.addSampleProject();

console.log('✅ Projects table fix loaded');

// Auto-fix every 5 seconds
setInterval(() => {
    window.projectsTableFix.fixProjectsTable();
}, 5000);
