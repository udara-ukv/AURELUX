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

function getCheckoutTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const promoCode = document.getElementById('promoCode');
    let discount = 0;

    if (promoCode && promoCode.value) {
        const appliedCode = localStorage.getItem('appliedPromoCode');
        if (appliedCode) {
            discount = appliedCode === 'LUXURY20' ? subtotal * 0.2 :
                      appliedCode === 'SAVE10' ? subtotal * 0.1 : 0;
        }
    }

    return {
        subtotal,
        shipping,
        discount,
        total: subtotal + shipping - discount,
        promoCode: promoCode?.value || null
    };
}

function getSelectedPaymentMethod() {
    return document.querySelector('input[name="paymentMethod"]:checked')?.value || 'stripe-test';
}

function validateStripeTestPaymentDetails() {
    const cardNumberInput = document.getElementById('testCardNumber');
    const expiryInput = document.getElementById('testCardExpiry');
    const cvcInput = document.getElementById('testCardCvc');

    const cardNumber = (cardNumberInput?.value || '').replace(/\s+/g, '');
    const expiry = (expiryInput?.value || '').trim();
    const cvc = (cvcInput?.value || '').trim();

    if (cardNumber !== '4242424242424242') {
        return { ok: false, message: 'Use the Stripe test card number 4242 4242 4242 4242.' };
    }

    const expiryMatch = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!expiryMatch) {
        return { ok: false, message: 'Enter expiry in MM/YY format.' };
    }

    const month = parseInt(expiryMatch[1], 10);
    const year = 2000 + parseInt(expiryMatch[2], 10);
    if (month < 1 || month > 12) {
        return { ok: false, message: 'Expiry month must be between 01 and 12.' };
    }

    const now = new Date();
    const expiryDate = new Date(year, month, 0, 23, 59, 59, 999);
    if (expiryDate < now) {
        return { ok: false, message: 'Test card expiry must be in the future.' };
    }

    if (!/^\d{3,4}$/.test(cvc)) {
        return { ok: false, message: 'Enter a 3 or 4 digit CVC.' };
    }

    return { ok: true, last4: cardNumber.slice(-4) };
}

function getPayPalSandboxClientId() {
    const input = document.getElementById('paypalSandboxClientId');
    const stored = localStorage.getItem('paypalSandboxClientId') || '';
    const value = (input?.value || stored).trim();

    if (value && input && input.value !== value) {
        input.value = value;
    }

    return value;
}

function loadPayPalSdk(clientId) {
    return new Promise((resolve, reject) => {
        if (window.paypal) {
            resolve();
            return;
        }

        const existingScript = document.querySelector('script[data-paypal-sdk="true"]');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(), { once: true });
            existingScript.addEventListener('error', () => reject(new Error('Failed to load PayPal SDK')), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture`;
        script.async = true;
        script.setAttribute('data-paypal-sdk', 'true');
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
        document.head.appendChild(script);
    });
}

function buildOrderPayload(paymentMeta, totals, user, orderRefId) {
    return {
        customerEmail: user.email,
        customerName: user.fullName,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            color: item.color,
            size: item.size
        })),
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        discount: totals.discount,
        total: totals.total,
        promoCode: totals.promoCode,
        paymentMethod: paymentMeta.method,
        paymentProvider: paymentMeta.provider,
        paymentStatus: paymentMeta.status,
        paymentLast4: paymentMeta.last4 || null,
        paymentReference: paymentMeta.reference || null,
        paymentPayerEmail: paymentMeta.payerEmail || null,
        paymentPayload: paymentMeta.payload || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: paymentMeta.orderStatus || 'completed'
    };
}

async function saveOrderAndNotify(paymentMeta, successMessage) {
    const user = JSON.parse(localStorage.getItem('user'));
    const totals = getCheckoutTotals();

    if (!user) {
        showNotification('Please login to checkout', 'error');
        setTimeout(() => {
            openModal('userModal');
        }, 500);
        return;
    }

    if (!window.db) {
        showNotification('Database connection unavailable', 'error');
        return;
    }

    try {
        const orderPayload = buildOrderPayload(paymentMeta, totals, user);
        const orderRef = await window.db.collection('orders').add(orderPayload);

        try {
            const itemsList = cart.map(item =>
                `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
            ).join('\n');

            if (typeof sendEmailAsync !== 'undefined') {
                sendEmailAsync('service_9b6hlzf', 'template_ukyzry9', {
                    customer_email: user.email,
                    customer_name: user.fullName,
                    order_id: orderRef.id.substring(0, 8),
                    items_list: itemsList,
                    subtotal: totals.subtotal.toFixed(2),
                    shipping: totals.shipping === 0 ? 'FREE' : '$' + totals.shipping.toFixed(2),
                    discount: totals.discount > 0 ? '-$' + totals.discount.toFixed(2) : '$0.00',
                    total: totals.total.toFixed(2)
                });
            }
        } catch (emailError) {
            console.log('Email error:', emailError.message);
        }

        showNotification(successMessage || 'Order placed successfully!');
        setTimeout(() => {
            cart.length = 0;
            saveCart();
            localStorage.removeItem('appliedPromoCode');
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        console.error('Error saving order:', error);
        showNotification('Could not place order. Please try again.', 'error');
    }
}

async function renderPayPalSandboxButtons() {
    const container = document.getElementById('paypalButtonsContainer');
    const clientId = getPayPalSandboxClientId();

    if (!container) {
        return;
    }

    if (!clientId) {
        container.innerHTML = '<p class="payment-note">Enter your PayPal sandbox client ID first.</p>';
        return;
    }

    localStorage.setItem('paypalSandboxClientId', clientId);
    container.innerHTML = '<p class="payment-note">Loading PayPal sandbox buttons...</p>';

    try {
        await loadPayPalSdk(clientId);

        if (!window.paypal) {
            throw new Error('PayPal SDK did not initialize');
        }

        const totals = getCheckoutTotals();
        container.innerHTML = '';

        window.paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'gold',
                shape: 'rect',
                label: 'paypal'
            },
            createOrder: (_, actions) => actions.order.create({
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: totals.total.toFixed(2),
                        breakdown: {
                            item_total: { currency_code: 'USD', value: totals.subtotal.toFixed(2) },
                            shipping: { currency_code: 'USD', value: totals.shipping.toFixed(2) },
                            discount: { currency_code: 'USD', value: totals.discount.toFixed(2) }
                        }
                    }
                }]
            }),
            onApprove: async (data, actions) => {
                const details = await actions.order.capture();
                await saveOrderAndNotify({
                    method: 'paypal-sandbox',
                    provider: 'PayPal Sandbox',
                    status: 'captured',
                    reference: data.orderID,
                    payerEmail: details?.payer?.email_address || '',
                    payload: details
                }, 'PayPal Sandbox payment approved! Order placed successfully.');
            },
            onError: (err) => {
                console.error('PayPal sandbox checkout failed:', err);
                showNotification('PayPal checkout failed. See console.', 'error');
            }
        }).render('#paypalButtonsContainer');
    } catch (error) {
        console.error('Failed to load PayPal sandbox:', error);
        container.innerHTML = '<p class="payment-note">Unable to load PayPal sandbox. Check your client ID and try again.</p>';
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

    const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const stripePanel = document.getElementById('stripePaymentPanel');
    const paypalPanel = document.getElementById('paypalPaymentPanel');
    const loadPaypalButtons = document.getElementById('loadPaypalButtons');
    const paypalClientIdInput = document.getElementById('paypalSandboxClientId');

    function updatePaymentPanels() {
        const selectedMethod = getSelectedPaymentMethod();
        if (stripePanel) {
            stripePanel.style.display = selectedMethod === 'stripe-test' ? 'block' : 'none';
        }
        if (paypalPanel) {
            paypalPanel.style.display = selectedMethod === 'paypal-sandbox' ? 'block' : 'none';
        }
        if (selectedMethod === 'paypal-sandbox') {
            renderPayPalSandboxButtons();
        }
    }

    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', updatePaymentPanels);
    });

    if (paypalClientIdInput) {
        const savedClientId = localStorage.getItem('paypalSandboxClientId');
        if (savedClientId) {
            paypalClientIdInput.value = savedClientId;
        }
        paypalClientIdInput.addEventListener('change', () => {
            localStorage.setItem('paypalSandboxClientId', paypalClientIdInput.value.trim());
        });
    }

    if (loadPaypalButtons) {
        loadPaypalButtons.addEventListener('click', renderPayPalSandboxButtons);
    }

    updatePaymentPanels();

    // Checkout
    const checkoutBtn = document.getElementById('proceedCheckout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }

            const selectedPaymentMethod = getSelectedPaymentMethod();
            if (selectedPaymentMethod === 'paypal-sandbox') {
                await renderPayPalSandboxButtons();
                showNotification('Use the PayPal Sandbox button below to complete checkout.', 'error');
                return;
            }

            const paymentCheck = validateStripeTestPaymentDetails();
            if (!paymentCheck.ok) {
                showNotification(paymentCheck.message, 'error');
                return;
            }

            await saveOrderAndNotify({
                method: 'stripe-test',
                provider: 'Stripe Test Mode',
                status: 'paid',
                last4: paymentCheck.last4
            }, 'Stripe test payment approved! Order placed successfully.');
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
