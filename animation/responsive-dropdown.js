/*
===============================================================================
                    RESPONSIVE DROPDOWN ENHANCEMENT
===============================================================================

Project: XyberShield Cyber Threat Report Form - Responsive Dropdown
Author: XyberShield Development Team
Version: 1.0
Description: Enhanced dropdown functionality with responsive positioning,
            touch support, and improved accessibility.

Features:
- Responsive positioning based on viewport
- Touch-friendly interactions
- Keyboard navigation support
- Auto-adjustment for mobile devices
- Improved z-index management
- Accessibility enhancements

===============================================================================
*/

class ResponsiveDropdown {
    constructor(selector) {
        this.dropdowns = document.querySelectorAll(selector);
        this.activeDropdown = null;
        this.init();
    }

    init() {
        this.dropdowns.forEach(dropdown => {
            this.setupDropdown(dropdown);
        });

        // Global event listeners
        document.addEventListener('click', (e) => this.handleGlobalClick(e));
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        document.addEventListener('resize', () => this.handleResize());
        document.addEventListener('scroll', () => this.handleScroll());
        
        // Touch events for mobile
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    }

    setupDropdown(dropdown) {
        const trigger = dropdown.querySelector('.select-trigger');
        const options = dropdown.querySelector('.select-options');
        const optionsList = dropdown.querySelectorAll('.select-option');
        const hiddenInput = dropdown.parentElement.querySelector('input[type="hidden"]');

        if (!trigger || !options) return;

        // Click handler for trigger
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleDropdown(dropdown);
        });

        // Touch handler for mobile
        trigger.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggleDropdown(dropdown);
        }, { passive: false });

        // Option click handlers
        optionsList.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.selectOption(dropdown, option, hiddenInput);
            });

            // Touch handler for options
            option.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.selectOption(dropdown, option, hiddenInput);
            }, { passive: false });

            // Keyboard navigation
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectOption(dropdown, option, hiddenInput);
                }
            });
        });

        // Make trigger focusable
        trigger.setAttribute('tabindex', '0');
        trigger.setAttribute('role', 'button');
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');

        // Make options focusable
        optionsList.forEach((option, index) => {
            option.setAttribute('tabindex', '-1');
            option.setAttribute('role', 'option');
            option.setAttribute('aria-posinset', index + 1);
            option.setAttribute('aria-setsize', optionsList.length);
        });

        options.setAttribute('role', 'listbox');
    }

    toggleDropdown(dropdown) {
        const isActive = dropdown.classList.contains('active');
        
        // Close all other dropdowns
        this.closeAllDropdowns();
        
        if (!isActive) {
            this.openDropdown(dropdown);
        }
    }

    openDropdown(dropdown) {
        const trigger = dropdown.querySelector('.select-trigger');
        const options = dropdown.querySelector('.select-options');
        
        dropdown.classList.add('active');
        trigger.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        
        this.activeDropdown = dropdown;
        
        // Ensure dropdown has highest z-index
        options.style.zIndex = '999999';
        options.style.position = 'absolute';
        
        // Position dropdown responsively
        this.positionDropdown(dropdown);
        
        // Focus first option
        const firstOption = options.querySelector('.select-option');
        if (firstOption) {
            firstOption.focus();
        }
        
        // Add escape key listener
        this.escapeKeyHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeDropdown(dropdown);
            }
        };
        document.addEventListener('keydown', this.escapeKeyHandler);
    }

    closeDropdown(dropdown) {
        const trigger = dropdown.querySelector('.select-trigger');
        
        dropdown.classList.remove('active');
        trigger.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        
        if (this.activeDropdown === dropdown) {
            this.activeDropdown = null;
        }
        
        // Remove escape key listener
        if (this.escapeKeyHandler) {
            document.removeEventListener('keydown', this.escapeKeyHandler);
            this.escapeKeyHandler = null;
        }
        
        // Return focus to trigger
        trigger.focus();
    }

    closeAllDropdowns() {
        this.dropdowns.forEach(dropdown => {
            this.closeDropdown(dropdown);
        });
    }

    selectOption(dropdown, option, hiddenInput) {
        const trigger = dropdown.querySelector('.select-trigger');
        const selectText = trigger.querySelector('.select-text');
        const value = option.getAttribute('data-value');
        const text = option.textContent.trim();
        
        // Update display
        selectText.textContent = text;
        selectText.classList.remove('placeholder');
        
        // Update hidden input
        if (hiddenInput) {
            hiddenInput.value = value;
        }
        
        // Update selected state
        dropdown.querySelectorAll('.select-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        
        // Close dropdown
        this.closeDropdown(dropdown);
        
        // Trigger change event
        if (hiddenInput) {
            hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        // Trigger custom event
        dropdown.dispatchEvent(new CustomEvent('dropdown:change', {
            detail: { value, text, option }
        }));
    }

    positionDropdown(dropdown) {
        const trigger = dropdown.querySelector('.select-trigger');
        const options = dropdown.querySelector('.select-options');
        const rect = trigger.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Force highest z-index
        options.style.zIndex = '999999';
        options.style.position = 'absolute';
        
        // Reset positioning
        options.style.top = '';
        options.style.bottom = '';
        options.style.left = '';
        options.style.right = '';
        options.style.maxHeight = '';
        options.style.width = '';
        
        // Calculate available space
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const spaceRight = viewportWidth - rect.left;
        const spaceLeft = rect.right;
        
        // Determine if dropdown should open above or below
        const shouldOpenAbove = spaceBelow < 200 && spaceAbove > spaceBelow;
        
        if (shouldOpenAbove) {
            options.style.bottom = '100%';
            options.style.borderRadius = 'var(--border-radius) var(--border-radius) 0 0';
            options.style.borderTop = '1px solid rgba(76, 148, 190, 0.3)';
            options.style.borderBottom = 'none';
        } else {
            options.style.top = '100%';
            options.style.borderRadius = '0 0 var(--border-radius) var(--border-radius)';
            options.style.borderTop = 'none';
            options.style.borderBottom = '1px solid rgba(76, 148, 190, 0.3)';
        }
        
        // Set max height based on available space
        const maxHeight = shouldOpenAbove ? 
            Math.min(spaceAbove - 20, 300) : 
            Math.min(spaceBelow - 20, 300);
        
        options.style.maxHeight = `${maxHeight}px`;
        
        // Handle horizontal positioning for very small screens
        if (viewportWidth < 576) {
            // On mobile, make dropdown full width
            options.style.left = '0';
            options.style.right = '0';
            options.style.width = '100%';
        } else {
            // On larger screens, align with trigger
            options.style.left = '0';
            options.style.width = '100%';
        }
        
        // Ensure dropdown is visible
        const optionsRect = options.getBoundingClientRect();
        if (optionsRect.right > viewportWidth) {
            options.style.right = '0';
            options.style.left = 'auto';
        }
        if (optionsRect.left < 0) {
            options.style.left = '0';
            options.style.right = 'auto';
        }
        
        // Force visibility
        options.style.visibility = 'visible';
        options.style.opacity = '1';
    }

    handleGlobalClick(e) {
        if (this.activeDropdown && !this.activeDropdown.contains(e.target)) {
            this.closeDropdown(this.activeDropdown);
        }
    }

    handleKeydown(e) {
        if (!this.activeDropdown) return;
        
        const options = this.activeDropdown.querySelectorAll('.select-option');
        const focusedOption = document.activeElement;
        const currentIndex = Array.from(options).indexOf(focusedOption);
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % options.length;
                options[nextIndex].focus();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
                options[prevIndex].focus();
                break;
                
            case 'Home':
                e.preventDefault();
                options[0].focus();
                break;
                
            case 'End':
                e.preventDefault();
                options[options.length - 1].focus();
                break;
        }
    }

    handleResize() {
        if (this.activeDropdown) {
            this.positionDropdown(this.activeDropdown);
        }
    }

    handleScroll() {
        if (this.activeDropdown) {
            this.positionDropdown(this.activeDropdown);
        }
    }

    handleTouchStart(e) {
        // Close dropdown if touch starts outside
        if (this.activeDropdown && !this.activeDropdown.contains(e.target)) {
            this.closeDropdown(this.activeDropdown);
        }
    }

    // Public methods
    getValue(dropdown) {
        const hiddenInput = dropdown.parentElement.querySelector('input[type="hidden"]');
        return hiddenInput ? hiddenInput.value : '';
    }

    setValue(dropdown, value) {
        const option = dropdown.querySelector(`[data-value="${value}"]`);
        if (option) {
            const hiddenInput = dropdown.parentElement.querySelector('input[type="hidden"]');
            this.selectOption(dropdown, option, hiddenInput);
        }
    }

    destroy() {
        // Remove event listeners
        document.removeEventListener('click', this.handleGlobalClick);
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('resize', this.handleResize);
        document.removeEventListener('scroll', this.handleScroll);
        document.removeEventListener('touchstart', this.handleTouchStart);
        
        if (this.escapeKeyHandler) {
            document.removeEventListener('keydown', this.escapeKeyHandler);
        }
    }
}

// Initialize responsive dropdowns when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dropdowns
    const responsiveDropdown = new ResponsiveDropdown('.custom-select');
    
    // Make it globally available for other scripts
    window.ResponsiveDropdown = responsiveDropdown;
    
    // Handle form validation integration
    const incidentTypeDropdown = document.getElementById('incident-type-dropdown');
    if (incidentTypeDropdown) {
        incidentTypeDropdown.addEventListener('dropdown:change', function(e) {
            // Remove validation error when option is selected
            const errorElement = document.getElementById('type-error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
            incidentTypeDropdown.classList.remove('is-invalid');
        });
    }
    
    // Handle window resize for responsive adjustments
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (responsiveDropdown.activeDropdown) {
                responsiveDropdown.positionDropdown(responsiveDropdown.activeDropdown);
            }
        }, 100);
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveDropdown;
}
