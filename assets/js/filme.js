let filteredMovies = [];
let currentPage = 0;
const moviesPerPage = 9;
document.addEventListener('DOMContentLoaded', function() {
    loadAllMovies();
    updateCartCount();
    updateAuthInterface();
});
function loadAllMovies() {
    filteredMovies = [...MOVIES_DATABASE.currentMovies];
    displayMovies();
}
function displayMovies() {
    const moviesGrid = document.getElementById('moviesGrid');
    const noResults = document.getElementById('noResults');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (filteredMovies.length === 0) {
        moviesGrid.innerHTML = '';
        noResults.style.display = 'block';
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    noResults.style.display = 'none';
    
    const startIndex = currentPage * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const moviesToShow = filteredMovies.slice(0, endIndex);
    
    moviesGrid.innerHTML = moviesToShow.map(movie => createMovieCard(movie)).join('');
    
    // Mostrar/esconder botão de carregar mais
    if (endIndex >= filteredMovies.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
    
    // Adicionar event listeners
    addMovieCardListeners();
}
function addMovieCardListeners() {
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.movie-actions')) {
                const movieId = parseInt(this.dataset.movieId);
                showMovieDetails(movieId);
            }
        });
    });
}
function applyFilters() {
    const genreFilter = document.getElementById('genreFilter').value;
    const ratingFilter = document.getElementById('ratingFilter').value;
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
    
    // Normaliza strings para comparação insensível a acentos e espaços
    const normalizeSlug = (str) => {
        if (!str) return '';
        return str
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\-]/g, '');
    };
    
    filteredMovies = MOVIES_DATABASE.currentMovies.filter(movie => {
        // Filtro de gênero (insensível a acento e espaços)
        const movieGenreSlug = normalizeSlug(movie.genre);
        const genreMatch = genreFilter === 'all' || movieGenreSlug === genreFilter || movieGenreSlug.includes(genreFilter);
        
        // Filtro de classificação
        const ratingMatch = ratingFilter === 'all' || 
                            movie.rating >= parseFloat(ratingFilter);
        
        // Filtro de busca
        const searchMatch = searchFilter === '' ||
                    movie.title.toLowerCase().includes(searchFilter) ||
                    movie.description.toLowerCase().includes(searchFilter) ||
                    movie.director.toLowerCase().includes(searchFilter) ||
                    (Array.isArray(movie.cast) && movie.cast.some(actor => actor.toLowerCase().includes(searchFilter)));
        
        return genreMatch && ratingMatch && searchMatch;
    });
    
    currentPage = 0;
    displayMovies();
}
function clearFilters() {
    document.getElementById('genreFilter').value = 'all';
    document.getElementById('ratingFilter').value = 'all';
    document.getElementById('searchFilter').value = '';
    
    filteredMovies = [...MOVIES_DATABASE.currentMovies];
    currentPage = 0;
    displayMovies();
}
function loadMoreMovies() {
    currentPage++;
    displayMovies();
}