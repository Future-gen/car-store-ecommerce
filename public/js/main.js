// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Utility Functions
function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
}

function setCurrentUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function removeCurrentUser() {
    localStorage.removeItem('user');
}

// API Request Helper
async function apiRequest(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            if (response.status === 401) {
                removeToken();
                removeCurrentUser();
                window.location.href = '/login.html';
            }
            const error = await response.json();
            throw new Error(error.message);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format Rating
function formatRating(rating) {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.insertBefore(notification, document.body.firstChild);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Update Cart Count
async function updateCartCount() {
    try {
        const user = getCurrentUser();
        if (!user) return;

        const response = await apiRequest(`/cart/${user.id}`);
        const cartCount = response.cart.items.length;
        
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(el => {
            el.textContent = cartCount;
        });
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Load Featured Products
async function loadFeaturedProducts() {
    try {
        const response = await apiRequest('/products?limit=8');
        const productsGrid = document.getElementById('featuredProducts');
        
        if (!productsGrid) return;

        productsGrid.innerHTML = response.products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <i class="fas fa-ring"></i>
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">${formatRating(product.rating)}</div>
                    <div class="product-price">${formatCurrency(product.price)}</div>
                    ${product.discount > 0 ? `
                        <div>
                            <span class="product-original-price">${formatCurrency(product.originalPrice)}</span>
                            <span class="product-discount">-${product.discount}%</span>
                        </div>
                    ` : ''}
                    <div class="product-actions">
                        <button class="btn-add-cart" onclick="addToCart('${product._id}')">Add Cart</button>
                        <button class="btn-wishlist"><i class="far fa-heart"></i></button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

// Add to Cart
async function addToCart(productId) {
    try {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = '/login.html';
            return;
        }

        await apiRequest(`/cart/${user.id}/add`, {
            method: 'POST',
            body: JSON.stringify({
                productId,
                quantity: 1
            })
        });

        updateCartCount();
        showNotification('Product added to cart!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadFeaturedProducts();
});
