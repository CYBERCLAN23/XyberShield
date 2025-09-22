// ======== TOGGLE PASSWORD VISIBILITY ========
function togglePassword() {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.getElementById("eye-icon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    }
}

// ======== SWITCH TO REGISTER FORM ========
function switchForm() {
    const container = document.getElementById("container");
    container.classList.add("switch");
    setTimeout(() => {
        document.getElementById("register-fields").style.display = "block";
        document.querySelector(".login-wrapper").style.display = "none";
    }, 400); // wait for animation
}

// ======== SWITCH BACK TO LOGIN FORM ========
function showLogin() {
    const container = document.getElementById("container");
    container.classList.remove("switch");
    setTimeout(() => {
        document.getElementById("register-fields").style.display = "none";
        document.querySelector(".login-wrapper").style.display = "flex";
    }, 400); // wait for animation
}

// ======== LOGIN FUNCTION (DUMMY VALIDATION) ========
function login() {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let valid = true;

    if (email.value.trim() === "") {
        showAlert("email-alert", "Email is required");
        valid = false;
    } else {
        hideAlert("email-alert");
    }

    if (password.value.trim() === "") {
        showAlert("password-alert", "Password is required");
        valid = false;
    } else {
        hideAlert("password-alert");
    }

    if (valid) {
        showNotification("Login successful!", "success");
    }
}

// ======== REGISTER FUNCTION (DUMMY VALIDATION) ========
function register() {
    const name = document.getElementById("name");
    const pseudo = document.getElementById("pseudo");
    const email = document.getElementById("reg-email");
    const password = document.getElementById("reg-password");
    const confirmPassword = document.getElementById("confirm-password");

    let valid = true;

    if (name.value.trim() === "" || pseudo.value.trim() === "" || email.value.trim() === "" || password.value.trim() === "" || confirmPassword.value.trim() === "") {
        showNotification("All fields are required", "error");
        valid = false;
    } else if (password.value !== confirmPassword.value) {
        showNotification("Passwords do not match", "error");
        valid = false;
    }

    if (valid) {
        showNotification("Registration successful!", "success");
    }
}

// ======== ALERT MESSAGE HANDLING ========
function showAlert(id, message) {
    const alert = document.getElementById(id);
    alert.textContent = message;
    alert.classList.add("show");
}

function hideAlert(id) {
    const alert = document.getElementById(id);
    alert.textContent = "";
    alert.classList.remove("show");
}

// ======== GLOBAL NOTIFICATION ========
function showNotification(message, type) {
    const notification = document.getElementById("welcome-notification");
    notification.textContent = message;
    notification.className = "notification " + type;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}
