// Products Page Functionality
let filteredProducts = [...products];
let currentCategory = 'all';
let currentSearchQuery = '';
let currentSortBy = 'featured';

// Initialize Products Page
function initializeProductsPage() {
    console.log('Initializing products page with', products.length, 'products');
    setupFilters();
    setupSearch();
    displayProducts();
    updateCartCount();
}

// Setup Filter Buttons
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            currentCategory = this.dataset.category;
            console.log('Filtering by category:', currentCategory);
            applyFilters();
        });
    });
}

// Apply Filters and Search
function applyFilters() {
    console.log('Applying filters. Category:', currentCategory, 'Search:', currentSearchQuery);
    
    filteredProducts = products.filter(product => {
        const categoryMatch = currentCategory === 'all' || product.category === currentCategory;
        const searchMatch = currentSearchQuery === '' || 
            product.name.toLowerCase().includes(currentSearchQuery) ||
            product.description.toLowerCase().includes(currentSearchQuery) ||
            product.brand.toLowerCase().includes(currentSearchQuery) ||
            product.tags.some(tag => tag.toLowerCase().includes(currentSearchQuery));
        
        return categoryMatch && searchMatch;
    });
    
    console.log('Filtered products:', filteredProducts.length);
    displayProducts();
}

// Search Products
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentSearchQuery = this.value.toLowerCase().trim();
                console.log('Searching for:', currentSearchQuery);
                applyFilters();
            }, 300);
        });
    }
}

// Display Products
function displayProducts() {
    const container = document.getElementById('products-container');
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    
    if (!container) {
        console.error('Products container not found');
        return;
    }
    
    console.log('Displaying', filteredProducts.length, 'products');
    
    // Show loading
    if (loadingState) loadingState.classList.remove('d-none');
    if (emptyState) emptyState.classList.add('d-none');
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        if (loadingState) loadingState.classList.add('d-none');
        
        if (filteredProducts.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.classList.remove('d-none');
            return;
        }
        
        container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
        
        // Initialize wishlist states
        filteredProducts.forEach(product => updateWishlistUI(product.id));
        
        // Add animation
        container.querySelectorAll('.product-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in-up');
        });
        
    }, 300);
}

// Create Product Card HTML
function createProductCard(product) {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    const hasDiscount = product.discount && product.discount > 0;
    
    return `
        <div class="col-md-6 col-lg-4 col-xl-3">
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    
                    ${product.arEnabled ? '<div class="ar-badge"><i class="fas fa-magic me-1"></i>AR Ready</div>' : ''}
                    ${hasDiscount ? `<div class="discount-badge">${product.discount}% OFF</div>` : ''}
                    
                    <div class="product-overlay">
                        <button class="btn btn-light btn-sm mb-2" onclick="viewProductDetails(${product.id})">
                            <i class="fas fa-eye me-1"></i> Quick View
                        </button>
                        <button class="btn btn-light btn-sm" onclick="toggleWishlist(${product.id})" 
                                data-wishlist="${product.id}">
                            <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                    </div>
                </div>
                
                <div class="product-info">
                    <div class="product-brand mb-1">
                        <small class="text-muted">${product.brand}</small>
                    </div>
                    
                    <h6 class="product-name mb-2">${product.name}</h6>
                    
                    <div class="product-rating mb-2">
                        ${generateStarRating(product.rating)}
                        <span class="text-muted ms-2 small">(${product.reviews})</span>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="price-container">
                            <span class="price">${formatPrice(product.price)}</span>
                            ${hasDiscount ? 
                                `<small class="text-muted text-decoration-line-through ms-2">${formatPrice(product.originalPrice)}</small>` : ''
                            }
                        </div>
                        <div class="color-preview">
                            ${product.colors.slice(0, 3).map(color => 
                                `<div class="color-dot" style="background-color: ${getColorCode(color)}" 
                                      title="${color}"></div>`
                            ).join('')}
                            ${product.colors.length > 3 ? '<span class="color-more">+' + (product.colors.length - 3) + '</span>' : ''}
                        </div>
                    </div>
                    
                    <div class="size-info mb-3">
                        <small class="text-muted">Sizes: ${product.sizes.slice(0, 4).join(', ')}${product.sizes.length > 4 ? '...' : ''}</small>
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn btn-primary flex-grow-1 me-2" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus me-1"></i> Add to Cart
                        </button>
                        
                        ${product.arEnabled ? 
                            `<a href="ar-tryon.html?product=${product.id}" class="btn btn-ar-try">
                                <i class="fas fa-camera me-1"></i> Try AR
                            </a>` : 
                            `<button class="btn btn-outline-secondary" disabled title="AR not available">
                                <i class="fas fa-ban me-1"></i>
                            </button>`
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
}

// View Product Details Modal
function viewProductDetails(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const modalContent = document.getElementById('modal-content');
    if (!modalContent) return;
    
    modalContent.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${product.image}" alt="${product.name}" class="img-fluid rounded">
            </div>
            <div class="col-md-6">
                <div class="product-brand mb-2">
                    <span class="badge bg-secondary">${product.brand}</span>
                    ${product.arEnabled ? '<span class="badge bg-warning ms-2"><i class="fas fa-magic me-1"></i>AR Ready</span>' : ''}
                </div>
                
                <h3 class="mb-3">${product.name}</h3>
                
                <div class="product-rating mb-3">
                    ${generateStarRating(product.rating)}
                    <span class="text-muted ms-2">(${product.reviews} reviews)</span>
                </div>
                
                <p class="text-muted mb-3">${product.description}</p>
                
                <div class="price-container mb-4">
                    <h4 class="text-primary mb-0">${formatPrice(product.price)}</h4>
                    ${product.discount ? 
                        `<small class="text-muted text-decoration-line-through">${formatPrice(product.originalPrice)}</small>
                         <span class="badge bg-success ms-2">${product.discount}% OFF</span>` : ''
                    }
                </div>
                
                <div class="mb-3">
                    <label class="form-label fw-bold">Available Colors:</label>
                    <div class="d-flex gap-2 flex-wrap">
                        ${product.colors.map(color => 
                            `<button class="btn btn-outline-secondary btn-sm color-option" 
                                     data-color="${color}">
                                <div class="color-dot me-2" style="background-color: ${getColorCode(color)}"></div>
                                ${color}
                            </button>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="form-label fw-bold">Available Sizes:</label>
                    <div class="d-flex gap-2 flex-wrap">
                        ${product.sizes.map(size => 
                            `<button class="btn btn-outline-secondary btn-sm size-option" 
                                     data-size="${size}">
                                ${size}
                            </button>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="d-grid gap-2">
                    <button class="btn btn-primary btn-lg" onclick="addToCartFromModal(${product.id})">
                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                    </button>
                    
                    ${product.arEnabled ? 
                        `<a href="ar-tryon.html?product=${product.id}" class="btn btn-warning btn-lg">
                            <i class="fas fa-camera me-2"></i>Try with AR - See how it looks on you!
                        </a>` : 
                        `<button class="btn btn-outline-secondary btn-lg" disabled>
                            <i class="fas fa-ban me-2"></i>AR not available for this product
                        </button>`
                    }
                    
                    <button class="btn btn-outline-primary btn-lg" onclick="toggleWishlist(${product.id})">
                        <i class="far fa-heart me-2"></i>Add to Wishlist
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Setup color and size selection
    setupModalSelections();
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

// Setup Modal Selections
function setupModalSelections() {
    // Color selection
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Size selection
    document.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Select first color and size by default
    const firstColor = document.querySelector('.color-option');
    const firstSize = document.querySelector('.size-option');
    
    if (firstColor) firstColor.classList.add('active');
    if (firstSize) firstSize.classList.add('active');
}

// Add to Cart from Modal
function addToCartFromModal(productId) {
    const selectedColor = document.querySelector('.color-option.active')?.dataset.color || 'default';
    const selectedSize = document.querySelector('.size-option.active')?.dataset.size || 'M';
    
    addToCart(productId, 1, selectedSize, selectedColor);
    
    // Close modal after adding to cart
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    if (modal) modal.hide();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (getCurrentPage() === 'products') {
        console.log('Products page detected, initializing...');
        initializeProductsPage();
    }
});
