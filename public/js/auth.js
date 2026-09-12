// Authentication Script

function toggleForms() {
    document.getElementById('loginForm').style.display = 
        document.getElementById('loginForm').style.display === 'none' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = 
        document.getElementById('registerForm').style.display === 'none' ? 'block' : 'none';
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;

    try {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        setToken(response.token);
        setCurrentUser(response.user);
        
        showNotification('Login successful!', 'success');
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const inputs = event.target.querySelectorAll('input');
    const firstName = inputs[0].value;
    const lastName = inputs[1].value;
    const email = inputs[2].value;
    const phone = inputs[3].value;
    const password = inputs[4].value;
    const confirmPassword = inputs[5].value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    try {
        const response = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                phone,
                password
            })
        });

        setToken(response.token);
        setCurrentUser(response.user);
        
        showNotification('Registration successful!', 'success');
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Check if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    if (user) {
        // Update UI for logged in user
        const btnLogin = document.querySelector('.btn-login');
        if (btnLogin) {
            btnLogin.textContent = 'Logout';
            btnLogin.onclick = (e) => {
                e.preventDefault();
                removeToken();
                removeCurrentUser();
                window.location.href = '/';
            };
        }
    }
});
