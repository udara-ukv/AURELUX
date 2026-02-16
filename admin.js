// admin.js - Admin Dashboard Functionality

// Admin credentials (in production, use Firebase Admin SDK with roles)
const ADMIN_EMAIL = 'admin@aurelux.com';
const ADMIN_PASSWORD = 'admin123'; // Change this in production!

let isAdminLoggedIn = false;

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    setupEventListeners();
});

function checkAdminAuth() {
    const adminSession = sessionStorage.getItem('adminLoggedIn');
    if (adminSession === 'true') {
        showDashboard();
    }
}

function setupEventListeners() {
    const loginForm = document.getElementById('adminLoginForm');
    const logoutBtn = document.getElementById('adminLogoutBtn');
    const exportBtn = document.getElementById('exportDataBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleAdminLogout);
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', exportAllData);
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    // Simple auth check (in production, use Firebase custom claims or Admin SDK)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        isAdminLoggedIn = true;
        showDashboard();
    } else {
        alert('Invalid admin credentials');
    }
}

function handleAdminLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    isAdminLoggedIn = false;
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    
    // Load all dashboard data
    loadDashboardData();
}

async function loadDashboardData() {
    try {
        await Promise.all([
            loadOrders(),
            loadCustomers(),
            loadSubscribers(),
            loadProductStats()
        ]);
        calculateStats();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load Orders from Firestore
async function loadOrders() {
    if (!window.db) {
        displayNoOrdersMessage();
        return;
    }

    try {
        const ordersSnapshot = await window.db.collection('orders')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();

        if (ordersSnapshot.empty) {
            displayNoOrdersMessage();
            return;
        }

        const orders = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        renderOrdersTable(orders);
        return orders;
    } catch (error) {
        console.error('Error loading orders:', error);
        displayNoOrdersMessage();
        return [];
    }
}

function displayNoOrdersMessage() {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align: center; padding: 2rem; color: #999;">
                No orders yet. Orders will appear here after checkout.
            </td>
        </tr>
    `;
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('ordersTableBody');
    
    if (orders.length === 0) {
        displayNoOrdersMessage();
        return;
    }

    tbody.innerHTML = orders.map(order => {
        const date = order.createdAt?.toDate ? 
            order.createdAt.toDate().toLocaleDateString() : 
            new Date(order.createdAt).toLocaleDateString();
        
        const itemCount = order.items?.length || 0;
        const total = order.total || 0;

        return `
            <tr>
                <td>#${order.id.substring(0, 8)}</td>
                <td>${order.customerEmail || order.userEmail || 'Guest'}</td>
                <td>${itemCount} items</td>
                <td>$${total.toFixed(2)}</td>
                <td>${date}</td>
                <td><span class="status-badge status-completed">Completed</span></td>
            </tr>
        `;
    }).join('');
}

// Load Customers
async function loadCustomers() {
    if (!window.db) {
        document.getElementById('usersList').innerHTML = 
            '<p style="text-align: center; padding: 2rem; color: #999;">Firebase not connected</p>';
        return;
    }

    try {
        const usersSnapshot = await window.db.collection('users')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();

        if (usersSnapshot.empty) {
            document.getElementById('usersList').innerHTML = 
                '<p style="text-align: center; padding: 2rem; color: #999;">No registered users yet</p>';
            return [];
        }

        const users = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        renderUsersList(users);
        return users;
    } catch (error) {
        console.error('Error loading customers:', error);
        document.getElementById('usersList').innerHTML = 
            '<p style="text-align: center; padding: 2rem; color: #999;">Error loading customers</p>';
        return [];
    }
}

function renderUsersList(users) {
    const container = document.getElementById('usersList');
    
    container.innerHTML = users.map(user => {
        const date = user.createdAt?.toDate ? 
            user.createdAt.toDate().toLocaleDateString() : 
            'N/A';

        return `
            <div class="user-item">
                <div>
                    <strong>${user.fullName || user.email || 'Unknown'}</strong><br>
                    <small style="color: #999;">${user.email || ''}</small>
                </div>
                <div style="text-align: right;">
                    <small style="color: #999;">Joined: ${date}</small>
                </div>
            </div>
        `;
    }).join('');
}

// Load Newsletter Subscribers
async function loadSubscribers() {
    if (!window.db) return [];

    try {
        const subscribersSnapshot = await window.db.collection('newsletter').get();
        return subscribersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error loading subscribers:', error);
        return [];
    }
}

// Load Product Stats
async function loadProductStats() {
    if (!window.db) {
        document.getElementById('productStats').innerHTML = 
            '<p style="text-align: center; padding: 2rem; color: #999;">Firebase not connected</p>';
        return;
    }

    try {
        const productsSnapshot = await window.db.collection('products').get();
        
        if (productsSnapshot.empty) {
            document.getElementById('productStats').innerHTML = 
                '<p style="text-align: center; padding: 2rem; color: #999;">No products in database</p>';
            return;
        }

        const products = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        renderProductStats(products);
    } catch (error) {
        console.error('Error loading product stats:', error);
        document.getElementById('productStats').innerHTML = 
            '<p style="text-align: center; padding: 2rem; color: #999;">Error loading products</p>';
    }
}

function renderProductStats(products) {
    const container = document.getElementById('productStats');
    
    // Calculate stats
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const avgPrice = products.reduce((sum, p) => sum + (p.price || 0), 0) / totalProducts;
    const categories = [...new Set(products.map(p => p.category))];

    container.innerHTML = `
        <div class="product-stat-item">
            <h4>Total Products</h4>
            <div class="value">${totalProducts}</div>
        </div>
        <div class="product-stat-item">
            <h4>Total Stock</h4>
            <div class="value">${totalStock}</div>
        </div>
        <div class="product-stat-item">
            <h4>Average Price</h4>
            <div class="value">$${avgPrice.toFixed(2)}</div>
        </div>
        <div class="product-stat-item">
            <h4>Categories</h4>
            <div class="value">${categories.length}</div>
        </div>
    `;
}

// Calculate Dashboard Statistics
async function calculateStats() {
    try {
        // Get all data
        const ordersSnapshot = window.db ? await window.db.collection('orders').get() : null;
        const usersSnapshot = window.db ? await window.db.collection('users').get() : null;
        const subscribersSnapshot = window.db ? await window.db.collection('newsletter').get() : null;

        // Calculate totals
        let totalRevenue = 0;
        let totalOrders = 0;

        if (ordersSnapshot && !ordersSnapshot.empty) {
            ordersSnapshot.forEach(doc => {
                const order = doc.data();
                totalRevenue += order.total || 0;
                totalOrders++;
            });
        }

        const totalCustomers = usersSnapshot ? usersSnapshot.size : 0;
        const totalSubscribers = subscribersSnapshot ? subscribersSnapshot.size : 0;

        // Update UI
        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalCustomers').textContent = totalCustomers;
        document.getElementById('totalSubscribers').textContent = totalSubscribers;

        // Calculate month changes (simplified - you can enhance this)
        document.getElementById('ordersChange').textContent = totalOrders;
        document.getElementById('customersChange').textContent = totalCustomers;
        document.getElementById('subscribersChange').textContent = totalSubscribers;

    } catch (error) {
        console.error('Error calculating stats:', error);
    }
}

// Export Data to CSV
async function exportAllData() {
    try {
        if (!window.db) {
            alert('Firebase not connected');
            return;
        }

        // Get all orders
        const ordersSnapshot = await window.db.collection('orders').get();
        const orders = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        if (orders.length === 0) {
            alert('No orders to export');
            return;
        }

        // Create CSV
        let csv = 'Order ID,Customer Email,Items Count,Total,Date\n';
        
        orders.forEach(order => {
            const date = order.createdAt?.toDate ? 
                order.createdAt.toDate().toLocaleDateString() : 
                new Date(order.createdAt).toLocaleDateString();
            
            csv += `${order.id},${order.customerEmail || order.userEmail || 'Guest'},${order.items?.length || 0},${order.total || 0},${date}\n`;
        });

        // Download CSV
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aurelux-orders-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        alert('Data exported successfully!');
    } catch (error) {
        console.error('Error exporting data:', error);
        alert('Error exporting data: ' + error.message);
    }
}
