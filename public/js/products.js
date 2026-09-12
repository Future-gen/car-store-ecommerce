// Products Page Script

let allProducts = [];
let filteredProducts = [];

// Load all products
async function loadProducts() {
    try {
        const response = await apiRequest('/products?limit=100');
        allProducts = response.products;
        filteredProducts = [...allProducts];
        displayProducts(filteredProducts);
    } catch (error) {
        showNotification('Error loading products', 'error');
    }
}

// Display products
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        productsGrid.innerHTML = '<p>No products found</p>';
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.category === 'Tires' ? '<i class="fas fa-ring"></i>' : 
                  product.category === 'Batteries' ? '<i class="fas fa-battery-full"></i>' : 
                  '<i class="fas fa-droplet"></i>'}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">${formatRating(product.rating)} (${product.totalReviews})</div>
                <div class="product-price">${formatCurrency(product.price)}</div>
                ${product.discount > 0 ? `
                    <div>
                        <span class="product-original-price">${formatCurrency(product.originalPrice)}</span>
                        <span class="product-discount">-${product.discount}%</span>
                    </div>
                ` : ''}
                ${product.inStock ? `
                    <div class="product-actions">
                        <button class="btn-add-cart" onclick="addToCart('${product._id}')">Add Cart</button>
                        <button class="btn-wishlist"><i class="far fa-heart"></i></button>
                    </div>
                ` : `
                    <button class="btn btn-secondary" disabled>Out of Stock</button>
                `}
            </div>
        </div>
    `).join('');
}

// Apply filters
function applyFilters() {
    const categoryCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]:checked');
    const priceRange = document.getElementById('priceRange').value;
    
    const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value);
    
    filteredProducts = allProducts.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const priceMatch = product.price <= priceRange;
        return categoryMatch && priceMatch;
    });
    
    displayProducts(filteredProducts);
}

// Reset filters
function resetFilters() {
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('priceRange').value = 500;
    document.getElementById('priceValue').textContent = 500;
    filteredProducts = [...allProducts];
    displayProducts(filteredProducts);
}

// Update price display
document.addEventListener('DOMContentLoaded', () => {
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            document.getElementById('priceValue').textContent = e.target.value;
            applyFilters();
        });
    }
    
    loadProducts();
    updateCartCount();
});
