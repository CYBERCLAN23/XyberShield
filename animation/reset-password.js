// =========================
// NOTIFICATION HANDLING
// =========================
function showNotification(message, isError = false) {
    const notif = document.getElementById("welcome-notification");
    notif.textContent = message;
    notif.className = "notification " + (isError ? "error" : "success");
    notif.style.display = "block";
    setTimeout(() => {
        notif.style.display = "none";
    }, 6000);
}

// =========================
// PASSWORD VALIDATION
// =========================
function isValidPassword(password) {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 digit
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
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
// PASSWORD RESET FUNCTION
// =========================
async function resetPassword() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    
    const newPassword = document.getElementById("newPassword").value;
    const confirmNewPassword = document.getElementById("confirmNewPassword").value;
    const resetBtn = document.getElementById("resetPasswordBtn");
    const originalBtnText = resetBtn.innerHTML;
    
    // Réinitialiser les alertes
    document.querySelectorAll('.input-alert').forEach(alert => {
        alert.textContent = '';
    });
    
    // Validation
    if (!token || !userId) {
        showNotification("Lien de réinitialisation invalide ou expiré. Veuillez en demander un nouveau.", true);
        return;
    }
    
    if (!newPassword) {
        document.getElementById("new-password-alert").textContent = "Le nouveau mot de passe est requis";
        document.getElementById("newPassword").classList.add("input-error");
        return;
    } else if (newPassword.length < 8) {
        document.getElementById("new-password-alert").textContent = "Le mot de passe doit contenir au moins 8 caractères";
        document.getElementById("newPassword").classList.add("input-error");
        return;
    } else if (!isValidPassword(newPassword)) {
        document.getElementById("new-password-alert").textContent = "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre";
        document.getElementById("newPassword").classList.add("input-error");
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        document.getElementById("confirm-password-alert").textContent = "Les mots de passe ne correspondent pas";
        document.getElementById("confirmNewPassword").classList.add("input-error");
        return;
    }

    try {
        // Mettre à jour le bouton pour afficher l'état de chargement
        resetBtn.disabled = true;
        resetBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Réinitialisation...';
        
        // Utiliser l'URL de l'API à partir de la configuration
        const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3001/api/auth/reset-password'
            : 'https://xybershield-api.vercel.app/api/auth/reset-password';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token,
                userId,
                newPassword
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Échec de la réinitialisation du mot de passe');
        }

        showNotification("Votre mot de passe a été réinitialisé avec succès. Redirection vers la page de connexion...", false);
        
        // Rediriger vers la page de connexion après un court délai
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
        
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        showNotification(error.message || 'Échec de la réinitialisation du mot de passe. Veuillez réessayer.', true);
    } finally {
        resetBtn.disabled = false;
        resetBtn.innerHTML = originalBtnText;
    }
}

// =========================
// INITIALIZE PAGE
// =========================
document.addEventListener('DOMContentLoaded', () => {
    // Check for success message from login redirect
    const urlParams = new URLSearchParams(window.location.search);
    const passwordReset = urlParams.get('passwordReset');
    
    if (passwordReset === 'success') {
        showNotification("Your password has been reset successfully! You can now log in with your new password.");
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Add event listeners for input validation
    document.getElementById('newPassword').addEventListener('input', function() {
        this.classList.remove('input-error');
        document.getElementById('new-password-alert').textContent = '';
    });
    
    document.getElementById('confirmNewPassword').addEventListener('input', function() {
        this.classList.remove('input-error');
        document.getElementById('confirm-password-alert').textContent = '';
    });
    
    // Allow form submission with Enter key
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            resetPassword();
        }
    });
});
