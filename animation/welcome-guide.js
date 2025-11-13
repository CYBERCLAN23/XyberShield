// Welcome Guide - Game Style Tutorial for Education Page

class WelcomeGuide {
    constructor() {
        this.currentStep = 0;
        this.steps = [
            {
                target: '.filter-bar',
                title: 'Barre de Recherche',
                content: 'Utilisez cette barre pour filtrer les vidéos par catégorie, niveau ou rechercher un sujet spécifique.',
                icon: 'fa-search',
                position: 'bottom'
            },
            {
                target: '.course-card:first-child',
                title: 'Cartes de Cours',
                content: 'Chaque carte représente une vidéo éducative. Cliquez dessus pour regarder et apprendre!',
                icon: 'fa-play-circle',
                position: 'right'
            },
            {
                target: '.course-badge',
                title: 'Niveau de Difficulté',
                content: 'Ce badge indique le niveau: Débutant, Intermédiaire ou Avancé. Commencez par votre niveau!',
                icon: 'fa-star',
                position: 'bottom'
            },
            {
                target: '.course-tags',
                title: 'Tags et Catégories',
                content: 'Les tags vous aident à identifier rapidement les sujets abordés dans chaque vidéo.',
                icon: 'fa-tags',
                position: 'top'
            },
            {
                target: '.course-card[data-type="quiz"]',
                title: 'Quiz Interactifs',
                content: 'Testez vos connaissances avec nos quiz! Répondez aux questions et obtenez votre score pour valider votre apprentissage.',
                icon: 'fa-question-circle',
                position: 'right'
            },
            {
                target: '#chatToggle',
                title: 'Assistant IA',
                content: 'Besoin d\'aide? Cliquez ici pour discuter avec notre assistant IA qui répondra à toutes vos questions!',
                icon: 'fa-robot',
                position: 'left'
            }
        ];
        
        this.init();
    }

    init() {
        // Check if guide has been shown before
        if (localStorage.getItem('educationGuideCompleted')) {
            return;
        }

        // Create guide elements
        this.createElements();
        
        // Show welcome screen after a short delay
        setTimeout(() => {
            this.showWelcome();
        }, 1000);
    }

    createElements() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'welcome-guide-overlay';
        document.body.appendChild(this.overlay);

        // Create spotlight
        this.spotlight = document.createElement('div');
        this.spotlight.className = 'guide-spotlight';
        document.body.appendChild(this.spotlight);

        // Create tooltip
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'guide-tooltip';
        document.body.appendChild(this.tooltip);

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.overlay.classList.contains('active')) return;
            
            if (e.key === 'ArrowRight' || e.key === 'Enter') {
                this.nextStep();
            } else if (e.key === 'ArrowLeft') {
                this.previousStep();
            } else if (e.key === 'Escape') {
                this.skip();
            }
        });
    }

    showWelcome() {
        const welcome = document.createElement('div');
        welcome.className = 'guide-welcome';
        welcome.innerHTML = `
            <div class="guide-welcome-icon">
                <i class="fas fa-graduation-cap"></i>
            </div>
            <h2 class="guide-welcome-title">Bienvenue sur XyberShield Education!</h2>
            <p class="guide-welcome-text">
                Voulez-vous faire un tour guidé pour découvrir toutes les fonctionnalités?
                Cela ne prendra que 30 secondes!
            </p>
            <div class="guide-welcome-actions">
                <button class="guide-btn guide-btn-primary" onclick="welcomeGuide.startTour()">
                    <i class="fas fa-play"></i>
                    Commencer le Tour
                </button>
                <button class="guide-btn guide-btn-secondary" onclick="welcomeGuide.skip()">
                    <i class="fas fa-times"></i>
                    Passer
                </button>
            </div>
        `;

        this.overlay.appendChild(welcome);
        this.overlay.classList.add('active');
    }

    startTour() {
        // Remove welcome screen
        const welcome = this.overlay.querySelector('.guide-welcome');
        if (welcome) {
            welcome.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => welcome.remove(), 300);
        }

        // Start first step
        setTimeout(() => {
            this.showStep(0);
        }, 400);
    }

    showStep(index) {
        if (index < 0 || index >= this.steps.length) return;

        this.currentStep = index;
        const step = this.steps[index];

        // Find target element
        const target = document.querySelector(step.target);
        if (!target) {
            console.warn(`Target not found: ${step.target}`);
            this.nextStep();
            return;
        }

        // Position spotlight
        this.positionSpotlight(target);

        // Position and show tooltip
        this.showTooltip(step, target);

        // Scroll target into view
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    positionSpotlight(element) {
        const rect = element.getBoundingClientRect();
        const padding = 8;

        this.spotlight.style.top = `${rect.top - padding + window.scrollY}px`;
        this.spotlight.style.left = `${rect.left - padding}px`;
        this.spotlight.style.width = `${rect.width + padding * 2}px`;
        this.spotlight.style.height = `${rect.height + padding * 2}px`;
    }

    showTooltip(step, target) {
        const rect = target.getBoundingClientRect();
        
        // Build tooltip HTML
        this.tooltip.innerHTML = `
            <div class="guide-tooltip-header">
                <div class="guide-tooltip-icon">
                    <i class="fas ${step.icon}"></i>
                </div>
                <div class="guide-tooltip-title">
                    <div class="guide-tooltip-step">Étape ${this.currentStep + 1}/${this.steps.length}</div>
                    <h3 class="guide-tooltip-heading">${step.title}</h3>
                </div>
            </div>
            <div class="guide-tooltip-content">
                ${step.content}
            </div>
            <div class="guide-tooltip-actions">
                ${this.currentStep > 0 ? `
                    <button class="guide-btn guide-btn-secondary" onclick="welcomeGuide.previousStep()">
                        <i class="fas fa-arrow-left"></i>
                        Précédent
                    </button>
                ` : ''}
                <button class="guide-btn guide-btn-primary" onclick="welcomeGuide.nextStep()">
                    ${this.currentStep < this.steps.length - 1 ? 'Suivant' : 'Terminer'}
                    <i class="fas fa-arrow-right"></i>
                </button>
                <button class="guide-btn guide-btn-skip" onclick="welcomeGuide.skip()" title="Passer le guide">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="guide-progress">
                ${this.steps.map((_, i) => `
                    <div class="guide-progress-dot ${i === this.currentStep ? 'active' : ''}"></div>
                `).join('')}
            </div>
            <div class="guide-keyboard-hint">
                <span class="guide-key">←</span>
                <span class="guide-key">→</span>
                <span>ou</span>
                <span class="guide-key">ESC</span>
                <span>pour naviguer</span>
            </div>
        `;

        // Position tooltip
        this.positionTooltip(step.position, rect);

        // Show tooltip
        setTimeout(() => {
            this.tooltip.classList.add('active');
        }, 100);
    }

    positionTooltip(position, targetRect) {
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const padding = 20;
        let top, left;

        // Remove previous arrow classes
        this.tooltip.classList.remove('arrow-top', 'arrow-bottom', 'arrow-left', 'arrow-right');

        switch (position) {
            case 'bottom':
                top = targetRect.bottom + padding + window.scrollY;
                left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
                this.tooltip.classList.add('arrow-top');
                break;
            case 'top':
                top = targetRect.top - tooltipRect.height - padding + window.scrollY;
                left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
                this.tooltip.classList.add('arrow-bottom');
                break;
            case 'right':
                top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2) + window.scrollY;
                left = targetRect.right + padding;
                this.tooltip.classList.add('arrow-left');
                break;
            case 'left':
                top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2) + window.scrollY;
                left = targetRect.left - tooltipRect.width - padding;
                this.tooltip.classList.add('arrow-right');
                break;
        }

        // Keep tooltip in viewport
        const maxLeft = window.innerWidth - tooltipRect.width - 20;
        const maxTop = window.innerHeight - tooltipRect.height - 20;
        
        left = Math.max(20, Math.min(left, maxLeft));
        top = Math.max(20, Math.min(top, maxTop));

        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }

    nextStep() {
        this.tooltip.classList.remove('active');
        
        setTimeout(() => {
            if (this.currentStep < this.steps.length - 1) {
                this.showStep(this.currentStep + 1);
            } else {
                this.complete();
            }
        }, 300);
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.tooltip.classList.remove('active');
            setTimeout(() => {
                this.showStep(this.currentStep - 1);
            }, 300);
        }
    }

    complete() {
        // Show completion message
        this.tooltip.innerHTML = `
            <div class="guide-complete">
                <div class="guide-complete-icon">🎉</div>
                <h3 class="guide-tooltip-heading">Félicitations!</h3>
                <p class="guide-tooltip-content">
                    Vous connaissez maintenant toutes les fonctionnalités. Bon apprentissage!
                </p>
                <button class="guide-btn guide-btn-primary" onclick="welcomeGuide.close()">
                    <i class="fas fa-check"></i>
                    Commencer à Apprendre
                </button>
            </div>
        `;

        this.tooltip.classList.add('active');
        this.spotlight.style.display = 'none';

        // Mark as completed
        localStorage.setItem('educationGuideCompleted', 'true');
    }

    skip() {
        localStorage.setItem('educationGuideCompleted', 'true');
        this.close();
    }

    close() {
        this.overlay.classList.remove('active');
        setTimeout(() => {
            this.overlay.remove();
            this.spotlight.remove();
            this.tooltip.remove();
        }, 400);
    }

    // Reset guide (for testing)
    static reset() {
        localStorage.removeItem('educationGuideCompleted');
        location.reload();
    }
}

// Initialize guide when DOM is ready
let welcomeGuide;
document.addEventListener('DOMContentLoaded', () => {
    welcomeGuide = new WelcomeGuide();
});

// Expose reset function to console for testing
window.resetGuide = () => WelcomeGuide.reset();
