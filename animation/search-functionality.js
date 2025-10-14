// Search functionality for Education page
class SearchManager {
    constructor() {
        this.allCards = [];
        this.currentFilter = 'all';
        this.suggestionKeywords = [];
        this.initialItemsToShow = 3;
        this.init();
    }

    init() {
        this.initSearchableElements();
        this.initFilterButtons();
        this.initSearchInput();
        this.generateKeywords();
        this.setupInitialView();
    }

    initSearchableElements() {
        this.allCards = document.querySelectorAll('.edu-card');
        this.searchableElements = [
            { element: document.querySelector('.search-section'), keywords: ['recherche', 'search', 'barre', 'trouver', 'chercher'], type: 'section', name: 'Barre de recherche' },
            { element: document.querySelector('#filter-buttons'), keywords: ['filtre', 'filter', 'catégorie', 'type', 'bouton'], type: 'section', name: 'Filtres par type' },
            { element: document.querySelector('#quizSection'), keywords: ['quiz', 'test', 'questions', 'évaluation', 'certificat', 'cybersécurité', 'connaissances'], type: 'section', name: 'Quiz de cybersécurité' },
            { element: document.querySelector('#chatToggle'), keywords: ['chat', 'assistant', 'aide', 'ia', 'intelligence artificielle', 'support'], type: 'section', name: 'Assistant IA' },
            { element: document.querySelector('.quiz-start-card'), keywords: ['commencer', 'démarrer', 'start', 'quiz', 'test'], type: 'quiz', name: 'Démarrer le quiz' },
            { element: document.querySelector('.quiz-timer'), keywords: ['temps', 'timer', 'chrono', 'minuteur', 'countdown'], type: 'quiz', name: 'Minuteur du quiz' },
            { element: document.querySelector('.education-section'), keywords: ['éducation', 'formation', 'apprentissage', 'ressources', 'contenu'], type: 'section', name: 'Section éducation' }
        ].filter(item => item.element);
    }

    initFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.applyFilters();
            });
        });
    }

    initSearchInput() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            searchInput.addEventListener('input', () => {
                this.handleSearchInput();
            });
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch();
                }
            });
        }
    }

    handleSearchInput() {
        this.applyFilters();
        this.showSuggestions();
    }

    performSearch() {
        const searchBtn = document.querySelector('.youtube-search-btn');
        if (searchBtn) {
            searchBtn.classList.add('searching');
            setTimeout(() => {
                searchBtn.classList.remove('searching');
            }, 1000);
        }
        this.applyFilters();
        const resultsSection = document.querySelector('.education-section') || document.getElementById('eduGrid');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    generateKeywords() {
        const keywords = new Set();
        this.allCards.forEach(card => {
            const title = card.dataset.title;
            if (title) {
                keywords.add(title.trim());
            }
            const text = card.querySelector('.card-text').textContent;
            if (text) {
                text.split(/[\s,]+/).forEach(word => {
                    if (word.length > 3) {
                        keywords.add(word.toLowerCase());
                    }
                });
            }
            const tags = card.querySelectorAll('.tag');
            tags.forEach(tag => {
                keywords.add(tag.textContent.replace('#', '').trim());
            });
        });
        this.suggestionKeywords = [...keywords];
    }

    setupInitialView() {
        this.setupLoadMore('video');
        this.setupLoadMore('image');
        this.setupLoadMore('pdf');
    }

    setupLoadMore(category) {
        const cards = document.querySelectorAll(`.edu-card[data-type='${category}']`);
        const loadMoreBtn = document.querySelector(`.load-more-btn[data-category='${category}']`);

        if (cards.length <= this.initialItemsToShow) {
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'none';
            }
            return;
        }

        for (let i = this.initialItemsToShow; i < cards.length; i++) {
            cards[i].classList.add('hidden');
        }

        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.addEventListener('click', function() {
                for (let i = this.initialItemsToShow; i < cards.length; i++) {
                    cards[i].classList.remove('hidden');
                }
                loadMoreBtn.style.display = 'none';
            });
        }
    }

    applyFilters() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        const loadMoreButtons = document.querySelectorAll('.load-more-btn');
        console.log(`Search Term: ${searchTerm}`);
        console.log(`Current Filter: ${this.currentFilter}`);

        if (searchTerm === '') {
            // Restore initial view
            this.allCards.forEach(card => {
                card.style.display = ''; // Reset display
                card.classList.remove('hidden');
            });
            this.setupInitialView();
        } else {
            // Apply search filters
            let visibleCount = 0;
            this.allCards.forEach(card => {
                const cardType = card.dataset.type || 'all';
                const cardTitle = card.getAttribute('data-title')?.toLowerCase() || card.querySelector('h5')?.textContent.toLowerCase() || '';
                const cardDescription = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
                const cardTags = card.querySelector('.card-tags')?.textContent.toLowerCase() || '';
                const cardContent = [cardTitle, cardDescription, cardTags].join(' ');

                const filterMatch = this.currentFilter === 'all' || cardType === this.currentFilter;
                const searchMatch = cardContent.includes(searchTerm);

                console.log(`Card: ${cardTitle}, Filter Match: ${filterMatch}, Search Match: ${searchMatch}`);

                if (filterMatch && searchMatch) {
                    card.style.display = 'block';
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            loadMoreButtons.forEach(btn => btn.style.display = 'none');
            this.showNoResultsMessage(visibleCount === 0);
        }
    }

    showSuggestions() {
        const searchInput = document.getElementById('searchInput');
        const suggestionsContainer = document.getElementById('suggestionsContainer');
        const query = searchInput.value.toLowerCase().trim();

        suggestionsContainer.innerHTML = '';
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const filteredSuggestions = this.suggestionKeywords.filter(kw => kw.toLowerCase().includes(query));

        if (filteredSuggestions.length > 0) {
            suggestionsContainer.style.display = 'block';
            filteredSuggestions.slice(0, 5).forEach(suggestion => {
                const suggestionItem = document.createElement('a');
                suggestionItem.className = 'list-group-item list-group-item-action';
                suggestionItem.href = '#';
                suggestionItem.textContent = suggestion;
                suggestionItem.onclick = (e) => {
                    e.preventDefault();
                    searchInput.value = suggestion;
                    this.applyFilters();
                    suggestionsContainer.innerHTML = '';
                    suggestionsContainer.style.display = 'none';
                    searchInput.focus();
                };
                suggestionsContainer.appendChild(suggestionItem);
            });
        } else {
            suggestionsContainer.style.display = 'none';
        }

        document.addEventListener('click', (e) => {
            if (!suggestionsContainer.contains(e.target) && e.target !== searchInput) {
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.style.display = 'none';
            }
        });
    }

    showNoResultsMessage(show) {
        let noResultsMsg = document.getElementById('noResultsMessage');
        
        if (show && !noResultsMsg) {
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
            const eduGrid = document.getElementById('eduGrid');
            if (eduGrid) {
                eduGrid.parentNode.insertBefore(noResultsMsg, eduGrid.nextSibling);
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
        const allButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allButton) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            allButton.classList.add('active');
            this.currentFilter = 'all';
        }
        this.applyFilters();
    }

    performSearch() {
        const searchBtn = document.querySelector('.youtube-search-btn');
        if (searchBtn) {
            searchBtn.classList.add('searching');
            setTimeout(() => {
                searchBtn.classList.remove('searching');
            }, 1000);
        }
        this.applyFilters();
        const resultsSection = document.querySelector('.education-section') || document.getElementById('eduGrid');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    window.searchManager = new SearchManager();

    const menuToggle = document.getElementById('menu-toggle');
    const filterButtons = document.getElementById('filter-buttons');

    if (menuToggle && filterButtons) {
        menuToggle.addEventListener('click', () => {
            console.log('Menu button clicked');
            filterButtons.classList.toggle('show-filters');
        });
    }
});