// Education Page Guide System
class EducationGuide {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 6;
        this.stepDuration = 4000; // 4 seconds per step
        this.isFirstVisit = this.checkFirstVisit();
        this.autoTimer = null;
        this.init();
    }

    checkFirstVisit() {
        const visited = localStorage.getItem('xyberEducationVisited');
        if (!visited) {
            localStorage.setItem('xyberEducationVisited', 'true');
            return true;
        }
        return false;
    }

    init() {
        // Initialize counter animations
        this.initCounters();
        
        // Show guide automatically on first visit
        if (this.isFirstVisit) {
            setTimeout(() => {
                this.startAutoGuide();
            }, 2000);
        }

        // Add manual guide trigger
        this.addManualTrigger();
    }

    initCounters() {
        const counters = document.querySelectorAll('.counter');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    startAutoGuide() {
        const overlay = document.getElementById('guideOverlay');
        if (overlay) {
            overlay.classList.add('active');
            this.showStep(1);
            this.startAutoTimer();
        }
    }

    startAutoTimer() {
        this.autoTimer = setTimeout(() => {
            this.nextGuideStep();
        }, this.stepDuration);
    }

    showStep(stepNumber) {
        // Clear any existing timer
        if (this.autoTimer) {
            clearTimeout(this.autoTimer);
        }

        // Hide all steps
        document.querySelectorAll('.guide-step').forEach(step => {
            step.style.display = 'none';
        });

        // Show current step
        const currentStep = document.querySelector(`[data-step="${stepNumber}"]`);
        if (currentStep) {
            currentStep.style.display = 'block';
            
            // Highlight the element being explained
            this.highlightElement(stepNumber);
            
            // Start timer for next step (except for last step)
            if (stepNumber < this.totalSteps) {
                this.startAutoTimer();
            } else {
                // Auto close after last step
                setTimeout(() => {
                    this.closeGuide();
                }, this.stepDuration);
            }
        }
    }

    highlightElement(stepNumber) {
        // Remove previous highlights
        document.querySelectorAll('.guide-highlight').forEach(el => {
            el.classList.remove('guide-highlight');
        });

        let targetElement = null;
        switch(stepNumber) {
            case 2:
                targetElement = document.getElementById('searchInput');
                break;
            case 3:
                targetElement = document.querySelector('.filter-btn');
                break;
            case 4:
                targetElement = document.querySelector('.edu-card');
                break;
            case 5:
                targetElement = document.getElementById('chatToggle');
                break;
        }

        if (targetElement) {
            targetElement.classList.add('guide-highlight');
        }
    }

    nextGuideStep() {
        this.currentStep++;
        if (this.currentStep <= this.totalSteps) {
            this.showStep(this.currentStep);
        } else {
            this.closeGuide();
        }
    }

    closeGuide() {
        // Clear any active timer
        if (this.autoTimer) {
            clearTimeout(this.autoTimer);
        }

        // Remove highlights
        document.querySelectorAll('.guide-highlight').forEach(el => {
            el.classList.remove('guide-highlight');
        });

        const overlay = document.getElementById('guideOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
        this.currentStep = 1;
    }

    addManualTrigger() {
        // Add a help button to manually trigger the guide
        const helpButton = document.createElement('button');
        helpButton.innerHTML = '<i class="fas fa-question-circle"></i>';
        helpButton.className = 'btn btn-outline-neon position-fixed';
        helpButton.style.cssText = `
            bottom: 120px;
            right: 20px;
            z-index: 1000;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        helpButton.title = 'Aide - Guide d\'utilisation';
        helpButton.onclick = () => {
            this.currentStep = 1;
            this.showGuide();
        };

        document.body.appendChild(helpButton);
    }
}

// Global functions for HTML onclick events
function nextGuideStep() {
    if (window.educationGuide) {
        window.educationGuide.nextGuideStep();
    }
}

function closeGuide() {
    if (window.educationGuide) {
        window.educationGuide.closeGuide();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.educationGuide = new EducationGuide();
});
