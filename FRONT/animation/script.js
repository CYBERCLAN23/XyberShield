/* =========================-----------------
   GLOBAL VARIABLES & RESET
   ========================= */

// Get the canvas element and its drawing context
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

// Set canvas size to fill the window
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// Letters for Matrix effect (currently empty string)
const letters = '';
const chars = letters.split("");
const fontSize = 12; // Size of each character
const columns = canvas.width / fontSize; // Number of columns
const drops = Array(Math.floor(columns)).fill(1); // Track drop position for each column

// Draw the Matrix animation on the canvas
function drawMatrix() {
    // Fade effect for trailing letters
    ctx.fillStyle = "rgba(0, 8, 2, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Set text color and font
    ctx.fillStyle = "rgba(16, 201, 87, 0.67)";
    ctx.font = fontSize +  "px monospace";

    // Draw each column's character
    for (let i = 0; i < drops.length; i++) {
        // Pick a random character from letters
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly when it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Animate Matrix effect every 35ms
setInterval(drawMatrix, 35);

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});

// ---------------------
// SMOOTH SCROLL (already included in index.html)
// ---------------------

// ---------------------
// MULTISTEP FORM LOGIC
// ---------------------

// Get all step elements and navigation buttons
const steps = document.querySelectorAll(".step");
const nextBtns = document.querySelectorAll(".next-step");
const prevBtns = document.querySelectorAll(".prev-step");
const progressBar = document.getElementById("progressBar");
const progressSteps = document.querySelectorAll(".progress-steps li");
const preview = document.getElementById("preview");
const summary = document.getElementById("summary");

let currentStep = 0; // Track current step index

// Update progress bar and step indicators
function updateProgress() {
    const progress = (currentStep / (steps.length - 1)) * 100;
    progressBar.style.width = progress + "%";
    progressSteps.forEach((li, index) => {
        li.classList.toggle("active", index <= currentStep);
    });
}

// Show the specified step and update progress
function showStep(index) {
    steps.forEach((step, i) => {
        step.classList.remove("active", "prev");
        if (i === index) step.classList.add("active");
        else if (i < index) step.classList.add("prev");
    });
    updateProgress();
}

// Handle next step button click
nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            if (currentStep === 3) fillSummary(); // Fill summary on last step
            showStep(currentStep);
        }
    });
});

// Handle previous step button click
prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });
});

// Handle screenshot file input change (preview image)
document.getElementById("screenshot").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width:150px;border:2px solid #39FF14;border-radius:10px;">`;
        };
        reader.readAsDataURL(file);
    }
});

// Fill summary section with form data
function fillSummary() {
    summary.innerHTML = `
        <li><strong>Nom :</strong> ${document.getElementById("fullname").value}</li>
        <li><strong>Email :</strong> ${document.getElementById("email").value}</li>
        <li><strong>Téléphone :</strong> ${document.getElementById("phone").value}</li>
        <li><strong>Ville :</strong> ${document.getElementById("location").value}</li>
        <li><strong>Plateforme :</strong> ${document.getElementById("platform").value}</li>
        <li><strong>Compte :</strong> ${document.getElementById("username").value}</li>
        <li><strong>Description :</strong> ${document.getElementById("description").value}</li>
        <li><strong>Anonyme :</strong> ${document.getElementById("anonymous").checked ? "Oui" : "Non"}</li>
    `;
}

// Handle form submission (show alert)
document.getElementById("reportForm").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Votre signalement a été envoyé avec succès !");
});

// Initialize step and progress bar
showStep(currentStep);
updateProgress();

// ---------------------
// USER AUTHENTICATION & PROFILE LOGIC
// ---------------------

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
        // Redirect to login if not authenticated
        return false;
    }
    return true;
}

// Update navigation bar with user info
function updateNavbarUserInfo(user) {
    if (!user) return;
    // Get the first letter of the user's name for the avatar
    const firstLetter = (user.name || user.pseudo || 'U').charAt(0).toUpperCase();
    const displayName = user.name || user.pseudo || 'Utilisateur';
    const userEmail = user.email || 'Non spécifié';
    // Update the navbar avatar and name
    const navAvatar = document.getElementById('navUserAvatar');
    const dropdownAvatar = document.getElementById('dropdownUserAvatar');
    if (navAvatar) navAvatar.innerHTML = firstLetter;
    if (dropdownAvatar) dropdownAvatar.innerHTML = firstLetter;
    // Update text elements
    const elementsToUpdate = {
        'navUserName': displayName,
        'dropdownUserName': displayName,
        'dropdownUserEmail': userEmail,
        'dropdownFullName': user.name || 'Non spécifié',
        'dropdownUsername': user.pseudo || 'Non spécifié'
    };
    Object.entries(elementsToUpdate).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
    // Format and update member since date
    if (user.createdAt) {
        const date = new Date(user.createdAt);
        const formattedDate = date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const memberSinceElement = document.getElementById('dropdownMemberSince');
        if (memberSinceElement) memberSinceElement.textContent = formattedDate;
    }
}

// Load user profile data
function loadUserProfile() {
    if (!checkAuth()) return;
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            // Update navbar with user info
            updateNavbarUserInfo(user);
            // Display user information on profile page
            document.getElementById('userName').textContent = user.name || user.pseudo || 'Utilisateur';
            document.getElementById('fullName').textContent = user.name || 'Non spécifié';
            document.getElementById('username').textContent = user.pseudo || 'Non spécifié';
            document.getElementById('userEmail').textContent = user.email || 'Non spécifié';
            // Format and display account creation date
            if (user.createdAt) {
                const date = new Date(user.createdAt);
                document.getElementById('accountCreated').textContent = date.toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
            // Set first letter of name as avatar in profile
            const firstLetter = (user.name || user.pseudo || 'U').charAt(0).toUpperCase();
            document.getElementById('userAvatar').textContent = firstLetter;
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        showNotification('Erreur lors du chargement du profil utilisateur', true);
    }
}

// Handle logout (clear localStorage and redirect)
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Show notification (simple alert)
function showNotification(message, isError = false) {
    alert(message);
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Logout button click handler
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutLink = document.getElementById('logoutLink');
    const dropdownLogout = document.getElementById('dropdownLogout');
    // Function to handle logout from any element
    function setupLogout(element) {
        if (element) {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogout();
            });
        }
    }
    // Setup logout for all possible logout elements
    setupLogout(logoutBtn);
    setupLogout(logoutLink);
    setupLogout(dropdownLogout);
    // Initialize tooltips (Bootstrap)
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    // Check authentication status
    checkAuth();
});

// ---------------------
// UI INTERACTIONS & ANIMATIONS
// ---------------------

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});

// Scroll indicator click: scroll to features section
document.querySelector('.scroll-indicator').addEventListener('click', function() {
    window.scrollTo({
        top: document.querySelector('.features').offsetTop,
        behavior: 'smooth'
    });
});

// Parallax effect on banner image when scrolling
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const banner = document.querySelector('.banner-image');
    const rate = scrolled * -0.5;
    banner.style.transform = `scale(1.1) translateY(${rate}px)`;
});

// ---------------------
// MOBILE MENU FUNCTIONALITY
// ---------------------

// Close navigation menu and dropdowns
function closeNavMenu() {
    const navMenu = document.getElementById('navbarNav');
    navMenu.classList.remove('show');
    // Also close any open dropdowns
    const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
    openDropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('navbarNav');
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navMenu.classList.contains('show') && 
        !navMenu.contains(event.target) && 
        !navbarToggler.contains(event.target)) {
        closeNavMenu();
    }
});

// ---------------------
// SCROLL ANIMATIONS
// ---------------------

document.addEventListener('DOMContentLoaded', function() {
    // Select all elements with hidden animation classes
    const hiddenElements = document.querySelectorAll('.hidden, .hidden-down, .hidden-up');
    // Create Intersection Observer for animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });
    // Observe each hidden element
    hiddenElements.forEach(el => observer.observe(el));
    // Scroll to card section when indicator is clicked
    document.querySelector('.scroll-indicator').addEventListener('click', function() {
        document.querySelector('.card-section').scrollIntoView({ behavior: 'smooth' });
    });
});

// ---------------------
// PLACEHOLDER FUNCTION (for future user profile logic)
// ---------------------

function loadUserProfile() {
    console.log("User profile loading...");
    // Your user profile loading logic here
}
