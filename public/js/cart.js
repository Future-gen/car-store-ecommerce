// Cart Page Script

let cartData = null;

// Load cart
async function loadCart() {
    try {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = '/login.html';
            return;
        }

        const response = await apiRequest(`/cart/${user.id}`);
        cartData = response.cart;
        displayCart();
    } catch (error) {
        showNotification('Error loading cart', 'error');
    }
}

// Display cart
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartTable = document.getElementById('cartTable');

    if (cartData.items.length === 0) {
        cartItems.innerHTML = '';
        cartTable.style.display = 'none';
        emptyCart.style.display = 'block';
        updateOrderSummary();
        return;
    }

    cartTable.style.display = 'table';
    emptyCart.style.display = 'none';

    cartItems.innerHTML = cartData.items.map(item => `
        <tr>
            <td>${item.productId.name}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>
                <input type="number" value="${item.quantity}" min="1" 
                       onchange="updateQuantity('${item.productId._id}', this.value)" 
                       style="width: 60px; padding: 0.25rem;">
            </td>
            <td>${formatCurrency(item.price * item.quantity)}</td>
            <td>
                <button class="btn btn-secondary" onclick="removeFromCart('${item.productId._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    updateOrderSummary();
}

// Update order summary
function updateOrderSummary() {
    const subtotal = cartData.subtotal || 0;
    const shipping = subtotal > 100 ? 0 : 15;
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const discount = cartData.discount || 0;
    const total = subtotal + shipping + tax - discount;

    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('shipping').textContent = formatCurrency(shipping);
    document.getElementById('tax').textContent = formatCurrency(tax);
    document.getElementById('total').textContent = formatCurrency(total);

    if (discount > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discount').textContent = `-${formatCurrency(discount)}`;
    } else {
        document.getElementById('discountRow').style.display = 'none';
    }
}

// Update quantity
async function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    try {
        const user = getCurrentUser();
        const response = await apiRequest(`/cart/${user.id}/add`, {
            method: 'POST',
            body: JSON.stringify({
                productId,
                quantity: parseInt(quantity)
            })
        });
        cartData = response.cart;
        displayCart();
    } catch (error) {
        showNotification('Error updating cart', 'error');
    }
}

// Remove from cart
async function removeFromCart(productId) {
    try {
        const user = getCurrentUser();
        const response = await apiRequest(`/cart/${user.id}/remove`, {
            method: 'POST',
            body: JSON.stringify({ productId })
        });
        cartData = response.cart;
        displayCart();
        updateCartCount();
        showNotification('Product removed from cart', 'success');
    } catch (error) {
        showNotification('Error removing item', 'error');
    }
}

// Apply coupon
async function applyCoupon() {
    try {
        const couponCode = document.getElementById('couponCode').value.trim();
        if (!couponCode) {
            showNotification('Please enter a coupon code', 'error');
            return;
        }

        const user = getCurrentUser();
        const response = await apiRequest(`/cart/${user.id}/apply-coupon`, {
            method: 'POST',
            body: JSON.stringify({ couponCode })
        });
        cartData = response.cart;
        displayCart();
        showNotification('Coupon applied successfully', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cartData.items.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    window.location.href = '/checkout.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartCount();
});
