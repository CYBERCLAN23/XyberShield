  // =========================
  let isLogin = true
        // NOTIFICATION HANDLING
        // =========================
        function showNotification(message, isError = false) {
            const notif = document.getElementById("welcome-notification");
            notif.textContent = message;
            notif.classList.toggle("error", isError);
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
        // REGISTER LOGIC
        // =========================
        function register() {
            const name = document.getElementById("name").value;
            const pseudo = document.getElementById("pseudo").value;
            const email = document.getElementById("reg-email").value;
            const password = document.getElementById("reg-password").value;
            const confirmPassword = document.getElementById("confirm-password").value;
            
            if (!name || !pseudo || !email || !password || !confirmPassword) {
                showNotification("Veuillez remplir tous les champs ⚠️", "error", "notification");
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification("Les mots de passe ne correspondent pas ⚠️", "error", "notification");
                return;
            }
            
            if (!isValidPassword(password)) {
                showNotification("Mot de passe invalide. Doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.", "error", "notification");
                return;
            }
            
            showNotification("Enregistrement réussi 🎉", "success", "notification");
        }

        // =========================
        // PASSWORD VISIBILITY TOGGLE
        // =========================
        function togglePassword() {
            const eyeIcon = document.getElementById("eye-icon");
            const passwordInput = document.getElementById("password");
            if(passwordInput.type === "password"){
                passwordInput.type = "text";
                eyeIcon.className = 'fa fa-eye-slash';
            } else {
                passwordInput.type = "password";
                eyeIcon.className = 'fa fa-eye';
            }
        }

        // =========================
        // FORM SWITCHING
        // =========================

//Fonction toggleForm()
function toggleForm(){
    const container = document.getElementById("container");
    const loginform = document.getElementById("login-form");
    const registerform = document.getElementById("register-form");
    const switchbtn = document.getElementById("switch-btn");
    if (isLogin){
        container.classList.add("switch");
        loginform.classList.replace("show", "hide");
        registerform.classList.replace("hide", "show");
        switchbtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
    else{
        conatainer.classList.remove("switch");
        registerform.classList.replace("show", "hide");
        loginform.classList.replace("hide", "show");
        switchbtn.innerHTML = '<i class="fas fa-user-plus"></i> Register';
    }
    isLogin = !isLogin;
}