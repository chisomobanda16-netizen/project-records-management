// Firebase Configuration for Project Records Management System
const firebaseConfig = {
    apiKey: "AIzaSyDemoKeyForTestingPurposesOnly",
    authDomain: "project-records-demo.firebaseapp.com",
    databaseURL: "https://project-records-demo-default-rtdb.firebaseio.com",
    projectId: "project-records-demo",
    storageBucket: "project-records-demo.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789012345678"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

console.log('✅ Firebase initialized');

// Database Manager Class
class DatabaseManager {
    constructor() {
        this.db = database;
        this.auth = auth;
        this.currentUser = null;
        this.init();
    }

    init() {
        // Listen for auth state changes
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.currentUser = user;
                console.log('✅ User authenticated:', user.email);
            } else {
                this.currentUser = null;
                console.log('🔒 User not authenticated');
            }
        });
    }

    // User Authentication
    async signIn(email, password) {
        try {
            const result = await this.auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: result.user };
        } catch (error) {
            console.error('❌ Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    async signUp(email, password, userData) {
        try {
            const result = await this.auth.createUserWithEmailAndPassword(email, password);
            
            // Save user data to database
            await this.saveUserData(result.user.uid, {
                email: email,
                username: userData.username,
                role: userData.role || 'user',
                createdAt: new Date().toISOString(),
                ...userData
            });
            
            return { success: true, user: result.user };
        } catch (error) {
            console.error('❌ Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            await this.auth.signOut();
            return { success: true };
        } catch (error) {
            console.error('❌ Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    // User Data Management
    async saveUserData(userId, userData) {
        try {
            await this.db.ref(`users/${userId}`).set(userData);
            return { success: true };
        } catch (error) {
            console.error('❌ Save user data error:', error);
            return { success: false, error: error.message };
        }
    }

    async getUserData(userId) {
        try {
            const snapshot = await this.db.ref(`users/${userId}`).once('value');
            return { success: true, data: snapshot.val() };
        } catch (error) {
            console.error('❌ Get user data error:', error);
            return { success: false, error: error.message };
        }
    }

    // Client Management
    async saveClient(clientData) {
        try {
            const clientId = clientData.id || this.db.ref('clients').push().key;
            const client = {
                id: clientId,
                ...clientData,
                createdAt: clientData.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: this.currentUser.uid
            };
            
            await this.db.ref(`clients/${clientId}`).set(client);
            return { success: true, clientId };
        } catch (error) {
            console.error('❌ Save client error:', error);
            return { success: false, error: error.message };
        }
    }

    async getClient(clientId) {
        try {
            const snapshot = await this.db.ref(`clients/${clientId}`).once('value');
            return { success: true, data: snapshot.val() };
        } catch (error) {
            console.error('❌ Get client error:', error);
            return { success: false, error: error.message };
        }
    }

    async getAllClients() {
        try {
            const snapshot = await this.db.ref('clients').orderByChild('createdBy').equalTo(this.currentUser.uid).once('value');
            const clients = [];
            snapshot.forEach((childSnapshot) => {
                clients.push(childSnapshot.val());
            });
            return { success: true, data: clients };
        } catch (error) {
            console.error('❌ Get all clients error:', error);
            return { success: false, error: error.message };
        }
    }

    async updateClient(clientId, updates) {
        try {
            await this.db.ref(`clients/${clientId}`).update({
                ...updates,
                updatedAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            console.error('❌ Update client error:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteClient(clientId) {
        try {
            await this.db.ref(`clients/${clientId}`).remove();
            return { success: true };
        } catch (error) {
            console.error('❌ Delete client error:', error);
            return { success: false, error: error.message };
        }
    }

    // Invoice Management
    async saveInvoice(invoiceData) {
        try {
            const invoiceId = invoiceData.id || this.db.ref('invoices').push().key;
            const invoice = {
                id: invoiceId,
                ...invoiceData,
                createdAt: invoiceData.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: this.currentUser.uid
            };
            
            await this.db.ref(`invoices/${invoiceId}`).set(invoice);
            return { success: true, invoiceId };
        } catch (error) {
            console.error('❌ Save invoice error:', error);
            return { success: false, error: error.message };
        }
    }

    async getInvoice(invoiceId) {
        try {
            const snapshot = await this.db.ref(`invoices/${invoiceId}`).once('value');
            return { success: true, data: snapshot.val() };
        } catch (error) {
            console.error('❌ Get invoice error:', error);
            return { success: false, error: error.message };
        }
    }

    async getAllInvoices() {
        try {
            const snapshot = await this.db.ref('invoices').orderByChild('createdBy').equalTo(this.currentUser.uid).once('value');
            const invoices = [];
            snapshot.forEach((childSnapshot) => {
                invoices.push(childSnapshot.val());
            });
            return { success: true, data: invoices };
        } catch (error) {
            console.error('❌ Get all invoices error:', error);
            return { success: false, error: error.message };
        }
    }

    async updateInvoice(invoiceId, updates) {
        try {
            await this.db.ref(`invoices/${invoiceId}`).update({
                ...updates,
                updatedAt: new Date().toISOString()
            });
            return { success: true };
        } catch (error) {
            console.error('❌ Update invoice error:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteInvoice(invoiceId) {
        try {
            await this.db.ref(`invoices/${invoiceId}`).remove();
            return { success: true };
        } catch (error) {
            console.error('❌ Delete invoice error:', error);
            return { success: false, error: error.message };
        }
    }

    // Real-time listeners
    onClientsChanged(callback) {
        const query = this.db.ref('clients').orderByChild('createdBy').equalTo(this.currentUser.uid);
        query.on('value', (snapshot) => {
            const clients = [];
            snapshot.forEach((childSnapshot) => {
                clients.push(childSnapshot.val());
            });
            callback(clients);
        });
    }

    onInvoicesChanged(callback) {
        const query = this.db.ref('invoices').orderByChild('createdBy').equalTo(this.currentUser.uid);
        query.on('value', (snapshot) => {
            const invoices = [];
            snapshot.forEach((childSnapshot) => {
                invoices.push(childSnapshot.val());
            });
            callback(invoices);
        });
    }

    // Search functionality
    async searchClients(searchTerm) {
        try {
            const snapshot = await this.db.ref('clients').orderByChild('createdBy').equalTo(this.currentUser.uid).once('value');
            const clients = [];
            snapshot.forEach((childSnapshot) => {
                const client = childSnapshot.val();
                const searchLower = searchTerm.toLowerCase();
                if (client.name?.toLowerCase().includes(searchLower) ||
                    client.email?.toLowerCase().includes(searchLower) ||
                    client.company?.toLowerCase().includes(searchLower)) {
                    clients.push(client);
                }
            });
            return { success: true, data: clients };
        } catch (error) {
            console.error('❌ Search clients error:', error);
            return { success: false, error: error.message };
        }
    }

    async searchInvoices(searchTerm) {
        try {
            const snapshot = await this.db.ref('invoices').orderByChild('createdBy').equalTo(this.currentUser.uid).once('value');
            const invoices = [];
            snapshot.forEach((childSnapshot) => {
                const invoice = childSnapshot.val();
                const searchLower = searchTerm.toLowerCase();
                if (invoice.clientName?.toLowerCase().includes(searchLower) ||
                    invoice.invoiceNumber?.toLowerCase().includes(searchLower) ||
                    invoice.status?.toLowerCase().includes(searchLower)) {
                    invoices.push(invoice);
                }
            });
            return { success: true, data: invoices };
        } catch (error) {
            console.error('❌ Search invoices error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Initialize database manager
window.databaseManager = new DatabaseManager();

console.log('✅ Database Manager loaded');
