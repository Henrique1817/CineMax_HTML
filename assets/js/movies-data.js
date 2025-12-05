// Base de dados dos filmes
const MOVIES_DATABASE = {
    genres: [
        'Ação', 'Drama', 'Comédia', 'Ficção Científica', 'Terror', 'Aventura', 
        'Romance', 'Thriller', 'Animação', 'Documentário', 'Musical', 'Guerra'
    ],
    
    theaters: [
        { id: 1, name: 'Sala 1 - IMAX', capacity: 120, type: 'imax', priceMultiplier: 1.5 },
        { id: 2, name: 'Sala 2 - 3D', capacity: 100, type: '3d', priceMultiplier: 1.3 },
        { id: 3, name: 'Sala 3 - 4DX', capacity: 80, type: '4dx', priceMultiplier: 2.0 },
        { id: 4, name: 'Sala 4 - Standard', capacity: 130, type: 'standard', priceMultiplier: 1.0 },
        { id: 5, name: 'Sala 5 - Premium', capacity: 60, type: 'premium', priceMultiplier: 1.8 }
    ],
    
    showtimes: ['14:00', '16:30', '19:00', '21:30', '22:00'],
    
    basePrice: 25.00,
    
    // Filmes em cartaz expandidos
    currentMovies: [
        {
            id: 1,
            title: "Vingadores: Ultimato",
            genre: "Ação",
            duration: "181 min",
            rating: 8.4,
            poster: "assets/images/ultimato.svg",
            backdrop: "assets/images/1920_ultimato.svg",
            description: "Os heróis mais poderosos da Terra enfrentam o Thanos em uma batalha épica pelo destino do universo. Após os eventos devastadores de Vingadores: Guerra Infinita, o universo está em ruínas.",
            fullDescription: "Os Vingadores restantes devem encontrar uma maneira de reverter as ações de Thanos e restaurar o equilíbrio ao universo. Esta batalha épica testará os limites de cada herói e mudará para sempre o Universo Cinematográfico Marvel.",
            year: 2019,
            director: "Anthony Russo, Joe Russo",
            cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Scarlett Johansson", "Jeremy Renner"],
            trailer: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
            showtimes: ["14:00", "17:30", "21:00"],
            theaters: [1, 2, 4],
            price: 30.00,
            isInTheater: true,
            ageRating: "12",
            language: "Dublado/Legendado",
            country: "EUA"
        },
        {
            id: 2,
            title: "Interestelar",
            genre: "Ficção Científica",
            duration: "169 min",
            rating: 8.6,
            poster: "assets/images/interestelar.svg",
            backdrop: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920&h=1080&fit=crop",
            backdrop: "/assets/images/interestelar_backdrop.jpg",
            description: "Um grupo de exploradores viaja através de um buraco de minhoca no espaço na tentativa de garantir a sobrevivência da humanidade.",
            fullDescription: "Em um futuro próximo, a Terra está se tornando inabitável. Ex-piloto da NASA Cooper deve deixar sua família para liderar uma missão através de um buraco de minhoca para encontrar um novo lar para a humanidade.",
            year: 2014,
            director: "Christopher Nolan",
            cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
            trailer: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
            showtimes: ["15:30", "19:00", "22:30"],
            theaters: [1, 4, 5],
            price: 22.00,
            isInTheater: true,
            ageRating: "10",
            language: "Dublado/Legendado",
            country: "EUA"
        },
        {
            id: 3,
            title: "Pantera Negra",
            genre: "Ação",
            duration: "134 min",
            rating: 7.3,
            poster: "assets/images/pantera.svg",
            backdrop: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop",
            backdrop: "/assets/images/pantera_negra_backdrop.jpg",
            description: "T'Challa retorna para casa para a isolada e tecnologicamente avançada nação africana de Wakanda para servir como novo líder de seu país.",
            fullDescription: "Após a morte de seu pai, T'Challa retorna a Wakanda para assumir o trono. No entanto, ele é desafiado por um poderoso inimigo, e sua habilidade como Pantera Negra é testada quando ele é arrastado para um conflito que coloca o destino de Wakanda e do mundo inteiro em risco.",
            year: 2018,
            director: "Ryan Coogler",
            cast: ["Chadwick Boseman", "Michael B. Jordan", "Lupita Nyong'o", "Danai Gurira"],
            trailer: "https://www.youtube.com/watch?v=xjDjIWPwcPU",
            showtimes: ["16:00", "19:30", "22:45"],
            theaters: [2, 3, 4],
            price: 24.00,
            isInTheater: true,
            ageRating: "12",
            language: "Dublado/Legendado",
            country: "EUA"
        },
        {
            id: 4,
            title: "Matrix Resurrections",
            genre: "Ficção Científica",
            duration: "148 min",
            rating: 5.7,
            poster: "assets/images/matrix.svg",
            backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
            backdrop: "/assets/images/matrix_resurrections_backdrop.jpg",
            description: "Neo vive uma vida aparentemente comum sob sua identidade original como Thomas A. Anderson em San Francisco.",
            fullDescription: "Vinte anos após os eventos de Matrix Revolutions, Neo vive uma vida aparentemente comum como Thomas A. Anderson em San Francisco, tendo esquecido tudo sobre a Matrix. Quando Morpheus lhe oferece novamente a pílula vermelha, Neo descobre que a realidade é mais estranha do que imaginava.",
            year: 2021,
            director: "Lana Wachowski",
            cast: ["Keanu Reeves", "Carrie-Anne Moss", "Yahya Abdul-Mateen II", "Jessica Henwick"],
            trailer: "https://www.youtube.com/watch?v=9ix7TUGVYIo",
            showtimes: ["14:30", "18:00", "21:30"],
            theaters: [1, 2, 4, 5],
            price: 26.00,
            isInTheater: true,
            ageRating: "14",
            language: "Dublado/Legendado",
            country: "EUA"
        },
        {
            id: 5,
            title: "Duna",
            genre: "Ficção Científica",
            duration: "155 min",
            rating: 8.0,
            poster: "assets/images/duna.svg",
            backdrop: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=1920&h=1080&fit=crop",
            backdrop: "/assets/images/duna_backdrop.jpg",
            description: "Paul Atreides, um jovem brilhante e talentoso nascido com um grande destino além de sua compreensão, deve viajar para o planeta mais perigoso do universo.",
            fullDescription: "Paul Atreides, um jovem brilhante e talentoso nascido com um grande destino além de sua compreensão, deve viajar para o planeta mais perigoso do universo para garantir o futuro de sua família e de seu povo. Enquanto forças malévolas explodem em conflito pela preciosa especiaria melange do planeta, apenas aqueles que podem conquistar seus medos sobreviverão.",
            year: 2021,
            director: "Denis Villeneuve",
            cast: ["Timothée Chalamet", "Rebecca Ferguson", "Oscar Isaac", "Josh Brolin"],
            trailer: "https://www.youtube.com/watch?v=n9xhJrPXop4",
            showtimes: ["15:00", "18:30", "22:00"],
            theaters: [1, 3, 4, 5],
            price: 28.00,
            isInTheater: true,
            ageRating: "12",
            language: "Dublado/Legendado",
            country: "EUA"
        },
        {
            id: 6,
            title: "Homem-Aranha: Sem Volta Para Casa",
            genre: "Ação",
            duration: "148 min",
            rating: 8.2,
            poster: "assets/images/homem_aranha.svg",
            backdrop: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1920&h=1080&fit=crop",
            backdrop: "/assets/images/homem_aranha_sem_volta_backdrop.jpg",
            description: "Peter Parker busca a ajuda do Doutor Estranho para fazer com que sua identidade secreta seja esquecida novamente.",
            fullDescription: "Peter Parker é desmascarado e não consegue mais separar sua vida normal dos grandes riscos de ser um super-herói. Quando ele pede ajuda ao Doutor Estranho, os riscos se tornam ainda mais perigosos, forçando-o a descobrir o que realmente significa ser o Homem-Aranha.",
            year: 2021,
            director: "Jon Watts",
            cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch", "Jacob Batalon"],
            trailer: "https://www.youtube.com/watch?v=JfVOs4VSpmA",
            showtimes: ["14:15", "17:45", "21:15"],
            theaters: [1, 2, 3, 4],
            price: 30.00,
            isInTheater: true,
            ageRating: "12",
            language: "Dublado/Legendado",
            country: "EUA"
        },
        {
            id: 7,
            title: "Top Gun: Maverick",
            genre: "Ação",
            duration: "130 min",
            rating: 8.3,
            poster: "assets/images/top_gun.svg",
            backdrop: "https://images.unsplash.com/photo-1517263904808-5dc91e3e7044?w=1920&h=1080&fit=crop",
            backdrop: "/assets/images/top_gun_maverick_backdrop.jpg",
            description: "Depois de mais de 30 anos de serviço como um dos aviadores mais corajosos da Marinha, Pete 'Maverick' Mitchell está de volta.",
            fullDescription: "Depois de mais de 30 anos de serviço como um dos aviadores mais corajosos da Marinha, Pete 'Maverick' Mitchell está onde pertence, empurrando os limites como um piloto de testes corajoso e esquivando-se do avanço na classificação que o aterraria.",
            year: 2022,
            director: "Joseph Kosinski",
            cast: ["Tom Cruise", "Miles Teller", "Jennifer Connelly", "Jon Hamm"],
            trailer: "https://www.youtube.com/watch?v=giXco2jaZ_4",
            showtimes: ["14:45", "17:15", "20:00"],
            theaters: [1, 3, 4, 5],
            price: 27.00,
            isInTheater: true,
            ageRating: "12",
            language: "Dublado/Legendado",
            country: "EUA"
        },
        {
            id: 8,
            title: "Doutor Estranho no Multiverso da Loucura",
            genre: "Ação",
            duration: "126 min",
            rating: 6.9,
            poster: "assets/images/doutor_estranho.svg",
            backdrop: "https://images.unsplash.com/photo-1578896288791-45b7e3e0f2b8?w=1920&h=1080&fit=crop",
            backdrop: "/assets/images/doutor_estranho_multiverso_backdrop.jpg",
            description: "O Doutor Stephen Strange continua sua pesquisa sobre a Joia do Tempo. Mas um velho amigo que virou inimigo põe fim aos seus planos.",
            fullDescription: "Após os eventos de Vingadores: Ultimato, o Dr. Stephen Strange continua sua pesquisa sobre a Joia do Tempo. Mas um velho amigo que virou inimigo põe fim aos seus planos e faz com que Strange desencadeie um mal indescritível.",
            year: 2022,
            director: "Sam Raimi",
            cast: ["Benedict Cumberbatch", "Elizabeth Olsen", "Chiwetel Ejiofor", "Benedict Wong"],
            trailer: "https://www.youtube.com/watch?v=aWzlQ2N6qqg",
            showtimes: ["15:15", "18:45", "22:15"],
            theaters: [2, 3, 4],
            price: 26.00,
            isInTheater: true,
            ageRating: "14",
            language: "Dublado/Legendado",
            country: "EUA"
        }
    ],
    
    // Próximos lançamentos
    upcomingMovies: [
        {
            id: 101,
            title: "Avatar: O Caminho da Água",
            genre: "Ficção Científica",
            duration: "192 min",
            rating: 0,
            poster: "assets/images/avatar.svg",
            backdrop: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
            description: "Jake Sully e Ney'tiri formaram uma família e estão fazendo de tudo para ficarem juntos.",
            fullDescription: "Mais de uma década depois dos acontecimentos do primeiro filme, 'Avatar: O Caminho da Água' começa a contar a história da família Sully (Jake, Neytiri e seus filhos), o problema que os persegue, os esforços que fazem para se manterem seguros, as batalhas que lutam para se manterem vivos e as tragédias que suportam.",
            year: 2025,
            director: "James Cameron",
            cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Kate Winslet"],
            releaseDate: "2025-12-15",
            isInTheater: false,
            ageRating: "12",
            language: "Dublado/Legendado",
            country: "EUA"
        },
        {
            id: 102,
            title: "Thor: Love and Thunder 2",
            genre: "Ação",
            duration: "125 min",
            rating: 0,
            poster: "assets/images/thor.svg",
            backdrop: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
            description: "Thor embarca em uma jornada diferente de tudo que já enfrentou - uma busca pela paz interior.",
            fullDescription: "Thor embarca em uma jornada diferente de tudo que já enfrentou - uma busca pela paz interior. Mas sua aposentadoria é interrompida por um assassino galáctico conhecido como Gorr, o Carniceiro dos Deuses, que busca a extinção dos deuses.",
            year: 2025,
            director: "Taika Waititi",
            cast: ["Chris Hemsworth", "Natalie Portman", "Tessa Thompson", "Christian Bale"],
            releaseDate: "2025-11-08",
            isInTheater: false,
            ageRating: "12",
            language: "Dublado/Legendado",
            country: "EUA"
        },
        {
            id: 103,
            title: "Guardiões da Galáxia Vol. 4",
            genre: "Ação",
            duration: "140 min",
            rating: 0,
            poster: "assets/images/galaxia.svg",
            backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
            description: "Os Guardiões embarcam em uma nova aventura épica para proteger o universo mais uma vez.",
            fullDescription: "Após os eventos traumáticos de Vingadores: Ultimato, os Guardiões da Galáxia devem se reunir para defender o universo e proteger um de seus próprios membros. Se a missão não for totalmente bem-sucedida, isso pode muito bem levar ao fim dos Guardiões como os conhecemos.",
            year: 2026,
            director: "James Gunn",
            cast: ["Chris Pratt", "Zoe Saldana", "Dave Bautista", "Bradley Cooper"],
            releaseDate: "2026-03-20",
            isInTheater: false,
            ageRating: "12",
            language: "Dublado/Legendado",
            country: "EUA"
        }
    ],
    
    // Promoções
    promotions: [
        {
            id: 1,
            title: "Terça-feira é Dia",
            description: "Todas as terças-feiras, ingressos pela metade do preço!",
            discount: 50,
            type: "percentage",
            dayOfWeek: 2, // Terça-feira
            icon: "calendar-week",
            active: true,
            validUntil: "2025-12-31"
        },
        {
            id: 2,
            title: "Família Feliz",
            description: "Compre 4 ingressos e ganhe pipoca grátis!",
            discount: "Pipoca Grátis",
            type: "freebie",
            minimumTickets: 4,
            icon: "users",
            active: true,
            validUntil: "2025-12-31"
        },
        {
            id: 3,
            title: "Estudante",
            description: "Apresente sua carteirinha e ganhe desconto especial",
            discount: 40,
            type: "percentage",
            requiresValidation: true,
            icon: "graduation-cap",
            active: true,
            validUntil: "2025-12-31"
        },
        {
            id: 4,
            title: "Primeira Sessão",
            description: "Sessões antes das 16h com preço especial",
            discount: 30,
            type: "percentage",
            timeRestriction: "16:00",
            icon: "sun",
            active: true,
            validUntil: "2025-12-31"
        }
    ],
    
    // Configurações de preços
    pricing: {
        base: 25.00,
        weekendMultiplier: 1.2,
        holidayMultiplier: 1.5,
        lateNightMultiplier: 0.9,  // Após 22h
        earlyBirdMultiplier: 0.8,  // Antes das 16h
        seniorDiscount: 0.5,       // 50% desconto para idosos
        childDiscount: 0.6         // 40% desconto para crianças
    }
};

// Funções utilitárias para manipulação de dados
const MovieDataUtils = {
    // Buscar filme por ID
    getMovieById: (id) => {
        return MOVIES_DATABASE.currentMovies.find(movie => movie.id === id) ||
               MOVIES_DATABASE.upcomingMovies.find(movie => movie.id === id);
    },
    
    // Filtrar filmes por gênero
    getMoviesByGenre: (genre) => {
        if (genre === 'all') return MOVIES_DATABASE.currentMovies;
        return MOVIES_DATABASE.currentMovies.filter(movie => 
            movie.genre.toLowerCase() === genre.toLowerCase()
        );
    },
    
    // Buscar filmes por título
    searchMovies: (query) => {
        const searchTerm = query.toLowerCase();
        return MOVIES_DATABASE.currentMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.description.toLowerCase().includes(searchTerm) ||
            movie.cast.some(actor => actor.toLowerCase().includes(searchTerm)) ||
            movie.director.toLowerCase().includes(searchTerm)
        );
    },
    
    // Obter filmes por classificação
    getMoviesByRating: (minRating) => {
        return MOVIES_DATABASE.currentMovies.filter(movie => movie.rating >= minRating);
    },
    
    // Calcular preço com base em fatores
    calculatePrice: (basePrice, theater, showtime, date = new Date()) => {
        let finalPrice = basePrice;
        
        // Multiplicador do tipo de sala
        const theaterInfo = MOVIES_DATABASE.theaters.find(t => t.id === theater);
        if (theaterInfo) {
            finalPrice *= theaterInfo.priceMultiplier;
        }
        
        // Multiplicador de fim de semana
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Domingo ou Sábado
            finalPrice *= MOVIES_DATABASE.pricing.weekendMultiplier;
        }
        
        // Multiplicador de horário
        const hour = parseInt(showtime.split(':')[0]);
        if (hour >= 22) {
            finalPrice *= MOVIES_DATABASE.pricing.lateNightMultiplier;
        } else if (hour < 16) {
            finalPrice *= MOVIES_DATABASE.pricing.earlyBirdMultiplier;
        }
        
        return Math.round(finalPrice * 100) / 100; // Arredondar para 2 casas decimais
    },
    
    // Verificar se uma promoção é válida
    isPromotionValid: (promotionId, date = new Date(), ticketCount = 1, showtime = null) => {
        const promotion = MOVIES_DATABASE.promotions.find(p => p.id === promotionId);
        if (!promotion || !promotion.active) return false;
        
        // Verificar validade
        if (new Date(promotion.validUntil) < date) return false;
        
        // Verificar dia da semana
        if (promotion.dayOfWeek && date.getDay() !== promotion.dayOfWeek) return false;
        
        // Verificar quantidade mínima de ingressos
        if (promotion.minimumTickets && ticketCount < promotion.minimumTickets) return false;
        
        // Verificar restrição de horário
        if (promotion.timeRestriction && showtime) {
            const restrictionHour = parseInt(promotion.timeRestriction.split(':')[0]);
            const showtimeHour = parseInt(showtime.split(':')[0]);
            if (showtimeHour >= restrictionHour) return false;
        }
        
        return true;
    },
    
    // Aplicar desconto de promoção
    applyPromotion: (price, promotionId) => {
        const promotion = MOVIES_DATABASE.promotions.find(p => p.id === promotionId);
        if (!promotion) return price;
        
        if (promotion.type === 'percentage') {
            return price * (1 - promotion.discount / 100);
        }
        
        return price; // Para outros tipos de promoção (como brindes)
    },
    
    // Gerar horários aleatórios para um filme
    generateShowtimes: (movieId, date = new Date()) => {
        const baseShowtimes = MOVIES_DATABASE.showtimes;
        const movie = MovieDataUtils.getMovieById(movieId);
        
        if (!movie) return [];
        
        // Filtrar horários com base no tipo de filme e duração
        let availableShowtimes = [...baseShowtimes];
        
        // Se for um filme longo, remover horários muito tardios
        if (parseInt(movie.duration) > 150) {
            availableShowtimes = availableShowtimes.filter(time => {
                const hour = parseInt(time.split(':')[0]);
                return hour <= 21;
            });
        }
        
        return availableShowtimes.slice(0, 3); // Retorna 3 horários por padrão
    }
};

// Exportar para uso global
window.MOVIES_DATABASE = MOVIES_DATABASE;
window.MovieDataUtils = MovieDataUtils;