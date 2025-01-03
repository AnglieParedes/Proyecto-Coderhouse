// Objeto para almacenar el estado de la aplicación
const appState = {
    categories: [],
    newArrivals: [],
    articles: [],
    cart: []
};

// Función principal que se ejecuta cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from JSON file using Promises
    fetchData()
        .then(data => {
            appState.categories = data.categories;
            appState.newArrivals = data.newArrivals;
            appState.articles = data.articles;
            
            // Uso de métodos de arrays para procesar datos
            appState.newArrivals = appState.newArrivals.map(product => ({
                ...product,
                discountPercentage: product.originalPrice 
                    ? Math.round((1 - product.price / product.originalPrice) * 100) 
                    : 0
            }));

            // Generación dinámica del DOM
            renderCategories();
            renderNewArrivals();
            renderArticles();
            initializeSwiper();
        })
        .catch(error => console.error('Error loading data:', error));

    // Event Listeners
    document.getElementById('searchButton').addEventListener('click', handleSearch);
    document.getElementById('accountButton').addEventListener('click', handleAccount);
    document.getElementById('cartButton').addEventListener('click', handleCart);
    document.getElementById('viewAllProducts').addEventListener('click', handleViewAllProducts);
    document.getElementById('viewAllArticles').addEventListener('click', handleViewAllArticles);
    document.getElementById('newsletterForm').addEventListener('submit', handleNewsletterSignup);

    // Event delegation for dynamic elements
    document.body.addEventListener('click', handleDynamicClicks);
});

// Función para manejar clics en elementos dinámicos
const handleDynamicClicks = (event) => {
    if (event.target.classList.contains('add-to-cart')) {
        const productId = event.target.dataset.productId;
        addToCart(productId);
    }
};

// Fetch data using Promises
const fetchData = () => {
    return fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
};

// Funciones para renderizar elementos del DOM
const renderCategories = () => {
    const categoriesGrid = document.getElementById('categoriesGrid');
    categoriesGrid.innerHTML = appState.categories
        .map(category => `
            <div class="category-card">
                <img src="${category.image}" alt="${category.name}">
                <div class="category-overlay">
                    <h3>${category.name}</h3>
                </div>
            </div>
        `)
        .join('');
};

const renderNewArrivals = () => {
    const newArrivalsGrid = document.getElementById('newArrivalsGrid');
    newArrivalsGrid.innerHTML = appState.newArrivals
        .map(product => `
            <div class="swiper-slide">
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        ${product.isNew ? '<span class="new-badge">New</span>' : ''}
                        ${product.discountPercentage > 0 ? `<span class="discount-badge">-${product.discountPercentage}%</span>` : ''}
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-rating">
                            ${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}
                        </div>
                        <div class="product-price">
                            $${product.price.toFixed(2)}
                            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `)
        .join('');
};

const renderArticles = () => {
    const articlesGrid = document.getElementById('articlesGrid');
    articlesGrid.innerHTML = appState.articles
        .map(article => `
            <div class="article-card">
                <div class="article-image">
                    <img src="${article.image}" alt="${article.title}">
                </div>
                <div class="article-info">
                    <h3 class="article-title">${article.title}</h3>
                    <p>${article.excerpt}</p>
                </div>
            </div>
        `)
        .join('');
};

// Inicialización de Swiper (librería externa)
const initializeSwiper = () => {
    new Swiper('.productsSwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
        },
    });
};

// Funciones para manejar eventos
const handleSearch = () => {
    const searchTerm = prompt('Escribe tu búsqueda aquí:');
    if (searchTerm) {
        // Uso de método de array y arrow function
        const results = appState.newArrivals.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        alert(`Encontrado ${results.length} productos con "${searchTerm}"`);
    }
};

const handleAccount = () => {
    alert('Se implementará la funcionalidad de gestión de cuentas.');
};

const handleCart = () => {
    const cartItems = appState.cart.reduce((acc, item) => {
        return acc + `${item.name} - $${item.price.toFixed(2)}\n`;
    }, '');
    
    alert(cartItems ? `Cart Contents:\n${cartItems}` : 'Tu carrito esta vacío');
};

const handleViewAllProducts = () => {
    alert('Ver todas las funcionalidades de los productos que se implementarán.');
};

const handleViewAllArticles = () => {
    alert('Ver todas las funcionalidades de los productos que se implementarán.');
};

const handleNewsletterSignup = (event) => {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    // Simulando una llamada API con una promesa
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email.includes('@')) {
                resolve('Suscripción exitosa.');
            } else {
                reject('Invalid email');
            }
        }, 1000);
    })
    .then(message => {
        alert(message);
        event.target.reset();
    })
    .catch(error => {
        alert(`Error: ${error}`);
    });
};

// Función para añadir productos al carrito
const addToCart = (productId) => {
    const product = appState.newArrivals.find(p => p.id === parseInt(productId));
    if (product) {
        appState.cart.push(product);
        updateCartBadge();
        alert(`${product.name} added to cart!`);
    }
};

// Función para actualizar el badge del carrito
const updateCartBadge = () => {
    const cartButton = document.getElementById('cartButton');
    const badge = cartButton.querySelector('.cart-badge') || document.createElement('span');
    badge.className = 'cart-badge';
    badge.textContent = appState.cart.length;
    cartButton.appendChild(badge);
};

// Uso de sintaxis avanzada: Destructuring y Default Parameters
const calculateTotal = (cart = []) => {
    return cart.reduce((total, { price }) => total + price, 0).toFixed(2);
};

// Ejemplo de uso de async/await con fetch para futura implementación
const fetchProductDetails = async (productId) => {
    try {
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
            throw new Error('Product not found');
        }
        const product = await response.json();
        return product;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
};