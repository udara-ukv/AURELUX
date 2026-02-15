// products.js - Products Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    let currentFilters = {
        categories: [],
        maxPrice: 10000,
        sortBy: 'newest'
    };

    const productsGrid = document.getElementById('productsGrid');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const sortBy = document.getElementById('sortBy');
    const clearFilters = document.getElementById('clearFilters');

    // Get category from URL if exists
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');

    // Initial render
    function renderFilteredProducts() {
        const filtered = filterProducts(currentFilters);
        renderProducts(filtered, productsGrid);
    }

    // Price range filter
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function(e) {
            currentFilters.maxPrice = parseInt(e.target.value);
            priceValue.textContent = e.target.value;
            renderFilteredProducts();
        });
    }

    // Category filters
    categoryFilters.forEach(checkbox => {
        if (categoryParam && checkbox.value === categoryParam) {
            checkbox.checked = true;
            currentFilters.categories.push(checkbox.value);
        }

        checkbox.addEventListener('change', function(e) {
            if (e.target.checked) {
                currentFilters.categories.push(e.target.value);
            } else {
                currentFilters.categories = currentFilters.categories.filter(cat => cat !== e.target.value);
            }
            renderFilteredProducts();
        });
    });

    // Sort functionality
    if (sortBy) {
        sortBy.addEventListener('change', function(e) {
            currentFilters.sortBy = e.target.value;
            renderFilteredProducts();
        });
    }

    // Clear filters
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            currentFilters = {
                categories: [],
                maxPrice: 10000,
                sortBy: 'newest'
            };
            
            categoryFilters.forEach(checkbox => checkbox.checked = false);
            if (priceRange) priceRange.value = 10000;
            if (priceValue) priceValue.textContent = '10000';
            if (sortBy) sortBy.value = 'newest';
            
            renderFilteredProducts();
        });
    }

    const renderInitial = () => {
        if (categoryParam && categoryParam !== '') {
            renderFilteredProducts();
        } else {
            renderProducts(productsDB, productsGrid);
        }
    };

    if (window.productsReady) {
        renderInitial();
    } else {
        window.addEventListener('products:ready', renderInitial, { once: true });
    }
});
