// cart.js - Shopping Cart Functionality

document.addEventListener('DOMContentLoaded', function() {
    renderCart();
    setupEventListeners();
});

function renderCart() {
    const cartContainer = document.getElementById('cartItemsContainer');
    const emptyMessage = document.getElementById('emptyCartMessage');

    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        emptyMessage.style.display = 'block';
        updateOrderSummary();
        return;
    }

    cartContainer.style.display = 'flex';
    emptyMessage.style.display = 'none';

    cartContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                ${item.color ? `<p><strong>Color:</strong> ${item.color}</p>` : ''}
                ${item.size ? `<p><strong>Size:</strong> ${item.size}</p>` : ''}
                <p class="cart-item-price">$${item.price}</p>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                    <button class="qty-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <div class="cart-item-remove">
                <button onclick="removeItem(${index})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `).join('');

    updateOrderSummary();
    loadSuggestedProducts();
}

function updateQuantity(index, newQuantity) {
    newQuantity = parseInt(newQuantity);
    if (newQuantity < 1) {
        removeItem(index);
    } else {
        updateCartQuantity(index, newQuantity);
        renderCart();
    }
}

function removeItem(index) {
    removeFromCart(index);
    renderCart();
    showNotification('Item removed from cart');
}

function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    let discount = 0;
    const promoCode = document.getElementById('promoCode');

    // Check for applied promo code
    if (promoCode && promoCode.value) {
        const appliedCode = localStorage.getItem('appliedPromoCode');
        if (appliedCode) {
            discount = appliedCode === 'LUXURY20' ? subtotal * 0.2 : 
                      appliedCode === 'SAVE10' ? subtotal * 0.1 : 0;
        }
    }

    const total = subtotal + shipping - discount;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;

    if (discount > 0) {
        document.getElementById('discountDisplay').style.display = 'flex';
        document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
    }
}

function setupEventListeners() {
    // Promo code
    const promoCodeCheck = document.getElementById('promoCodeCheck');
    const promoInput = document.getElementById('promoCodeInput');
    const applyPromo = document.getElementById('applyPromo');
    const promoCode = document.getElementById('promoCode');

    if (promoCodeCheck) {
        promoCodeCheck.addEventListener('change', function(e) {
            promoInput.style.display = e.target.checked ? 'flex' : 'none';
        });
    }

    if (applyPromo) {
        applyPromo.addEventListener('click', () => {
            const code = promoCode.value.toUpperCase();
            const validCodes = ['LUXURY20', 'SAVE10', 'WELCOME5'];

            if (validCodes.includes(code)) {
                localStorage.setItem('appliedPromoCode', code);
                const discount = code === 'LUXURY20' ? '20%' : 
                               code === 'SAVE10' ? '10%' : '5%';
                showNotification(`Promo code applied! ${discount} off`);
                updateOrderSummary();
            } else {
                showNotification('Invalid promo code', 'error');
            }
        });
    }

    // Checkout
    const checkoutBtn = document.getElementById('proceedCheckout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }

            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                showNotification('Please login to checkout', 'error');
                setTimeout(() => {
                    openModal('userModal');
                }, 500);
                return;
            }

            // Simulate checkout
            showNotification('Order placed successfully! Thank you for your purchase.');
            setTimeout(() => {
                cart.length = 0;
                saveCart();
                localStorage.removeItem('appliedPromoCode');
                window.location.href = 'index.html';
            }, 2000);
        });
    }
}

function loadSuggestedProducts() {
    // Get products not in cart
    const cartIds = cart.map(item => item.id);
    const suggested = productsDB.filter(p => !cartIds.includes(p.id)).slice(0, 4);

    const container = document.getElementById('suggestedProducts');
    if (container) {
        renderProducts(suggested, container);
    }
}
