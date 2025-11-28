// ===== SISTEMA PRINCIPAL OTIMIZADO - CINEMAX =====

// Estado global da aplicação
const AppState = {
    movies: {
        current: [],
        upcoming: []
    },
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    ui: {
        moviesPerPage: 6,
        currentPage: 1,
        isLoading: false
    },
    filters: {
        genre: 'all',
        rating: 'all',
        search: ''
    }
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Inicializando CineMax...');
    
    // Aguardar carregamento dos dados
    if (typeof MOVIES_DATABASE !== 'undefined') {
        initializeApp();
    } else {
        // Retry com timeout
        setTimeout(() => {
            if (typeof MOVIES_DATABASE !== 'undefined') {
                initializeApp();
            } else {
                console.error('❌ MOVIES_DATABASE não encontrado!');
                showMessage('Erro ao carregar dados dos filmes', 'error');
            }
        }, 100);
    }
});

function initializeApp() {
    console.log('✅ Iniciando aplicação...');
    
    // Carregar dados dos filmes
    AppState.movies.current = MOVIES_DATABASE.currentMovies || [];
    AppState.movies.upcoming = MOVIES_DATABASE.upcomingMovies || [];
    
    console.log(`📽️ ${AppState.movies.current.length} filmes em cartaz carregados`);
    console.log(`🎭 ${AppState.movies.upcoming.length} próximos lançamentos carregados`);
    
    // Inicializar componentes
    loadMovies();
    loadUpcomingMovies();
    setupEventListeners();
    updateCartCount();
    updateUserInterface();
    setupMobileMenu();
    setupTopBarInteractions();
    
    console.log('🚀 Aplicação inicializada com sucesso!');
}

// ===== INTERAÇÕES DO HEADER =====
function setupTopBarInteractions() {
    // Toggle menu do usuário
    const userBtn = document.querySelector('.user-btn');
    if (userBtn) {
        userBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleUserMenu();
        });
    }

    // Clique no carrinho leva à página do carrinho
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.style.cursor = 'pointer';
        cartBtn.addEventListener('click', () => {
            window.location.href = 'pages/carrinho.html';
        });
    }

    // Fecha menu usuário ao clicar fora
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('userMenu');
        if (!menu) return;
        if (!menu.contains(e.target) && !e.target.closest('.user-btn')) {
            menu.classList.remove('active');
        }
    });
}

function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    if (!menu) return;
    menu.classList.toggle('active');
}

// ===== CARREGAMENTO DE FILMES =====
function loadMovies() {
    const moviesGrid = document.getElementById('moviesGrid');
    if (!moviesGrid) {
        console.warn('⚠️ Grid de filmes não encontrado');
        return;
    }
    
    const moviesToShow = AppState.movies.current.slice(0, AppState.ui.moviesPerPage);
    moviesGrid.innerHTML = moviesToShow.map(createMovieCard).join('');
    
    // Controlar botão "Ver mais"
    updateLoadMoreButton();
    
    console.log(`📺 ${moviesToShow.length} filmes carregados no grid`);
}

function loadUpcomingMovies() {
    const upcomingGrid = document.getElementById('upcomingGrid');
    if (!upcomingGrid || !AppState.movies.upcoming.length) return;
    
    upcomingGrid.innerHTML = AppState.movies.upcoming.map(createUpcomingMovieCard).join('');
    console.log(`🎬 ${AppState.movies.upcoming.length} próximos lançamentos carregados`);
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        const hasMore = AppState.ui.moviesPerPage < AppState.movies.current.length;
        loadMoreBtn.style.display = hasMore ? 'block' : 'none';
    }
}

// ===== CRIAÇÃO DE CARDS =====
// Resolve caminho de imagem para funcionar em páginas dentro de /pages/
function resolveImagePath(path) {
    if (!path) return '';
    // Se começar com assets/ ajusta prefixo caso esteja em /pages/
    if (path.startsWith('assets/')) {
        const needsParent = window.location.pathname.includes('/pages/');
        return (needsParent ? '../' : '') + path;
    }
    return path; // URLs absolutas ou externas
}

function createMovieCard(movie) {
    const price = movie.price || 25.00;
    
    return `
        <div class="movie-card" data-movie-id="${movie.id}">
            <div class="movie-poster">
                <img src="${resolveImagePath(movie.poster)}" alt="${movie.title}" loading="lazy" onerror="handleImageError(this)">
                <div class="movie-overlay">
                    <button class="play-btn" onclick="playTrailer('${movie.trailer || '#'}', event)">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="genre">
                        <i class="fas fa-tag"></i> ${movie.genre}
                    </span>
                    <span class="duration">
                        <i class="fas fa-clock"></i> ${movie.duration}
                    </span>
                    <span class="rating">
                        <i class="fas fa-star"></i> ${movie.rating}
                    </span>
                </div>
                <p class="movie-description">${truncateText(movie.description, 100)}</p>
                <div class="movie-actions">
                    <div class="movie-price">R$ ${price.toFixed(2)}</div>
                    <button class="btn btn-primary" onclick="addToCart(${movie.id}, event)">
                        <i class="fas fa-shopping-cart"></i>
                        Comprar
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createUpcomingMovieCard(movie) {
    const releaseDate = new Date(movie.releaseDate);
    
    return `
        <div class="movie-card upcoming" data-movie-id="${movie.id}">
            <div class="movie-poster">
                <img src="${resolveImagePath(movie.poster)}" alt="${movie.title}" loading="lazy" onerror="handleImageError(this)">
                <div class="movie-overlay">
                    <div class="coming-soon-badge">Em Breve</div>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="genre">
                        <i class="fas fa-tag"></i> ${movie.genre}
                    </span>
                    <span class="duration">
                        <i class="fas fa-clock"></i> ${movie.duration}
                    </span>
                </div>
                <p class="movie-description">${truncateText(movie.description, 100)}</p>
                <div class="movie-actions">
                    <div class="release-date">
                        <i class="fas fa-calendar"></i>
                        ${releaseDate.toLocaleDateString('pt-BR')}
                    </div>
                    <button class="btn btn-secondary notify-btn" onclick="notifyMe(${movie.id}, event)">
                        <i class="fas fa-bell"></i>
                        Me Avise
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ===== TRATAMENTO DE IMAGENS =====
function handleImageError(img) {
    console.warn(`⚠️ Erro ao carregar imagem: ${img.src}`);
    
    // Imagem placeholder usando um serviço online
    img.src = `https://via.placeholder.com/400x600/333333/ffffff?text=${encodeURIComponent('Poster\\nIndisponível')}`;
    img.onerror = null; // Prevent infinite loop
    
    // Adicionar classe para styling especial se necessário
    img.classList.add('placeholder-image');
}

// ===== FUNÇÕES DE INTERAÇÃO =====
function loadMoreMovies() {
    AppState.ui.moviesPerPage += 6;
    loadMovies();
    console.log(`📈 Carregando mais filmes: ${AppState.ui.moviesPerPage}`);
}

function addToCart(movieId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Verificar autenticação
    if (!isUserAuthenticated()) {
        showMessage('Faça login para comprar ingressos', 'warning');
        openModal('loginModal');
        return;
    }
    
    // Encontrar o filme
    const movie = AppState.movies.current.find(m => m.id === movieId);
    if (!movie) {
        showMessage('Filme não encontrado', 'error');
        return;
    }
    
    // Usar sistema de carrinho se disponível
    if (typeof cartSystem !== 'undefined') {
        const success = cartSystem.addItem(movieId);
        if (success) {
            showMessage(`${movie.title} adicionado ao carrinho!`, 'success');
            updateCartCount();
        }
    } else {
        // Fallback simples
        addToCartSimple(movie);
    }
    
    console.log(`🛒 Filme adicionado ao carrinho: ${movie.title}`);
}

function addToCartSimple(movie) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.movieId === movie.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            movieId: movie.id,
            title: movie.title,
            price: movie.price || 25.00,
            poster: movie.poster,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showMessage(`${movie.title} adicionado ao carrinho!`, 'success');
}

function notifyMe(movieId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    if (!isUserAuthenticated()) {
        showMessage('Faça login para receber notificações', 'warning');
        openModal('loginModal');
        return;
    }
    
    const movie = AppState.movies.upcoming.find(m => m.id === movieId);
    if (movie) {
        showMessage(`Você será notificado quando "${movie.title}" estrear!`, 'success');
        console.log(`🔔 Notificação ativada para: ${movie.title}`);
    }
}

function playTrailer(trailerUrl, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    if (trailerUrl && trailerUrl !== '#') {
        window.open(trailerUrl, '_blank');
        console.log(`▶️ Abrindo trailer: ${trailerUrl}`);
    } else {
        showMessage('Trailer não disponível', 'info');
    }
}

function showMovieDetails(movieId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const movie = AppState.movies.current.find(m => m.id === movieId) || 
                  AppState.movies.upcoming.find(m => m.id === movieId);
    
    if (movie) {
        showMessage(`Detalhes de "${movie.title}" - Em desenvolvimento`, 'info');
        console.log(`ℹ️ Detalhes solicitados para: ${movie.title}`);
    }
}

// ===== SISTEMA DE EVENTOS =====
function setupEventListeners() {
    // Eventos de modal
    setupModalEvents();
    
    // Scroll do header
    setupHeaderScroll();
    
    // Eventos de teclado
    document.addEventListener('keydown', handleKeydown);
    
    console.log('🎯 Event listeners configurados');
}

function setupModalEvents() {
    // Fechar modal clicando fora
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    };
}

function setupHeaderScroll() {
    let lastScrollY = 0;
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

function handleKeydown(event) {
    if (event.key === 'Escape') {
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => closeModal(modal.id));
    }
}

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        console.log('📱 Menu mobile configurado');
    }
}

// ===== FUNÇÕES DE MODAL =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        modal.classList.add('active');
        console.log(`📋 Modal aberto: ${modalId}`);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        console.log(`📋 Modal fechado: ${modalId}`);
    }
}

// ===== SISTEMA DE AUTENTICAÇÃO SIMPLIFICADO =====
function isUserAuthenticated() {
    if (typeof authSystem !== 'undefined') {
        return authSystem.isAuthenticated();
    }
    return AppState.user !== null;
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    
    if (!email || !password) {
        showMessage('Preencha todos os campos', 'warning');
        return;
    }
    
    showLoading();
    
    // Simular login
    setTimeout(() => {
        hideLoading();
        
        if (typeof authSystem !== 'undefined') {
            try {
                authSystem.login(email, password);
                updateUserInterface();
                closeModal('loginModal');
                showMessage('Login realizado com sucesso!', 'success');
            } catch (error) {
                showMessage(error.message, 'error');
            }
        } else {
            // Sistema simples
            const user = {
                id: Date.now(),
                name: email.split('@')[0],
                email: email
            };
            
            AppState.user = user;
            localStorage.setItem('user', JSON.stringify(user));
            updateUserInterface();
            closeModal('loginModal');
            showMessage('Login realizado com sucesso!', 'success');
        }
        
        console.log(`👤 Login realizado: ${email}`);
    }, 1000);
}

function handleRegister(event) {
    event.preventDefault();
    
    const inputs = event.target.querySelectorAll('input');
    const name = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;
    const confirmPassword = inputs[3].value;
    
    if (!name || !email || !password || !confirmPassword) {
        showMessage('Preencha todos os campos', 'warning');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('As senhas não coincidem', 'error');
        return;
    }
    
    showLoading();
    
    // Simular registro
    setTimeout(() => {
        hideLoading();
        
        if (typeof authSystem !== 'undefined') {
            try {
                authSystem.register(name, email, password);
                updateUserInterface();
                closeModal('registerModal');
                showMessage('Cadastro realizado com sucesso!', 'success');
            } catch (error) {
                showMessage(error.message, 'error');
            }
        } else {
            // Sistema simples
            const user = {
                id: Date.now(),
                name: name,
                email: email
            };
            
            AppState.user = user;
            localStorage.setItem('user', JSON.stringify(user));
            updateUserInterface();
            closeModal('registerModal');
            showMessage('Cadastro realizado com sucesso!', 'success');
        }
        
        console.log(`👤 Usuário registrado: ${name}`);
    }, 1000);
}

function logout() {
    if (typeof authSystem !== 'undefined') {
        authSystem.logout();
    } else {
        AppState.user = null;
        localStorage.removeItem('user');
    }
    
    updateUserInterface();
    showMessage('Logout realizado com sucesso!', 'info');
    console.log('👤 Usuário desconectado');
}

// ===== INTERFACE DO USUÁRIO =====
function updateUserInterface() {
    const currentUser = typeof authSystem !== 'undefined' ? 
        authSystem.getCurrentUser() : AppState.user;
    
    const userMenu = document.getElementById('userMenu');
    const userBtn = document.querySelector('.user-btn');
    
    if (currentUser && userMenu) {
        userMenu.innerHTML = `
            <div class="user-menu-item" onclick="showUserProfile()">
                <i class="fas fa-user"></i> ${currentUser.name}
            </div>
            <div class="user-menu-item" onclick="showUserOrders()">
                <i class="fas fa-ticket-alt"></i> Meus Ingressos
            </div>
            <div class="user-menu-item" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> Sair
            </div>
        `;
        
        if (userBtn) {
            userBtn.textContent = currentUser.name;
        }
    } else if (userMenu) {
        userMenu.innerHTML = `
            <div class="user-menu-item" onclick="openModal('loginModal')">
                <i class="fas fa-sign-in-alt"></i> Entrar
            </div>
            <div class="user-menu-item" onclick="openModal('registerModal')">
                <i class="fas fa-user-plus"></i> Cadastrar
            </div>
        `;
        
        if (userBtn) {
            userBtn.innerHTML = '<i class="fas fa-user"></i>';
        }
    }
}

function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');
    let totalItems = 0;
    
    if (typeof cartSystem !== 'undefined') {
        totalItems = cartSystem.getTotalQuantity();
    } else {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }
    
    cartCounts.forEach(count => {
        count.textContent = totalItems;
        count.style.display = totalItems > 0 ? 'block' : 'none';
    });
    
    console.log(`🛒 Contador do carrinho atualizado: ${totalItems}`);
}

// ===== FUNÇÕES AUXILIARES =====
function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        console.log(`📍 Scrolling para: ${sectionId}`);
    }
}

function showUserProfile() {
    showMessage('Perfil do usuário - Em desenvolvimento', 'info');
}

function showUserOrders() {
    showMessage('Histórico de pedidos - Em desenvolvimento', 'info');
}

// ===== SISTEMA DE LOADING E MENSAGENS =====
function showLoading() {
    let loader = document.getElementById('globalLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.className = 'loading';
        loader.innerHTML = `
            <div class="loading-spinner"></div>
        `;
        document.body.appendChild(loader);
    }
    loader.style.display = 'flex';
}

function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.style.display = 'none';
    }
}

function showMessage(message, type = 'info') {
    // Remover mensagem anterior
    const existingMessage = document.getElementById('globalMessage');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageEl = document.createElement('div');
    messageEl.id = 'globalMessage';
    messageEl.className = `message message-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    messageEl.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <span>${message}</span>
        <button class="message-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(messageEl);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (messageEl.parentElement) {
            messageEl.remove();
        }
    }, 5000);
    
    console.log(`💬 Mensagem ${type}: ${message}`);
}

// ===== EXPORTAÇÕES GLOBAIS =====
window.AppState = AppState;
window.addToCart = addToCart;
window.notifyMe = notifyMe;
window.playTrailer = playTrailer;
window.showMovieDetails = showMovieDetails;
window.handleImageError = handleImageError;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.logout = logout;
window.openModal = openModal;
window.closeModal = closeModal;
window.loadMoreMovies = loadMoreMovies;
window.scrollToSection = scrollToSection;
window.showUserProfile = showUserProfile;
window.showUserOrders = showUserOrders;
window.toggleUserMenu = toggleUserMenu;

console.log('🎬 Sistema CineMax otimizado carregado!');

// ===== HERO VIDEO (Landing) =====
(function initHeroVideo(){
    // Primeiro tenta vídeo nativo (caso exista) senão assume iframe do YouTube
    const nativeVideo = document.getElementById('heroVideo');
    const ytIframe = document.querySelector('.hero-video-embed');
    const wrapper = document.querySelector('.hero-video-wrapper');

    if (nativeVideo) {
        const markLoaded = () => requestAnimationFrame(() => nativeVideo.classList.add('loaded'));
        if (nativeVideo.readyState >= 2) markLoaded(); else {
            nativeVideo.addEventListener('loadeddata', markLoaded, { once: true });
            nativeVideo.addEventListener('canplay', markLoaded, { once: true });
        }
        nativeVideo.addEventListener('error', () => {
            console.warn('⚠️ Erro ao carregar vídeo do hero (native).');
            nativeVideo.remove();
            if (wrapper) {
                wrapper.style.background = "linear-gradient(135deg, rgba(26,37,47,0.8), rgba(74,144,226,0.65)), url('https://images.unsplash.com/photo-1489599150337-cb6e5adbf088?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat";
            }
        }, { once: true });
        return;
    }

    if (ytIframe) {
        // Alguns browsers não disparam load direto no iframe de YouTube, usar pequeno timeout como fallback
        let loaded = false;
        const markLoaded = () => {
            if (loaded) return;
            loaded = true;
            ytIframe.classList.add('loaded');
        };
        ytIframe.addEventListener('load', markLoaded, { once: true });
        setTimeout(markLoaded, 2500); // fallback em até ~2.5s
    } else if (wrapper) {
        // fallback estático final
        wrapper.style.background = "linear-gradient(135deg, rgba(26,37,47,0.8), rgba(74,144,226,0.65)), url('https://images.unsplash.com/photo-1489599150337-cb6e5adbf088?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat";
    }
})();

// ===== FIM DO SISTEMA PRINCIPAL =====