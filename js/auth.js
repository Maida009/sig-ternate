// Check if user is already logged in
if (window.location.pathname.includes('peta.html')) {
    if (!localStorage.getItem('currentUser')) {
        window.location.href = 'index.html';
    }
}

// Login Form Handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find user
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Save current user
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'peta.html';
        } else {
            showError('Username atau password salah!');
        }
    });
}

// Register Form Handler
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        
        // Validation
        if (password !== confirm) {
            showError('Password tidak cocok!');
            return;
        }
        
        if (password.length < 6) {
            showError('Password minimal 6 karakter!');
            return;
        }
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if username exists
        if (users.find(u => u.username === username)) {
            showError('Username sudah digunakan!');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            username: username,
            email: email,
            password: password,
            registeredAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        showSuccess('Registrasi berhasil! Silakan login.');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// Initialize default admin user
function initDefaultUser() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
        users.push({
            id: 1,
            username: 'admin',
            email: 'admin@ternate.go.id',
            password: 'admin123',
            registeredAt: new Date().toISOString()
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-msg');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('success-msg');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Initialize on load
initDefaultUser();