// Complete Products System with Full Functionality

// Comprehensive Product Database
const productsDatabase = {
    shirts: [
        {
            id: 101,
            name: "Premium Cotton Dress Shirt",
            price: 89.99,
            originalPrice: 120.00,
            image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop",
            category: "shirts",
            brand: "Premium Threads",
            description: "Professional white cotton dress shirt perfect for business meetings and formal events.",
            colors: ["White", "Light Blue", "Navy", "Pink"],
            sizes: ["S", "M", "L", "XL", "XXL"],
            rating: 4.6,
            reviews: 234,
            arEnabled: true,
            inStock: true
        },
        {
            id: 102,
            name: "Casual Plaid Flannel Shirt",
            price: 45.99,
            originalPrice: 65.00,
            image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop",
            category: "shirts",
            brand: "Urban Style",
            description: "Comfortable plaid flannel shirt perfect for weekend wear and casual outings.",
            colors: ["Red Plaid", "Blue Plaid", "Green Plaid", "Gray Plaid"],
            sizes: ["S", "M", "L", "XL"],
            rating: 4.3,
            reviews: 156,
            arEnabled: true,
            inStock: true
        },
        {
            id: 103,
            name: "Linen Summer Shirt",
            price: 65.99,
            originalPrice: 85.00,
            image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop",
            category: "shirts",
            brand: "Summer Breeze",
            description: "Lightweight linen shirt perfect for hot summer days. Breathable and stylish.",
            colors: ["White", "Beige", "Light Blue", "Sage Green"],
            sizes: ["S", "M", "L", "XL"],
            rating: 4.4,
            reviews: 89,
            arEnabled: true,
            inStock: true
        },
        {
            id: 104,
            name: "Oxford Button-Down Shirt",
            price: 55.99,
            originalPrice: 75.00,
            image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=500&fit=crop",
            category: "shirts",
            brand: "Classic Oxford",
            description: "Classic Oxford button-down shirt suitable for both casual and formal occasions.",
            colors: ["White", "Light Blue", "Pink", "Yellow"],
            sizes: ["S", "M", "L", "XL", "XXL"],
            rating: 4.5,
            reviews: 167,
            arEnabled: true,
            inStock: true
        },
        {
            id: 105,
            name: "Hawaiian Print Shirt",
            price: 39.99,
            originalPrice: 55.00,
            image: "https://images.unsplash.com/photo-1622445275576-721325763afe?w=500&h=500&fit=crop",
            category: "shirts",
            brand: "Island Vibes",
            description: "Tropical Hawaiian print shirt perfect for vacations and casual summer wear.",
            colors: ["Tropical Blue", "Sunset Orange", "Palm Green", "Ocean Teal"],
            sizes: ["S", "M", "L", "XL"],
            rating: 4.2,
            reviews: 201,
            arEnabled: true,
            inStock: true
        }
    ],
    hoodies: [
        {
            id: 201,
            name: "Classic Pullover Hoodie",
            price: 79.99,
            originalPrice: 110.00,
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop",
            category: "hoodies",
            brand: "Comfort Zone",
            description: "Heavyweight cotton blend hoodie with soft fleece lining and kangaroo pocket.",
            colors: ["Black", "Gray", "Navy", "Burgundy", "Forest Green"],
            sizes: ["S", "M", "L", "XL", "XXL"],
            rating: 4.7,
            reviews: 445,
            arEnabled: true,
            inStock: true
        },
        {
            id: 202,
            name: "Zip-Up Athletic Hoodie",
            price: 95.99,
            originalPrice: 125.00,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
            category: "hoodies",
            brand: "Athletic Pro",
            description: "Performance hoodie with moisture-wicking technology, perfect for workouts.",
            colors: ["Black", "Charcoal", "Navy", "Gray"],
            sizes: ["S", "M", "L", "XL"],
            rating: 4.5,
            reviews: 203,
            arEnabled: true,
            inStock: true
        },
        {
            id: 203,
            name: "Oversized Streetwear Hoodie",
            price: 69.99,
            originalPrice: 90.00,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
            category: "hoodies",
            brand: "Street Culture",
            description: "Trendy oversized hoodie with urban streetwear styling and bold graphics.",
            colors: ["Black", "White", "Dusty Pink", "Sage Green"],
            sizes: ["S", "M", "L", "XL", "XXL"],
            rating: 4.4,
            reviews: 312,
            arEnabled: true,
            inStock: true
        },
        {
            id: 204,
            name: "Cropped Fashion Hoodie",
            price: 59.99,
            originalPrice: 80.00,
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
            category: "hoodies",
            brand: "Fashion Forward",
            description: "Trendy cropped hoodie perfect for layering and creating stylish casual looks.",
            colors: ["Lavender", "Mint Green", "Coral Pink", "Sky Blue"],
            sizes: ["XS", "S", "M", "L", "XL"],
            rating: 4.3,
            reviews: 189,
            arEnabled: true,
            inStock: true
        }
    ],
    pants: [
        {
            id: 301,
            name: "Classic Straight-Leg Jeans",
            price: 85.99,
            originalPrice: 120.00,
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
            category: "pants",
            brand: "Denim Heritage",
            description: "Classic straight-leg jeans with perfect fit. Made from premium denim with stretch.",
            colors: ["Dark Wash", "Medium Wash", "Light Wash", "Black"],
            sizes: ["26", "28", "30", "32", "34", "36", "38"],
            rating: 4.7,
            reviews: 567,
            arEnabled: true,
            inStock: true
        },
        {
            id: 302,
            name: "High-Waisted Skinny Jeans",
            price: 95.99,
            originalPrice: 125.00,
            image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&h=500&fit=crop",
            category: "pants",
            brand: "Curve Appeal",
            description: "Flattering high-waisted skinny jeans that hug your curves perfectly.",
            colors: ["Dark Blue", "Black", "Gray", "White"],
            sizes: ["24", "26", "28", "30", "32", "34"],
            rating: 4.8,
            reviews: 423,
            arEnabled: true,
            inStock: true
        },
        {
            id: 303,
            name: "Wide-Leg Trousers",
            price: 105.99,
            originalPrice: 140.00,
            image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=500&fit=crop",
            category: "pants",
            brand: "Professional Wear",
            description: "Elegant wide-leg trousers perfect for office wear and formal occasions.",
            colors: ["Black", "Navy", "Charcoal", "Beige"],
            sizes: ["XS", "S", "M", "L", "XL"],
            rating: 4.6,
            reviews: 234,
            arEnabled: true,
            inStock: true
        },
        {
            id: 304,
            name: "Cargo Utility Pants",
            price: 75.99,
            originalPrice: 95.00,
            image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=500&fit=crop",
            category: "pants",
            brand: "Urban Utility",
            description: "Functional cargo pants with multiple pockets, perfect for outdoor activities.",
            colors: ["Olive Green", "Khaki", "Black", "Navy"],
            sizes: ["S", "M", "L", "XL", "XXL"],
            rating: 4.4,
            reviews: 189,
            arEnabled: true,
            inStock: true
        }
    ],
    dresses: [
        {
            id: 401,
            name: "Elegant Midi Summer Dress",
            price: 89.99,
            originalPrice: 130.00,
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop",
            category: "dresses",
            brand: "Elegant Touch",
            description: "Flowing midi dress perfect for summer events with floral print and A-line silhouette.",
            colors: ["Floral Blue", "Floral Pink", "Floral Green", "Solid Navy"],
            sizes: ["XS", "S", "M", "L", "XL"],
            rating: 4.8,
            reviews: 312,
            arEnabled: true,
            inStock: true
        },
        {
            id: 402,
            name: "Little Black Cocktail Dress",
            price: 145.99,
            originalPrice: 200.00,
            image: "https://images.unsplash.com/photo-1566479179817-c34b3e47b377?w=500&h=500&fit=crop",
            category: "dresses",
            brand: "Night Out",
            description: "Classic little black dress perfect for cocktail parties and evening events.",
            colors: ["Black", "Navy", "Burgundy"],
            sizes: ["XS", "S", "M", "L"],
            rating: 4.9,
            reviews: 189,
            arEnabled: true,
            inStock: true
        },
        {
            id: 403,
            name: "Bohemian Maxi Dress",
            price: 75.99,
            originalPrice: 95.00,
            image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop",
            category: "dresses",
            brand: "Free Spirit",
            description: "Free-flowing bohemian maxi dress with intricate patterns, perfect for festivals.",
            colors: ["Boho Print", "Paisley Blue", "Floral Earth", "Tie Dye"],
            sizes: ["S", "M", "L", "XL"],
            rating: 4.4,
            reviews: 276,
            arEnabled: true,
            inStock: true
        }
    ],
    accessories: [
        {
            id: 501,
            name: "Leather Crossbody Bag",
            price: 125.99,
            originalPrice: 180.00,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
            category: "accessories",
            brand: "Luxury Bags",
            description: "Elegant leather crossbody bag with multiple compartments and adjustable strap.",
            colors: ["Black", "Brown", "Cognac", "Navy"],
            sizes: ["One Size"],
            rating: 4.8,
            reviews: 156,
            arEnabled: false,
            inStock: true
        },
        {
            id: 502,
            name: "Classic Baseball Cap",
            price: 28.99,
            originalPrice: 35.00,
            image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&h=500&fit=crop",
            category: "accessories",
            brand: "Cap Culture",
            description: "Classic six-panel baseball cap with adjustable strap, perfect for casual wear.",
            colors: ["Black", "Navy", "White", "Gray", "Red"],
            sizes: ["One Size"],
            rating: 4.3,
            reviews: 267,
            arEnabled: false,
            inStock: true
        }
    ]
};

// Flatten all products into single array
const allProducts = Object.values(productsDatabase).flat();

// Current state
let currentProducts = [...allProducts];
let cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Products page loaded');
    initializeProductsPage();
});

function initializeProductsPage() {
    displayProducts(currentProducts);
    updateCartCount();
    setupEventListeners();
    updateResultsInfo();
}

// Setup all event listeners
function setupEventListeners() {
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterByCategory(category);
            
            // Update active button
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
}

// Filter products by category
function filterByCategory(category) {
    console.log('Filtering by category:', category);
    
    if (category === 'all') {
        currentProducts = [...allProducts];
    } else {
        currentProducts = allProducts.filter(product => product.category === category);
    }
    
    displayProducts(currentProducts);
    updateResultsInfo();
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // If search is empty, show current category
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        filterByCategory(activeCategory);
        return;
    }
    
    currentProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(currentProducts);
    updateResultsInfo();
}

// Handle sorting
function handleSort(e) {
    const sortBy = e.target.value;
    
    switch(sortBy) {
        case 'price-low':
            currentProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            currentProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            currentProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
        default:
            currentProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    displayProducts(currentProducts);
}

// Display products
function displayProducts(products) {
    const container = document.getElementById('products-container');
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    
    // Show loading
    loadingState.classList.remove('d-none');
    emptyState.classList.add('d-none');
    container.innerHTML = '';
    
    setTimeout(() => {
        loadingState.classList.add('d-none');
        
        if (products.length === 0) {
            emptyState.classList.remove('d-none');
            return;
        }
        
        container.innerHTML = products.map(product => createProductCard(product)).join('');
        
        // Add animation
        container.querySelectorAll('.product-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });
        
    }, 500);
}

// Create product card
function createProductCard(product) {
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    return `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    
                    <!-- Badges -->
                    <div class="product-badges">
                        ${product.arEnabled ? '<span class="badge ar-badge"><i class="fas fa-magic me-1"></i>AR Ready</span>' : ''}
                        ${discount > 0 ? `<span class="badge discount-badge">${discount}% OFF</span>` : ''}
                    </div>
                    
                    <!-- Overlay -->
                    <div class="product-overlay">
                        <button class="btn btn-light btn-sm mb-2" onclick="quickView(${product.id})">
                            <i class="fas fa-eye me-1"></i>Quick View
                        </button>
                        <button class="btn btn-light btn-sm" onclick="toggleWishlist(${product.id})">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
                
                <div class="product-info">
                    <div class="product-brand">${product.brand}</div>
                    <h6 class="product-name">${product.name}</h6>
                    
                    <!-- Rating -->
                    <div class="product-rating mb-2">
                        ${generateStars(product.rating)}
                        <small class="text-muted">(${product.reviews})</small>
                    </div>
                    
                    <!-- Price -->
                    <div class="price-container mb-3">
                        <span class="current-price">$${product.price}</span>
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                    </div>
                    
                    <!-- Colors -->
                    <div class="color-options mb-3">
                        <small class="text-muted d-block">Available colors:</small>
                        <div class="color-dots">
                            ${product.colors.slice(0, 4).map(color => 
                                `<span class="color-dot" style="background: ${getColorHex(color)}" title="${color}"></span>`
                            ).join('')}
                            ${product.colors.length > 4 ? `<small class="text-muted">+${product.colors.length - 4} more</small>` : ''}
                        </div>
                    </div>
                    
                    <!-- Sizes -->
                    <div class="size-options mb-3">
                        <small class="text-muted">Sizes: ${product.sizes.slice(0, 5).join(', ')}</small>
                    </div>
                    
                    <!-- Actions -->
                    <div class="product-actions">
                        <button class="btn btn-primary btn-sm flex-grow-1 me-2" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus me-1"></i>Add to Cart
                        </button>
                        
                        ${product.arEnabled ? 
                            `<a href="ar-tryon.html?product=${product.id}" class="btn btn-ar btn-sm">
                                <i class="fas fa-camera me-1"></i>Try AR
                            </a>` :
                            `<button class="btn btn-outline-secondary btn-sm" disabled>
                                <i class="fas fa-ban"></i>
                            </button>`
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Add to cart function
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            brand: product.brand,
            category: product.category,
            quantity: 1,
            size: product.sizes[0] || 'M',
            color: product.colors[0] || 'Default'
        });
    }
    
    localStorage.setItem('fashionCart', JSON.stringify(cart));
    updateCartCount();
    showCartToast(product.name);
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Show cart toast
function showCartToast(productName) {
    const toast = document.getElementById('cart-toast');
    const message = document.getElementById('toast-message');
    
    message.textContent = `${productName} added to your cart!`;
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Update results info
function updateResultsInfo() {
    const resultsCount = document.getElementById('results-count');
    const activeCategory = document.querySelector('.category-btn.active').dataset.category;
    const categoryName = activeCategory === 'all' ? 'all products' : activeCategory;
    
    resultsCount.textContent = `Showing ${currentProducts.length} ${categoryName}`;
}

// Utility functions
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-warning"></i>';
    }
    
    return stars;
}

function getColorHex(colorName) {
    const colorMap = {
        'Black': '#000000', 'White': '#ffffff', 'Navy': '#001f3f',
        'Gray': '#aaaaaa', 'Red': '#ff4444', 'Blue': '#0074d9',
        'Green': '#2ecc40', 'Yellow': '#ffdc00', 'Pink': '#ff69b4',
        'Brown': '#8b4513', 'Beige': '#f5f5dc', 'Burgundy': '#800020'
    };
    return colorMap[colorName] || '#cccccc';
}

function quickView(productId) {
    const product = allProducts.find(p => p.id === productId);
    alert(`Quick View: ${product.name}\nPrice: $${product.price}\nDescription: ${product.description}`);
}

function toggleWishlist(productId) {
    // Wishlist functionality
    alert('Added to wishlist!');
}

// Global cart access for other pages
window.getCart = function() {
    return JSON.parse(localStorage.getItem('fashionCart') || '[]');
};

window.updateCartDisplay = function() {
    cart = JSON.parse(localStorage.getItem('fashionCart') || '[]');
    updateCartCount();
};

// Add this to your existing products-complete.js file
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Check if user is logged in for personalized experience
    const currentUser = window.authSystem?.getCurrentUser();
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            brand: product.brand,
            category: product.category,
            quantity: 1,
            size: product.sizes[0] || 'M',
            color: product.colors[0] || 'Default',
            userId: currentUser ? currentUser.id : null,
            addedAt: new Date().toISOString()
        });
    }
    
    // Save to user-specific cart if logged in
    const cartKey = currentUser ? `fashionCart_${currentUser.id}` : 'fashionCart';
    localStorage.setItem(cartKey, JSON.stringify(cart));
    
    updateCartCount();
    showCartToast(product.name);
}
