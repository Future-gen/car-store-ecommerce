// Checkout Page Script

let checkoutCart = null;

// Load checkout data
async function loadCheckout() {
    try {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = '/login.html';
            return;
        }

        const response = await apiRequest(`/cart/${user.id}`);
        checkoutCart = response.cart;
        displayCheckoutSummary();
    } catch (error) {
        showNotification('Error loading checkout data', 'error');
    }
}

// Display checkout summary
function displayCheckoutSummary() {
    const orderItems = document.getElementById('orderItems');
    const subtotal = checkoutCart.subtotal || 0;
    const shipping = subtotal > 100 ? 0 : 15;
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const discount = checkoutCart.discount || 0;
    const total = subtotal + shipping + tax - discount;

    orderItems.innerHTML = checkoutCart.items.map(item => `
        <div class="summary-row">
            <span>${item.productId.name} x${item.quantity}</span>
            <span>${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `).join('');

    document.getElementById('checkoutSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('checkoutShipping').textContent = formatCurrency(shipping);
    document.getElementById('checkoutTax').textContent = formatCurrency(tax);
    document.getElementById('checkoutTotal').textContent = formatCurrency(total);

    if (discount > 0) {
        document.getElementById('checkoutDiscountRow').style.display = 'flex';
        document.getElementById('checkoutDiscount').textContent = `-${formatCurrency(discount)}`;
    }
}

// Handle same address checkbox
document.addEventListener('DOMContentLoaded', () => {
    const sameAddress = document.getElementById('sameAddress');
    const billingForm = document.getElementById('billingForm');

    if (sameAddress) {
        sameAddress.addEventListener('change', () => {
            if (sameAddress.checked) {
                billingForm.style.display = 'none';
            } else {
                billingForm.style.display = 'block';
            }
        });
    }

    // Show/hide card form based on payment method
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const cardForm = document.getElementById('cardForm');

    paymentOptions.forEach(option => {
        option.addEventListener('change', () => {
            if (option.value === 'credit_card' || option.value === 'debit_card') {
                cardForm.style.display = 'block';
            } else {
                cardForm.style.display = 'none';
            }
        });
    });

    loadCheckout();
    updateCartCount();
});

// Place order
async function placeOrder() {
    try {
        const user = getCurrentUser();
        
        // Get form data
        const shippingInputs = document.getElementById('shippingForm').querySelectorAll('input');
        const shippingAddress = {
            firstName: shippingInputs[0].value,
            lastName: shippingInputs[1].value,
            street: shippingInputs[3].value,
            city: shippingInputs[4].value,
            state: shippingInputs[5].value,
            zipCode: shippingInputs[6].value,
            country: shippingInputs[7].value,
            phone: shippingInputs[8].value
        };

        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

        // Validate required fields
        if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.street) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Create order
        const orderResponse = await apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify({
                userId: user.id,
                shippingAddress,
                billingAddress: shippingAddress,
                paymentMethod,
                couponCode: checkoutCart.couponCode || null
            })
        });

        showNotification('Order placed successfully!', 'success');
        
        // Redirect to payment or confirmation
        setTimeout(() => {
            window.location.href = `/order-confirmation.html?orderId=${orderResponse.order._id}`;
        }, 2000);
    } catch (error) {
        showNotification(error.message, 'error');
    }
}
