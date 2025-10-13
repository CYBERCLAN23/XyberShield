// Typing animation for text elements
class TypeWriter {
    constructor(element, options = {}) {
        this.element = element;
        this.words = JSON.parse(element.getAttribute('data-text') || '[]');
        this.speed = options.speed || 50;
        this.delay = options.delay || 2000;
        this.loop = options.loop !== false;
        this.cursor = element.getAttribute('data-cursor') || '';
        this.waitAtEnd = options.waitAtEnd || 1500;
        this.txt = '';
        this.wordIndex = 0;
        this.isDeleting = false;
        this.animationCount = 0;
        this.maxAnimations = 2; // Run animation twice
        
        if (this.words && this.words.length > 0) {
            this.type();
        }
    }
    
    type() {
        // Check if we've reached the maximum number of animations
        if (this.animationCount >= this.maxAnimations * 2) {
            // Keep the final text visible
            const finalText = this.words[0];
            this.element.textContent = Array.isArray(finalText) ? finalText[0] : finalText;
            return;
        }

        // Current index of word
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = Array.isArray(this.words[current]) ? this.words[current][0] : this.words[current];
        
        // Check if deleting
        if (this.isDeleting) {
            // Remove char
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add char
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        
        // Insert txt into element
        this.element.textContent = this.txt + (this.cursor && !this.isDeleting ? this.cursor : '');
        
        // Initial Type Speed
        let typeSpeed = this.speed;
        
        if (this.isDeleting) {
            typeSpeed /= 2; // Speed up when deleting
        }
        
        // If word is complete
        if (!this.isDeleting && this.txt === fullTxt) {
            // Pause at end
            typeSpeed = this.waitAtEnd;
            // Set delete to true
            this.isDeleting = true;
            // Increment animation count when we finish typing a word
            this.animationCount++;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
            // Pause before start typing
            typeSpeed = 500;
            // Increment animation count when we finish deleting a word
            this.animationCount++;
        }
        
        // If we're not in loop and finished all words
        if (!this.loop && !this.isDeleting && this.wordIndex === this.words.length) {
            return;
        }
        
        // Stop if we've reached the maximum number of animations
        if (this.animationCount >= this.maxAnimations * 2) {
            // Keep the final text visible
            const finalText = this.words[0];
            this.element.textContent = Array.isArray(finalText) ? finalText[0] : finalText;
            return;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize all typing animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize typing animations for all elements with typing-text class
    document.querySelectorAll('.typing-text').forEach((element) => {
        const text = element.getAttribute('data-text');
        if (text) {
            // Check if it's a single string or array
            const isArray = text.trim().startsWith('[');
            const words = isArray ? JSON.parse(text) : [text];
            
            // Set the data attribute as an array for the TypeWriter
            element.setAttribute('data-text', JSON.stringify(words));
            
            // Initialize the typewriter
            new TypeWriter(element, {
                speed: 50,
                delay: 2000,
                loop: true,
                waitAtEnd: 1500
            });
        }
    });
    
    // Search input focus effect
    const searchInput = document.querySelector('.tech-input');
    const searchPlaceholder = document.querySelector('.search-placeholder');
    
    if (searchInput && searchPlaceholder) {
        searchInput.addEventListener('focus', () => {
            searchPlaceholder.style.opacity = '0';
            searchPlaceholder.style.transform = 'translateX(10px)';
        });
        
        searchInput.addEventListener('blur', () => {
            if (!searchInput.value) {
                searchPlaceholder.style.opacity = '1';
                searchPlaceholder.style.transform = 'translateX(0)';
            }
        });
    }
});

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation completes
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to all buttons with data-ripple attribute
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-ripple]').forEach(button => {
        button.addEventListener('click', createRipple);
    });
});

// Add parallax effect to search section
function updateParallax() {
    const searchSection = document.querySelector('.search-section');
    if (!searchSection) return;
    
    const scrollPosition = window.pageYOffset;
    const backgroundPos = scrollPosition * 0.5;
    
    searchSection.style.backgroundPositionY = `${backgroundPos}px`;
}

window.addEventListener('scroll', updateParallax);
window.addEventListener('resize', updateParallax);

// Initialize particles for tech grid background
function initTechGrid() {
    const gridContainer = document.querySelector('.search-tech-grid');
    if (!gridContainer) return;
    
    const gridSize = 20; // Size of each grid cell
    const width = gridContainer.offsetWidth;
    const height = gridContainer.offsetHeight;
    const cols = Math.ceil(width / gridSize) + 1;
    const rows = Math.ceil(height / gridSize) + 1;
    
    // Clear existing grid
    gridContainer.innerHTML = '';
    
    // Create grid dots
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const dot = document.createElement('div');
            dot.className = 'grid-dot';
            dot.style.left = `${x * gridSize}px`;
            dot.style.top = `${y * gridSize}px`;
            dot.style.width = `${gridSize}px`;
            dot.style.height = `${gridSize}px`;
            
            // Add animation delay based on position
            const distance = Math.sqrt(Math.pow(x - cols/2, 2) + Math.pow(y - rows/2, 2));
            const delay = (distance * 0.05).toFixed(2);
            dot.style.animationDelay = `${delay}s`;
            
            gridContainer.appendChild(dot);
        }
    }
}

// Initialize on load and window resize
window.addEventListener('load', () => {
    initTechGrid();
    updateParallax();
});

window.addEventListener('resize', initTechGrid);
