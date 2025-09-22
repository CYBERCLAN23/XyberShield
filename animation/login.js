// =========================
// NOTIFICATION HANDLING
// =========================
function showNotification(message, isError = false) {
    console.log('Notification:', message, isError ? 'error' : 'success');
    
    // Create notification element if it doesn't exist
    let notif = document.getElementById("welcome-notification");
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'welcome-notification';
        document.body.appendChild(notif);
    }
    
    // Set notification content and style
    notif.textContent = message;
    notif.className = "notification " + (isError ? "error" : "success");
    notif.style.display = "block";
    notif.style.opacity = 1;
    
    // Auto-hide after delay
    setTimeout(() => {
        if (notif) {
            notif.style.opacity = 0;
            setTimeout(() => {
                if (notif) notif.style.display = "none";
            }, 500);
        }
    }, 5000);
    
    // Also log to console for debugging
    if (isError) {
        console.error('Error:', message);
    } else {
        console.log('Success:', message);
    }
}

// =========================
// VALIDATION HELPERS
// =========================
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isValidPassword(password) {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 digit
    // Accepts any special characters
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    
    return hasLower && hasUpper && hasNumber && hasMinLength;
}

// =========================
// LOGIN FUNCTION
// =========================
async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const emailAlert = document.getElementById("email-alert");
    const passwordAlert = document.getElementById("password-alert");
    const loginBtn = document.getElementById("valide");
    const originalBtnText = loginBtn.innerHTML;

    // Reset alerts and errors
    emailAlert.textContent = "";
    passwordAlert.textContent = "";
    document.getElementById("email").classList.remove("input-error");
    document.getElementById("password").classList.remove("input-error");

    // Simple client-side validation
    let hasError = false;
    
    if (!email) {
        emailAlert.textContent = "Veuillez entrer votre email";
        emailAlert.classList.add("show");
        document.getElementById("email").classList.add("input-error");
        hasError = true;
    } else if (!isValidEmail(email)) {
        emailAlert.textContent = "Veuillez entrer une adresse email valide";
        emailAlert.classList.add("show");
        document.getElementById("email").classList.add("input-error");
        hasError = true;
    }
    
    if (!password) {
        passwordAlert.textContent = "Veuillez entrer votre mot de passe";
        passwordAlert.classList.add("show");
        document.getElementById("password").classList.add("input-error");
        hasError = true;
    }

    if (hasError) {
        showNotification("Veuillez corriger les erreurs dans le formulaire.", true);
        return;
    }

    // Show loading state
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion en cours...';

    try {
        // Utiliser l'URL de l'API à partir du fichier de configuration
        const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3001/api/auth/login'
            : 'https://xybershield-api.vercel.app/api/auth/login';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include' // Important pour les sessions/cookies
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
        }

        // Sauvegarder le token et les données utilisateur
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Mettre à jour l'interface utilisateur immédiatement
            updateUserUI(data.user);
        }

        showNotification("Connexion réussie ! Redirection en cours...", false);
        
        // Rediriger vers la page d'accueil après un court délai
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1500);

    } catch (error) {
        console.error('Erreur de connexion:', error);
        showNotification(error.message || 'Erreur lors de la connexion. Veuillez réessayer plus tard.', true);
        
        // Réactiver le bouton de connexion en cas d'erreur
        loginBtn.disabled = false;
        loginBtn.innerHTML = originalBtnText;
    }
}

// =========================
// REGISTER FUNCTION
// =========================
async function register() {
    const name = document.getElementById("name").value.trim();
    const pseudo = document.getElementById("pseudo").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const registerBtn = document.querySelector('button[onclick="register()"]');
    const originalBtnText = registerBtn.innerHTML;
    
    // Réinitialiser les alertes
    document.querySelectorAll('.input-alert').forEach(alert => {
        alert.textContent = '';
    });
    
    // Validation
    let isValid = true;
    
    if (!name) {
        showNotification("Le nom est requis", true);
        isValid = false;
    }
    
    if (!pseudo) {
        showNotification("Le nom d'utilisateur est requis", true);
        isValid = false;
    } else if (pseudo.length < 3 || pseudo.length > 20) {
        showNotification("Le nom d'utilisateur doit contenir entre 3 et 20 caractères", true);
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(pseudo)) {
        showNotification("Le nom d'utilisateur ne peut contenir que des lettres, des chiffres et des tirets bas", true);
        isValid = false;
    }
    
    if (!email) {
        showNotification("L'email est requis", true);
        isValid = false;
    } else if (!isValidEmail(email)) {
        showNotification("Veuillez entrer une adresse email valide", true);
        isValid = false;
    }
    
    if (!password) {
        showNotification("Le mot de passe est requis", true);
        isValid = false;
    } else if (password.length < 8) {
        showNotification("Le mot de passe doit contenir au moins 8 caractères", true);
        isValid = false;
    } else if (!isValidPassword(password)) {
        showNotification("Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre", true);
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        showNotification("Les mots de passe ne correspondent pas", true);
        isValid = false;
    }
    
    if (!isValid) return;

    try {
        // Mettre à jour le bouton pour afficher l'état de chargement
        registerBtn.disabled = true;
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Création du compte...';

        // Utiliser l'URL de l'API à partir du fichier de configuration
        const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3001/api/auth/register'
            : 'https://xybershield-api.vercel.app/api/auth/register';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, username: pseudo, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Échec de l'inscription");
        }

        // Sauvegarder le token dans le localStorage
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        
        // Afficher un message de succès
        showNotification("Inscription réussie ! Un email de bienvenue a été envoyé à votre adresse email.");
        
        // Vider le formulaire
        document.getElementById("name").value = "";
        document.getElementById("pseudo").value = "";
        document.getElementById("reg-email").value = "";
        document.getElementById("reg-password").value = "";
        document.getElementById("confirm-password").value = "";
        
        // Revenir au formulaire de connexion après un court délai
        setTimeout(() => {
            switchForm();
        }, 2000);
        
    } catch (error) {
        console.error("Erreur d'inscription:", error);
        showNotification(error.message || "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.", true);
    } finally {
        registerBtn.disabled = false;
        registerBtn.innerHTML = originalBtnText;
    }
}

// =========================
// UPDATE USER UI
// =========================
function updateUserUI(user) {
    if (!user) return;
    
    // Mettre à jour l'avatar et le nom dans la barre de navigation
    const navAvatar = document.getElementById('navUserAvatar');
    const navUserName = document.getElementById('navUserName');
    const dropdownAvatar = document.getElementById('dropdownUserAvatar');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    const dropdownFullName = document.getElementById('dropdownFullName');
    const dropdownUsername = document.getElementById('dropdownUsername');
    const dropdownMemberSince = document.getElementById('dropdownMemberSince');
    
    // Mettre à jour l'avatar avec la première lettre du nom
    const firstLetter = (user.name || user.pseudo || 'U').charAt(0).toUpperCase();
    
    if (navAvatar) navAvatar.textContent = firstLetter;
    if (dropdownAvatar) dropdownAvatar.textContent = firstLetter;
    
    // Mettre à jour les informations utilisateur
    const displayName = user.name || user.pseudo || 'Utilisateur';
    
    if (navUserName) navUserName.textContent = displayName;
    if (dropdownUserName) dropdownUserName.textContent = displayName;
    if (dropdownUserEmail) dropdownUserEmail.textContent = user.email || 'Non spécifié';
    if (dropdownFullName) dropdownFullName.textContent = user.name || 'Non spécifié';
    if (dropdownUsername) dropdownUsername.textContent = user.pseudo || 'Non spécifié';
    
    // Mettre à jour la date de création du compte
    if (user.createdAt && dropdownMemberSince) {
        const date = new Date(user.createdAt);
        dropdownMemberSince.textContent = date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// =========================
// PASSWORD VISIBILITY TOGGLE
// =========================
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const eyeIcon = field.nextElementSibling.querySelector('i');
    
    if (field.type === "password") {
        field.type = "text";
        eyeIcon.className = 'fa fa-eye-slash';
    } else {
        field.type = "password";
        eyeIcon.className = 'fa fa-eye';
    }
}

// =========================
// FORGOT PASSWORD
// =========================
async function showForgotPassword() {
    const { value: email } = await Swal.fire({
        title: 'Reset Password',
        html: 'Enter your email address and we ll send you a link to reset your password.',
        input: 'email',
        inputPlaceholder: 'Your email address',
        inputAttributes: {
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Send Reset Link',
        showLoaderOnConfirm: true,
        preConfirm: async (email) => {
            try {
                const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to send reset link');
                }

                return response.json();
            } catch (error) {
                Swal.showValidationMessage(`Request failed: ${error.message}`);
                return false;
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    });

    if (email) {
        Swal.fire({
            icon: 'success',
            title: 'Check your email',
            text: 'If an account exists with this email, you will receive a password reset link shortly.',
            confirmButtonColor: '#00cc44'
        });
    }
}

// =========================
// SOCIAL LOGIN
// =========================
function loginWithGoogle() {
    window.location.href = 'http://localhost:3001/api/auth/google';
}

function loginWithGithub() {
    window.location.href = 'http://localhost:3001/api/auth/github';
}

// =========================
// INITIALIZATION
// =========================
document.addEventListener('DOMContentLoaded', () => {
    console.log('login.js loaded successfully');
    
    // Add event listeners to login and register forms
    const loginForm = document.querySelector('#login-form form');
    const registerForm = document.querySelector('#register-form form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            login();
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            register();
        });
    }
    
    // Add event listeners for password visibility toggles
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
    
    // Check for social auth callback on page load
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    if (token) {
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Redirect to dashboard or home page
        window.location.href = '/dashboard.html';
    } else if (error) {
        showNotification(`Authentication failed: ${error}`, true);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// =========================
// FORM SWITCHING
// =========================
let isLogin = true;

function switchForm() {
    const container = document.getElementById("container");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const btn = document.getElementById("register-btn");
    const leftPanel = document.querySelector(".left-panel");

    if (isLogin) {
        container.classList.add("switch");
        loginForm.classList.remove("show");
        loginForm.classList.add("hide");
        registerForm.classList.remove("hide");
        registerForm.classList.add("show");
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        
        // Ajout d'une animation pour le changement d'image
        leftPanel.style.opacity = "0";
        setTimeout(() => {
            container.classList.add("switch");
            leftPanel.style.opacity = "1";
        }, 300);
    } else {
        registerForm.classList.remove("show");
        registerForm.classList.add("hide");
        loginForm.classList.remove("hide");
        loginForm.classList.add("show");
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Register';
        
        // Animation pour le retour à l'image d'origine
        leftPanel.style.opacity = "0";
        setTimeout(() => {
            container.classList.remove("switch");
            leftPanel.style.opacity = "1";
        }, 300);
    }
    isLogin = !isLogin;
}

function showLogin() {
    const container = document.getElementById("container");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const btn = document.getElementById("register-btn");

    const leftPanel = document.querySelector(".left-panel");

    // Animation pour le retour à l'image d'origine
    leftPanel.style.opacity = "0";
    setTimeout(() => {
        container.classList.remove("switch");
        leftPanel.style.opacity = "1";
        
        registerForm.classList.remove("show");
        registerForm.classList.add("hide");
        loginForm.classList.remove("hide");
        loginForm.classList.add("show");
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Register';
       
        isLogin = true;
    }, 300);

}