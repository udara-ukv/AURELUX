document.addEventListener('DOMContentLoaded', async () => {
    const ordersContainer = document.getElementById('ordersContainer');
    const ordersEmpty = document.getElementById('ordersEmpty');

    function renderOrderCard(order) {
        const createdAt = order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleString() : '—';
        const itemsHtml = (order.items || []).map(i => `<li>${i.name} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}</li>`).join('');
        return `
            <div class="order-card">
                <div class="order-header">
                    <strong>Order</strong> <span class="order-id">${order.id || ''}</span>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-meta">Placed: ${createdAt} • Total: $${(order.total || 0).toFixed(2)}</div>
                <ul class="order-items">${itemsHtml}</ul>
            </div>
        `;
    }

    // Wait for firebase to initialize
    const waitForFirebase = () => new Promise(resolve => {
        const check = () => {
            if (window.firebaseInitialized) return resolve();
            setTimeout(check, 200);
        };
        check();
    });

    await waitForFirebase();

    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (!user) {
        ordersEmpty.textContent = 'Please log in to view your orders.';
        return;
    }

    if (!window.db) {
        ordersEmpty.textContent = 'No database connection available.';
        return;
    }

    try {
        const snapshot = await window.db.collection('orders')
            .where('customerEmail', '==', user.email)
            .orderBy('createdAt', 'desc')
            .get();

        if (snapshot.empty) {
            ordersEmpty.textContent = 'You have no orders yet.';
            return;
        }

        ordersEmpty.style.display = 'none';
        ordersContainer.innerHTML = snapshot.docs.map(doc => {
            const data = doc.data();
            data.id = doc.id.substring(0,8);
            return renderOrderCard(data);
        }).join('');
    } catch (err) {
        console.error('Failed to load orders:', err);
        ordersEmpty.textContent = 'Failed to load orders. See console for details.';
    }
});
