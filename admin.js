// admin.js - Admin Dashboard Functionality

// Admin credentials (in production, use Firebase Admin SDK with roles)
const ADMIN_EMAIL = 'admin@aurelux.com';
const ADMIN_PASSWORD = 'admin123'; // Change this in production!

let isAdminLoggedIn = false;
let analyticsOrdersCache = [];
let analyticsRange = { start: null, end: null };
let forceDemoMode = localStorage.getItem('adminForceDemoMode') === 'true';

const DEMO_ORDERS = [
    {
        id: 'demo-order-1',
        customerEmail: 'samantha@example.com',
        customerName: 'Samantha Jay',
        total: 128.5,
        status: 'completed',
        paymentProvider: 'Stripe Test Mode',
        paymentStatus: 'paid',
        paymentLast4: '4242',
        createdAt: new Date('2026-09-28T10:15:00')
    },
    {
        id: 'demo-order-2',
        customerEmail: 'nimal@example.com',
        customerName: 'Nimal Perera',
        total: 86.0,
        status: 'processing',
        paymentProvider: 'PayPal Sandbox',
        paymentStatus: 'captured',
        paymentReference: 'PAYPAL-DEMO-2',
        createdAt: new Date('2026-10-01T14:40:00')
    },
    {
        id: 'demo-order-3',
        customerEmail: 'amalie@example.com',
        customerName: 'Amalie Silva',
        total: 54.0,
        status: 'shipped',
        paymentProvider: 'Stripe Test Mode',
        paymentStatus: 'paid',
        paymentLast4: '4242',
        createdAt: new Date('2026-10-03T09:05:00')
    }
];

const DEMO_USERS = [
    { id: 'demo-user-1', fullName: 'Samantha Jay', email: 'samantha@example.com', createdAt: new Date('2026-09-20T08:00:00') },
    { id: 'demo-user-2', fullName: 'Nimal Perera', email: 'nimal@example.com', createdAt: new Date('2026-09-29T11:20:00') },
    { id: 'demo-user-3', fullName: 'Amalie Silva', email: 'amalie@example.com', createdAt: new Date('2026-10-02T16:45:00') }
];

const DEMO_PRODUCTS = [
    { id: 'demo-product-1', name: 'Gold Bracelet', category: 'jewelry', price: 120, stock: 8 },
    { id: 'demo-product-2', name: 'Luxury Handbag', category: 'bags', price: 180, stock: 5 },
    { id: 'demo-product-3', name: 'Elegant Watch', category: 'accessories', price: 95, stock: 12 },
    { id: 'demo-product-4', name: 'Pearl Earrings', category: 'jewelry', price: 64, stock: 10 }
];

const DEMO_SUBSCRIBERS = [
    { id: 'demo-sub-1', email: 'samantha@example.com' },
    { id: 'demo-sub-2', email: 'nimal@example.com' },
    { id: 'demo-sub-3', email: 'amalie@example.com' }
];

function cloneDemoOrders() {
    return DEMO_ORDERS.map(order => ({
        ...order,
        createdAt: new Date(order.createdAt),
        items: [
            { id: 'demo-item-1', name: 'Gold Bracelet', quantity: 1, price: 64.5 },
            { id: 'demo-item-2', name: 'Elegant Watch', quantity: 1, price: 64 }
        ]
    }));
}

function cloneDemoUsers() {
    return DEMO_USERS.map(user => ({ ...user, createdAt: new Date(user.createdAt) }));
}

function cloneDemoProducts() {
    return DEMO_PRODUCTS.map(product => ({ ...product }));
}

function cloneDemoSubscribers() {
    return DEMO_SUBSCRIBERS.map(subscriber => ({ ...subscriber }));
}

function useDemoDataNotice(sectionId, message) {
    const container = document.getElementById(sectionId);
    if (container) {
        container.innerHTML = `<p style="text-align: center; padding: 2rem; color: #999;">${message}</p>`;
    }
}

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
    const applyAnalyticsFilterBtn = document.getElementById('applyAnalyticsFilter');
    const resetAnalyticsFilterBtn = document.getElementById('resetAnalyticsFilter');
    const exportAnalyticsBtn = document.getElementById('exportAnalyticsBtn');
    const loadDemoDataBtn = document.getElementById('loadDemoDataBtn');
    const showLiveDataBtn = document.getElementById('showLiveDataBtn');
    const hideDemoBannerBtn = document.getElementById('hideDemoBannerBtn');
    const showDemoBannerBtn = document.getElementById('showDemoBannerBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleAdminLogout);
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', exportAllData);
    }

    if (applyAnalyticsFilterBtn) {
        applyAnalyticsFilterBtn.addEventListener('click', applyAnalyticsFilter);
    }

    if (resetAnalyticsFilterBtn) {
        resetAnalyticsFilterBtn.addEventListener('click', resetAnalyticsFilter);
    }

    if (exportAnalyticsBtn) {
        exportAnalyticsBtn.addEventListener('click', exportAnalyticsSummary);
    }

    if (loadDemoDataBtn) {
        loadDemoDataBtn.addEventListener('click', enableDemoMode);
    }

    if (showLiveDataBtn) {
        showLiveDataBtn.addEventListener('click', disableDemoMode);
    }

    if (hideDemoBannerBtn) {
        hideDemoBannerBtn.addEventListener('click', hideDemoBanner);
    }

    if (showDemoBannerBtn) {
        showDemoBannerBtn.addEventListener('click', showDemoBanner);
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
    updateDemoBannerState();
    
    // Load all dashboard data
    loadDashboardData();
}

function updateDemoBannerState() {
    const banner = document.getElementById('demoBanner');
    const badge = document.getElementById('demoModeBadge');
    const text = document.getElementById('demoBannerText');
    const showBtn = document.getElementById('showDemoBannerBtn');

    if (!banner || !badge || !text) return;

    banner.style.display = 'flex';
    if (showBtn) {
        showBtn.style.display = 'none';
    }

    if (forceDemoMode) {
        badge.textContent = 'DEMO DATA ON';
        badge.classList.remove('live');
        text.textContent = 'Demo Data Mode is enabled manually. Dashboard is showing sample values.';
    } else {
        badge.textContent = 'LIVE DATA MODE';
        badge.classList.add('live');
        text.textContent = 'Live Data Mode is enabled. Demo values appear only when live data is unavailable.';
    }
}

function enableDemoMode() {
    forceDemoMode = true;
    localStorage.setItem('adminForceDemoMode', 'true');
    updateDemoBannerState();
    loadDashboardData();
}

function disableDemoMode() {
    forceDemoMode = false;
    localStorage.setItem('adminForceDemoMode', 'false');
    updateDemoBannerState();
    loadDashboardData();
}

function hideDemoBanner() {
    const banner = document.getElementById('demoBanner');
    const showBtn = document.getElementById('showDemoBannerBtn');
    if (banner) {
        banner.style.display = 'none';
    }
    if (showBtn) {
        showBtn.style.display = 'inline-flex';
    }
}

function showDemoBanner() {
    const banner = document.getElementById('demoBanner');
    const showBtn = document.getElementById('showDemoBannerBtn');
    if (banner) {
        banner.style.display = 'flex';
    }
    if (showBtn) {
        showBtn.style.display = 'none';
    }
}

async function loadDashboardData() {
    try {
        await Promise.all([
            loadOrders(),
            loadCustomers(),
            loadSubscribers(),
            loadProductStats(),
            loadPageSettings(),
            loadSimpleAnalytics()
        ]);
        calculateStats();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load Orders from Firestore
async function loadOrders() {
    if (forceDemoMode) {
        const demoOrders = cloneDemoOrders();
        renderOrdersTable(demoOrders);
        return demoOrders;
    }

    if (!window.db) {
        const demoOrders = cloneDemoOrders();
        renderOrdersTable(demoOrders);
        return demoOrders;
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

        if (!orders.length) {
            const demoOrders = cloneDemoOrders();
            renderOrdersTable(demoOrders);
            return demoOrders;
        }

        renderOrdersTable(orders);
        return orders;
    } catch (error) {
        console.error('Error loading orders:', error);
        const demoOrders = cloneDemoOrders();
        renderOrdersTable(demoOrders);
        return demoOrders;
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
        const paymentLabel = order.paymentProvider ? `${order.paymentProvider} / ${order.paymentStatus || 'paid'}` : '—';

        const currentStatus = order.status || 'pending';
        const statusOptions = ['pending','processing','shipped','completed','cancelled'];

        return `
            <tr>
                <td>#${order.id.substring(0, 8)}</td>
                <td>${order.customerEmail || order.userEmail || 'Guest'}</td>
                <td>${itemCount} items</td>
                <td>$${total.toFixed(2)}</td>
                <td>${paymentLabel}</td>
                <td>${date}</td>
                <td>
                    <select class="order-status-select" onchange="updateOrderStatus('${order.id}', this.value)">
                        ${statusOptions.map(s => `<option value="${s}" ${s===currentStatus? 'selected':''}>${s}</option>`).join('')}
                    </select>
                </td>
            </tr>
        `;
    }).join('');
}

// Update order status in Firestore and notify customer
async function updateOrderStatus(orderId, newStatus) {
    if (!window.db) {
        alert('Firebase not connected');
        return;
    }

    try {
        await window.db.collection('orders').doc(orderId).update({ status: newStatus });

        // Reload orders table
        await loadOrders();

        // Optionally send email notification to customer (if sendEmailAsync available)
        try {
            const orderDoc = await window.db.collection('orders').doc(orderId).get();
            if (orderDoc.exists) {
                const order = orderDoc.data();
                const toEmail = order.customerEmail || order.userEmail;
                if (toEmail && typeof sendEmailAsync !== 'undefined') {
                    sendEmailAsync('service_9b6hlzf', 'template_order_status', {
                        customer_email: toEmail,
                        customer_name: order.customerName || '',
                        order_id: orderId.substring(0,8),
                        new_status: newStatus
                    });
                }
            }
        } catch (emailErr) {
            console.warn('Order updated but notification failed:', emailErr);
        }

        alert('Order status updated to ' + newStatus);
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
    }
}

// Load Customers
async function loadCustomers() {
    if (forceDemoMode) {
        const demoUsers = cloneDemoUsers();
        renderUsersList(demoUsers);
        return demoUsers;
    }

    if (!window.db) {
        renderUsersList(cloneDemoUsers());
        return cloneDemoUsers();
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

        if (!users.length) {
            const demoUsers = cloneDemoUsers();
            renderUsersList(demoUsers);
            return demoUsers;
        }

        renderUsersList(users);
        return users;
    } catch (error) {
        console.error('Error loading customers:', error);
        const demoUsers = cloneDemoUsers();
        renderUsersList(demoUsers);
        return demoUsers;
    }
}

function renderUsersList(users) {
    const container = document.getElementById('usersList');
    
    container.innerHTML = users.map(user => {
        const createdAt = user.createdAt?.toDate ? user.createdAt.toDate() : (user.createdAt ? new Date(user.createdAt) : null);
        const date = createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt.toLocaleDateString() : 'N/A';

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
    if (forceDemoMode) return cloneDemoSubscribers();
    if (!window.db) return cloneDemoSubscribers();

    try {
        const subscribersSnapshot = await window.db.collection('newsletter').get();
        const subscribers = subscribersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return subscribers.length ? subscribers : cloneDemoSubscribers();
    } catch (error) {
        console.error('Error loading subscribers:', error);
        return cloneDemoSubscribers();
    }
}

// Load Product Stats
async function loadProductStats() {
    if (forceDemoMode) {
        const demoProducts = cloneDemoProducts();
        renderProductStats(demoProducts);
        return demoProducts;
    }

    if (!window.db) {
        renderProductStats(cloneDemoProducts());
        return cloneDemoProducts();
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

        if (!products.length) {
            const demoProducts = cloneDemoProducts();
            renderProductStats(demoProducts);
            return demoProducts;
        }

        renderProductStats(products);
    } catch (error) {
        console.error('Error loading product stats:', error);
        renderProductStats(cloneDemoProducts());
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
        if (forceDemoMode) {
            const demoOrders = cloneDemoOrders();
            const totalRevenue = demoOrders.reduce((sum, order) => sum + (order.total || 0), 0);
            const totalOrders = demoOrders.length;
            const totalCustomers = cloneDemoUsers().length;
            const totalSubscribers = cloneDemoSubscribers().length;

            document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
            document.getElementById('totalOrders').textContent = totalOrders;
            document.getElementById('totalCustomers').textContent = totalCustomers;
            document.getElementById('totalSubscribers').textContent = totalSubscribers;
            document.getElementById('ordersChange').textContent = totalOrders;
            document.getElementById('customersChange').textContent = totalCustomers;
            document.getElementById('subscribersChange').textContent = totalSubscribers;
            return;
        }

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
        } else {
            const demoOrders = cloneDemoOrders();
            totalRevenue = demoOrders.reduce((sum, order) => sum + (order.total || 0), 0);
            totalOrders = demoOrders.length;
        }

        const totalCustomers = usersSnapshot && usersSnapshot.size ? usersSnapshot.size : cloneDemoUsers().length;
        const totalSubscribers = subscribersSnapshot && subscribersSnapshot.size ? subscribersSnapshot.size : cloneDemoSubscribers().length;

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

async function loadSimpleAnalytics() {
    if (forceDemoMode) {
        analyticsOrdersCache = cloneDemoOrders();
        renderAnalyticsViews();
        return;
    }

    if (!window.db) {
        analyticsOrdersCache = cloneDemoOrders();
        renderAnalyticsViews();
        return;
    }

    try {
        const ordersSnapshot = await window.db.collection('orders').orderBy('createdAt', 'asc').get();
        analyticsOrdersCache = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (!analyticsOrdersCache.length) {
            analyticsOrdersCache = cloneDemoOrders();
        }

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        analyticsRange = { start: startDate, end: endDate };

        const startInput = document.getElementById('analyticsStartDate');
        const endInput = document.getElementById('analyticsEndDate');
        if (startInput) startInput.value = toDateInputValue(startDate);
        if (endInput) endInput.value = toDateInputValue(endDate);

        renderAnalyticsViews();
    } catch (error) {
        console.error('Error loading simple analytics:', error);
        analyticsOrdersCache = cloneDemoOrders();
        renderAnalyticsViews();
    }
}

function renderStatusBreakdown(orders) {
    const container = document.getElementById('statusBreakdown');
    const statusCounts = orders.reduce((acc, order) => {
        const status = order.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const totalOrders = orders.length || 1;
    const orderStatuses = Object.entries(statusCounts).sort((a, b) => b[1] - a[1]);

    container.innerHTML = orderStatuses.length ? orderStatuses.map(([status, count]) => {
        const percent = Math.round((count / totalOrders) * 100);
        return `
            <div class="analytics-row">
                <div class="analytics-row-header">
                    <strong>${status}</strong>
                    <span>${count} orders (${percent}%)</span>
                </div>
                <div class="analytics-progress"><span style="width:${percent}%"></span></div>
            </div>
        `;
    }).join('') : '<p style="color:#999;">No orders yet</p>';
}

function renderMonthlyRevenue(orders) {
    const container = document.getElementById('monthlyRevenueChart');
    const monthlyTotals = orders.reduce((acc, order) => {
        const dateValue = order.createdAt?.toDate ? order.createdAt.toDate() : (order.createdAt ? new Date(order.createdAt) : new Date());
        const monthKey = dateValue.toLocaleString('default', { month: 'short', year: '2-digit' });
        acc[monthKey] = (acc[monthKey] || 0) + (order.total || 0);
        return acc;
    }, {});

    const sortedMonths = Object.entries(monthlyTotals).slice(-6);
    const maxRevenue = Math.max(...sortedMonths.map(([, total]) => total), 1);

    container.innerHTML = sortedMonths.length ? sortedMonths.map(([month, total]) => {
        const height = Math.max((total / maxRevenue) * 100, 8);
        return `
            <div class="analytics-bar-item">
                <div class="analytics-bar-label">${month}</div>
                <div class="analytics-bar-track"><span style="height:${height}%"></span></div>
                <div class="analytics-bar-value">$${total.toFixed(0)}</div>
            </div>
        `;
    }).join('') : '<p style="color:#999;">No revenue data yet</p>';
}

function renderTopProducts(orders) {
    const container = document.getElementById('topProductsList');
    const productCounts = {};

    orders.forEach(order => {
        (order.items || []).forEach(item => {
            const key = item.name || item.id || 'Unknown';
            productCounts[key] = (productCounts[key] || 0) + (item.quantity || 1);
        });
    });

    const topProducts = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    container.innerHTML = topProducts.length ? topProducts.map(([name, quantity], index) => `
        <div class="analytics-list-item">
            <span class="analytics-rank">#${index + 1}</span>
            <div>
                <strong>${name}</strong>
                <div style="color:#777; font-size:0.85rem;">${quantity} units sold</div>
            </div>
        </div>
    `).join('') : '<p style="color:#999;">No product sales data yet</p>';
}

function toDateInputValue(date) {
    return date.toISOString().split('T')[0];
}

function getOrderDate(order) {
    if (!order.createdAt) return null;
    if (order.createdAt.toDate) return order.createdAt.toDate();
    return new Date(order.createdAt);
}

function filterOrdersByRange(orders, startDate, endDate) {
    const startTime = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const endTime = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    return orders.filter(order => {
        const date = getOrderDate(order);
        if (!date || Number.isNaN(date.getTime())) return false;
        const time = date.getTime();
        if (startTime !== null && time < startTime) return false;
        if (endTime !== null && time > endTime) return false;
        return true;
    });
}

function getPreviousPeriod(startDate, endDate) {
    if (!startDate || !endDate) return { start: null, end: null };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.max(Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1, 1);
    const previousEnd = new Date(start);
    previousEnd.setDate(previousEnd.getDate() - 1);
    const previousStart = new Date(previousEnd);
    previousStart.setDate(previousStart.getDate() - diffDays + 1);
    return { start: previousStart, end: previousEnd };
}

function renderAnalyticsViews() {
    const filteredOrders = filterOrdersByRange(analyticsOrdersCache, analyticsRange.start, analyticsRange.end);
    const previousRange = getPreviousPeriod(analyticsRange.start, analyticsRange.end);
    const previousOrders = filterOrdersByRange(analyticsOrdersCache, previousRange.start, previousRange.end);

    renderStatusBreakdown(filteredOrders);
    renderMonthlyRevenue(filteredOrders);
    renderTopProducts(filteredOrders);
    renderAnalyticsSummary(filteredOrders, previousOrders);
}

function renderAnalyticsSummary(currentOrders, previousOrders) {
    const currentRevenue = currentOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const previousRevenue = previousOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const currentCount = currentOrders.length;
    const previousCount = previousOrders.length;
    const currentAov = currentCount ? currentRevenue / currentCount : 0;
    const previousAov = previousCount ? previousRevenue / previousCount : 0;

    document.getElementById('analyticsRevenueRange').textContent = `$${currentRevenue.toFixed(2)}`;
    document.getElementById('analyticsOrdersRange').textContent = currentCount;
    document.getElementById('analyticsAovRange').textContent = `$${currentAov.toFixed(2)}`;
    document.getElementById('analyticsTopProduct').textContent = getTopProductName(currentOrders);

    document.getElementById('analyticsRevenueCompare').textContent = buildCompareText(currentRevenue, previousRevenue);
    document.getElementById('analyticsOrdersCompare').textContent = buildCompareText(currentCount, previousCount);
    document.getElementById('analyticsAovCompare').textContent = buildCompareText(currentAov, previousAov);
    document.getElementById('analyticsTopProductNote').textContent = currentOrders.length ? 'Most sold item in selected range' : 'No orders in selected range';
}

function getTopProductName(orders) {
    const productCounts = {};
    orders.forEach(order => {
        (order.items || []).forEach(item => {
            const key = item.name || item.id || 'Unknown';
            productCounts[key] = (productCounts[key] || 0) + (item.quantity || 1);
        });
    });

    const topEntry = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];
    return topEntry ? `${topEntry[0]} (${topEntry[1]})` : '-';
}

function buildCompareText(current, previous) {
    if (previous === 0 && current === 0) return 'No change from previous period';
    if (previous === 0) return 'No previous data to compare';
    const diff = current - previous;
    const percent = ((diff / previous) * 100).toFixed(1);
    const direction = diff >= 0 ? 'up' : 'down';
    return `${direction} ${Math.abs(percent)}% from previous period`;
}

function applyAnalyticsFilter() {
    analyticsRange = {
        start: document.getElementById('analyticsStartDate').value || null,
        end: document.getElementById('analyticsEndDate').value || null
    };
    renderAnalyticsViews();
}

function resetAnalyticsFilter() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    document.getElementById('analyticsStartDate').value = toDateInputValue(startDate);
    document.getElementById('analyticsEndDate').value = toDateInputValue(endDate);

    analyticsRange = { start: startDate, end: endDate };
    renderAnalyticsViews();
}

function exportAnalyticsSummary() {
    const filteredOrders = filterOrdersByRange(analyticsOrdersCache, analyticsRange.start, analyticsRange.end);

    if (!filteredOrders.length) {
        alert('No analytics data to export');
        return;
    }

    const revenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const statusCounts = filteredOrders.reduce((acc, order) => {
        const status = order.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const csvLines = [
        'Metric,Value',
        `Selected Period Revenue,$${revenue.toFixed(2)}`,
        `Selected Period Orders,${filteredOrders.length}`,
        `Average Order Value,$${(revenue / filteredOrders.length).toFixed(2)}`,
        `Top Product,${getTopProductName(filteredOrders)}`,
        '',
        'Order Status,Count',
        ...Object.entries(statusCounts).map(([status, count]) => `${status},${count}`)
    ];

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aurelux-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

// Page Visibility Management
const PAGES = [
    { id: 'products', name: 'Shop', url: 'products.html', default: true },
    { id: 'product-detail', name: 'Product Details', url: 'product-detail.html', default: true },
    { id: 'cart', name: 'Shopping Cart', url: 'cart.html', default: true }
];

async function loadPageSettings() {
    if (!window.db) {
        renderPageControls([]);
        return;
    }

    try {
        const settingsSnapshot = await window.db.collection('settings').doc('pages').get();
        let pageSettings = settingsSnapshot.exists ? settingsSnapshot.data() : {};

        // Initialize missing pages with defaults
        let needsUpdate = false;
        for (const page of PAGES) {
            if (!(page.id in pageSettings)) {
                pageSettings[page.id] = page.default;
                needsUpdate = true;
            }
        }

        // Save defaults if needed
        if (needsUpdate) {
            await window.db.collection('settings').doc('pages').set(pageSettings);
        }

        renderPageControls(pageSettings);
    } catch (error) {
        console.error('Error loading page settings:', error);
        renderPageControls({});
    }
}

function renderPageControls(pageSettings) {
    const container = document.getElementById('pageVisibilityControls');
    
    container.innerHTML = PAGES.map(page => {
        const isEnabled = pageSettings[page.id] !== false;
        
        return `
            <div class="page-toggle">
                <div>
                    <h4>${page.name}</h4>
                    <div class="page-status ${isEnabled ? 'enabled' : 'disabled'}">
                        ${isEnabled ? '✓ Visible to customers' : '⏳ Coming Soon'}
                    </div>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" ${isEnabled ? 'checked' : ''} onchange="togglePageVisibility('${page.id}', this.checked)">
                    <span class="toggle-slider"></span>
                </label>
            </div>
        `;
    }).join('');
}

async function togglePageVisibility(pageId, isEnabled) {
    if (!window.db) {
        alert('Firebase not connected');
        return;
    }

    try {
        await window.db.collection('settings').doc('pages').set({
            [pageId]: isEnabled
        }, { merge: true });

        // Reload page settings to update UI
        await loadPageSettings();
        alert(`Page ${isEnabled ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
        console.error('Error updating page visibility:', error);
        alert('Error updating page visibility');
    }
}
