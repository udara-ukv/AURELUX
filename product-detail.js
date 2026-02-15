// product-detail.js - Product Detail Page Functionality

let currentProduct = null;
let selectedColor = null;
let selectedSize = null;

document.addEventListener('DOMContentLoaded', function() {
    const initDetail = () => {
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));

        currentProduct = productsDB.find(p => p.id === productId);

        if (!currentProduct) {
            document.body.innerHTML = '<div style="text-align: center; padding: 4rem;"><h1>Product not found</h1></div>';
            return;
        }

        // Populate product details
        populateProductDetails();
        loadRelatedProducts();
        
        // Setup event listeners
        setupEventListeners();
    };

    if (window.productsReady) {
        initDetail();
    } else {
        window.addEventListener('products:ready', initDetail, { once: true });
    }
});

function populateProductDetails() {
    // Breadcrumb
    document.getElementById('breadcrumbName').textContent = currentProduct.name;

    // Product header
    document.getElementById('productName').textContent = currentProduct.name;
    
    // Rating
    const ratingStars = '★'.repeat(Math.floor(currentProduct.rating)) + 
                        '☆'.repeat(5 - Math.floor(currentProduct.rating));
    document.getElementById('productRating').textContent = ratingStars;
    document.getElementById('reviewCount').textContent = `${currentProduct.reviews} reviews`;

    // Price
    document.getElementById('productPrice').textContent = `$${currentProduct.price}`;
    if (currentProduct.originalPrice > currentProduct.price) {
        document.getElementById('originalPrice').textContent = `$${currentProduct.originalPrice}`;
        const discount = Math.round((1 - currentProduct.price / currentProduct.originalPrice) * 100);
        document.getElementById('discountBadge').textContent = `Save ${discount}%`;
    }

    // Description and details
    document.getElementById('productDescription').textContent = currentProduct.description;
    
    const detailsList = document.getElementById('productDetails');
    detailsList.innerHTML = currentProduct.details.map(detail => 
        `<li>${detail}</li>`
    ).join('');

    // Color options
    const colorOptions = document.getElementById('colorOptions');
    colorOptions.innerHTML = currentProduct.colors.map((color, index) => 
        `<button class="option-btn ${index === 0 ? 'active' : ''}" data-color="${color}">${color}</button>`
    ).join('');
    selectedColor = currentProduct.colors[0];

    // Size options
    const sizeOptions = document.getElementById('sizeOptions');
    sizeOptions.innerHTML = currentProduct.sizes.map((size, index) => 
        `<button class="option-btn ${index === 0 ? 'active' : ''}" data-size="${size}">${size}</button>`
    ).join('');
    selectedSize = currentProduct.sizes[0];

    // Main product image
    const mainImage = document.getElementById('mainImage');
    const mainSrc = currentProduct.images && currentProduct.images.length
        ? currentProduct.images[0]
        : currentProduct.image;
    mainImage.innerHTML = `<img src="${mainSrc}" alt="${currentProduct.name}">`;

    // Thumbnails
    const thumbnails = document.getElementById('thumbnailImages');
    const images = currentProduct.images && currentProduct.images.length
        ? currentProduct.images
        : [currentProduct.image];
    thumbnails.innerHTML = images.map((src, i) => 
        `<div class="thumbnail-image ${i === 0 ? 'active' : ''}">
            <img src="${src}" alt="${currentProduct.name} thumbnail ${i + 1}">
        </div>`
    ).join('');

    thumbnails.querySelectorAll('.thumbnail-image').forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            thumbnails.querySelectorAll('.thumbnail-image').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            mainImage.innerHTML = `<img src="${images[index]}" alt="${currentProduct.name}">`;
        });
    });
}

function setupEventListeners() {
    // Quantity controls
    const quantityInput = document.getElementById('quantity');
    const increaseBtn = document.getElementById('increaseQty');
    const decreaseBtn = document.getElementById('decreaseQty');

    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        });
    }

    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            if (parseInt(quantityInput.value) > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
            }
        });
    }

    // Color selection
    document.querySelectorAll('[data-color]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('[data-color]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedColor = this.dataset.color;
        });
    });

    // Size selection
    document.querySelectorAll('[data-size]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('[data-size]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedSize = this.dataset.size;
        });
    });

    // Add to cart
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('quantity').value);
            addToCart(currentProduct.id, quantity, selectedColor, selectedSize);
            document.getElementById('quantity').value = 1;
        });
    }

    // Wishlist
    const wishlistBtn = document.getElementById('addToWishlistBtn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            const isActive = this.classList.contains('active');
            showNotification(
                isActive ? 'Added to wishlist!' : 'Removed from wishlist',
                isActive ? 'success' : 'info'
            );
        });
    }

    // Reviews form
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('reviewTitle').value;
            const text = document.getElementById('reviewText').value;
            const rating = document.querySelector('input[name="rating"]:checked').value;

            // Add review to display
            const newReview = document.createElement('div');
            newReview.className = 'review-item';
            newReview.innerHTML = `
                <div class="review-header">
                    <span class="review-author">You</span>
                    <span class="review-date">Just now</span>
                </div>
                <div class="review-rating">★ ${rating}</div>
                <h4>${title}</h4>
                <p class="review-text">${text}</p>
            `;

            const reviewsList = document.getElementById('reviewsList');
            reviewsList.insertBefore(newReview, reviewsList.firstChild);

            showNotification('Thank you for your review!');
            reviewForm.reset();
        });
    }
}

function loadRelatedProducts() {
    const related = productsDB
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);

    const container = document.getElementById('relatedProducts');
    if (container) {
        renderProducts(related, container);
    }
}
