/**
 * XyberShield Animation Handler
 * Handles scroll-based animations and UI interactions
 */

// Add js-initialized class when JS is ready
document.documentElement.classList.add('js-loading');

document.addEventListener('DOMContentLoaded', function() {
    // Remove loading class and add initialized class
    document.documentElement.classList.remove('js-loading');
    document.documentElement.classList.add('js-initialized');
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers without IntersectionObserver
        const animatedElements = document.querySelectorAll('.hidden-up, .hidden-down, .hidden-left, .hidden-right');
        animatedElements.forEach(el => el.classList.add('visible'));
        return;
    }

    // Configure intersection observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -10% 0px', // Start animation when 10% of element is visible
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    // Create intersection observer
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger animation
                requestAnimationFrame(() => {
                    entry.target.classList.add('visible');
                    // Stop observing after animation completes
                    setTimeout(() => {
                        observerInstance.unobserve(entry.target);
                    }, 800); // Match this with the longest animation duration
                });
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const observeElements = () => {
        const elements = document.querySelectorAll('.hidden-up, .hidden-down, .hidden-left, .hidden-right');
        elements.forEach(element => {
            observer.observe(element);
        });
    };

    // Initialize accordion functionality
    window.toggleAccordion = function(header) {
        if (!header) return;
        
        const content = header.nextElementSibling;
        if (!content) return;
        
        const isActive = header.classList.contains('active');
        
        // Close all other accordion items
        document.querySelectorAll('.accordion-header').forEach(h => {
            if (h !== header) {
                h.classList.remove('active');
                const otherContent = h.nextElementSibling;
                if (otherContent) {
                    otherContent.style.maxHeight = null;
                }
                const span = h.querySelector('span');
                if (span) span.textContent = '+';
            }
        });
        
        // Toggle current item
        if (isActive) {
            header.classList.remove('active');
            content.style.maxHeight = null;
            const span = header.querySelector('span');
            if (span) span.textContent = '+';
        } else {
            header.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
            const span = header.querySelector('span');
            if (span) span.textContent = '-';
        }
    };

    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(function(tooltipTriggerEl) {
            try {
                new bootstrap.Tooltip(tooltipTriggerEl);
            } catch (e) {
                console.warn('Failed to initialize tooltip:', e);
            }
        });
    }

    // Initial observation
    observeElements();

    // Re-observe elements when content is dynamically loaded
    const observerConfig = { childList: true, subtree: true };
    const mutationObserver = new MutationObserver(() => {
        observeElements();
    });
    mutationObserver.observe(document.body, observerConfig);

    // Handle window resize to ensure animations work after layout changes
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            observeElements();
        }, 250);
    });
});
