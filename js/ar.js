// AR Try-On System with Database Functionality
/*class ARTryOnSystem {
    constructor() {
        this.camera = null;
        this.canvas = null;
        this.ctx = null;
        this.stream = null;
        this.currentProduct = null;
        this.currentColor = '#ff6b6b';
        this.isActive = false;
        this.arSessionData = this.loadARSession();
        this.detectionConfidence = 0;
        
        // AR Database - stored in localStorage
        this.arDatabase = {
            sessions: JSON.parse(localStorage.getItem('arSessions') || '[]'),
            captures: JSON.parse(localStorage.getItem('arCaptures') || '[]'),
            preferences: JSON.parse(localStorage.getItem('arPreferences') || '{}'),
            analytics: JSON.parse(localStorage.getItem('arAnalytics') || '{}')
        };
        
        this.init();
    }

    // Initialize AR System
    async init() {
        try {
            this.showLoading(true);
            await this.setupCamera();
            this.setupCanvas();
            this.loadProductFromURL();
            this.setupARControls();
            this.startARLoop();
            this.saveARSession('started');
            this.updateStatus('AR Try-On Ready!', 'success');
        } catch (error) {
            console.error('AR initialization failed:', error);
            this.showError('Camera access required for AR try-on');
            this.saveARSession('failed', { error: error.message });
        } finally {
            this.showLoading(false);
        }
    }

    // Database Operations for AR Sessions
    saveARSession(action, data = {}) {
        const session = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            action: action,
            productId: this.currentProduct?.id,
            color: this.currentColor,
            data: data
        };
        
        this.arDatabase.sessions.push(session);
        localStorage.setItem('arSessions', JSON.stringify(this.arDatabase.sessions));
        
        // Update analytics
        this.updateAnalytics(action);
    }

    loadARSession() {
        return {
            startTime: Date.now(),
            interactions: [],
            triedProducts: [],
            captures: [],
            totalTime: 0
        };
    }

    updateAnalytics(action) {
        if (!this.arDatabase.analytics[action]) {
            this.arDatabase.analytics[action] = 0;
        }
        this.arDatabase.analytics[action]++;
        localStorage.setItem('arAnalytics', JSON.stringify(this.arDatabase.analytics));
    }

    // Camera Setup
    async setupCamera() {
        this.camera = document.getElementById('camera-feed');
        
        try {
            const constraints = {
                video: { 
                    width: { ideal: 1280, max: 1920 }, 
                    height: { ideal: 720, max: 1080 },
                    facingMode: 'user',
                    frameRate: { ideal: 30 }
                }
            };
            
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.camera.srcObject = this.stream;
            
            this.camera.addEventListener('loadedmetadata', () => {
                this.isActive = true;
                this.updateCameraStatus('connected');
            });
            
        } catch (error) {
            throw new Error(`Camera access denied: ${error.message}`);
        }
    }

    setupCanvas() {
        this.canvas = document.getElementById('ar-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size to match video
        this.camera.addEventListener('loadedmetadata', () => {
            this.canvas.width = this.camera.videoWidth;
            this.canvas.height = this.camera.videoHeight;
        });
    }

    // Load Product from URL Parameters
    loadProductFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('product');
        
        if (productId) {
            const product = getProductById(parseInt(productId));
            if (product) {
                this.setCurrentProduct(product);
            }
        } else {
            // Default to first product
            this.setCurrentProduct(products[0]);
        }
    }

    setCurrentProduct(product) {
        this.currentProduct = product;
        this.updateProductDisplay();
        this.updateVirtualGarment();
        this.saveARSession('product_selected', { productId: product.id });
        
        // Save to tried products database
        this.addToTriedProducts(product);
    }

    addToTriedProducts(product) {
        const triedProducts = JSON.parse(localStorage.getItem('triedProducts') || '[]');
        const existingIndex = triedProducts.findIndex(p => p.id === product.id);
        
        if (existingIndex === -1) {
            triedProducts.push({
                ...product,
                triedAt: new Date().toISOString(),
                colors: [this.currentColor]
            });
        } else {
            triedProducts[existingIndex].triedAt = new Date().toISOString();
            if (!triedProducts[existingIndex].colors.includes(this.currentColor)) {
                triedProducts[existingIndex].colors.push(this.currentColor);
            }
        }
        
        localStorage.setItem('triedProducts', JSON.stringify(triedProducts));
    }

    updateProductDisplay() {
        const thumbnail = document.getElementById('product-thumbnail');
        const nameDisplay = document.getElementById('product-name-display');
        const priceDisplay = document.getElementById('product-price-display');
        
        if (thumbnail) thumbnail.src = this.currentProduct.image;
        if (nameDisplay) nameDisplay.textContent = this.currentProduct.name;
        if (priceDisplay) priceDisplay.textContent = formatPrice(this.currentProduct.price);
    }

    // AR Controls Setup
    setupARControls() {
        // Product selection buttons
        document.querySelectorAll('.product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productType = e.target.dataset.product;
                this.selectProductType(productType);
            });
        });

        // Color selection buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                this.changeColor(color);
            });
        });
    }

    selectProductType(type) {
        // Find product by category
        const productsByType = {
            'tshirt': products.find(p => p.category === 'shirts'),
            'hoodie': products.find(p => p.category === 'hoodies'),
            'dress': products.find(p => p.category === 'dresses')
        };
        
        if (productsByType[type]) {
            this.setCurrentProduct(productsByType[type]);
        }
        
        // Update active button
        document.querySelectorAll('.product-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-product="${type}"]`).classList.add('active');
        
        this.updateStatus(`Selected: ${type}`, 'info');
    }

    changeColor(color) {
        this.currentColor = color;
        this.updateVirtualGarment();
        this.saveARSession('color_changed', { color: color });
        
        // Update active color button
        document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-color="${color}"]`).classList.add('active');
        
        // Save color preference
        this.saveColorPreference(color);
        this.updateStatus(`Color changed to ${this.getColorName(color)}`, 'success');
    }

    saveColorPreference(color) {
        const preferences = JSON.parse(localStorage.getItem('colorPreferences') || '{}');
        if (!preferences[color]) preferences[color] = 0;
        preferences[color]++;
        localStorage.setItem('colorPreferences', JSON.stringify(preferences));
    }

    getColorName(color) {
        const colorNames = {
            '#ff6b6b': 'Red',
            '#4ecdc4': 'Teal',
            '#45b7d1': 'Blue',
            '#96ceb4': 'Green',
            '#feca57': 'Yellow'
        };
        return colorNames[color] || 'Unknown';
    }

    updateVirtualGarment() {
        const garment = document.querySelector('.virtual-garment');
        if (garment) {
            // Update color
            garment.style.background = `${this.currentColor}33`;
            garment.style.borderColor = this.currentColor;
            
            // Update icon based on product type
            const icon = garment.querySelector('i');
            const label = garment.querySelector('.garment-label');
            
            if (this.currentProduct.category === 'shirts') {
                icon.className = 'fas fa-tshirt';
                label.textContent = 'Virtual T-Shirt';
            } else if (this.currentProduct.category === 'hoodies') {
                icon.className = 'fas fa-hoodie';
                label.textContent = 'Virtual Hoodie';
            } else if (this.currentProduct.category === 'dresses') {
                icon.className = 'fas fa-female';
                label.textContent = 'Virtual Dress';
            }
        }
    }

    // AR Loop
    startARLoop() {
        const animate = () => {
            if (this.isActive) {
                this.updateAROverlay();
                this.simulatePoseDetection();
                this.updateConfidence();
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    updateAROverlay() {
        if (!this.ctx || !this.camera.videoWidth) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw AR elements
        this.drawVirtualClothing();
        this.drawPosePoints();
    }

    drawVirtualClothing() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Set style
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.fillStyle = `${this.currentColor}33`;
        this.ctx.lineWidth = 4;
        this.ctx.setLineDash([10, 5]);

        // Draw based on product type
        if (this.currentProduct.category === 'shirts') {
            this.drawTShirt(centerX, centerY - 80);
        } else if (this.currentProduct.category === 'hoodies') {
            this.drawHoodie(centerX, centerY - 80);
        } else if (this.currentProduct.category === 'dresses') {
            this.drawDress(centerX, centerY - 60);
        }
    }

    drawTShirt(x, y) {
        this.ctx.beginPath();
        // Main body
        this.ctx.rect(x - 80, y, 160, 140);
        // Sleeves
        this.ctx.rect(x - 120, y - 20, 40, 80);
        this.ctx.rect(x + 80, y - 20, 40, 80);
        // Neck
        this.ctx.arc(x, y - 10, 25, 0, Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawHoodie(x, y) {
        this.ctx.beginPath();
        // Main body
        this.ctx.rect(x - 90, y, 180, 160);
        // Sleeves
        this.ctx.rect(x - 130, y - 30, 40, 100);
        this.ctx.rect(x + 90, y - 30, 40, 100);
        // Hood
        this.ctx.arc(x, y - 40, 50, Math.PI, 0);
        // Pocket
        this.ctx.rect(x - 40, y + 60, 80, 40);
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawDress(x, y) {
        this.ctx.beginPath();
        // Top
        this.ctx.rect(x - 60, y, 120, 100);
        // Skirt
        this.ctx.moveTo(x - 60, y + 100);
        this.ctx.lineTo(x - 100, y + 200);
        this.ctx.lineTo(x + 100, y + 200);
        this.ctx.lineTo(x + 60, y + 100);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    simulatePoseDetection() {
        // Simulate pose detection points
        const poseContainer = document.getElementById('pose-points');
        if (!poseContainer) return;

        // Clear existing points
        poseContainer.innerHTML = '';

        // Add simulated pose points
        const points = [
            { x: 40, y: 25, label: 'left_shoulder' },
            { x: 60, y: 25, label: 'right_shoulder' },
            { x: 50, y: 35, label: 'chest' },
            { x: 45, y: 55, label: 'left_hip' },
            { x: 55, y: 55, label: 'right_hip' }
        ];

        points.forEach(point => {
            const dot = document.createElement('div');
            dot.className = 'pose-point';
            dot.style.left = `${point.x}%`;
            dot.style.top = `${point.y}%`;
            dot.title = point.label;
            poseContainer.appendChild(dot);
        });

        // Update confidence based on points detected
        this.detectionConfidence = Math.min(95, Math.max(70, 70 + Math.random() * 25));
    }

    updateConfidence() {
        const confidenceElement = document.getElementById('detection-confidence');
        if (confidenceElement) {
            confidenceElement.textContent = `${Math.round(this.detectionConfidence)}%`;
        }
    }

    // Capture Functionality
    async captureARPhoto() {
        if (!this.camera || !this.canvas) return;

        const captureCanvas = document.getElementById('capture-canvas');
        const captureCtx = captureCanvas.getContext('2d');

        // Set canvas size
        captureCanvas.width = this.camera.videoWidth;
        captureCanvas.height = this.camera.videoHeight;

        // Draw video frame
        captureCtx.drawImage(this.camera, 0, 0);

        // Draw AR overlay
        captureCtx.drawImage(this.canvas, 0, 0);

        // Save capture to database
        const captureData = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            productId: this.currentProduct.id,
            productName: this.currentProduct.name,
            color: this.currentColor,
            dataURL: captureCanvas.toDataURL('image/jpeg', 0.8)
        };

        this.arDatabase.captures.push(captureData);
        localStorage.setItem('arCaptures', JSON.stringify(this.arDatabase.captures));

        // Show success message
        this.showSuccessFeedback('Photo captured!');
        this.saveARSession('photo_captured', { captureId: captureData.id });

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('captureModal'));
        modal.show();

        return captureData;
    }

    // Cart Integration with Database
    addCurrentToCart() {
        if (!this.currentProduct) return;

        // Add to cart with AR metadata
        const cartItem = {
            id: this.currentProduct.id,
            name: this.currentProduct.name,
            price: this.currentProduct.price,
            image: this.currentProduct.image,
            quantity: 1,
            size: 'M', // Default size
            color: this.getColorName(this.currentColor),
            arTried: true,
            arColor: this.currentColor,
            arTimestamp: new Date().toISOString()
        };

        // Get existing cart
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Check if item already exists
        const existingIndex = cart.findIndex(item => 
            item.id === cartItem.id && 
            item.color === cartItem.color
        );

        if (existingIndex > -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push(cartItem);
        }

        // Save to cart database
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Save AR session
        this.saveARSession('added_to_cart', { 
            productId: this.currentProduct.id, 
            color: this.currentColor 
        });
        
        // Show success
        this.showSuccessFeedback(`${this.currentProduct.name} added to cart!`);
        
        // Update analytics
        this.updateAnalytics('cart_addition');
    }

    // Status and UI Updates
    updateStatus(message, type = 'info') {
        const statusText = document.getElementById('status-text');
        if (statusText) {
            statusText.textContent = message;
            statusText.className = `status-${type}`;
        }
    }

    updateCameraStatus(status) {
        const statusDot = document.getElementById('camera-status');
        if (statusDot) {
            statusDot.className = `fas fa-circle status-dot ${status}`;
        }
    }

    showLoading(show) {
        const loadingOverlay = document.getElementById('ar-loading');
        if (loadingOverlay) {
            loadingOverlay.style.display = show ? 'flex' : 'none';
        }
    }

    showError(message) {
        const errorOverlay = document.getElementById('ar-error');
        if (errorOverlay) {
            errorOverlay.classList.remove('d-none');
            errorOverlay.querySelector('p').textContent = message;
        }
    }

    showSuccessFeedback(message) {
        const feedback = document.createElement('div');
        feedback.className = 'ar-success-feedback';
        feedback.innerHTML = `<i class="fas fa-check-circle me-2"></i>${message}`;
        
        document.querySelector('.ar-container').appendChild(feedback);
        
        setTimeout(() => feedback.remove(), 2000);
    }

    // Cleanup
    destroy() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        this.isActive = false;
        
        // Save session end
        this.arSessionData.totalTime = Date.now() - this.arSessionData.startTime;
        this.saveARSession('ended', this.arSessionData);
    }
}

// Global AR Functions
let arSystem = null;

// Initialize AR System
document.addEventListener('DOMContentLoaded', function() {
    if (getCurrentPage() === 'ar-tryon') {
        arSystem = new ARTryOnSystem();
    }
});

// Global AR Control Functions
function selectARProduct(type) {
    if (arSystem) {
        arSystem.selectProductType(type);
    }
}

function changeARColor(color) {
    if (arSystem) {
        arSystem.changeColor(color);
    }
}

function captureARPhoto() {
    if (arSystem) {
        arSystem.captureARPhoto();
    }
}

function addCurrentToCart() {
    if (arSystem) {
        arSystem.addCurrentToCart();
    }
}

function requestCameraPermission() {
    // Reload page to retry camera permission
    window.location.reload();
}

function downloadCapture() {
    const canvas = document.getElementById('capture-canvas');
    const link = document.createElement('a');
    link.download = `ar-tryon-${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
}

function shareCapture() {
    if (navigator.share) {
        const canvas = document.getElementById('capture-canvas');
        canvas.toBlob(blob => {
            const file = new File([blob], 'ar-tryon.jpg', { type: 'image/jpeg' });
            navigator.share({
                files: [file],
                title: 'My AR Try-On',
                text: 'Check out how this looks on me!'
            });
        });
    } else {
        // Fallback: copy to clipboard
        showNotification('Share feature not supported on this browser', 'info');
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (arSystem) {
        arSystem.destroy();
    }
});
*/
