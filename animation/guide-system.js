/**
 * Professional Guide System for XyberShield Education
 * Provides interactive element highlighting and smooth transitions
 */

class ProfessionalGuideSystem {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.isActive = false;
        this.highlightedElement = null;
        
        // Element targets for each step
        this.stepTargets = {
            1: '.search-section h2',
            2: '#searchInput',
            3: '#filter-buttons',
            4: '#quizSection',
            5: '#chatToggle'
        };
        
        this.init();
    }
    
    init() {
        // Check if user has seen the guide before
        const hasSeenGuide = localStorage.getItem('xyberShieldGuideCompleted');
        
        if (!hasSeenGuide) {
            // Show guide after page loads
            setTimeout(() => {
                this.startGuide();
            }, 1500);
        }
        
        // Add event listeners
        this.bindEvents();
    }
    
    bindEvents() {
        // Global functions for HTML onclick handlers
        window.nextGuideStep = () => this.nextStep();
        window.closeGuide = () => this.closeGuide();
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            
            if (e.key === 'Escape') {
                this.closeGuide();
            } else if (e.key === 'ArrowRight' || e.key === 'Space') {
                e.preventDefault();
                this.nextStep();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousStep();
            }
        });
    }
    
    startGuide() {
        const overlay = document.getElementById('guideOverlay');
        if (!overlay) return;
        
        this.isActive = true;
        overlay.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Start with first step
        this.showStep(1);
        
        // Add entrance animation
        setTimeout(() => {
            const firstStep = document.querySelector('.guide-step[data-step="1"]');
            if (firstStep) {
                firstStep.classList.add('active');
            }
        }, 300);
    }
    
    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.guide-step').forEach(step => {
            step.classList.remove('active');
            step.style.display = 'none';
        });
        
        // Update progress
        this.updateProgress(stepNumber);
        
        // Highlight target element first
        this.highlightTargetElement(stepNumber);
        
        // Position spotlight
        this.positionSpotlight(stepNumber);
        
        // Position guide bubble and arrow precisely
        this.positionGuideElements(stepNumber);
        
        // Show current step
        const currentStepElement = document.querySelector(`.guide-step[data-step="${stepNumber}"]`);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
            setTimeout(() => {
                currentStepElement.classList.add('active');
            }, 100);
        }
        
        this.currentStep = stepNumber;
    }
    
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.showStep(this.currentStep + 1);
        } else {
            this.closeGuide();
        }
    }
    
    previousStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }
    
    updateProgress(stepNumber) {
        const progressText = document.getElementById('currentStep');
        const progressFill = document.getElementById('progressFill');
        
        if (progressText) {
            progressText.textContent = stepNumber;
        }
        
        if (progressFill) {
            const percentage = (stepNumber / this.totalSteps) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }
    
    highlightTargetElement(stepNumber) {
        // Remove previous highlight
        if (this.highlightedElement) {
            this.highlightedElement.classList.remove('guide-highlight');
        }
        
        // Get target selector for current step
        const targetSelector = this.stepTargets[stepNumber];
        if (!targetSelector) return;
        
        // Find and highlight target element
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            targetElement.classList.add('guide-highlight');
            this.highlightedElement = targetElement;
            
            // Scroll element into view smoothly
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
    }
    
    positionSpotlight(stepNumber) {
        const spotlight = document.getElementById('guideSpotlight');
        const targetSelector = this.stepTargets[stepNumber];
        
        if (!spotlight || !targetSelector) return;
        
        const targetElement = document.querySelector(targetSelector);
        if (!targetElement) return;
        
        // Get element position and dimensions
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Calculate spotlight position
        const centerX = rect.left + scrollLeft + (rect.width / 2);
        const centerY = rect.top + scrollTop + (rect.height / 2);
        const radius = Math.max(rect.width, rect.height) + 60;
        
        // Position and size spotlight
        spotlight.style.left = `${centerX - radius}px`;
        spotlight.style.top = `${centerY - radius}px`;
        spotlight.style.width = `${radius * 2}px`;
        spotlight.style.height = `${radius * 2}px`;
        spotlight.style.background = `radial-gradient(circle at center, transparent ${radius * 0.4}px, rgba(0, 0, 0, 0.9) ${radius * 0.8}px)`;
    }
    
    positionGuideElements(stepNumber) {
        const targetSelector = this.stepTargets[stepNumber];
        if (!targetSelector) return;
        
        const targetElement = document.querySelector(targetSelector);
        const currentStepElement = document.querySelector(`.guide-step[data-step="${stepNumber}"]`);
        const guideBubble = currentStepElement?.querySelector('.guide-bubble');
        const guideArrow = currentStepElement?.querySelector('.guide-arrow');
        
        if (!targetElement || !guideBubble || !guideArrow) return;
        
        // Get target element position and dimensions
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        const targetCenterX = rect.left + scrollLeft + (rect.width / 2);
        const targetCenterY = rect.top + scrollTop + (rect.height / 2);
        const targetTop = rect.top + scrollTop;
        const targetBottom = rect.bottom + scrollTop;
        const targetLeft = rect.left + scrollLeft;
        const targetRight = rect.right + scrollLeft;
        
        let bubbleX, bubbleY, arrowX, arrowY;
        
        // Position bubble and arrow based on step and available space
        switch(stepNumber) {
            case 1: // Education title - position above
                bubbleX = targetCenterX;
                bubbleY = targetTop - 120;
                arrowX = targetCenterX;
                arrowY = targetTop - 30;
                guideBubble.style.transform = 'translateX(-50%)';
                break;
                
            case 2: // Search input - position to the right
                bubbleX = targetRight + 40;
                bubbleY = targetCenterY - 80;
                arrowX = targetRight + 20;
                arrowY = targetCenterY;
                guideBubble.style.transform = 'translateY(-50%)';
                break;
                
            case 3: // Filter buttons - position above right
                bubbleX = targetRight - 100;
                bubbleY = targetTop - 120;
                arrowX = targetRight - 50;
                arrowY = targetTop - 30;
                guideBubble.style.transform = 'translateX(-50%)';
                break;
                
            case 4: // Quiz section - position to the left
                bubbleX = targetLeft - 400;
                bubbleY = targetCenterY - 80;
                arrowX = targetLeft - 20;
                arrowY = targetCenterY;
                guideBubble.style.transform = 'translateY(-50%)';
                break;
                
            case 5: // Chat toggle - position above and to the left
                bubbleX = targetLeft - 380;
                bubbleY = targetTop - 140;
                arrowX = targetCenterX;
                arrowY = targetTop - 30;
                guideBubble.style.transform = 'translateX(-50%)';
                break;
        }
        
        // Apply positions
        guideBubble.style.position = 'absolute';
        guideBubble.style.left = `${bubbleX}px`;
        guideBubble.style.top = `${bubbleY}px`;
        guideBubble.style.right = 'auto';
        guideBubble.style.bottom = 'auto';
        
        guideArrow.style.position = 'absolute';
        guideArrow.style.left = `${arrowX}px`;
        guideArrow.style.top = `${arrowY}px`;
        guideArrow.style.right = 'auto';
        guideArrow.style.bottom = 'auto';
        guideArrow.style.transform = 'translate(-50%, -50%)';
    }
    
    closeGuide() {
        const overlay = document.getElementById('guideOverlay');
        if (!overlay) return;
        
        // Remove highlight from current element
        if (this.highlightedElement) {
            this.highlightedElement.classList.remove('guide-highlight');
            this.highlightedElement = null;
        }
        
        // Hide overlay with animation
        overlay.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Mark guide as completed
        localStorage.setItem('xyberShieldGuideCompleted', 'true');
        
        this.isActive = false;
        
        // Optional: Show completion message
        setTimeout(() => {
            this.showCompletionMessage();
        }, 500);
    }
    
    showCompletionMessage() {
        // Create temporary success notification
        const notification = document.createElement('div');
        notification.className = 'guide-completion-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Guide terminé ! Explorez XyberShield Education</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(61, 220, 132, 0.95), rgba(76, 148, 190, 0.95));
            color: #020c1b;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(61, 220, 132, 0.3);
            z-index: 10000;
            font-weight: 600;
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 3000);
    }
    
    // Method to restart guide (for testing or user request)
    restartGuide() {
        localStorage.removeItem('xyberShieldGuideCompleted');
        this.currentStep = 1;
        this.startGuide();
    }
}

// Initialize guide system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for other scripts to load
    setTimeout(() => {
        window.guideSystem = new ProfessionalGuideSystem();
    }, 500);
});

// Expose restart function globally for debugging/admin use
window.restartGuide = () => {
    if (window.guideSystem) {
        window.guideSystem.restartGuide();
    }
};
