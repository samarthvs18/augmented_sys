// Authentication System for AR Fashion Store
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('arFashionUsers') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('arFashionCurrentUser') || 'null');
        this.demoUsers = [
            {
                id: 1,
                email: 'demo@arfashion.com',
                password: 'demo123',
                firstName: 'Demo',
                lastName: 'User',
                phone: '+1234567890',
                preferences: { gender: 'unisex', size: 'M' },
                createdAt: new Date().toISOString(),
                isDemo: true
            },
            {
                id: 2,
                email: 'admin@arfashion.com',
                password: 'admin123',
                firstName: 'Admin',
                lastName: 'User',
                phone: '+1987654321',
                preferences: { gender: 'unisex', size: 'L' },
                createdAt: new Date().toISOString(),
                isAdmin: true,
                isDemo: true
            }
        ];
        
        this.initializeAuth();
    }

    initializeAuth() {
        // Add demo users if not exist
        this.demoUsers.forEach(demoUser => {
            if (!this.users.find(u => u.email === demoUser.email)) {
                this.users.push(demoUser);
            }
        });
        this.saveUsers();

        // Setup page-specific functionality
        this.setupEventListeners();
        this.updateAuthState();
    }

    setupEventListeners() {
        const currentPage = this.getCurrentPage();
        
        if (currentPage === 'login') {
            this.setupLoginPage();
        } else if (currentPage === 'register') {
            this.setupRegisterPage();
        }

        // Update navigation for all pages
        this.updateNavigation();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('login')) return 'login';
        if (path.includes('register')) return 'register';
        return 'other';
    }

    setupLoginPage() {
        const loginForm = document.getElementById('login-form');
        const togglePassword = document.getElementById('toggle-password');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility('password'));
        }

        // Auto-fill demo account for testing
        this.setupDemoLogin();
    }

    setupRegisterPage() {
        const registerForm = document.getElementById('register-form');
        const toggleRegPassword = document.getElementById('toggle-reg-password');
        const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
        const passwordInput = document.getElementById('reg-password');

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        if (toggleRegPassword) {
            toggleRegPassword.addEventListener('click', () => this.togglePasswordVisibility('reg-password'));
        }

        if (toggleConfirmPassword) {
            toggleConfirmPassword.addEventListener('click', () => this.togglePasswordVisibility('confirm-password'));
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.checkPasswordStrength());
        }

        // Real-time validation
        this.setupRealTimeValidation();
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember-me').checked;

        // Clear previous errors
        this.clearErrors();
        
        // Show loading
        this.setButtonLoading(true);

        // Simulate API delay
        await this.delay(1000);

        // Find user
        const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            this.showError('email-error', 'No account found with this email address');
            this.setButtonLoading(false);
            return;
        }

        if (user.password !== password) {
            this.showError('password-error', 'Incorrect password');
            this.setButtonLoading(false);
            return;
        }

        // Successful login
        this.currentUser = { ...user };
        delete this.currentUser.password; // Don't store password in current user

        // Save login state
        localStorage.setItem('arFashionCurrentUser', JSON.stringify(this.currentUser));
        if (remember) {
            localStorage.setItem('arFashionRememberMe', 'true');
        }

        // Update user's last login
        const userIndex = this.users.findIndex(u => u.id === user.id);
        this.users[userIndex].lastLogin = new Date().toISOString();
        this.saveUsers();

        this.setButtonLoading(false);
        this.showSuccessModal();
    }

    async handleRegister(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(e.target);
        const userData = {};
        
        for (let [key, value] of formData.entries()) {
            userData[key] = value.trim();
        }

        // Clear previous errors
        this.clearErrors();

        // Validate form
        if (!this.validateRegisterForm(userData)) {
            return;
        }

        // Show loading
        this.setButtonLoading(true, 'register');

        // Simulate API delay
        await this.delay(1500);

        // Check if user already exists
        if (this.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            this.showError('reg-email-error', 'An account with this email already exists');
            this.setButtonLoading(false, 'register');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone || '',
            preferences: {
                gender: userData.genderPreference || 'unisex',
                size: userData.sizePreference || 'M',
                newsletter: userData.newsletter === 'on'
            },
            createdAt: new Date().toISOString(),
            isVerified: true // Auto-verify for demo
        };

        // Add to users array
        this.users.push(newUser);
        this.saveUsers();

        this.setButtonLoading(false, 'register');
        this.showRegisterSuccessModal();
    }

    validateRegisterForm(data) {
        let isValid = true;

        // First name validation
        if (!data.firstName || data.firstName.length < 2) {
            this.showError('first-name-error', 'First name must be at least 2 characters');
            isValid = false;
        }

        // Last name validation
        if (!data.lastName || data.lastName.length < 2) {
            this.showError('last-name-error', 'Last name must be at least 2 characters');
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showError('reg-email-error', 'Please enter a valid email address');
            isValid = false;
        }

        // Password validation
        if (data.password.length < 6) {
            this.showError('reg-password-error', 'Password must be at least 6 characters');
            isValid = false;
        }

        // Confirm password validation
        if (data.password !== data.confirmPassword) {
            this.showError('confirm-password-error', 'Passwords do not match');
            isValid = false;
        }

        // Terms validation
        if (!data.terms) {
            this.showNotification('You must agree to the Terms of Service', 'error');
            isValid = false;
        }

        return isValid;
    }

    checkPasswordStrength() {
        const password = document.getElementById('reg-password').value;
        const strengthBar = document.getElementById('strength-bar');
        const strengthText = document.getElementById('strength-text');

        if (!password) {
            strengthBar.className = 'strength-bar';
            strengthText.textContent = 'Password strength';
            return;
        }

        let strength = 0;
        let strengthLevel = '';
        let strengthColor = '';

        // Length check
        if (password.length >= 8) strength += 1;
        
        // Uppercase check
        if (/[A-Z]/.test(password)) strength += 1;
        
        // Lowercase check
        if (/[a-z]/.test(password)) strength += 1;
        
        // Number check
        if (/\d/.test(password)) strength += 1;
        
        // Special character check
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

        // Determine strength level
        if (strength <= 2) {
            strengthLevel = 'Weak';
            strengthColor = 'weak';
        } else if (strength <= 3) {
            strengthLevel = 'Fair';
            strengthColor = 'fair';
        } else if (strength <= 4) {
            strengthLevel = 'Good';
            strengthColor = 'good';
        } else {
            strengthLevel = 'Strong';
            strengthColor = 'strong';
        }

        strengthBar.className = `strength-bar ${strengthColor}`;
        strengthText.textContent = `Password strength: ${strengthLevel}`;
    }

    setupRealTimeValidation() {
        const emailInput = document.getElementById('reg-email');
        const confirmPasswordInput = document.getElementById('confirm-password');

        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                const email = emailInput.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (email && !emailRegex.test(email)) {
                    this.showError('reg-email-error', 'Please enter a valid email address');
                    emailInput.classList.add('is-invalid');
                } else if (email) {
                    this.clearError('reg-email-error');
                    emailInput.classList.remove('is-invalid');
                    emailInput.classList.add('is-valid');
                }
            });
        }

        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                const password = document.getElementById('reg-password').value;
                const confirmPassword = confirmPasswordInput.value;

                if (confirmPassword && password !== confirmPassword) {
                    this.showError('confirm-password-error', 'Passwords do not match');
                    confirmPasswordInput.classList.add('is-invalid');
                } else if (confirmPassword) {
                    this.clearError('confirm-password-error');
                    confirmPasswordInput.classList.remove('is-invalid');
                    confirmPasswordInput.classList.add('is-valid');
                }
            });
        }
    }

    setupDemoLogin() {
        // Add click handlers for demo account info
        const demoAlert = document.querySelector('.demo-accounts .alert');
        if (demoAlert) {
            demoAlert.addEventListener('click', (e) => {
                if (e.target.tagName === 'SMALL') {
                    const text = e.target.textContent;
                    const emailMatch = text.match(/Email: ([^\s|]+)/);
                    const passwordMatch = text.match(/Password: ([^\s]+)/);
                    
                    if (emailMatch && passwordMatch) {
                        document.getElementById('email').value = emailMatch[1];
                        document.getElementById('password').value = passwordMatch[1];
                    }
                }
            });
        }
    }

    togglePasswordVisibility(inputId) {
        const input = document.getElementById(inputId);
        const button = document.querySelector(`#toggle-${inputId.replace('reg-', '').replace('confirm-', 'confirm')}`);
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    showSuccessModal() {
        const modal = new bootstrap.Modal(document.getElementById('success-modal'));
        modal.show();
    }

    showRegisterSuccessModal() {
        const modal = new bootstrap.Modal(document.getElementById('register-success-modal'));
        modal.show();
    }

    redirectAfterLogin() {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') || 'products.html';
        window.location.href = redirect;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('arFashionCurrentUser');
        localStorage.removeItem('arFashionRememberMe');
        this.updateNavigation();
        this.showNotification('Successfully logged out', 'info');
    }

    updateNavigation() {
        // Update navigation based on auth state
        const navItems = document.querySelectorAll('.navbar-nav');
        
        navItems.forEach(nav => {
            if (this.currentUser) {
                // User is logged in
                const loginLink = nav.querySelector('a[href="login.html"]');
                const registerLink = nav.querySelector('a[href="register.html"]');
                
                if (loginLink) {
                    loginLink.innerHTML = `<i class="fas fa-user me-1"></i>${this.currentUser.firstName}`;
                    loginLink.href = '#';
                    loginLink.classList.add('dropdown-toggle');
                    loginLink.onclick = () => this.showUserMenu();
                }
                
                if (registerLink) {
                    registerLink.innerHTML = '<i class="fas fa-sign-out-alt me-1"></i>Logout';
                    registerLink.href = '#';
                    registerLink.onclick = () => this.logout();
                }
            }
        });
    }

    showUserMenu() {
        // Simple user menu implementation
        const menu = `
            <div class="user-menu">
                <p>Welcome, ${this.currentUser.firstName}!</p>
                <button onclick="authSystem.logout()" class="btn btn-sm btn-outline-danger">Logout</button>
            </div>
        `;
        // This would show a dropdown menu in a real implementation
        alert(`Welcome, ${this.currentUser.firstName}!`);
    }

    updateAuthState() {
        // Check if user should be remembered
        const rememberMe = localStorage.getItem('arFashionRememberMe');
        if (rememberMe && this.currentUser) {
            // Keep user logged in
            this.updateNavigation();
        }
    }

    // Utility methods
    setButtonLoading(loading, type = 'login') {
        const button = document.querySelector('.auth-btn');
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');

        if (loading) {
            button.disabled = true;
            btnText.classList.add('d-none');
            btnLoading.classList.remove('d-none');
        } else {
            button.disabled = false;
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
        }
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        const inputElement = document.getElementById(elementId.replace('-error', ''));
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        if (inputElement) {
            inputElement.classList.add('is-invalid');
        }
    }

    clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        const inputElement = document.getElementById(elementId.replace('-error', ''));
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        if (inputElement) {
            inputElement.classList.remove('is-invalid');
        }
    }

    clearErrors() {
        document.querySelectorAll('.invalid-feedback').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        
        document.querySelectorAll('.form-control').forEach(el => {
            el.classList.remove('is-invalid', 'is-valid');
        });
    }

    showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    saveUsers() {
        localStorage.setItem('arFashionUsers', JSON.stringify(this.users));
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public methods for external access
    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getUserPreferences() {
        return this.currentUser ? this.currentUser.preferences : {};
    }
}

// Global functions
function forgotPassword() {
    alert('Password reset functionality would be implemented here.\n\nFor demo purposes, use:\n• demo@arfashion.com / demo123\n• admin@arfashion.com / admin123');
}

function socialLogin(provider) {
    alert(`${provider} login would be implemented here using OAuth.`);
}

// Initialize auth system
let authSystem;
document.addEventListener('DOMContentLoaded', function() {
    authSystem = new AuthSystem();
});

// Export for global access
window.authSystem = authSystem;
