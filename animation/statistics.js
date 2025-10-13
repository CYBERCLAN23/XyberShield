// Initialize statistics
function initHackingStats() {
    const statsContainer = document.querySelector('.statistics');
    if (!statsContainer) return; // Exit if no stats container found

    // Sample statistics data with icons and suffixes
    const statsData = [
        { value: 95, label: 'Taux de succès', icon: 'fas fa-shield-alt', suffix: '%' },
        { value: 1000, label: 'Incidents signalés', icon: 'fas fa-exclamation-triangle', suffix: '+' },
        { value: 24, label: 'Heures de support', icon: 'fas fa-headset', suffix: '/7' },
        { value: 99, label: 'Satisfaction client', icon: 'fas fa-smile-beam', suffix: '%' }
    ];

    // Create statistics elements
    const statsHTML = statsData.map(stat => `
        <div class="col-6 col-md-3 mb-4">
            <div class="stat-item text-center p-3">
                <div class="stat-icon"><i class="${stat.icon}"></i></div>
                <div class="stat-value display-4 fw-bold text-neon" data-count="${stat.value}" data-suffix="${stat.suffix || ''}">0</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        </div>
    `).join('');

    // Insert statistics into the container
    statsContainer.innerHTML = `
        <div class="row justify-content-center">
            ${statsHTML}
        </div>
    `;

    // Animate counting up the statistics with easing
    const animateStats = () => {
        const statValues = document.querySelectorAll('.stat-value');

        const easeOutQuad = t => t * (2 - t);

        statValues.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 2500; // Animation duration in ms
            let startTime = null;

            const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                const percentage = Math.min(progress / duration, 1);
                const easedPercentage = easeOutQuad(percentage);
                const currentValue = Math.floor(easedPercentage * target);

                stat.textContent = currentValue + suffix;

                if (progress < duration) {
                    requestAnimationFrame(step);
                } else {
                    stat.textContent = target + suffix;
                }
            };

            requestAnimationFrame(step);
        });
    };

    // Only animate when the stats section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsContainer);
}

// Make initHackingStats available globally
window.initHackingStats = initHackingStats;

// Auto-initialize if the DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHackingStats);
} else {
    // If the DOM is already loaded, initialize immediately
    initHackingStats();
}
