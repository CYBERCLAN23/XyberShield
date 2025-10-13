// =========================
// NOTIFICATION HANDLING
// =========================
function showNotification(message, type, targetId) {
    const notif = document.getElementById(targetId);
    notif.textContent = message;
    notif.className = `notification ${type}`;
    notif.style.display = "block";
    setTimeout(() => {
        notif.style.display = "none";
    }, 4000);
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
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
}

// =========================
// LOGIN LOGIC
// =========================
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // Hide previous alerts
    document.getElementById("email-alert").classList.remove("show");
    document.getElementById("password-alert").classList.remove("show");
    document.getElementById("email-alert").textContent = "";
    document.getElementById("password-alert").textContent = "";
    let hasError = false;

    // Email validation
    if (!email) {
        document.getElementById("email-alert").textContent = "Veuillez remplir l'email 🔴";
        document.getElementById("email-alert").classList.add("show");
        document.getElementById("email").classList.add("input-error");
        hasError = true;
    } else if (!isValidEmail(email)) {
        document.getElementById("email-alert").textContent = "Email invalide ❌";
        document.getElementById("email-alert").classList.add("show");
        document.getElementById("email").classList.add("input-error");
        hasError = true;
    } else {
        document.getElementById("email").classList.remove("input-error");
    }

    // Password validation
    if (!password) {
        document.getElementById("password-alert").textContent = "Veuillez remplir le mot de passe 🔴";
        document.getElementById("password-alert").classList.add("show");
        document.getElementById("password").classList.add("input-error");
        hasError = true;
    } else {
        let pwdErrors = [];
        if (password.length < 8) pwdErrors.push("Au moins 8 caractères");
        if (!/[A-Z]/.test(password)) pwdErrors.push("Une majuscule");
        if (!/[a-z]/.test(password)) pwdErrors.push("Une minuscule");
        if (!/\d/.test(password)) pwdErrors.push("Un chiffre");
        if (pwdErrors.length > 0) {
            document.getElementById("password-alert").textContent = "Mot de passe invalide: " + pwdErrors.join(", ") + " ❌";
            document.getElementById("password-alert").classList.add("show");
            document.getElementById("password").classList.add("input-error");
            hasError = true;
        } else {
            document.getElementById("password").classList.remove("input-error");
        }
    }

    // Show notification
    if (hasError) {
        showNotification("Erreur dans le formulaire. Corrigez les champs en rouge.", "error", "notification");
    } else {
        showNotification("Connexion réussie ✅", "success", "notification");
        // Show welcome notification 
        const welcome = document.getElementById("welcome-notification");
        welcome.textContent = "Bienvenue sur XyberShield! Vous êtes connecté.";
        welcome.className = "notification success";
        welcome.style.display = "block";
        setTimeout(() => {
            welcome.style.display = "none";
        }, 4000);
    }
}

// =========================
// REGISTER LOGIC (SIMPLE DEMO)
// =========================
function register() {
    const username = document.getElementById("username").value;
    if (username.length > 0) {
        showNotification("Enregistrement réussi 🎉", "success", "notification");
    } else {
        showNotification("Veuillez saisir un nom d'utilisateur ⚠️", "error", "notification");
    }
}

// =========================
// PASSWORD VISIBILITY TOGGLE
// =========================
function togglePassword() { // =========================
// NOTIFICATION HANDLING
// =========================
function showNotification(message, type, targetId) {
    const notif = document.getElementById(targetId);
    notif.textContent = message;
    notif.className = `notification ${type}`;
    notif.style.display = "block";
    setTimeout(() => {
        notif.style.display = "none";
    }, 4000);
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
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
}

// =========================
// LOGIN LOGIC
// =========================
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    // Hide previous alerts
    document.getElementById("email-alert").classList.remove("show");
    document.getElementById("password-alert").classList.remove("show");
    document.getElementById("email-alert").textContent = "";
    document.getElementById("password-alert").textContent = "";
    let hasError = false;

    // Email validation
    if (!email) {
        document.getElementById("email-alert").textContent = "Veuillez remplir l'email 🔴";
        document.getElementById("email-alert").classList.add("show");
        document.getElementById("email").classList.add("input-error");
        hasError = true;
    } else if (!isValidEmail(email)) {
        document.getElementById("email-alert").textContent = "Email invalide ❌";
        document.getElementById("email-alert").classList.add("show");
        document.getElementById("email").classList.add("input-error");
        hasError = true;
    } else {
        document.getElementById("email").classList.remove("input-error");
    }

    // Password validation
    if (!password) {
        document.getElementById("password-alert").textContent = "Veuillez remplir le mot de passe 🔴";
        document.getElementById("password-alert").classList.add("show");
        document.getElementById("password").classList.add("input-error");
        hasError = true;
    } else {
        let pwdErrors = [];
        if (password.length < 8) pwdErrors.push("Au moins 8 caractères");
        if (!/[A-Z]/.test(password)) pwdErrors.push("Une majuscule");
        if (!/[a-z]/.test(password)) pwdErrors.push("Une minuscule");
        if (!/\d/.test(password)) pwdErrors.push("Un chiffre");
        if (pwdErrors.length > 0) {
            document.getElementById("password-alert").textContent = "Mot de passe invalide: " + pwdErrors.join(", ") + " ❌";
            document.getElementById("password-alert").classList.add("show");
            document.getElementById("password").classList.add("input-error");
            hasError = true;
        } else {
            document.getElementById("password").classList.remove("input-error");
        }
    }

    // Show notification
    if (hasError) {
        showNotification("Erreur dans le formulaire. Corrigez les champs en rouge.", "error", "notification");
    } else {
        showNotification("Connexion réussie ✅", "success", "notification");
        // Show welcome notification 
        const welcome = document.getElementById("welcome-notification");
        welcome.textContent = "Bienvenue sur XyberShield! Vous êtes connecté.";
        welcome.className = "notification success";
        welcome.style.display = "block";
        setTimeout(() => {
            welcome.style.display = "none";
        }, 4000);
    }
}

// =========================
// REGISTER LOGIC (SIMPLE DEMO)
// =========================
function register() {
    const username = document.getElementById("username").value;
    if (username.length > 0) {
        showNotification("Enregistrement réussi 🎉", "success", "notification");
    } else {
        showNotification("Veuillez saisir un nom d'utilisateur ⚠️", "error", "notification");
    }
}

// =========================
// PASSWORD VISIBILITY TOGGLE
// =========================
function togglePassword() { 
    const eyeIcon = document.getElementById("eye-icon");
    const passwordinput = document.getElementById("password");
    if(passwordinput.type === "password"){
        passwordinput.type = "text";
        eyeIcon.className = 'fa fa-eye-slash';
    } else {
        passwordinput.type = "password";
        eyeIcon.className = 'fa fa-eye';
    }
}
    const eyeIcon = document.getElementById("eye-icon");
    const passwordinput = document.getElementById("password");
    if(passwordinput.type === "password"){
        passwordinput.type = "text";
        eyeIcon.className = 'fa fa-eye-slash';
    } else {
        passwordinput.type = "password";
        eyeIcon.className = 'fa fa-eye';
    }
}