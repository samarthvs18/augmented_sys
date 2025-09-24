// Global Variables
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

// Comprehensive Product Database - THIS IS THE KEY PART
const products = [
    // SHIRTS
    {
        id: 1,
        name: "Premium Cotton Dress Shirt",
        price: 89.99,
        originalPrice: 120.00,
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop",
        category: "shirts",
        subcategory: "dress-shirts",
        gender: "men",
        brand: "Premium Threads",
        description: "Professional white cotton dress shirt perfect for business meetings and formal events. Made from 100% premium Egyptian cotton with mother-of-pearl buttons.",
        colors: ["White", "Light Blue", "Navy", "Black"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        arEnabled: true,
        featured: true,
        rating: 4.6,
        reviews: 234,
        tags: ["formal", "business", "cotton", "classic"],
        inStock: true,
        discount: 25
    },
    {
        id: 2,
        name: "Casual Plaid Flannel Shirt",
        price: 45.99,
        originalPrice: 65.00,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop",
        category: "shirts",
        subcategory: "casual-shirts",
        gender: "men",
        brand: "Urban Style",
        description: "Comfortable plaid flannel shirt perfect for weekend wear. Soft brushed cotton with a relaxed fit.",
        colors: ["Red Plaid", "Blue Plaid", "Green Plaid", "Black Plaid"],
        sizes: ["S", "M", "L", "XL"],
        arEnabled: true,
        featured: false,
        rating: 4.3,
        reviews: 156,
        tags: ["casual", "flannel", "weekend", "comfortable"],
        inStock: true,
        discount: 29
    },
    {
        id: 3,
        name: "Women's Silk Blouse",
        price: 125.99,
        originalPrice: 175.00,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop",
        category: "shirts",
        subcategory: "blouses",
        gender: "women",
        brand: "Elegant Touch",
        description: "Luxurious silk blouse perfect for professional settings. Features mother-of-pearl buttons and tailored fit.",
        colors: ["Ivory", "Blush Pink", "Navy", "Black"],
        sizes: ["XS", "S", "M", "L", "XL"],
        arEnabled: true,
        featured: true,
        rating: 4.8,
        reviews: 134,
        tags: ["silk", "professional", "luxury", "office"],
        inStock: true,
        discount: 28
    },

    // T-SHIRTS
    {
        id: 4,
        name: "Premium Cotton T-Shirt",
        price: 24.99,
        originalPrice: 35.00,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        category: "tshirts",
        subcategory: "basic-tees",
        gender: "men",
        brand: "Essential Basics",
        description: "Ultra-soft premium cotton crew neck t-shirt. Perfect fit with reinforced seams and pre-shrunk fabric.",
        colors: ["White", "Black", "Navy", "Gray", "Olive Green"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        arEnabled: true,
        featured: true,
        rating: 4.8,
        reviews: 892,
        tags: ["basic", "cotton", "essential", "comfortable"],
        inStock: true,
        discount: 29
    },
    {
        id: 5,
        name: "Graphic Design Vintage Tee",
        price: 32.99,
        originalPrice: 42.00,
        image: "https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=500&h=500&fit=crop",
        category: "tshirts",
        subcategory: "graphic-tees",
        gender: "unisex",
        brand: "Street Art Co.",
        description: "Retro-inspired graphic t-shirt with vintage band artwork. Soft-washed cotton for that lived-in feel.",
        colors: ["Black", "Charcoal", "Navy", "Burgundy"],
        sizes: ["S", "M", "L", "XL"],
        arEnabled: true,
        featured: false,
        rating: 4.4,
        reviews: 167,
        tags: ["graphic", "vintage", "music", "streetwear"],
        inStock: true,
        discount: 21
    },

    // PANTS
    {
        id: 6,
        name: "Classic Straight-Leg Jeans",
        price: 85.99,
        originalPrice: 120.00,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
        category: "pants",
        subcategory: "jeans",
        gender: "unisex",
        brand: "Denim Heritage",
        description: "Classic straight-leg jeans with perfect fit. Made from premium denim with stretch for comfort.",
        colors: ["Dark Wash", "Medium Wash", "Light Wash", "Black"],
        sizes: ["26", "28", "30", "32", "34", "36", "38"],
        arEnabled: true,
        featured: true,
        rating: 4.7,
        reviews: 567,
        tags: ["jeans", "classic", "denim", "versatile"],
        inStock: true,
        discount: 28
    },
    {
        id: 7,
        name: "High-Waisted Skinny Jeans",
        price: 95.99,
        originalPrice: 125.00,
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&h=500&fit=crop",
        category: "pants",
        subcategory: "jeans",
        gender: "women",
        brand: "Curve Appeal",
        description: "Flattering high-waisted skinny jeans that hug your curves perfectly. Premium stretch denim for all-day comfort.",
        colors: ["Dark Blue", "Black", "Gray", "White"],
        sizes: ["24", "26", "28", "30", "32", "34"],
        arEnabled: true,
        featured: true,
        rating: 4.8,
        reviews: 423,
        tags: ["high-waisted", "skinny", "flattering", "stretch"],
        inStock: true,
        discount: 23
    },
    {
        id: 8,
        name: "Cargo Utility Pants",
        price: 75.99,
        originalPrice: 95.00,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=500&fit=crop",
        category: "pants",
        subcategory: "cargo-pants",
        gender: "unisex",
        brand: "Urban Utility",
        description: "Functional cargo pants with multiple pockets. Durable construction perfect for outdoor activities.",
        colors: ["Olive Green", "Khaki", "Black", "Navy"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        arEnabled: true,
        featured: false,
        rating: 4.4,
        reviews: 189,
        tags: ["cargo", "utility", "outdoor", "functional"],
        inStock: true,
        discount: 20
    },

    // HOODIES
    {
        id: 9,
        name: "Classic Pullover Hoodie",
        price: 79.99,
        originalPrice: 110.00,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop",
        category: "hoodies",
        subcategory: "pullover-hoodies",
        gender: "unisex",
        brand: "Comfort Zone",
        description: "Heavyweight cotton blend hoodie with soft fleece lining. Features adjustable drawstring hood and kangaroo pocket.",
        colors: ["Black", "Gray", "Navy", "Burgundy", "Forest Green"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        arEnabled: true,
        featured: true,
        rating: 4.7,
        reviews: 445,
        tags: ["hoodie", "comfortable", "casual", "warm"],
        inStock: true,
        discount: 27
    },
    {
        id: 10,
        name: "Zip-Up Tech Hoodie",
        price: 95.99,
        originalPrice: 125.00,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
        category: "hoodies",
        subcategory: "zip-hoodies",
        gender: "men",
        brand: "Tech Athletic",
        description: "Modern tech hoodie with moisture-wicking fabric and athletic fit. Perfect for workouts or casual wear.",
        colors: ["Black", "Charcoal", "Navy", "Gray"],
        sizes: ["S", "M", "L", "XL"],
        arEnabled: true,
        featured: false,
        rating: 4.5,
        reviews: 203,
        tags: ["athletic", "tech", "moisture-wicking", "modern"],
        inStock: true,
        discount: 23
    },

    // DRESSES
    {
        id: 11,
        name: "Elegant Midi Summer Dress",
        price: 89.99,
        originalPrice: 130.00,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop",
        category: "dresses",
        subcategory: "midi-dresses",
        gender: "women",
        brand: "Elegant Touch",
        description: "Flowing midi dress perfect for summer events. Features floral print and comfortable A-line silhouette.",
        colors: ["Floral Blue", "Floral Pink", "Floral Green", "Solid Navy"],
        sizes: ["XS", "S", "M", "L", "XL"],
        arEnabled: true,
        featured: true,
        rating: 4.8,
        reviews: 312,
        tags: ["midi", "floral", "summer", "elegant"],
        inStock: true,
        discount: 31
    },
    {
        id: 12,
        name: "Little Black Cocktail Dress",
        price: 145.99,
        originalPrice: 200.00,
        image: "https://images.unsplash.com/photo-1566479179817-c34b3e47b377?w=500&h=500&fit=crop",
        category: "dresses",
        subcategory: "cocktail-dresses",
        gender: "women",
        brand: "Night Out",
        description: "Classic little black dress perfect for cocktail parties and evening events. Sophisticated cut with subtle details.",
        colors: ["Black", "Navy", "Burgundy"],
        sizes: ["XS", "S", "M", "L"],
        arEnabled: true,
        featured: true,
        rating: 4.9,
        reviews: 189,
        tags: ["cocktail", "evening", "elegant", "classic"],
        inStock: true,
        discount: 27
    }
];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    updateCartCount();
    setupSmoothScrolling();
    setupNavbarEffects();
    setupNotificationSystem();
    
    // Initialize page-specific functions
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'products':
            initializeProductsPage();
            break;
        case 'ar-tryon':
            initializeARPage();
            break;
        case 'cart':
            initializeCartPage();
            break;
    }
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page === '' ? 'index' : page;
}

// Cart Management
function addToCart(productId, quantity = 1, size = 'M', color = 'default') {
    const product = getProductById(productId);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }

    const existingItem = cart.find(item => 
        item.id === productId && 
        item.size === size && 
        item.color === color
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            size: size,
            color: color,
            arTried: false
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
    
    // Add animation effect
    animateCartIcon();
}

function removeFromCart(productId, size = 'M', color = 'default') {
    cart = cart.filter(item => 
        !(item.id === productId && item.size === size && item.color === color)
    );
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Item removed from cart', 'info');
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function animateCartIcon() {
    const cartIcon = document.querySelector('#cart-count');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.3)';
        cartIcon.style.background = '#28a745';
        
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
            cartIcon.style.background = '';
        }, 300);
    }
}

// Wishlist Management
function toggleWishlist(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(product);
        showNotification('Added to wishlist!', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistUI(productId);
}

function updateWishlistUI(productId) {
    const wishlistBtns = document.querySelectorAll(`[data-wishlist="${productId}"]`);
    const isInWishlist = wishlist.some(item => item.id === productId);
    
    wishlistBtns.forEach(btn => {
        const icon = btn.querySelector('i');
        if (icon) {
            if (isInWishlist) {
                icon.className = 'fas fa-heart';
                btn.classList.add('active');
            } else {
                icon.className = 'far fa-heart';
                btn.classList.remove('active');
            }
        }
    });
}

// Notification System
function setupNotificationSystem() {
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    
    notification.className = 'notification';
    notification.style.cssText = `
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; margin-left: auto; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

// Smooth Scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar Effects
function setupNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Home Page Initialization
function initializeHomePage() {
    loadFeaturedProducts();
}

function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;
    
    const featuredProducts = products.filter(product => product.featured).slice(0, 4);
    
    if (featuredProducts.length === 0) return;
    
    featuredContainer.innerHTML = featuredProducts.map(product => `
        <div class="col-md-6 col-lg-3">
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-overlay">
                        <button class="btn btn-light btn-sm" onclick="viewProduct(${product.id})">
                            <i class="fas fa-eye me-1"></i> Quick View
                        </button>
                    </div>
                    ${product.arEnabled ? '<div class="ar-badge">AR Ready</div>' : ''}
                </div>
                <div class="product-info">
                    <h6 class="product-name mb-2">${product.name}</h6>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="price">$${product.price}</span>
                        <button class="btn-wishlist" data-wishlist="${product.id}" onclick="toggleWishlist(${product.id})">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-sm me-2" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus me-1"></i> Add to Cart
                        </button>
                        ${product.arEnabled ? 
                            `<a href="ar-tryon.html?product=${product.id}" class="btn btn-warning btn-sm">
                                <i class="fas fa-camera me-1"></i> Try AR
                            </a>` : ''
                        }
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Utility Functions
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-warning"></i>';
    }
    
    return stars;
}

function getColorCode(colorName) {
    const colorMap = {
        'White': '#ffffff',
        'Black': '#000000',
        'Navy': '#001f3f',
        'Gray': '#aaaaaa',
        'Blue': '#0074d9',
        'Light Blue': '#7fdbff',
        'Burgundy': '#85144b',
        'Red': '#ff4444',
        'Green': '#2ecc40',
        'Yellow': '#ffdc00',
        'Pink': '#ff69b4'
    };
    
    return colorMap[colorName] || '#cccccc';
}

// Export functions for other modules
window.appFunctions = {
    addToCart,
    removeFromCart,
    toggleWishlist,
    showNotification,
    getProductById,
    formatPrice
};
