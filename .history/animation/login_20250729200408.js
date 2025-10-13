function showNotification(message, type, targetId) {
      const notif = document.getElementById(targetId);
      notif.textContent = message;
      notif.className = `notification ${type}`;
      notif.style.display = "block";
      setTimeout(() => {
        notif.style.display = "none";
      }, 4000);
    }

    function isValidEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }
    function isValidPassword(password) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return regex.test(password);
    }
    function login() {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      // Hide previous alerts
      document.getElementById("email-alert").classList.remove("show");
      document.getElementById("password-alert").classList.remove("show");
      document.getElementById("email-alert").textContent = "";
      document.getElementById("password-alert").textContent = "";
      let hasError = false;
      if (!email) {
        document.getElementById("email-alert").textContent = "Veuillez remplir l'email 🔴";
        document.getElementById("email-alert").classList.add("show");
        hasError = true;
      } else if (!isValidEmail(email)) {
        document.getElementById("email-alert").textContent = "Email invalide ❌";
        document.getElementById("email-alert").classList.add("show");
        hasError = true;
      }
      if (!password) {
        document.getElementById("password-alert").textContent = "Veuillez remplir le mot de passe 🔴";
        document.getElementById("password-alert").classList.add("show");
        hasError = true;
      } else if (!isValidPassword(password)) {
        document.getElementById("password-alert").textContent = "Password invalide. Il doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre. ❌";
        document.getElementById("password-alert").classList.add("show");
        hasError = true;
      }
      if (hasError) {
        showNotification("Erreur dans le formulaire. Corrigez les champs en rouge.", "error", "notification");
      } else {
        showNotification("Connexion réussie ✅", "success", "notification");
        // Show welcome notification at body top
        const welcome = document.getElementById("welcome-notification");
        welcome.textContent = "Bienvenue sur XyberShield! Vous êtes connecté.";
        welcome.className = "notification success";
        welcome.style.display = "block";
        setTimeout(() => {
          welcome.style.display = "none";
        }, 4000);
      }
    }

    function register() {
      const username = document.getElementById("username").value;
      if (username.length > 0) {
        showNotification("Enregistrement réussi 🎉", "success", "notification");
      } else {
        showNotification("Veuillez saisir un nom d'utilisateur ⚠️", "error", "notification");
      }
    }