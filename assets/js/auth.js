// Sistema de Autenticação
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutos
        this.initializeSession();
    }

    // Inicializar sistema de sessão
    initializeSession() {
        if (this.currentUser) {
            this.startSessionTimer();
            this.updateLastActivity();
        }
    }

    // Registrar novo usuário
    async register(userData) {
        const { name, email, password, confirmPassword } = userData;
        
        // Validações
        const validation = this.validateRegistrationData(userData);
        if (!validation.isValid) {
            throw new Error(validation.message);
        }
        
        // Verificar se usuário já existe
        const existingUser = this.users.find(user => user.email === email);
        if (existingUser) {
            throw new Error('Usuário já cadastrado com este e-mail');
        }
        
        // Criar novo usuário
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: this.hashPassword(password), // Em produção, use bcrypt
            createdAt: new Date().toISOString(),
            profile: {
                phone: '',
                birthDate: '',
                preferences: {
                    genres: [],
                    notifications: true,
                    newsletter: true
                }
            },
            purchaseHistory: [],
            favorites: [],
            notifications: []
        };
        
        this.users.push(newUser);
        this.saveUsersToStorage();
        
        return this.sanitizeUserData(newUser);
    }

    // Login do usuário
    async login(email, password) {
        // Validações básicas
        if (!email || !password) {
            throw new Error('E-mail e senha são obrigatórios');
        }
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Buscar usuário
        const user = this.users.find(u => u.email === email);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        
        // Verificar senha
        if (!this.verifyPassword(password, user.password)) {
            throw new Error('Senha incorreta');
        }
        
        // Atualizar último login
        user.lastLogin = new Date().toISOString();
        this.saveUsersToStorage();
        
        // Definir usuário atual
        const sanitizedUser = this.sanitizeUserData(user);
        this.currentUser = sanitizedUser;
        this.saveCurrentUserToStorage();
        
        // Iniciar sessão
        this.startSessionTimer();
        this.updateLastActivity();
        
        return sanitizedUser;
    }

    // Logout do usuário
    logout() {
        this.currentUser = null;
        this.clearSessionTimer();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('lastActivity');
        
        // Disparar evento de logout
        window.dispatchEvent(new CustomEvent('userLogout'));
    }

    // Verificar se usuário está autenticado
    isAuthenticated() {
        return this.currentUser !== null && this.isSessionValid();
    }

    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }

    // Atualizar perfil do usuário
    async updateProfile(profileData) {
        if (!this.isAuthenticated()) {
            throw new Error('Usuário não autenticado');
        }
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex === -1) {
            throw new Error('Usuário não encontrado');
        }
        
        // Atualizar dados
        const updatedUser = {
            ...this.users[userIndex],
            name: profileData.name || this.users[userIndex].name,
            profile: {
                ...this.users[userIndex].profile,
                ...profileData.profile
            },
            updatedAt: new Date().toISOString()
        };
        
        this.users[userIndex] = updatedUser;
        this.currentUser = this.sanitizeUserData(updatedUser);
        
        this.saveUsersToStorage();
        this.saveCurrentUserToStorage();
        
        return this.currentUser;
    }

    // Alterar senha
    async changePassword(currentPassword, newPassword, confirmPassword) {
        if (!this.isAuthenticated()) {
            throw new Error('Usuário não autenticado');
        }
        
        // Validações
        if (!currentPassword || !newPassword || !confirmPassword) {
            throw new Error('Todos os campos são obrigatórios');
        }
        
        if (newPassword !== confirmPassword) {
            throw new Error('Nova senha e confirmação não coincidem');
        }
        
        if (newPassword.length < 6) {
            throw new Error('Nova senha deve ter pelo menos 6 caracteres');
        }
        
        // Buscar usuário
        const user = this.users.find(u => u.id === this.currentUser.id);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        
        // Verificar senha atual
        if (!this.verifyPassword(currentPassword, user.password)) {
            throw new Error('Senha atual incorreta');
        }
        
        // Atualizar senha
        user.password = this.hashPassword(newPassword);
        user.passwordChangedAt = new Date().toISOString();
        
        this.saveUsersToStorage();
        
        return true;
    }

    // Adicionar filme aos favoritos
    addToFavorites(movieId) {
        if (!this.isAuthenticated()) {
            throw new Error('Usuário não autenticado');
        }
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex === -1) return false;
        
        if (!this.users[userIndex].favorites.includes(movieId)) {
            this.users[userIndex].favorites.push(movieId);
            this.currentUser.favorites.push(movieId);
            
            this.saveUsersToStorage();
            this.saveCurrentUserToStorage();
            
            return true;
        }
        
        return false;
    }

    // Remover filme dos favoritos
    removeFromFavorites(movieId) {
        if (!this.isAuthenticated()) {
            throw new Error('Usuário não autenticado');
        }
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex === -1) return false;
        
        this.users[userIndex].favorites = this.users[userIndex].favorites.filter(id => id !== movieId);
        this.currentUser.favorites = this.currentUser.favorites.filter(id => id !== movieId);
        
        this.saveUsersToStorage();
        this.saveCurrentUserToStorage();
        
        return true;
    }

    // Verificar se filme é favorito
    isFavorite(movieId) {
        if (!this.isAuthenticated()) return false;
        return this.currentUser.favorites.includes(movieId);
    }

    // Adicionar compra ao histórico
    addPurchaseToHistory(purchaseData) {
        if (!this.isAuthenticated()) return false;
        
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex === -1) return false;
        
        const purchase = {
            id: Date.now(),
            ...purchaseData,
            purchaseDate: new Date().toISOString(),
            status: 'confirmed'
        };
        
        this.users[userIndex].purchaseHistory.push(purchase);
        if (!this.currentUser.purchaseHistory) {
            this.currentUser.purchaseHistory = [];
        }
        this.currentUser.purchaseHistory.push(purchase);
        
        this.saveUsersToStorage();
        this.saveCurrentUserToStorage();
        
        return purchase;
    }

    // Obter histórico de compras
    getPurchaseHistory() {
        if (!this.isAuthenticated()) return [];
        return this.currentUser.purchaseHistory || [];
    }

    // Validar dados de registro
    validateRegistrationData(userData) {
        const { name, email, password, confirmPassword } = userData;
        
        if (!name || name.trim().length < 2) {
            return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
        }
        
        if (!email || !this.isValidEmail(email)) {
            return { isValid: false, message: 'E-mail inválido' };
        }
        
        if (!password || password.length < 6) {
            return { isValid: false, message: 'Senha deve ter pelo menos 6 caracteres' };
        }
        
        if (password !== confirmPassword) {
            return { isValid: false, message: 'Senhas não coincidem' };
        }
        
        return { isValid: true };
    }

    // Validar e-mail
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Hash da senha (versão simples - use bcrypt em produção)
    hashPassword(password) {
        // Esta é uma implementação muito simples apenas para demonstração
        // Em produção, use uma biblioteca como bcrypt
        return btoa(password + 'salt123');
    }

    // Verificar senha
    verifyPassword(password, hashedPassword) {
        return this.hashPassword(password) === hashedPassword;
    }

    // Remover dados sensíveis do usuário
    sanitizeUserData(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }

    // Verificar validade da sessão
    isSessionValid() {
        const lastActivity = localStorage.getItem('lastActivity');
        if (!lastActivity) return false;
        
        const timeDiff = Date.now() - parseInt(lastActivity);
        return timeDiff < this.sessionTimeout;
    }

    // Atualizar última atividade
    updateLastActivity() {
        localStorage.setItem('lastActivity', Date.now().toString());
    }

    // Iniciar timer de sessão
    startSessionTimer() {
        this.clearSessionTimer();
        this.sessionTimer = setInterval(() => {
            if (!this.isSessionValid()) {
                this.logout();
                window.dispatchEvent(new CustomEvent('sessionExpired'));
            }
        }, 60000); // Verificar a cada minuto
    }

    // Limpar timer de sessão
    clearSessionTimer() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
        }
    }

    // Salvar usuários no localStorage
    saveUsersToStorage() {
        localStorage.setItem('registeredUsers', JSON.stringify(this.users));
    }

    // Salvar usuário atual no localStorage
    saveCurrentUserToStorage() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    // Recuperar senha (simulação)
    async requestPasswordReset(email) {
        if (!email || !this.isValidEmail(email)) {
            throw new Error('E-mail inválido');
        }
        
        const user = this.users.find(u => u.email === email);
        if (!user) {
            throw new Error('E-mail não encontrado');
        }
        
        // Simular envio de e-mail
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Em uma aplicação real, você enviaria um e-mail com link de reset
        console.log(`Link de reset enviado para: ${email}`);
        
        return true;
    }
}

// Instância global do sistema de autenticação
const authSystem = new AuthSystem();

// Eventos de autenticação
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar atividade quando usuário interage com a página
    document.addEventListener('click', () => {
        if (authSystem.isAuthenticated()) {
            authSystem.updateLastActivity();
        }
    });
    
    document.addEventListener('keydown', () => {
        if (authSystem.isAuthenticated()) {
            authSystem.updateLastActivity();
        }
    });
    
    // Escutar eventos de logout
    window.addEventListener('userLogout', () => {
        showMessage('Logout realizado com sucesso!', 'info');
        updateUserInterface();
    });
    
    // Escutar expiração de sessão
    window.addEventListener('sessionExpired', () => {
        showMessage('Sua sessão expirou. Faça login novamente.', 'warning');
        updateUserInterface();
    });
});

// Funções auxiliares para integração com o sistema principal
function updateAuthInterface() {
    const userBtn = document.querySelector('.user-btn');
    const userMenu = document.getElementById('userMenu');
    
    if (authSystem.isAuthenticated() && userMenu) {
        const user = authSystem.getCurrentUser();
        userMenu.innerHTML = `
            <div class="user-menu-item" onclick="showUserProfile()">
                <i class="fas fa-user"></i> ${user.name}
            </div>
            <div class="user-menu-item" onclick="showUserOrders()">
                <i class="fas fa-ticket-alt"></i> Meus Ingressos
            </div>
            <div class="user-menu-item" onclick="showFavorites()">
                <i class="fas fa-heart"></i> Favoritos
            </div>
            <div class="user-menu-item" onclick="showUserSettings()">
                <i class="fas fa-cog"></i> Configurações
            </div>
            <div class="user-menu-item" onclick="authSystem.logout()">
                <i class="fas fa-sign-out-alt"></i> Sair
            </div>
        `;
    } else if (userMenu) {
        userMenu.innerHTML = `
            <div class="user-menu-item" onclick="openModal('loginModal')">
                <i class="fas fa-sign-in-alt"></i> Entrar
            </div>
            <div class="user-menu-item" onclick="openModal('registerModal')">
                <i class="fas fa-user-plus"></i> Cadastrar
            </div>
        `;
    }
}

// Funções placeholder para funcionalidades futuras
function showUserProfile() {
    showMessage('Perfil do usuário - Em desenvolvimento', 'info');
}

function showUserOrders() {
    const history = authSystem.getPurchaseHistory();
    if (history.length === 0) {
        showMessage('Você ainda não fez nenhuma compra', 'info');
    } else {
        showMessage(`Você tem ${history.length} compra(s) no histórico`, 'info');
    }
}

function showFavorites() {
    const user = authSystem.getCurrentUser();
    if (user && user.favorites && user.favorites.length > 0) {
        showMessage(`Você tem ${user.favorites.length} filme(s) favorito(s)`, 'info');
    } else {
        showMessage('Você ainda não tem filmes favoritos', 'info');
    }
}

function showUserSettings() {
    showMessage('Configurações do usuário - Em desenvolvimento', 'info');
}

// Atualizar interface quando a página carrega
if (typeof updateUserInterface === 'function') {
    updateUserInterface = updateAuthInterface;
} else {
    window.updateUserInterface = updateAuthInterface;
}

// Exportar para uso global
window.authSystem = authSystem;
window.updateAuthInterface = updateAuthInterface;