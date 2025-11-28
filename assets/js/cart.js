// Sistema de Carrinho de Compras
class CartSystem {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
        this.coupons = {
            'DESCONTO10': { type: 'percentage', value: 10, description: '10% de desconto' },
            'PRIMEIRA': { type: 'percentage', value: 15, description: '15% desconto primeira compra' },
            'ESTUDANTE': { type: 'percentage', value: 20, description: '20% desconto estudante' },
            'VIP30': { type: 'fixed', value: 30.00, description: 'R$ 30 de desconto' },
            'FRETE': { type: 'percentage', value: 0, description: 'Taxa de conveniência grátis' }
        };
        this.appliedCoupons = [];
        this.convenienceFee = 5.00; // Taxa fixa de conveniência
        this.taxRate = 0.0; // Taxa de imposto (0% para ingressos de cinema)
    }

    // Adicionar item ao carrinho
    addItem(movieId, options = {}) {
        // Buscar filme na base de dados
        const movie = MOVIES_DATABASE.currentMovies.find(m => m.id === movieId) ||
                     MOVIES_DATABASE.upcomingMovies.find(m => m.id === movieId);
        if (!movie) return false;

        const item = {
            id: Date.now(),
            movieId: movieId,
            title: movie.title,
            poster: movie.poster,
            genre: movie.genre,
            duration: movie.duration,
            rating: movie.rating,
            price: options.price || movie.price || MOVIES_DATABASE.basePrice || 25.00,
            quantity: options.quantity || 1,
            showtime: options.showtime || movie.showtimes?.[0] || '19:00',
            date: options.date || new Date().toISOString().split('T')[0],
            theater: options.theater || 'Sala 1',
            seats: options.seats || [],
            addedAt: new Date().toISOString()
        };

        // Verificar se já existe item similar
        const existingItem = this.cart.find(cartItem => 
            cartItem.movieId === movieId && 
            cartItem.showtime === item.showtime && 
            cartItem.date === item.date &&
            cartItem.theater === item.theater
        );

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.cart.push(item);
        }

        this.saveCart();
        return true;
    }

    // Remover item do carrinho
    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
    }

    // Atualizar quantidade de item
    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(item => item.id === itemId);
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            this.saveCart();
            return true;
        } else if (item && newQuantity <= 0) {
            this.removeItem(itemId);
            return true;
        }
        return false;
    }

    // Limpar carrinho
    clear() {
        this.cart = [];
        this.appliedCoupons = [];
        this.saveCart();
    }

    // Obter itens do carrinho
    getItems() {
        return [...this.cart];
    }

    // Obter quantidade total de itens
    getTotalQuantity() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Calcular subtotal
    getSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Aplicar cupom
    applyCoupon(code) {
        const coupon = this.coupons[code.toUpperCase()];
        if (!coupon) {
            throw new Error('Cupom inválido');
        }

        if (this.appliedCoupons.find(c => c.code === code.toUpperCase())) {
            throw new Error('Cupom já aplicado');
        }

        this.appliedCoupons.push({
            code: code.toUpperCase(),
            ...coupon
        });

        return coupon;
    }

    // Remover cupom
    removeCoupon(code) {
        this.appliedCoupons = this.appliedCoupons.filter(c => c.code !== code);
    }

    // Calcular desconto total
    getTotalDiscount() {
        const subtotal = this.getSubtotal();
        let totalDiscount = 0;
        let totalFixed = 0;
        let totalPercentage = 0;

        this.appliedCoupons.forEach(coupon => {
            if (coupon.type === 'fixed') {
                totalFixed += coupon.value;
            } else if (coupon.type === 'percentage') {
                totalPercentage += coupon.value;
            }
        });

        // Aplicar desconto percentual
        if (totalPercentage > 0) {
            const percentageDiscount = Math.min(totalPercentage, 100); // Máximo 100%
            totalDiscount += (subtotal * percentageDiscount) / 100;
        }

        // Aplicar desconto fixo
        totalDiscount += totalFixed;

        // Não pode ser maior que o subtotal
        return Math.min(totalDiscount, subtotal);
    }

    // Calcular taxa de conveniência
    getConvenienceFee() {
        // Verificar se há cupom que elimina a taxa
        const hasFreeShipping = this.appliedCoupons.some(c => c.code === 'FRETE');
        return hasFreeShipping ? 0 : this.convenienceFee;
    }

    // Calcular impostos
    getTaxes() {
        const subtotal = this.getSubtotal();
        const discount = this.getTotalDiscount();
        const taxableAmount = subtotal - discount;
        return Math.max(0, taxableAmount * this.taxRate);
    }

    // Calcular total final
    getTotal() {
        const subtotal = this.getSubtotal();
        const discount = this.getTotalDiscount();
        const convenienceFee = this.getConvenienceFee();
        const taxes = this.getTaxes();
        
        return Math.max(0, subtotal - discount + convenienceFee + taxes);
    }

    // Salvar carrinho no localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    // Atualizar contador do carrinho
    updateCartCount() {
        const cartCounts = document.querySelectorAll('.cart-count');
        const totalQuantity = this.getTotalQuantity();
        
        cartCounts.forEach(count => {
            count.textContent = totalQuantity;
            count.style.display = totalQuantity > 0 ? 'block' : 'none';
        });
    }

    // Finalizar compra
    async checkout(paymentData) {
        if (this.cart.length === 0) {
            throw new Error('Carrinho vazio');
        }

        if (!authSystem.isAuthenticated()) {
            throw new Error('Usuário não autenticado');
        }

        // Simular processamento de pagamento
        const orderData = {
            id: Date.now(),
            items: [...this.cart],
            subtotal: this.getSubtotal(),
            discount: this.getTotalDiscount(),
            convenienceFee: this.getConvenienceFee(),
            taxes: this.getTaxes(),
            total: this.getTotal(),
            appliedCoupons: [...this.appliedCoupons],
            paymentData: paymentData,
            user: authSystem.getCurrentUser(),
            createdAt: new Date().toISOString(),
            status: 'confirmed'
        };

        // Simular delay de processamento
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Adicionar ao histórico do usuário
        authSystem.addPurchaseToHistory(orderData);

        // Limpar carrinho
        this.clear();

        return orderData;
    }
}

// Instância global do carrinho
const cartSystem = new CartSystem();

// Funções da página do carrinho
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('carrinho.html')) {
        initializeCartPage();
    }
    
    // Atualizar contador em todas as páginas
    cartSystem.updateCartCount();
});

function initializeCartPage() {
    loadCartItems();
    updateCartSummary();
    updateAuthInterface();
    
    // Escutar mudanças no carrinho
    window.addEventListener('cartUpdated', function() {
        loadCartItems();
        updateCartSummary();
    });
}

function loadCartItems() {
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const items = cartSystem.getItems();

    if (items.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }

    emptyCart.style.display = 'none';
    cartContent.style.display = 'block';

    cartItemsList.innerHTML = items.map(item => createCartItemHTML(item)).join('');
}

function createCartItemHTML(item) {
    const itemTotal = item.price * item.quantity;
    const formattedDate = new Date(item.date).toLocaleDateString('pt-BR');
    
    return `
        <div class="cart-item" data-item-id="${item.id}">
            <div class="item-image">
                <img src="${item.poster}" alt="${item.title}">
            </div>
            
            <div class="item-details">
                <h3 class="item-title">${item.title}</h3>
                <div class="item-meta">
                    <span class="item-genre"><i class="fas fa-tag"></i> ${item.genre}</span>
                    <span class="item-duration"><i class="fas fa-clock"></i> ${item.duration}</span>
                    <span class="item-rating"><i class="fas fa-star"></i> ${item.rating}</span>
                </div>
                <div class="item-session">
                    <span class="session-date"><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    <span class="session-time"><i class="fas fa-clock"></i> ${item.showtime}</span>
                    <span class="session-theater"><i class="fas fa-tv"></i> ${item.theater}</span>
                </div>
                ${item.seats && item.seats.length > 0 ? 
                    `<div class="item-seats">
                        <i class="fas fa-chair"></i> Assentos: ${item.seats.join(', ')}
                    </div>` : ''
                }
            </div>
            
            <div class="item-controls">
                <div class="quantity-controls">
                    <button class="qty-btn minus" onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn plus" onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <div class="item-price">
                    <span class="unit-price">R$ ${item.price.toFixed(2)} cada</span>
                    <span class="total-price">R$ ${itemTotal.toFixed(2)}</span>
                </div>
                
                <button class="remove-item-btn" onclick="removeCartItem(${item.id})">
                    <i class="fas fa-trash"></i>
                    Remover
                </button>
            </div>
        </div>
    `;
}

function updateItemQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;
    
    cartSystem.updateQuantity(itemId, newQuantity);
    showMessage('Quantidade atualizada!', 'success');
}

function removeCartItem(itemId) {
    if (confirm('Tem certeza que deseja remover este item?')) {
        cartSystem.removeItem(itemId);
        showMessage('Item removido do carrinho!', 'info');
    }
}

function clearCart() {
    if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
        cartSystem.clear();
        showMessage('Carrinho limpo!', 'info');
    }
}

function updateCartSummary() {
    const summaryDetails = document.getElementById('summaryDetails');
    const subtotalAmount = document.getElementById('subtotalAmount');
    const discountLine = document.getElementById('discountLine');
    const discountAmount = document.getElementById('discountAmount');
    const taxAmount = document.getElementById('taxAmount');
    const totalAmount = document.getElementById('totalAmount');
    const checkoutBtn = document.getElementById('checkoutBtn');

    const subtotal = cartSystem.getSubtotal();
    const discount = cartSystem.getTotalDiscount();
    const convenienceFee = cartSystem.getConvenienceFee();
    const total = cartSystem.getTotal();
    const items = cartSystem.getItems();

    // Atualizar resumo de itens
    summaryDetails.innerHTML = `
        <div class="summary-items">
            <h4><i class="fas fa-list"></i> Itens (${cartSystem.getTotalQuantity()})</h4>
            ${items.map(item => `
                <div class="summary-item">
                    <span class="summary-item-title">${item.title}</span>
                    <span class="summary-item-qty">x${item.quantity}</span>
                    <span class="summary-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
    `;

    // Atualizar valores
    subtotalAmount.textContent = `R$ ${subtotal.toFixed(2)}`;
    taxAmount.textContent = `R$ ${convenienceFee.toFixed(2)}`;
    totalAmount.textContent = `R$ ${total.toFixed(2)}`;

    // Mostrar/esconder linha de desconto
    if (discount > 0) {
        discountLine.style.display = 'flex';
        discountAmount.textContent = `-R$ ${discount.toFixed(2)}`;
    } else {
        discountLine.style.display = 'none';
    }

    // Atualizar cupons aplicados
    updateAppliedCoupons();

    // Habilitar/desabilitar botão de checkout
    checkoutBtn.disabled = items.length === 0;
}

function updateAppliedCoupons() {
    const appliedCoupons = document.getElementById('appliedCoupons');
    const coupons = cartSystem.appliedCoupons;

    if (coupons.length === 0) {
        appliedCoupons.innerHTML = '';
        return;
    }

    appliedCoupons.innerHTML = `
        <div class="applied-coupons-list">
            ${coupons.map(coupon => `
                <div class="applied-coupon">
                    <div class="coupon-info">
                        <span class="coupon-code">${coupon.code}</span>
                        <span class="coupon-desc">${coupon.description}</span>
                    </div>
                    <button class="remove-coupon-btn" onclick="removeCoupon('${coupon.code}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

function applyCoupon() {
    const couponInput = document.getElementById('couponCode');
    const code = couponInput.value.trim();

    if (!code) {
        showMessage('Digite um código de cupom', 'warning');
        return;
    }

    try {
        const coupon = cartSystem.applyCoupon(code);
        couponInput.value = '';
        updateCartSummary();
        showMessage(`Cupom "${code}" aplicado com sucesso! ${coupon.description}`, 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    }
}

function removeCoupon(code) {
    cartSystem.removeCoupon(code);
    updateCartSummary();
    showMessage(`Cupom "${code}" removido`, 'info');
}

function proceedToCheckout() {
    if (!authSystem.isAuthenticated()) {
        showMessage('Faça login para finalizar a compra', 'warning');
        openModal('loginModal');
        return;
    }

    if (cartSystem.getItems().length === 0) {
        showMessage('Seu carrinho está vazio', 'warning');
        return;
    }

    openCheckoutModal();
}

function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const checkoutBody = document.getElementById('checkoutBody');
    
    // Resetar steps
    document.querySelectorAll('.checkout-steps .step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    document.querySelector('.checkout-steps .step[data-step="1"]').classList.add('active');
    
    // Carregar primeira etapa
    loadCheckoutStep(1);
    
    modal.style.display = 'block';
    modal.classList.add('active');
}

function loadCheckoutStep(stepNumber) {
    const checkoutBody = document.getElementById('checkoutBody');
    const user = authSystem.getCurrentUser();
    
    switch (stepNumber) {
        case 1:
            checkoutBody.innerHTML = createPersonalDataStep(user);
            break;
        case 2:
            checkoutBody.innerHTML = createPaymentStep();
            break;
        case 3:
            checkoutBody.innerHTML = createConfirmationStep();
            break;
    }
}

function createPersonalDataStep(user) {
    return `
        <div class="checkout-step personal-data">
            <h3><i class="fas fa-user"></i> Confirme seus Dados Pessoais</h3>
            <form class="checkout-form" id="personalDataForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Nome Completo *</label>
                        <input type="text" id="fullName" value="${user.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>CPF *</label>
                        <input type="text" id="cpf" placeholder="000.000.000-00" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>E-mail *</label>
                        <input type="email" id="email" value="${user.email || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Telefone *</label>
                        <input type="tel" id="phone" placeholder="(11) 99999-9999" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Data de Nascimento</label>
                    <input type="date" id="birthDate">
                </div>
                
                <div class="checkout-actions">
                    <button type="button" class="btn-secondary" onclick="closeModal('checkoutModal')">
                        Voltar ao Carrinho
                    </button>
                    <button type="submit" class="btn-primary">
                        Continuar para Pagamento
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </form>
        </div>
    `;
}

function createPaymentStep() {
    return `
        <div class="checkout-step payment-step">
            <h3><i class="fas fa-credit-card"></i> Forma de Pagamento</h3>
            <form class="checkout-form" id="paymentForm">
                <div class="payment-methods">
                    <div class="payment-method">
                        <input type="radio" id="creditCard" name="paymentMethod" value="credit" checked>
                        <label for="creditCard">
                            <i class="fas fa-credit-card"></i>
                            Cartão de Crédito
                        </label>
                    </div>
                    <div class="payment-method">
                        <input type="radio" id="debitCard" name="paymentMethod" value="debit">
                        <label for="debitCard">
                            <i class="fas fa-money-check-alt"></i>
                            Cartão de Débito
                        </label>
                    </div>
                    <div class="payment-method">
                        <input type="radio" id="pix" name="paymentMethod" value="pix">
                        <label for="pix">
                            <i class="fas fa-qrcode"></i>
                            PIX
                        </label>
                    </div>
                </div>
                
                <div class="card-details" id="cardDetails">
                    <div class="form-group">
                        <label>Número do Cartão *</label>
                        <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label>Validade *</label>
                            <input type="text" id="cardExpiry" placeholder="MM/AA" required>
                        </div>
                        <div class="form-group">
                            <label>CVV *</label>
                            <input type="text" id="cardCvv" placeholder="000" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Nome no Cartão *</label>
                        <input type="text" id="cardName" required>
                    </div>
                    
                    <div class="installments">
                        <label>Parcelamento</label>
                        <select id="installments">
                            <option value="1">À vista</option>
                            <option value="2">2x sem juros</option>
                            <option value="3">3x sem juros</option>
                            <option value="6">6x com juros</option>
                            <option value="12">12x com juros</option>
                        </select>
                    </div>
                </div>
                
                <div class="pix-details" id="pixDetails" style="display: none;">
                    <div class="pix-info">
                        <i class="fas fa-info-circle"></i>
                        <p>Após confirmar, você receberá um código PIX para pagamento.</p>
                    </div>
                </div>
                
                <div class="checkout-actions">
                    <button type="button" class="btn-secondary" onclick="goToCheckoutStep(1)">
                        <i class="fas fa-arrow-left"></i>
                        Voltar
                    </button>
                    <button type="submit" class="btn-primary">
                        Revisar Pedido
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </form>
        </div>
    `;
}

function createConfirmationStep() {
    const items = cartSystem.getItems();
    const subtotal = cartSystem.getSubtotal();
    const discount = cartSystem.getTotalDiscount();
    const convenienceFee = cartSystem.getConvenienceFee();
    const total = cartSystem.getTotal();
    
    return `
        <div class="checkout-step confirmation-step">
            <h3><i class="fas fa-check-circle"></i> Confirme seu Pedido</h3>
            
            <div class="order-summary">
                <div class="order-items">
                    <h4><i class="fas fa-ticket-alt"></i> Seus Ingressos</h4>
                    ${items.map(item => `
                        <div class="order-item">
                            <div class="item-poster">
                                <img src="${item.poster}" alt="${item.title}">
                            </div>
                            <div class="item-info">
                                <h5>${item.title}</h5>
                                <p>${new Date(item.date).toLocaleDateString('pt-BR')} - ${item.showtime}</p>
                                <p>${item.theater}</p>
                                <p>Quantidade: ${item.quantity}</p>
                            </div>
                            <div class="item-price">
                                R$ ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-total">
                    <div class="total-line">
                        <span>Subtotal:</span>
                        <span>R$ ${subtotal.toFixed(2)}</span>
                    </div>
                    ${discount > 0 ? `
                        <div class="total-line discount">
                            <span>Desconto:</span>
                            <span>-R$ ${discount.toFixed(2)}</span>
                        </div>
                    ` : ''}
                    <div class="total-line">
                        <span>Taxa de conveniência:</span>
                        <span>R$ ${convenienceFee.toFixed(2)}</span>
                    </div>
                    <div class="total-line final">
                        <strong>
                            <span>Total:</span>
                            <span>R$ ${total.toFixed(2)}</span>
                        </strong>
                    </div>
                </div>
            </div>
            
            <div class="terms-checkbox">
                <input type="checkbox" id="acceptTerms" required>
                <label for="acceptTerms">
                    Li e aceito os <a href="#" target="_blank">termos de uso</a> e 
                    <a href="#" target="_blank">política de privacidade</a>
                </label>
            </div>
            
            <div class="checkout-actions">
                <button type="button" class="btn-secondary" onclick="goToCheckoutStep(2)">
                    <i class="fas fa-arrow-left"></i>
                    Voltar
                </button>
                <button type="button" class="btn-primary" onclick="finalizeOrder()" id="finalizeBtn">
                    <i class="fas fa-lock"></i>
                    Finalizar Compra
                </button>
            </div>
        </div>
    `;
}

function goToCheckoutStep(stepNumber) {
    // Atualizar indicador visual
    document.querySelectorAll('.checkout-steps .step').forEach(step => {
        const currentStep = parseInt(step.dataset.step);
        step.classList.remove('active');
        
        if (currentStep < stepNumber) {
            step.classList.add('completed');
        } else if (currentStep === stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('completed');
        }
    });
    
    loadCheckoutStep(stepNumber);
}

// Event listeners para os formulários de checkout
document.addEventListener('submit', function(e) {
    if (e.target.id === 'personalDataForm') {
        e.preventDefault();
        // Validar dados pessoais
        if (validatePersonalData()) {
            goToCheckoutStep(2);
        }
    }
    
    if (e.target.id === 'paymentForm') {
        e.preventDefault();
        // Validar dados de pagamento
        if (validatePaymentData()) {
            goToCheckoutStep(3);
        }
    }
});

// Event listener para mudança de método de pagamento
document.addEventListener('change', function(e) {
    if (e.target.name === 'paymentMethod') {
        const cardDetails = document.getElementById('cardDetails');
        const pixDetails = document.getElementById('pixDetails');
        
        if (e.target.value === 'pix') {
            cardDetails.style.display = 'none';
            pixDetails.style.display = 'block';
        } else {
            cardDetails.style.display = 'block';
            pixDetails.style.display = 'none';
        }
    }
});

function validatePersonalData() {
    const form = document.getElementById('personalDataForm');
    const formData = new FormData(form);
    
    // Validações básicas já são feitas pelo HTML5
    return form.checkValidity();
}

function validatePaymentData() {
    const form = document.getElementById('paymentForm');
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (paymentMethod === 'pix') {
        return true; // PIX não precisa de validação adicional
    }
    
    return form.checkValidity();
}

function finalizeOrder() {
    const acceptTerms = document.getElementById('acceptTerms');
    if (!acceptTerms.checked) {
        showMessage('Você deve aceitar os termos de uso', 'warning');
        return;
    }
    
    const finalizeBtn = document.getElementById('finalizeBtn');
    finalizeBtn.disabled = true;
    finalizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    
    showLoading();
    
    // Coletar dados de pagamento
    const paymentData = collectPaymentData();
    
    // Processar compra
    cartSystem.checkout(paymentData)
        .then(orderData => {
            hideLoading();
            closeModal('checkoutModal');
            showSuccessModal(orderData);
        })
        .catch(error => {
            hideLoading();
            finalizeBtn.disabled = false;
            finalizeBtn.innerHTML = '<i class="fas fa-lock"></i> Finalizar Compra';
            showMessage(`Erro ao processar compra: ${error.message}`, 'error');
        });
}

function collectPaymentData() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const personalData = {
        fullName: document.getElementById('fullName')?.value,
        cpf: document.getElementById('cpf')?.value,
        email: document.getElementById('email')?.value,
        phone: document.getElementById('phone')?.value,
        birthDate: document.getElementById('birthDate')?.value
    };
    
    let paymentInfo = { method: paymentMethod };
    
    if (paymentMethod !== 'pix') {
        paymentInfo = {
            ...paymentInfo,
            cardNumber: document.getElementById('cardNumber')?.value,
            cardExpiry: document.getElementById('cardExpiry')?.value,
            cardCvv: document.getElementById('cardCvv')?.value,
            cardName: document.getElementById('cardName')?.value,
            installments: document.getElementById('installments')?.value
        };
    }
    
    return {
        personal: personalData,
        payment: paymentInfo
    };
}

function showSuccessModal(orderData) {
    const modal = document.getElementById('successModal');
    const purchaseDetails = document.getElementById('purchaseDetails');
    
    purchaseDetails.innerHTML = `
        <div class="success-order-details">
            <div class="order-number">
                <strong>Pedido #${orderData.id}</strong>
            </div>
            <div class="order-summary">
                <p><i class="fas fa-ticket-alt"></i> ${orderData.items.length} ingresso(s)</p>
                <p><i class="fas fa-dollar-sign"></i> Total: R$ ${orderData.total.toFixed(2)}</p>
                <p><i class="fas fa-clock"></i> ${new Date(orderData.createdAt).toLocaleString('pt-BR')}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    modal.classList.add('active');
}

function downloadTickets() {
    showMessage('Ingressos enviados para seu e-mail!', 'success');
    // Aqui implementaria a geração real de PDF
}

// Exportar funções para uso global
window.cartSystem = cartSystem;
window.updateItemQuantity = updateItemQuantity;
window.removeCartItem = removeCartItem;
window.clearCart = clearCart;
window.applyCoupon = applyCoupon;
window.removeCoupon = removeCoupon;
window.proceedToCheckout = proceedToCheckout;
window.goToCheckoutStep = goToCheckoutStep;
window.finalizeOrder = finalizeOrder;
window.downloadTickets = downloadTickets;