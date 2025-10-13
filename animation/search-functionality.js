// Search functionality for Education page
class SearchManager {
    constructor() {
        this.allCards = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        // Get all searchable elements on the page
        this.initSearchableElements();
        
        // Initialize filter buttons
        this.initFilterButtons();
        
        // Initialize search input
        this.initSearchInput();
    }

    initSearchableElements() {
        // Get all resource cards
        this.allCards = document.querySelectorAll('.resource-card');
        
        // Get all searchable page elements
        this.searchableElements = [
            // Page sections
            { element: document.querySelector('.search-section'), keywords: ['recherche', 'search', 'barre', 'trouver', 'chercher'], type: 'section', name: 'Barre de recherche' },
            { element: document.querySelector('#filter-buttons'), keywords: ['filtre', 'filter', 'catégorie', 'type', 'bouton'], type: 'section', name: 'Filtres par type' },
            { element: document.querySelector('#quizSection'), keywords: ['quiz', 'test', 'questions', 'évaluation', 'certificat', 'cybersécurité', 'connaissances'], type: 'section', name: 'Quiz de cybersécurité' },
            { element: document.querySelector('#chatToggle'), keywords: ['chat', 'assistant', 'aide', 'ia', 'intelligence artificielle', 'support'], type: 'section', name: 'Assistant IA' },
            
            // Quiz elements
            { element: document.querySelector('.quiz-start-card'), keywords: ['commencer', 'démarrer', 'start', 'quiz', 'test'], type: 'quiz', name: 'Démarrer le quiz' },
            { element: document.querySelector('.quiz-timer'), keywords: ['temps', 'timer', 'chrono', 'minuteur', 'countdown'], type: 'quiz', name: 'Minuteur du quiz' },
            
            // Education content
            { element: document.querySelector('.education-section'), keywords: ['éducation', 'formation', 'apprentissage', 'ressources', 'contenu'], type: 'section', name: 'Section éducation' }
        ].filter(item => item.element); // Remove null elements
    }

    initFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Update current filter
                this.currentFilter = e.target.dataset.filter;
                
                // Apply filter
                this.applyFilters();
            });
        });
    }

    initSearchInput() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            // Clear search on page load
            searchInput.value = '';
            
            // Add event listeners
            searchInput.addEventListener('input', () => {
                this.applyFilters();
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch();
                }
            });
        }
    }

    applyFilters() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        let visibleCount = 0;
        let foundPageElement = null;

        // First, search in page elements if there's a search term
        if (searchTerm !== '') {
            foundPageElement = this.searchPageElements(searchTerm);
        }

        // Then filter resource cards
        this.allCards.forEach(card => {
            const cardType = card.dataset.type || 'all';
            const cardTitle = card.querySelector('h5')?.textContent.toLowerCase() || '';
            const cardDescription = card.querySelector('p')?.textContent.toLowerCase() || '';
            const cardContent = cardTitle + ' ' + cardDescription;

            // Check filter match
            const filterMatch = this.currentFilter === 'all' || cardType === this.currentFilter;
            
            // Check search match
            const searchMatch = searchTerm === '' || cardContent.includes(searchTerm);

            if (filterMatch && searchMatch) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
            }
        });

        // Show page element result or no results message
        if (foundPageElement) {
            this.showPageElementResult(foundPageElement);
        } else {
            this.showNoResultsMessage(visibleCount === 0 && (searchTerm !== '' || this.currentFilter !== 'all'));
        }
    }

    searchPageElements(searchTerm) {
        // Search through page elements
        for (let item of this.searchableElements) {
            const keywordMatch = item.keywords.some(keyword => 
                keyword.toLowerCase().includes(searchTerm) || 
                searchTerm.includes(keyword.toLowerCase())
            );
            
            if (keywordMatch) {
                return item;
            }
        }
        return null;
    }

    showPageElementResult(pageElement) {
        // Remove existing messages
        this.removeExistingMessages();
        
        // Create page element result
        const resultDiv = document.createElement('div');
        resultDiv.id = 'pageElementResult';
        resultDiv.className = 'page-element-result text-center py-4 mb-4';
        resultDiv.innerHTML = `
            <div class="page-element-container">
                <i class="fas fa-bullseye fa-2x text-primary mb-3"></i>
                <h5 class="text-primary mb-2">Élément trouvé sur la page</h5>
                <p class="text-muted mb-3">${pageElement.name}</p>
                <button class="btn btn-primary btn-sm" onclick="searchManager.scrollToElement('${pageElement.element.id || pageElement.element.className}')">
                    <i class="fas fa-eye me-2"></i>Voir l'élément
                </button>
                <button class="btn btn-outline-secondary btn-sm ms-2" onclick="searchManager.clearSearch()">
                    <i class="fas fa-times me-2"></i>Effacer
                </button>
            </div>
        `;
        
        // Insert after filter buttons
        const filterSection = document.getElementById('filter-buttons');
        if (filterSection) {
            filterSection.parentNode.insertBefore(resultDiv, filterSection.nextSibling);
        }
        
        // Highlight the element
        this.highlightElement(pageElement.element);
    }

    scrollToElement(selector) {
        let element;
        if (selector.startsWith('.')) {
            element = document.querySelector(selector);
        } else {
            element = document.getElementById(selector) || document.querySelector(`.${selector}`);
        }
        
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'center'
            });
            
            // Add pulse animation
            element.style.animation = 'elementPulse 2s ease-in-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 2000);
        }
    }

    highlightElement(element) {
        // Remove previous highlights
        document.querySelectorAll('.search-highlighted').forEach(el => {
            el.classList.remove('search-highlighted');
        });
        
        // Add highlight to found element
        if (element) {
            element.classList.add('search-highlighted');
            setTimeout(() => {
                element.classList.remove('search-highlighted');
            }, 3000);
        }
    }

    removeExistingMessages() {
        const existingResult = document.getElementById('pageElementResult');
        const existingNoResults = document.getElementById('noResultsMessage');
        
        if (existingResult) existingResult.remove();
        if (existingNoResults) existingNoResults.remove();
    }

    showNoResultsMessage(show) {
        let noResultsMsg = document.getElementById('noResultsMessage');
        
        if (show && !noResultsMsg) {
            // Create no results message
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'noResultsMessage';
            noResultsMsg.className = 'text-center py-5';
            noResultsMsg.innerHTML = `
                <div class="no-results-container">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4 class="text-muted">Aucun résultat trouvé</h4>
                    <p class="text-muted">Essayez de modifier votre recherche ou sélectionnez une autre catégorie.</p>
                    <button class="btn btn-outline-primary" onclick="searchManager.clearSearch()">
                        <i class="fas fa-times me-2"></i>Effacer la recherche
                    </button>
                </div>
            `;
            
            // Insert after filter buttons
            const filterSection = document.getElementById('filter-buttons');
            if (filterSection) {
                filterSection.parentNode.insertBefore(noResultsMsg, filterSection.nextSibling);
            }
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Reset to "Tous" filter
        const allButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allButton) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            allButton.classList.add('active');
            this.currentFilter = 'all';
        }
        
        this.applyFilters();
    }

    performSearch() {
        // Trigger search animation
        const searchBtn = document.querySelector('.youtube-search-btn');
        if (searchBtn) {
            searchBtn.classList.add('searching');
            setTimeout(() => {
                searchBtn.classList.remove('searching');
            }, 1000);
        }
        
        // Apply current filters
        this.applyFilters();
        
        // Scroll to results
        const resultsSection = document.querySelector('.resources-grid');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Global functions for HTML event handlers
function performSearch(event) {
    if (event) {
        event.preventDefault();
    }
    if (window.searchManager) {
        window.searchManager.performSearch();
    }
}

function handleSearchInput() {
    if (window.searchManager) {
        window.searchManager.applyFilters();
    }
}

// Initialize search manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.searchManager = new SearchManager();
});
