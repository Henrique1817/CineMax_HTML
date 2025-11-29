# 🎬 CineMax - Sistema Completo de Cinema

Um projeto completo de cinema desenvolvido em HTML5, CSS3 e JavaScript ES6+, incluindo sistema de autenticação, catálogo de filmes, programação de sessões, promoções e **carrinho de compras completo**.

## ✨ Funcionalidades Implementadas

### 🧩 Visão Geral do Sistema

- **Catálogo de Filmes**: carregado de `assets/js/movies-data.js` com pôster, sinopse, classificação e trailers.
- **Filtros Inteligentes**: por gênero, nota mínima e busca textual (título, diretor, elenco).
- **Paginação Incremental**: botão "Carregar Mais" gerenciado por `main-optimized.js`.
- **Autenticação Simulada**: login/registro com interface e estado em `auth.js`.
- **Carrinho Completo**: `cart.js` com itens, quantidade, cupons, checkout e persistência em LocalStorage.
- **Programação de Sessões**: dados de salas, horários e precificação dinâmica.
- **Promoções**: regras configuráveis e validações (dia, horário, quantidade).
- **Responsividade**: CSS otimizado e componentes adaptativos.

### 🛒 Carrinho de Compras (Detalhes)
- **Ações**: adicionar/remover, alterar quantidade, limpar carrinho.
- **Cupons**: `DESCONTO10`, `PRIMEIRA`, `ESTUDANTE`, `VIP30`, `FRETE`.
- **Checkout**: 3 etapas (Dados → Pagamento → Confirmação).
- **Pagamentos**: cartão, PIX, parcelamento (simulado).
- **Cálculos**: subtotal, descontos, taxas, total final com arredondamento.
- **Persistência**: LocalStorage, integração com autenticação.
- **Como testar**: abrir `pages/filmes.html`, clicar "Comprar" e revisar em `pages/carrinho.html`.

### 🚀 Como Rodar Localmente

#### Opção recomendada (Node + npm)
Requer Node.js instalado.

```powershell
# Instalar dependências (apenas na primeira vez)
npm install

# Servidor de desenvolvimento com auto-reload
npm run dev
# Acesse: http://localhost:5173/

# Servidor simples (porta 8080)
npm start
# Acesse: http://localhost:8080/
```

#### Alternativas (sem Node)
```powershell
# Python 3 (Windows)
py -3 -m http.server 8000
# ou
python -m http.server 8000

# PHP
php -S localhost:8000
```

#### Dica (VS Code)
Você também pode usar a extensão "Live Server" para abrir o `index.html` com hot reload.

## 📁 Estrutura do Projeto

```
.
├── index.html
├── IMAGENS-CORRIGIDAS.md
├── OTIMIZACOES.md
├── README.md
├── package.json
├── assets/
│   ├── css/
│   │   ├── promocao.css
│   │   ├── responsive.css
│   │   └── style-optimized.css
│   ├── images/
│   ├── js/
│   │   ├── auth.js            # Autenticação (simulada)
│   │   ├── cart.js            # Carrinho (novo)
│   │   ├── main-optimized.js  # Funcionalidades principais
│   │   └── movies-data.js     # Base de dados/config
│   └── videos/
└── pages/
  ├── carrinho.html         # Carrinho e checkout
  ├── filmes.html           # Catálogo de filmes
  ├── programacao.html      # Grade de horários
  └── promocoes.html        # Promoções
```

## 🎨 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e moderna
- **CSS3**: 
  - Flexbox e CSS Grid para layouts responsivos
  - Animações e transições suaves
  - Variáveis CSS para tema consistente
  - Media queries para responsividade
- **JavaScript (ES6+)**:
  - Classes e modules
  - Local Storage para persistência de dados
  - Event handling avançado
  - Programação orientada a objetos
- **Bibliotecas Externas**:
  - Font Awesome para ícones
  - Google Fonts (Roboto) para tipografia
 - **Ferramentas de Desenvolvimento**:
   - `http-server` via npm para servir o site (`npm run dev`/`npm start`)
   - VS Code + extensão Live Server (opcional)

## 🎭 Funcionalidades por Página

### 🏠 **Página Inicial (index.html)**
- Hero section com banner atrativo
- Grid de filmes em cartaz
- Seção de próximos lançamentos
- Cards de promoções especiais
- Sistema de notificações
- Menu de navegação responsivo

### 🎥 **Catálogo de Filmes (filmes.html)**
- Lista completa de filmes disponíveis
- Filtros por:
  - Gênero (Ação, Ficção Científica, Drama, etc.)
  - Classificação por estrelas
  - Busca por título, diretor ou elenco
- Paginação com "Carregar Mais"
- Cards informativos com poster, sinopse e classificação
 - Tratamento de imagens: fallback automático para placeholder se o pôster falhar

### 📅 **Programação (programacao.html)**
- Seletor de datas (próximos 7 dias)
- Grade de horários por filme e sala
- Informações de salas (IMAX, 3D, 4DX, etc.)
- Disponibilidade de assentos em tempo real
- Preços dinâmicos baseados em horário e tipo de sala

### 🎁 **Promoções (promocoes.html)**
- Sistema de promoções ativas
- Programa de fidelidade "CineMax Plus"
- Newsletter para ofertas exclusivas
- Promoções futuras com sistema de lembretes

## 🔐 Sistema de Autenticação

### Funcionalidades de Login
- **Registro de usuários** com validação de dados
- **Login seguro** com hash de senha (simulado)
- **Sessão persistente** com timeout automático
- **Menu de usuário** com opções personalizadas
- **Histórico de compras** e favoritos

### Dados Armazenados
- Informações do perfil do usuário
- Histórico de compras
- Filmes favoritos
- Preferências de notificação

## 🛒 Sistema de E-commerce

### Carrinho de Compras
- Adição/remoção de ingressos
- Cálculo automático de preços
- Aplicação de promoções
- Persistência no Local Storage

### Cálculo de Preços
- Preço base por filme
- Multiplicadores por tipo de sala:
  - Standard: 1.0x
  - 3D: 1.3x
  - IMAX: 1.5x
  - Premium: 1.8x
  - 4DX: 2.0x
- Ajustes por horário e dia da semana
- Aplicação automática de promoções

## 📱 Design Responsivo

### Breakpoints
- **Mobile Small**: até 360px
- **Mobile Large**: até 480px
- **Tablet**: até 768px
- **Desktop Small**: até 1024px
- **Desktop Large**: 1200px+

### Adaptações por Dispositivo
- **Menu hamburger** em telas menores
- **Grid flexível** para cards de filmes
- **Typography scaling** responsiva
- **Touch-friendly** buttons e interações
- **Optimized images** para diferentes densidades

## 🎯 Próximos Passos de Desenvolvimento

### 1. **Sistema de Reserva de Assentos**
- Mapa visual da sala de cinema
- Seleção interativa de assentos
- Diferentes categorias (normal, premium, deficiente)
- Validação de disponibilidade em tempo real

### 2. **Página de Detalhes do Filme**
- Informações completas do filme
- Galeria de imagens e trailers
- Sistema de avaliações e comentários
- Integração com APIs de filmes (TMDB)

### 3. **Sistema de Pagamento**
- Múltiplas formas de pagamento
- Integração com gateways (simulado)
- Confirmação por email
- Geração de ingressos em PDF

### 4. **Painel Administrativo**
- Gestão de filmes e sessões
- Relatórios de vendas
- Gerenciamento de usuários
- Configuração de promoções

### 5. **Melhorias Técnicas Planejadas**
- Migrar pôsteres para caminho absoluto `/assets/...` e remover helper de resolução.
- Separar dados em JSON e carregar via fetch (mock), melhorando manutenção.
- Adicionar testes unitários básicos para utilitários (preço, promoções).
- Otimizar imagens (WebP/AVIF), gerar thumbnails e lazy loading avançado.
- Automatizar build (Vite/Parcel) para minificação e cache busting.

## 🔧 Configuração e Customização

### Variáveis CSS Principais
```css
:root {
    --primary-color: #e50914;    /* Cor principal (vermelho Netflix) */
    --secondary-color: #221f1f;  /* Cor secundária (cinza escuro) */
    --dark-color: #141414;       /* Cor de fundo escura */
    --light-color: #ffffff;      /* Cor clara */
    --text-color: #333333;       /* Cor do texto */
    --gray-color: #666666;       /* Cor cinza para texto secundário */
}
```

### Configuração de Filmes
O arquivo `movies-data.js` contém:
- Base de dados de filmes
- Configurações de salas
- Sistema de promoções
- Utilitários para cálculo de preços

## 🎪 Demonstração das Funcionalidades

### Para Testar o Sistema:
1. **Navegue pelas páginas** usando o menu superior
2. **Experimente os filtros** na página de filmes
3. **Teste o sistema de login** (qualquer email/senha funciona)
4. **Adicione filmes ao carrinho** e veja o contador atualizar
5. **Explore as promoções** e o programa de fidelidade
6. **Teste em diferentes dispositivos** para ver a responsividade

### Dados de Teste:
- **Login**: Qualquer email válido + senha com 6+ caracteres
- **Filmes**: 8 filmes em cartaz + 4 próximos lançamentos
- **Salas**: 5 tipos diferentes (Standard, 3D, IMAX, Premium, 4DX)
- **Promoções**: 4 promoções ativas com diferentes condições

## 🚀 Performance e Otimizações

### Otimizações Implementadas
- **Lazy loading** para imagens
- **CSS minificado** e organizado
- **JavaScript modular** para melhor manutenção
- **Local Storage** para reduzir requisições
- **Animações CSS** com GPU acceleration
- **Font loading** otimizado
- **Mobile-first** approach

### Métricas de Performance
- **First Contentful Paint**: < 2s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 90+ (Performance)
- **Peso total**: < 1MB (sem imagens externas)

## 📄 Licença e Uso

Este projeto é desenvolvido para fins educacionais e demonstrativos. Você pode:
- ✅ Usar como base para seus projetos
- ✅ Modificar e adaptar o código
- ✅ Estudar as implementações
- ✅ Contribuir com melhorias

### Créditos
- **Imagens**: Unsplash (placeholder images)
- **Ícones**: Font Awesome
- **Fonts**: Google Fonts (Roboto)

---

## 🤝 Contribuição

Sinta-se à vontade para contribuir com:
- 🐛 Correção de bugs
- ✨ Novas funcionalidades  
- 📝 Melhorias na documentação
- 🎨 Aprimoramentos no design
- 📱 Otimizações para mobile

**Desenvolvido com ❤️ para demonstrar as possibilidades do desenvolvimento web moderno.**