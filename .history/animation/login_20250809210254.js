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

        //////////////////////////////////////////////
                document.addEventListener('DOMContentLoaded', function() {
            // Elements
            const loginWrapper = document.querySelector('.login-wrapper');
            const leftPanel = document.querySelector('.left-panel');
            const rightPanel = document.querySelector('.right-panel');
            const registerToggle = document.getElementById('register-btn');
            const loginBtn = document.getElementById('valide');
            const loginPasswordToggle = document.getElementById('see');
            const notification = document.getElementById('notification');
            
            // Register form template
            const registerFormHTML = `
                <div class="register-form" id="register-fields">
                    <div class="head">REGISTER</div>
                    
                    <div class="name input-group">
                        <i class="fas fa-user input-icon"></i>
                        <input type="text" id="fullname" placeholder="Full Name" required>
                        <div class="input-alert">Full name is required</div>
                    </div>
                      <div class="name input-group">
                        <i class="fas fa-user input-icon"></i>
                        <input type="text" id="fullname" placeholder="Pseudonyme" required>
                        <div class="input-alert">Full name is required</div>
                    </div>
                    
                    <div class="email input-group">
                        <i class="fas fa-at input-icon"></i>
                        <input type="email" id="email" placeholder="Email" required>
                        <div class="input-alert">Valid email required</div>
                    </div>
                    
                    <div class="password input-group">
                          <span class="input-icon">
                         <lord-icon
                            src="https://cdn.lordicon.com/lbjtvqiv.json"
                           trigger="loop-on-hover"
                            stroke="bold"
                            state="loop-roll"
                            colors="primary:#fff,secondary:#00ff88"
                            style="width:25px;height:25px">
                        </lord-icon>
                    </span>
                        <input type="password" id="reg-password" placeholder="Password" required>
                         <span class="see" id="see" onclick="togglePassword()"><i id="eye-icon" class="fa fa-eye"></i></span>
                     
                    </div>
                    
                    <div class="input-group">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" id="confirm-password" placeholder="Confirm Password" required>
                        <div class="input-alert">Passwords must match</div>
                    </div>
                    
                    <button class="btn" id="register-btn">
                        <i class="fas fa-user-plus"></i> REGISTER
                    </button>
                    
                    <button class="toggle-btn" id="back-to-login">
                        <i class="fas fa-arrow-left"></i> Back to Login
                    </button>
                </div>
            `;
            
            // Toggle password visibility
            function togglePasswordVisibility(field, toggleIcon) {
                if (field.type === "password") {
                    field.type = "text";
                    toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    field.type = "password";
                    toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            }
            
            // Show notification
            function showNotification(message, type) {
                notification.textContent = message;
                notification.className = `notification ${type}`;
                notification.style.display = 'block';
                
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 3000);
            }
            
            // Switch to register mode
            function switchToRegister() {
                // Add register class to container
                document.querySelector('.container').classList.add('register');
                
                // Add animation classes
                loginWrapper.classList.add('switching');
                leftPanel.classList.add('slide-out');
                rightPanel.classList.add('slide-in');
                
                setTimeout(() => {
                    // Swap panel contents
                    leftPanel.querySelector('.panel-content').innerHTML = registerFormHTML;
                    rightPanel.querySelector('.panel-content').innerHTML = `
                        <div>
                            <h1>CYBER SECURE</h1>
                            <p class="slogant">Join Our Security Network</p>
                            <p class="welcome">
                                Create an account to access our advanced security features. 
                                Get real-time threat detection and comprehensive digital protection.
                            </p>
                            <button class="toggle-btn" id="login-toggle">
                                <i class="fas fa-sign-in-alt"></i> Login to Account
                            </button>
                        </div>
                    `;
                    
                    // Remove animation classes
                    loginWrapper.classList.remove('switching');
                    leftPanel.classList.remove('slide-out');
                    rightPanel.classList.remove('slide-in');
                    
                    // Add event listeners to new elements
                    document.getElementById('reg-password-toggle').addEventListener('click', function() {
                        const passwordField = document.getElementById('reg-password');
                        togglePasswordVisibility(passwordField, this);
                    });
                    
                    document.getElementById('register-btn').addEventListener('click', handleRegister);
                    document.getElementById('back-to-login').addEventListener('click', switchToLogin);
                    document.getElementById('login-toggle').addEventListener('click', switchToLogin);
                }, 800);
            }
            
            // Switch to login mode
            function switchToLogin() {
                // Remove register class from container
                document.querySelector('.container').classList.remove('register');
                
                // Add animation classes
                loginWrapper.classList.add('switching');
                leftPanel.classList.add('slide-in-reverse');
                rightPanel.classList.add('slide-out-reverse');
                
                setTimeout(() => {
                    // Restore original content
                    leftPanel.querySelector('.panel-content').innerHTML = `
                        <h1>CYBER SECURE</h1>
                        <p class="slogant">Protecting Your Digital Universe</p>
                        <p class="welcome">
                            Secure your digital assets with our advanced protection system. 
                            Trusted by millions worldwide to safeguard their online presence 
                            against emerging threats.
                        </p>
                        <button class="toggle-btn" id="register-toggle">
                            <i class="fas fa-user-plus"></i> Create Account
                        </button>
                    `;
                    
                    rightPanel.querySelector('.panel-content').innerHTML = `
                        <div class="login-form">
                            <div class="head">LOGIN</div>
                            
                            <div class="input-group">
                                <i class="fas fa-user input-icon"></i>
                                <input type="text" id="username" placeholder="Username" required>
                                <div class="input-alert">Username is required</div>
                            </div>
                            
                            <div class="input-group">
                                <i class="fas fa-lock input-icon"></i>
                                <input type="password" id="password" placeholder="Password" required>
                                <i class="fas fa-eye password-toggle" id="login-password-toggle"></i>
                                <div class="input-alert">Password must be at least 8 characters</div>
                            </div>
                            
                            <button class="btn" id="login-btn">
                                <i class="fas fa-sign-in-alt"></i> LOGIN
                            </button>
                        </div>
                    `;
                    
                    // Remove animation classes
                    loginWrapper.classList.remove('switching');
                    leftPanel.classList.remove('slide-in-reverse');
                    rightPanel.classList.remove('slide-out-reverse');
                    
                    // Reattach event listeners
                    document.getElementById('register-toggle').addEventListener('click', switchToRegister);
                    document.getElementById('login-btn').addEventListener('click', handleLogin);
                    document.getElementById('login-password-toggle').addEventListener('click', function() {
                        const passwordField = document.getElementById('password');
                        togglePasswordVisibility(passwordField, this);
                    });
                }, 800);
            }
            
            // Handle login
            function handleLogin() {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                if (!username) {
                    showNotification('Username is required', 'error');
                    return;
                }
                
                if (password.length < 8) {
                    showNotification('Password must be at least 8 characters', 'error');
                    return;
                }
                
                showNotification('Login successful! Redirecting...', 'success');
                
                // Simulate login process
                setTimeout(() => {
                    showNotification('Welcome back!', 'success');
                }, 1500);
            }
            
            // Handle registration
            function handleRegister() {
                const fullname = document.getElementById('fullname').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('reg-password').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                
                if (!fullname) {
                    showNotification('Full name is required', 'error');
                    return;
                }
                
                if (!email.includes('@')) {
                    showNotification('Please enter a valid email', 'error');
                    return;
                }
                
                if (password.length < 8) {
                    showNotification('Password must be at least 8 characters', 'error');
                    return;
                }
                
                if (password !== confirmPassword) {
                    showNotification('Passwords do not match', 'error');
                    return;
                }
                
                showNotification('Account created successfully!', 'success');
                
                // Simulate registration process
                setTimeout(() => {
                    switchToLogin();
                }, 2000);
            }
            
            // Initial event listeners
            registerToggle.addEventListener('click', switchToRegister);
            loginBtn.addEventListener('click', handleLogin);
            loginPasswordToggle.addEventListener('click', function() {
                const passwordField = document.getElementById('password');
                togglePasswordVisibility(passwordField, this);
            });
        });