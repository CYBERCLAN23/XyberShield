// Gestion du menu utilisateur dynamique pour toutes les pages
class UserMenuManager {
    constructor() {
        this.loginButton = document.getElementById('loginButton');
        this.userDropdown = document.getElementById('userDropdown');
        this.init();
    }

    init() {
        // Vérifier l'état de connexion au chargement de la page
        this.checkAuthStatus();
        
        // Écouter les changements dans localStorage (pour synchronisation entre onglets)
        window.addEventListener('storage', () => {
            this.checkAuthStatus();
        });

        // Vérifier périodiquement l'état de connexion
        setInterval(() => {
            this.checkAuthStatus();
        }, 5000);
    }

    checkAuthStatus() {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                this.showUserMenu(user);
            } catch (e) {
                console.error('Erreur parsing user data:', e);
                this.showLoginButton();
            }
        } else {
            this.showLoginButton();
        }
    }

    showLoginButton() {
        if (this.loginButton) this.loginButton.style.display = 'block';
        if (this.userDropdown) this.userDropdown.style.display = 'none';
    }

    showUserMenu(user) {
        if (this.loginButton) this.loginButton.style.display = 'none';
        if (this.userDropdown) this.userDropdown.style.display = 'block';
        
        // Mettre à jour les informations utilisateur
        this.updateUserInfo(user);
    }

    updateUserInfo(user) {
        // Avatar avec première lettre du nom
        const firstLetter = (user.name || user.pseudo || 'U').charAt(0).toUpperCase();
        
        // Éléments de navigation
        const navUserAvatar = document.getElementById('navUserAvatar');
        const navUserName = document.getElementById('navUserName');
        
        if (navUserAvatar) {
            navUserAvatar.innerHTML = firstLetter;
            navUserAvatar.style.background = 'linear-gradient(135deg, #00ff66, #00cc44)';
            navUserAvatar.style.color = '#000';
            navUserAvatar.style.fontWeight = 'bold';
            navUserAvatar.style.borderRadius = '50%';
            navUserAvatar.style.width = '35px';
            navUserAvatar.style.height = '35px';
            navUserAvatar.style.display = 'flex';
            navUserAvatar.style.alignItems = 'center';
            navUserAvatar.style.justifyContent = 'center';
        }
        
        if (navUserName) {
            navUserName.textContent = user.name || user.pseudo || 'Utilisateur';
        }

        // Éléments du dropdown
        const dropdownUserAvatar = document.getElementById('dropdownUserAvatar');
        const dropdownUserName = document.getElementById('dropdownUserName');
        const dropdownUserEmail = document.getElementById('dropdownUserEmail');
        const dropdownFullName = document.getElementById('dropdownFullName');
        const dropdownUsername = document.getElementById('dropdownUsername');
        const dropdownMemberSince = document.getElementById('dropdownMemberSince');

        if (dropdownUserAvatar) {
            dropdownUserAvatar.innerHTML = firstLetter;
            dropdownUserAvatar.style.background = 'linear-gradient(135deg, #00ff66, #00cc44)';
            dropdownUserAvatar.style.color = '#000';
            dropdownUserAvatar.style.fontWeight = 'bold';
            dropdownUserAvatar.style.borderRadius = '50%';
            dropdownUserAvatar.style.display = 'flex';
            dropdownUserAvatar.style.alignItems = 'center';
            dropdownUserAvatar.style.justifyContent = 'center';
        }

        if (dropdownUserName) dropdownUserName.textContent = user.name || user.pseudo || 'Utilisateur';
        if (dropdownUserEmail) dropdownUserEmail.textContent = user.email || 'Non spécifié';
        if (dropdownFullName) dropdownFullName.textContent = user.name || 'Non spécifié';
        if (dropdownUsername) dropdownUsername.textContent = user.pseudo || 'Non spécifié';
        
        if (dropdownMemberSince && user.created_at) {
            const date = new Date(user.created_at);
            dropdownMemberSince.textContent = date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } else if (dropdownMemberSince) {
            dropdownMemberSince.textContent = 'Récemment';
        }
    }
}

// Fonction de déconnexion globale
function logout() {
    // Effacer les données de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Afficher une notification
    showNotification('Déconnexion réussie !', 'success');
    
    // Mettre à jour l'interface
    if (window.userMenuManager) {
        window.userMenuManager.checkAuthStatus();
    }
    
    // Rediriger vers la page de login après un délai
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Fonction de notification simple
function showNotification(message, type = 'success') {
    // Créer l'élément de notification s'il n'existe pas
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            transform: translateX(400px);
            transition: all 0.3s ease;
            max-width: 350px;
        `;
        document.body.appendChild(notification);
    }
    
    // Définir le style selon le type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #00ff66, #00cc44)';
        notification.style.color = '#000';
    } else {
        notification.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';
        notification.style.color = '#fff';
    }
    
    // Afficher le message
    notification.textContent = message;
    notification.style.transform = 'translateX(0)';
    
    // Masquer après 3 secondes
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
    }, 3000);
}

// Initialiser le gestionnaire de menu utilisateur
document.addEventListener('DOMContentLoaded', () => {
    window.userMenuManager = new UserMenuManager();
});

// Fonction pour forcer la mise à jour du menu (utile après login)
function updateUserMenu() {
    if (window.userMenuManager) {
        window.userMenuManager.checkAuthStatus();
    }
}
