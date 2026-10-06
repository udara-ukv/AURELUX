// ===== EMAILJS INITIALIZATION =====
// Use EmailJS REST API as a reliable fallback when the CDN script is blocked.
const EMAILJS_PUBLIC_KEY = "eBshwVe3UMGGO3vfj";

function initializeEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('✅ EmailJS initialized successfully');
    }
}

// Try to initialize immediately if the library is already loaded
initializeEmailJS();

// Register service worker for PWA (if supported)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('✅ Service Worker registered:', reg.scope))
            .catch(err => console.log('⚠️ Service Worker failed:', err));
    });
}

// Helper function to send emails (non-blocking, fire-and-forget)
function sendEmailAsync(serviceId, templateId, templateParams) {
    // Enrich params with to_email field
    const enrichedParams = {
        ...templateParams
    };
    if (!enrichedParams.to_email && enrichedParams.user_email) {
        enrichedParams.to_email = enrichedParams.user_email;
    }
    if (!enrichedParams.to_email && enrichedParams.customer_email) {
        enrichedParams.to_email = enrichedParams.customer_email;
    }

    if (typeof emailjs !== 'undefined') {
        emailjs.send(serviceId, templateId, enrichedParams)
            .then(response => {
                console.log('✅ Email sent:', response.status);
            })
            .catch(error => {
                console.log('⚠️ Email failed:', error.message || error);
            });
        return;
    }

    // REST API fallback (works even if CDN is blocked)

    fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: EMAILJS_PUBLIC_KEY,
            template_params: enrichedParams
        })
    })
        .then(async response => {
            if (!response.ok) {
                const bodyText = await response.text();
                throw new Error(`HTTP ${response.status} - ${bodyText}`);
            }
            console.log('✅ Email sent via REST API');
        })
        .catch(error => {
            console.log('⚠️ Email failed via REST API:', error.message || error);
        });
}

// ===== SAMPLE PRODUCT DATABASE =====
let productsDB = [
    {
        id: 1,
        name: "Diamond Elegance Ring",
        category: "jewelry",
        price: 1299,
        originalPrice: 1599,
        rating: 4.8,
        reviews: 127,
        image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1512187849-463fdb898f7f?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "Stunning 18k white gold ring with certified diamond stone. Perfect for engagements and special occasions.",
        details: ["18K White Gold", "Certified Diamond", "Ring Size: 6-9", "Weight: 4.2g"],
        colors: ["Gold", "Silver", "Rose Gold"],
        sizes: ["6", "7", "8", "9"],
        stock: 15
    },
    {
        id: 2,
        name: "Luxury Automatic Watch",
        category: "watches",
        price: 2499,
        originalPrice: 3200,
        rating: 4.9,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "Swiss-made automatic watch with sapphire crystal and water-resistant design.",
        details: ["Swiss Movement", "Sapphire Crystal", "Water Resistant 100m", "Leather Strap"],
        colors: ["Black", "Brown", "Navy"],
        sizes: ["S", "M", "L"],
        stock: 8
    },
    {
        id: 3,
        name: "Premium Leather Handbag",
        category: "handbags",
        price: 899,
        originalPrice: 1200,
        rating: 4.7,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1522752251099-2f9c9f4e1bcd?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "Italian leather handbag with elegant design and spacious compartments.",
        details: ["Italian Leather", "Hand Stitched", "Adjustable Straps", "Protective Case"],
        colors: ["Black", "Burgundy", "Cream"],
        sizes: ["Standard"],
        stock: 22
    },
    {
        id: 4,
        name: "Pearl Necklace Set",
        category: "jewelry",
        price: 599,
        originalPrice: 850,
        rating: 4.6,
        reviews: 203,
        image: "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1512187849-463fdb898f7f?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "Luxurious pearl necklace with matching earrings crafted with 14k gold.",
        details: ["14K Gold Setting", "Authentic Pearls", "Includes Earrings", "Gift Box"],
        colors: ["Gold", "Silver"],
        sizes: ["One Size"],
        stock: 18
    },
    {
        id: 5,
        name: "Designer Sunglasses",
        category: "accessories",
        price: 449,
        originalPrice: 650,
        rating: 4.5,
        reviews: 98,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "UV-protected designer sunglasses with premium frame quality.",
        details: ["100% UV Protection", "Polarized Lenses", "Designer Frame", "Hard Case"],
        colors: ["Black", "Gold", "Tortoise"],
        sizes: ["One Size"],
        stock: 30
    },
    {
        id: 6,
        name: "Luxury Watch Strap",
        category: "accessories",
        price: 149,
        originalPrice: 200,
        rating: 4.4,
        reviews: 67,
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "Premium leather watch strap compatible with multiple watch models.",
        details: ["Genuine Leather", "Adjustable Fit", "Multiple Colors", "Easy Install"],
        colors: ["Black", "Brown", "Tan"],
        sizes: ["Standard"],
        stock: 45
    },
    {
        id: 7,
        name: "Elegant Bracelet",
        category: "jewelry",
        price: 379,
        originalPrice: 520,
        rating: 4.7,
        reviews: 142,
        image: "https://images.unsplash.com/photo-1512187849-463fdb898f7f?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1512187849-463fdb898f7f?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "18k gold bracelet with intricate design patterns.",
        details: ["18K Gold", "Handcrafted", "Adjustable", "Certificate"],
        colors: ["Gold", "White Gold"],
        sizes: ["S", "M", "L"],
        stock: 12
    },
    {
        id: 8,
        name: "Vintage Pocket Watch",
        category: "watches",
        price: 1899,
        originalPrice: 2400,
        rating: 4.8,
        reviews: 76,
        image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "Classic vintage-style pocket watch with working chain.",
        details: ["Mechanical Movement", "Brass Case", "Chain Included", "Display Case"],
        colors: ["Gold", "Silver"],
        sizes: ["One Size"],
        stock: 6
    },
    {
        id: 9,
        name: "Rose Oud Perfume",
        category: "fragrances",
        price: 289,
        originalPrice: 360,
        rating: 4.9,
        reviews: 61,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "A rich unisex fragrance with rose, oud, and warm amber notes.",
        details: ["Unisex Scent", "Rose & Oud", "Long Lasting", "Travel Ready"],
        colors: ["Burgundy", "Gold"],
        sizes: ["50ml", "100ml"],
        stock: 20
    },
    {
        id: 10,
        name: "Silk Travel Wallet",
        category: "travel",
        price: 199,
        originalPrice: 250,
        rating: 4.6,
        reviews: 48,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1520637836862-4d197d17c7d7?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "Compact luxury wallet for passports, cards, and travel documents.",
        details: ["Passport Slot", "Card Holders", "Zipped Pocket", "Premium Silk Finish"],
        colors: ["Navy", "Black", "Olive"],
        sizes: ["Standard"],
        stock: 14
    },
    {
        id: 11,
        name: "Satin Beauty Essentials Kit",
        category: "beauty",
        price: 149,
        originalPrice: 210,
        rating: 4.7,
        reviews: 77,
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1526947425960-945c6e728c7d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1556228578-2bfe7b58c0f6?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "A curated beauty set with premium essentials for everyday care.",
        details: ["Skincare Set", "Satin Pouch", "Gift Ready", "Travel Friendly"],
        colors: ["Rose", "Cream", "Pearl"],
        sizes: ["Standard"],
        stock: 26
    },
    {
        id: 12,
        name: "Signature Gift Box",
        category: "gifts",
        price: 159,
        originalPrice: 220,
        rating: 4.8,
        reviews: 39,
        image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80",
        images: [
            "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
        ],
        description: "A premium luxury gift box for special occasions and celebrations.",
        details: ["Curated Items", "Premium Wrap", "Message Card", "Ready to Gift"],
        colors: ["Black", "Gold"],
        sizes: ["Standard"],
        stock: 19
    }
];

// ===== LOCAL STORAGE MANAGEMENT =====
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const user = JSON.parse(localStorage.getItem('user')) || null;

// ===== FIREBASE PRODUCTS SYNC =====
async function loadProductsFromFirebase() {
    if (!window.db) return null;

    try {
        const snapshot = await window.db.collection('products').get();
        if (snapshot.empty) return null;

        return snapshot.docs.map(doc => {
            const data = doc.data() || {};
            const idValue = data.id ?? parseInt(doc.id, 10) ?? doc.id;
            return {
                id: idValue,
                name: data.name || 'Unnamed Product',
                category: data.category || 'accessories',
                price: Number(data.price || 0),
                originalPrice: Number(data.originalPrice || data.price || 0),
                rating: Number(data.rating || 4.5),
                reviews: Number(data.reviews || 0),
                image: data.image || '',
                images: Array.isArray(data.images) ? data.images : [],
                description: data.description || '',
                details: Array.isArray(data.details) ? data.details : [],
                colors: Array.isArray(data.colors) ? data.colors : [],
                sizes: Array.isArray(data.sizes) ? data.sizes : [],
                stock: Number(data.stock || 0)
            };
        });
    } catch (error) {
        console.error('Failed to load products from Firebase:', error);
        return null;
    }
}

async function initProducts() {
    const firebaseProducts = await loadProductsFromFirebase();
    if (firebaseProducts && firebaseProducts.length) {
        productsDB = firebaseProducts;
    }

    window.productsReady = true;
    window.dispatchEvent(new CustomEvent('products:ready'));
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function saveUser(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
}

// ===== CART MANAGEMENT =====
function addToCart(productId, quantity = 1, color = null, size = null) {
    const product = productsDB.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => 
        item.id === productId && item.color === color && item.size === size
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity,
            color,
            size,
            image: product.image
        });
    }

    saveCart();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

function updateCartQuantity(index, quantity) {
    if (quantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = quantity;
        saveCart();
    }
}

function updateCartCount() {
    const cartBtn = document.getElementById('cartCount');
    if (cartBtn) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBtn.textContent = total;
    }
}

// ===== USER AUTHENTICATION =====
function getFirebaseAuthErrorMessage(error, action = 'sign in') {
    const code = error && error.code ? String(error.code) : '';

    const messages = {
        'auth/email-already-in-use': 'This email is already registered. Try signing in instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password should be at least 6 characters long.',
        'auth/operation-not-allowed': 'Email/password sign-in is disabled in Firebase Authentication. Enable it in Firebase Console.',
        'auth/network-request-failed': 'Network error. Check your connection and try again.',
        'auth/user-not-found': 'No account found for this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
        'permission-denied': 'Firestore permission denied. Update Firestore rules or use demo mode.',
        'PERMISSION_DENIED': 'Firestore permission denied. Update Firestore rules or use demo mode.'
    };

    if (messages[code]) {
        return messages[code];
    }

    if (error && error.message) {
        const message = String(error.message);
        if (message.toLowerCase().includes('permission')) {
            return 'Firestore permission denied. Update Firestore rules or switch to demo mode.';
        }
        return message;
    }

    return `Unable to ${action} right now.`;
}

async function createOrUpdateUserProfile(user, fullName = '') {
    if (!window.db || !user) return true;

    const profileData = {
        uid: user.uid,
        email: user.email || '',
        fullName: fullName || user.displayName || '',
        lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (fullName) {
        profileData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    }

    try {
        await window.db.collection('users').doc(user.uid).set(profileData, { merge: true });
        return true;
    } catch (error) {
        const isPermissionIssue = error && (
            error.code === 'permission-denied' ||
            error.code === 'PERMISSION_DENIED' ||
            String(error.message || '').toLowerCase().includes('permission')
        );

        if (isPermissionIssue) {
            console.warn('Firestore user profile write blocked by rules:', error);
            return false;
        }

        throw error;
    }
}

async function registerUser(email, password, fullName) {
    if (window.auth) {
        try {
            const credential = await window.auth.createUserWithEmailAndPassword(email, password);
            const user = credential.user;

            if (user && fullName) {
                await user.updateProfile({ displayName: fullName });
            }

            let profileWritten = true;
            try {
                profileWritten = await createOrUpdateUserProfile(user, fullName);
            } catch (error) {
                console.warn('Profile sync failed:', error);
                profileWritten = false;
            }

            saveUser({ email, fullName });

            if (!profileWritten) {
                showNotification('Account created locally. Firestore rules need to allow user profile writes.', 'error');
            } else {
                showNotification('Account created successfully!');
            }

            // Send welcome email (non-blocking)
            sendEmailAsync("service_9b6hlzf", "template_2go1h35", {
                user_email: email,
                user_name: fullName || "Guest"
            });

            updateUserUI();
            return true;
        } catch (error) {
            console.error('Firebase register failed:', error);
            showNotification(getFirebaseAuthErrorMessage(error, 'register'), 'error');
            return false;
        }
    }

    if (localStorage.getItem('user_' + email)) {
        showNotification('Email already registered', 'error');
        return false;
    }
    
    const userData = {
        email,
        password,
        fullName,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('user_' + email, JSON.stringify(userData));
    saveUser({ email, fullName });
    showNotification('Account created successfully!');
    updateUserUI();
    return true;
}

async function loginUser(email, password) {
    if (window.auth) {
        try {
            const credential = await window.auth.signInWithEmailAndPassword(email, password);
            const user = credential.user;
            await createOrUpdateUserProfile(user);
            saveUser({ email: user.email || email, fullName: user.displayName || '' });
            showNotification(`Welcome back, ${user.displayName || 'User'}!`);
            updateUserUI();
            return true;
        } catch (error) {
            console.error('Firebase login failed:', error);
            showNotification(getFirebaseAuthErrorMessage(error, 'sign in'), 'error');
            return false;
        }
    }

    const userData = JSON.parse(localStorage.getItem('user_' + email));
    
    if (!userData || userData.password !== password) {
        showNotification('Invalid credentials', 'error');
        return false;
    }
    
    saveUser({ email, fullName: userData.fullName });
    showNotification(`Welcome back, ${userData.fullName}!`);
    updateUserUI();
    return true;
}

async function logoutUser() {
    if (window.auth) {
        try {
            await window.auth.signOut();
        } catch (error) {
            console.error('Firebase logout failed:', error);
        }
    }

    localStorage.removeItem('user');
    showNotification('Logged out successfully');
    updateUserUI();
}

function updateUserUI() {
    const localUser = JSON.parse(localStorage.getItem('user'));
    const firebaseUser = window.auth ? window.auth.currentUser : null;
    const displayName = (firebaseUser && firebaseUser.displayName) || (localUser && localUser.fullName) || '';

    const accountContent = document.getElementById('accountContent');
    const userProfile = document.getElementById('userProfile');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    if ((firebaseUser || localUser) && accountContent && userProfile) {
        accountContent.style.display = 'none';
        userProfile.style.display = 'block';
        userNameDisplay.textContent = displayName || 'User';
    } else if (accountContent && userProfile) {
        accountContent.style.display = 'block';
        userProfile.style.display = 'none';
    }
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#4caf50' : '#ff5252'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 4px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== MODAL MANAGEMENT =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
}

// ===== SEARCH FUNCTIONALITY =====
function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return productsDB.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery)
    );
}

// ===== PRODUCT FILTERING =====
function filterProducts(filters) {
    let filtered = [...productsDB];
    
    if (filters.categories && filters.categories.length > 0) {
        filtered = filtered.filter(p => filters.categories.includes(p.category));
    }
    
    if (filters.maxPrice) {
        filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.sortBy) {
        switch(filters.sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                filtered.sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews));
                break;
            default: // newest
                filtered.sort((a, b) => b.id - a.id);
        }
    }
    
    return filtered;
}

// ===== DOM EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on page load
    updateCartCount();
    updateUserUI();

    if (window.auth) {
        window.auth.onAuthStateChanged((user) => {
            if (user) {
                saveUser({ email: user.email || '', fullName: user.displayName || '' });
            } else {
                localStorage.removeItem('user');
            }
            updateUserUI();
        });
    }

    if (!window.productsReady) {
        window.productsReady = false;
        initProducts();
    }

    // Check if current page is enabled
    checkPageVisibility();

    // Modal controls
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });

    // Close modal on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });

    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => openModal('searchModal'));
    }

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const results = searchProducts(e.target.value);
            searchResults.innerHTML = '';

            if (e.target.value && results.length > 0) {
                results.slice(0, 8).forEach(product => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.innerHTML = `
                        <h4>${product.name}</h4>
                        <p>$${product.price}</p>
                    `;
                    resultItem.addEventListener('click', () => {
                        window.location.href = `product-detail.html?id=${product.id}`;
                    });
                    searchResults.appendChild(resultItem);
                });
            } else if (e.target.value) {
                searchResults.innerHTML = '<p style="padding: 1rem; color: #666;">No products found</p>';
            }
        });
    }

    // User authentication
    const userBtn = document.getElementById('userBtn');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    if (userBtn) {
        userBtn.addEventListener('click', () => openModal('userModal'));
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            closeModal('userModal');
            openModal('loginModal');
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            closeModal('userModal');
            openModal('registerModal');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logoutUser();
            closeModal('userModal');
        });
    }

    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('loginModal');
            openModal('registerModal');
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('registerModal');
            openModal('loginModal');
        });
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (await loginUser(email, password)) {
                closeModal('loginModal');
                loginForm.reset();
            }
        });
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (await registerUser(email, password, fullName)) {
                closeModal('registerModal');
                registerForm.reset();
            }
        });
    }

    // Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const emailValue = emailInput ? emailInput.value.trim() : '';

            if (window.db && emailValue) {
                window.db.collection('newsletter').add({
                    email: emailValue,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).catch(err => console.error('Newsletter save failed:', err));
            }

            showNotification('Thank you for subscribing!');
            newsletterForm.reset();
        });
    }

        // Contact form (About -> Contact)
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = (contactForm.querySelector('input[name="name"]') || {}).value || '';
                const email = (contactForm.querySelector('input[name="email"]') || {}).value || '';
                const message = (contactForm.querySelector('textarea[name="message"]') || {}).value || '';

                // Save to Firestore if available
                if (window.db) {
                    try {
                        await window.db.collection('contacts').add({
                            name: name,
                            email: email,
                            message: message,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                        console.log('✅ Contact saved to Firestore');
                    } catch (err) {
                        console.error('⚠️ Failed to save contact:', err);
                    }
                }

                // Send email via EmailJS (template id: replace with your template)
                try {
                    sendEmailAsync('service_9b6hlzf', 'template_contact', {
                        from_name: name,
                        user_email: email,
                        message: message
                    });
                } catch (err) {
                    console.error('⚠️ sendEmailAsync error:', err);
                }

                showNotification('Thanks — your message was sent!');
                contactForm.reset();
            });
        }

    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }

    // Featured products on home page
    const featuredGrid = document.getElementById('featuredProductsGrid');
    const recommendedGrid = document.getElementById('recommendedProductsGrid');

    const renderHomeProductSections = () => {
        if (featuredGrid) {
            console.log('featuredGrid found, productsDB length:', productsDB.length);
            if (productsDB && productsDB.length > 0) {
                renderProducts(productsDB.slice(0, 4), featuredGrid);
                console.log('Featured products rendered');
            } else {
                console.log('No products in productsDB yet');
            }
        }

        if (recommendedGrid) {
            const recommendations = getRecommendedProducts();
            if (recommendations.length > 0) {
                renderProducts(recommendations, recommendedGrid);
            } else {
                recommendedGrid.innerHTML = '<p style="text-align:center; color:#999; padding:2rem;">Add a few products to your cart to get personalized recommendations.</p>';
            }
        }
    };

    renderHomeProductSections();
    window.addEventListener('products:ready', renderHomeProductSections);
});

function getRecommendedProducts(limit = 4) {
    if (!productsDB || !productsDB.length) return [];

    const cartItems = Array.isArray(cart) ? cart : [];
    const cartIds = cartItems.map(item => item.id);
    const categoryScores = cartItems.reduce((scores, item) => {
        const product = productsDB.find(p => p.id === item.id);
        const category = (product?.category || item.category || '').toLowerCase();
        if (!category) return scores;
        scores[category] = (scores[category] || 0) + 1;
        return scores;
    }, {});

    const scoredProducts = productsDB
        .filter(product => !cartIds.includes(product.id))
        .map(product => {
            const category = (product.category || '').toLowerCase();
            const categoryScore = categoryScores[category] || 0;
            const ratingScore = Number(product.rating || 0) / 5;
            const reviewScore = Math.min(Number(product.reviews || 0) / 100, 1);
            const popularityScore = (ratingScore * 0.5) + (reviewScore * 0.5);

            return {
                ...product,
                recommendationScore: (categoryScore * 2) + popularityScore
            };
        })
        .sort((a, b) => b.recommendationScore - a.recommendationScore);

    const hasPreferenceSignal = Object.keys(categoryScores).length > 0;
    const fallbackList = productsDB
        .filter(product => !cartIds.includes(product.id))
        .sort((a, b) => (Number(b.rating || 0) - Number(a.rating || 0)) || (Number(b.reviews || 0) - Number(a.reviews || 0)));

    return (hasPreferenceSignal ? scoredProducts : fallbackList).slice(0, limit);
}

// ===== PRODUCT RENDERING =====
function renderProducts(products, container) {
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.originalPrice > product.price ? `<span class="product-badge">Save ${Math.round((1 - product.price/product.originalPrice)*100)}%</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-rating">
                    <i class="fas fa-star"></i> ${product.rating} (${product.reviews} reviews)
                </p>
                <div class="product-price">
                    $${product.price}
                    ${product.originalPrice > product.price ? `<span class="original">$${product.originalPrice}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-bag"></i> Add
                    </button>
                    <button class="wishlist-btn">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers to product cards
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('button')) {
                const product = products[index];
                window.location.href = `product-detail.html?id=${product.id}`;
            }
        });
    });
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== PAGE VISIBILITY CHECK =====
async function checkPageVisibility() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Pages that need visibility check
    const pageMap = {
        'products.html': 'products',
        'product-detail.html': 'product-detail',
        'cart.html': 'cart'
    };

    const pageId = pageMap[currentPage];
    if (!pageId) return; // No check needed for this page

    if (!window.db) return; // Firebase not available

    try {
        const settingsSnapshot = await window.db.collection('settings').doc('pages').get();
        const pageSettings = settingsSnapshot.exists ? settingsSnapshot.data() : {};
        
        const isPageEnabled = pageSettings[pageId] !== false;
        
        if (!isPageEnabled) {
            // Show coming soon page
            document.body.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <h1 style="color: white; font-size: 3rem; margin-bottom: 1rem;">Coming Soon</h1>
                    <p style="color: rgba(255,255,255,0.8); font-size: 1.2rem; margin-bottom: 2rem;">This page is not yet available.</p>
                    <a href="index.html" style="background: white; color: #667eea; padding: 12px 30px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                        Back to Home
                    </a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error checking page visibility:', error);
    }
}

// Update navigation to hide/show pages based on visibility
async function updateNavigationVisibility() {
    if (!window.db) return;

    try {
        const settingsSnapshot = await window.db.collection('settings').doc('pages').get();
        const pageSettings = settingsSnapshot.exists ? settingsSnapshot.data() : {};

        // Map page IDs to nav links
        const navMap = {
            'products': 'a[href="products.html"]',
            'cart': 'a[href="cart.html"]'
        };

        for (const [pageId, selector] of Object.entries(navMap)) {
            const isEnabled = pageSettings[pageId] !== false;
            const links = document.querySelectorAll(selector);
            links.forEach(link => {
                link.style.display = isEnabled ? 'block' : 'none';
            });
        }
    } catch (error) {
        console.error('Error updating navigation visibility:', error);
    }
}

// Call navigation update on load
window.addEventListener('load', updateNavigationVisibility);

