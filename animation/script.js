/**
 * XyberShield Main Application JavaScript
 * Consolidated and organized version
 */

// =========================
// GLOBAL APPLICATION STATE
// =========================
window.appState = {
    initialized: false,
    components: {
        matrixEffect: { initialized: false },
        threatMap: { initialized: false },
        animations: { initialized: false },
        ui: { initialized: false },
        map: { initialized: false }
    },
    resizeTimer: null
};

// =========================
// UTILITY FUNCTIONS
// =========================

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return (
        rect.top <= viewportHeight * 0.85 &&
        rect.bottom >= viewportHeight * 0.15
    );
}

/**
 * Show error message to user
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.textContent = message;
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.right = '20px';
    errorDiv.style.zIndex = '9999';
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

// =========================
// SCROLL ANIMATIONS
// =========================

/**
 * Initialize scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll('.hidden-up, .hidden-down, .hidden-left, .hidden-right');
    if (!elementsToAnimate.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation starts to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    // Observe all elements that should be animated
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });

    console.log('✅ Scroll animations initialized');
}

// =========================
// CARD FLIP FUNCTIONALITY
// =========================

/**
 * Initialize card flip functionality for team cards
 */
function initCardFlip() {
    const cards = document.querySelectorAll('.card-variant-3');
    if (!cards.length) return;

    let touchStartX = 0;
    let touchEndX = 0;
    let isMobile = window.innerWidth <= 991;

    // Function to handle card flip with animation frame
    function flipCard(card) {
        requestAnimationFrame(() => {
            card.classList.toggle('flipped');
        });
    }

    // Function to handle click/tap
    function handleCardInteraction(card, event) {
        if (event && event.type === 'click' && event.button !== 0) return;
        if (event && event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;

        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        flipCard(card);
    }

    // Touch event handlers
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e, card) {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            flipCard(card);
        }
    }

    // Setup event listeners for cards
    cards.forEach(card => {
        // Click events for desktop
        if (!isMobile) {
            card.addEventListener('click', (e) => handleCardInteraction(card, e));
        }

        // Touch events
        card.addEventListener('touchstart', handleTouchStart, { passive: true });
        card.addEventListener('touchend', (e) => handleTouchEnd(e, card), { passive: true });

        // Keyboard navigation
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardInteraction(card, e);
            }
        });

        // Make card focusable
        card.tabIndex = 0;
    });

    // Global Escape key handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.card-variant-3.flipped').forEach(card => {
                card.classList.remove('flipped');
            });
        }
    });

    // Handle window resize
    const handleResize = debounce(() => {
        const newIsMobile = window.innerWidth <= 991;
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            // Re-initialize if needed
        }
    }, 100);

    window.addEventListener('resize', handleResize);
    console.log('✅ Card flip functionality initialized');
}

// =========================
// FAQ ACCORDION
// =========================

/**
 * Toggle accordion functionality
 */
function toggleAccordion(element) {
    const content = element.nextElementSibling;
    if (!content) return;

    const isActive = content.classList.contains('active');

    // Close all accordion items
    document.querySelectorAll('.accordion-content').forEach(item => {
        item.classList.remove('active');
    });

    document.querySelectorAll('.accordion-header span').forEach(item => {
        item.textContent = '+';
        item.style.transform = 'rotate(0deg)';
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
        content.classList.add('active');
        const span = element.querySelector('span');
        if (span) {
            span.textContent = '-';
            span.style.transform = 'rotate(180deg)';
        }
    }
}

// =========================
// NAVIGATION
// =========================

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const closeMenuBtn = document.querySelector('.close-menu');

    if (!navbarToggler || !navbarCollapse) return;

    // Toggle mobile menu
    navbarToggler.addEventListener('click', function() {
        navbarCollapse.classList.toggle('show');
        document.body.style.overflow = navbarCollapse.classList.contains('show') ? 'hidden' : '';
    });

    // Close menu when clicking close button
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', function() {
            navbarCollapse.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 991) {
                navbarCollapse.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
            navbarCollapse.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    console.log('✅ Mobile menu initialized');
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('✅ Smooth scrolling initialized');
}

// =========================
// TOOLTIPS & UI COMPONENTS
// =========================

/**
 * Initialize Bootstrap tooltips
 */
function initTooltips() {
    if (typeof bootstrap === 'undefined') return;
    
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });

    console.log('✅ Tooltips initialized');
}

// =========================
// COUNTERS & ANIMATIONS
// =========================

/**
 * Initialize attack counter with CountUp.js
 */
function initAttackCounter() {
    const attackCounter = document.getElementById('attack-counter');
    if (!attackCounter || typeof CountUp === 'undefined') return;

    const countUp = new CountUp('attack-counter', 0, {
        duration: 2.5,
        separator: ',',
        useEasing: true,
        useGrouping: true
    });

    if (!countUp.error) {
        countUp.start();
        console.log('✅ Attack counter initialized');
    } else {
        console.error('CountUp error:', countUp.error);
    }
}

/**
 * Initialize threat statistics counters
 */
function initThreatStats() {
    const stats = [
        { id: 'totalThreats', target: 1247 },
        { id: 'activeCountries', target: 23 },
        { id: 'threatsLastHour', target: 47 }
    ];

    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element && typeof CountUp !== 'undefined') {
            const counter = new CountUp(stat.id, stat.target, {
                duration: 2,
                separator: ',',
                useEasing: true,
                useGrouping: true
            });

            if (!counter.error) {
                // Start counter when element comes into view
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            counter.start();
                            observer.unobserve(entry.target);
                        }
                    });
                });
                observer.observe(element);
            }
        }
    });

    console.log('✅ Threat statistics initialized');
}

// =========================
// USER PROFILE MANAGEMENT
// =========================

/**
 * Load user profile data
 */
function loadUserProfile() {
    // Simulate loading user data (replace with actual API call)
    const userData = {
        name: 'Utilisateur',
        email: 'user@example.com',
        fullName: 'Nom Complet',
        username: 'username',
        memberSince: 'Janvier 2024',
        avatar: null
    };

    // Update navbar user info
    const navUserName = document.getElementById('navUserName');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    const dropdownFullName = document.getElementById('dropdownFullName');
    const dropdownUsername = document.getElementById('dropdownUsername');
    const dropdownMemberSince = document.getElementById('dropdownMemberSince');

    if (navUserName) navUserName.textContent = userData.name;
    if (dropdownUserName) dropdownUserName.textContent = userData.name;
    if (dropdownUserEmail) dropdownUserEmail.textContent = userData.email;
    if (dropdownFullName) dropdownFullName.textContent = userData.fullName;
    if (dropdownUsername) dropdownUsername.textContent = userData.username;
    if (dropdownMemberSince) dropdownMemberSince.textContent = userData.memberSince;

    console.log('✅ User profile loaded');
}

// =========================
// THREAT MAP INTEGRATION
// =========================

/**
 * Initialize threat map
 */
function initThreatMap() {
    const mapContainer = document.getElementById('threatMap');
    if (!mapContainer) return;

    // Check if CyberThreatMap is available
    if (typeof CyberThreatMap !== 'undefined') {
        CyberThreatMap.init('threatMap')
            .then(() => {
                window.appState.components.threatMap.initialized = true;
                console.log('✅ Threat map initialized');
                
                // Update map on resize
                window.addEventListener('resize', handleWindowResize);
                
                // Initial map update
                setTimeout(() => {
                    const map = CyberThreatMap.getMap();
                    if (map) {
                        map.invalidateSize();
                    }
                }, 100);
            })
            .catch(error => {
                console.error('❌ Failed to initialize threat map:', error);
                showMapError('Impossible de charger la carte des menaces');
            });
    } else {
        console.warn('⚠️ CyberThreatMap not available');
        showMapError('Module de carte non disponible');
    }
}

/**
 * Handle window resize for map
 */
function handleWindowResize() {
    if (window.appState.resizeTimer) {
        clearTimeout(window.appState.resizeTimer);
    }
    window.appState.resizeTimer = setTimeout(() => {
        if (window.appState.components.threatMap.initialized && typeof CyberThreatMap !== 'undefined') {
            const map = CyberThreatMap.getMap();
            if (map) {
                map.invalidateSize();
            }
        }
    }, 300);
}

/**
 * Show map error message
 */
function showMapError(message) {
    const mapContainer = document.getElementById('threatMap');
    if (mapContainer) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert alert-warning mt-3';
        errorMsg.innerHTML = `
            <h4>Carte temporairement indisponible</h4>
            <p>${message}</p>
            <p>Veuillez réessayer plus tard.</p>
        `;
        mapContainer.innerHTML = '';
        mapContainer.appendChild(errorMsg);
    }
}

// =========================
// MAIN INITIALIZATION
// =========================

/**
 * Initialize all application components
 */
function initializeApp() {
    if (window.appState.initialized) {
        console.log('ℹ️ Application already initialized');
        return;
    }

    console.group('🚀 Initializing XyberShield Application');

    try {
        // Initialize core UI components
        initTooltips();
        initMobileMenu();
        initSmoothScrolling();
        
        // Initialize animations
        initScrollAnimations();
        initCardFlip();
        
        // Initialize counters
        initAttackCounter();
        initThreatStats();
        
        // Load user data
        loadUserProfile();
        
        // Initialize threat map
        initThreatMap();
        
        // Mark as initialized
        window.appState.initialized = true;
        
        console.log('✅ Application initialized successfully');
        
    } catch (error) {
        console.error('❌ Application initialization failed:', error);
        showError('Erreur lors de l\'initialisation de l\'application');
    }

    console.groupEnd();
}

// =========================
// EVENT LISTENERS
// =========================

/**
 * DOM Content Loaded event handler
 */
function onDOMContentLoaded() {
    console.log('🌐 DOM fully loaded');
    initializeApp();
}

/**
 * Window load event handler
 */
function onWindowLoad() {
    console.log('🎉 Window fully loaded');
    
    // Additional initialization that requires all resources to be loaded
    const mapContainer = document.getElementById('threatMap');
    if (mapContainer) {
        mapContainer.style.visibility = 'visible';
        mapContainer.style.opacity = '1';
    }
}

// =========================
// APPLICATION STARTUP
// =========================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
} else {
    // DOM already loaded
    setTimeout(onDOMContentLoaded, 0);
}

// Additional initialization when window is fully loaded
if (document.readyState === 'complete') {
    setTimeout(onWindowLoad, 0);
} else {
    window.addEventListener('load', onWindowLoad);
}

// Export functions for global access
window.XyberShield = {
    initializeApp,
    toggleAccordion,
    loadUserProfile,
    showError,
    appState: window.appState
};

console.log('📦 XyberShield main script loaded');
