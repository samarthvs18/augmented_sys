// Working AR Body Tracking with TensorFlow.js PoseNet
class WorkingARSystem {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.net = null;
        this.bodySegmenter = null;
        
        // Current clothing state
        this.currentClothing = {
            type: 'tshirt',
            color: '#ff6b6b',
            size: 'm'
        };
        
        // Body analysis
        this.bodyData = {
            pose: null,
            confidence: 0,
            measurements: {},
            recommendedSize: 'M'
        };
        
        this.isRunning = false;
        this.animationId = null;
        
        this.init();
    }

    async init() {
        try {
            this.updateProgress(10, 'Setting up camera...');
            await this.setupCamera();
            
            this.updateProgress(30, 'Loading AI models...');
            await this.loadModels();
            
            this.updateProgress(60, 'Initializing body tracking...');
            await this.setupCanvas();
            
            this.updateProgress(80, 'Starting AR...');
            this.setupEventListeners();
            
            this.updateProgress(100, 'Ready!');
            setTimeout(() => {
                this.hideLoading();
                this.startTracking();
            }, 1000);
            
        } catch (error) {
            console.error('AR System Error:', error);
            this.showError(error.message);
        }
    }

    async setupCamera() {
        this.video = document.getElementById('video');
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                }
            });
            
            this.video.srcObject = stream;
            
            return new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.video.width = this.video.videoWidth;
                    this.video.height = this.video.videoHeight;
                    resolve();
                };
            });
        } catch (error) {
            throw new Error('Camera access denied. Please allow camera permissions.');
        }
    }

    async loadModels() {
        // Load PoseNet model
        this.net = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: { width: 640, height: 480 },
            multiplier: 0.75
        });
        
        console.log('PoseNet model loaded successfully');
    }

    setupCanvas() {
        this.canvas = document.getElementById('output-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Match canvas size to video
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
    }

    setupEventListeners() {
        // Color buttons
        document.querySelectorAll('.color-dot').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                this.changeColor(color);
            });
        });
        
        // Size buttons
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const size = e.target.dataset.size;
                this.changeSize(size);
            });
        });
    }

    startTracking() {
        this.isRunning = true;
        this.detectPose();
    }

    async detectPose() {
        if (!this.isRunning || !this.net || !this.video.readyState) {
            this.animationId = requestAnimationFrame(() => this.detectPose());
            return;
        }

        try {
            // Detect pose
            const pose = await this.net.estimateSinglePose(this.video, {
                flipHorizontal: true,
                decodingMethod: 'single-person'
            });
            
            this.bodyData.pose = pose;
            this.bodyData.confidence = pose.score;
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw video frame (mirrored)
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(this.video, -this.canvas.width, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
            
            // If good pose detected
            if (pose.score > 0.3) {
                this.drawPoseKeypoints(pose);
                this.drawClothing(pose);
                this.calculateMeasurements(pose);
                this.updateUI();
            }
            
        } catch (error) {
            console.error('Pose detection error:', error);
        }
        
        this.animationId = requestAnimationFrame(() => this.detectPose());
    }

    drawPoseKeypoints(pose) {
        // Draw important keypoints for clothing
        const keypoints = pose.keypoints;
        
        // Key points for clothing placement
        const clothingPoints = [
            'leftShoulder', 'rightShoulder',  // Shoulders
            'leftElbow', 'rightElbow',        // Elbows
            'leftWrist', 'rightWrist',        // Wrists
            'leftHip', 'rightHip'             // Hips
        ];
        
        keypoints.forEach((keypoint, index) => {
            if (keypoint.score > 0.3) {
                const { y, x } = keypoint.position;
                
                // Draw keypoint
                this.ctx.beginPath();
                this.ctx.arc(x, y, 6, 0, 2 * Math.PI);
                this.ctx.fillStyle = '#ff6b6b';
                this.ctx.fill();
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        });
        
        // Draw skeleton
        this.drawSkeleton(keypoints);
    }

    drawSkeleton(keypoints) {
        const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, 0.3);
        
        adjacentKeyPoints.forEach((keypoints) => {
            const [keypoint1, keypoint2] = keypoints;
            const { y: y1, x: x1 } = keypoint1.position;
            const { y: y2, x: x2 } = keypoint2.position;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.strokeStyle = 'rgba(255, 107, 107, 0.6)';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        });
    }

    drawClothing(pose) {
        const keypoints = pose.keypoints;
        
        // Get shoulder and hip positions
        const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
        const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
        const leftHip = keypoints.find(kp => kp.part === 'leftHip');
        const rightHip = keypoints.find(kp => kp.part === 'rightHip');
        
        if (leftShoulder?.score > 0.3 && rightShoulder?.score > 0.3) {
            const centerX = (leftShoulder.position.x + rightShoulder.position.x) / 2;
            const centerY = (leftShoulder.position.y + rightShoulder.position.y) / 2;
            const shoulderWidth = Math.abs(leftShoulder.position.x - rightShoulder.position.x);
            
            // Draw clothing based on type
            this.ctx.save();
            this.ctx.fillStyle = this.currentClothing.color + '80'; // Semi-transparent
            this.ctx.strokeStyle = this.currentClothing.color;
            this.ctx.lineWidth = 3;
            
            switch (this.currentClothing.type) {
                case 'tshirt':
                    this.drawTShirtOverlay(centerX, centerY, shoulderWidth);
                    break;
                case 'hoodie':
                    this.drawHoodieOverlay(centerX, centerY, shoulderWidth);
                    break;
                case 'dress':
                    this.drawDressOverlay(centerX, centerY, shoulderWidth, leftHip, rightHip);
                    break;
            }
            
            this.ctx.restore();
        }
    }

    drawTShirtOverlay(centerX, centerY, shoulderWidth) {
        const width = shoulderWidth * 1.2;
        const height = width * 1.3;
        
        // T-shirt body
        this.ctx.fillRect(centerX - width/2, centerY, width, height);
        
        // Sleeves
        const sleeveWidth = width * 0.3;
        const sleeveHeight = height * 0.5;
        this.ctx.fillRect(centerX - width/2 - sleeveWidth/2, centerY, sleeveWidth, sleeveHeight);
        this.ctx.fillRect(centerX + width/2 - sleeveWidth/2, centerY, sleeveWidth, sleeveHeight);
        
        // Neck
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY + 10, width * 0.12, 0, Math.PI);
        this.ctx.fill();
        
        // Outline
        this.ctx.strokeRect(centerX - width/2, centerY, width, height);
        this.ctx.strokeRect(centerX - width/2 - sleeveWidth/2, centerY, sleeveWidth, sleeveHeight);
        this.ctx.strokeRect(centerX + width/2 - sleeveWidth/2, centerY, sleeveWidth, sleeveHeight);
    }

    drawHoodieOverlay(centerX, centerY, shoulderWidth) {
        const width = shoulderWidth * 1.3;
        const height = width * 1.4;
        
        // Hoodie body (larger than t-shirt)
        this.ctx.fillRect(centerX - width/2, centerY, width, height);
        
        // Sleeves (longer)
        const sleeveWidth = width * 0.35;
        const sleeveHeight = height * 0.7;
        this.ctx.fillRect(centerX - width/2 - sleeveWidth/2, centerY, sleeveWidth, sleeveHeight);
        this.ctx.fillRect(centerX + width/2 - sleeveWidth/2, centerY, sleeveWidth, sleeveHeight);
        
        // Hood
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY - 10, width * 0.25, Math.PI, 0);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Pocket
        const pocketWidth = width * 0.6;
        const pocketHeight = height * 0.15;
        this.ctx.strokeRect(centerX - pocketWidth/2, centerY + height * 0.4, pocketWidth, pocketHeight);
        
        // Outline
        this.ctx.strokeRect(centerX - width/2, centerY, width, height);
        this.ctx.strokeRect(centerX - width/2 - sleeveWidth/2, centerY, sleeveWidth, sleeveHeight);
        this.ctx.strokeRect(centerX + width/2 - sleeveWidth/2, centerY, sleeveWidth, sleeveHeight);
    }

    drawDressOverlay(centerX, centerY, shoulderWidth, leftHip, rightHip) {
        const topWidth = shoulderWidth * 1.1;
        const topHeight = topWidth * 0.8;
        
        // Dress top
        this.ctx.fillRect(centerX - topWidth/2, centerY, topWidth, topHeight);
        
        // Dress skirt (flared)
        if (leftHip?.score > 0.3 && rightHip?.score > 0.3) {
            const hipCenterY = (leftHip.position.y + rightHip.position.y) / 2;
            const hipWidth = Math.abs(leftHip.position.x - rightHip.position.x) * 1.5;
            const skirtHeight = hipWidth * 0.8;
            
            // Trapezoidal skirt
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - topWidth/2, centerY + topHeight);
            this.ctx.lineTo(centerX - hipWidth/2, hipCenterY + skirtHeight);
            this.ctx.lineTo(centerX + hipWidth/2, hipCenterY + skirtHeight);
            this.ctx.lineTo(centerX + topWidth/2, centerY + topHeight);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
        
        // Sleeves (cap sleeves)
        const sleeveWidth = topWidth * 0.2;
        this.ctx.fillRect(centerX - topWidth/2 - sleeveWidth/2, centerY, sleeveWidth, topHeight * 0.3);
        this.ctx.fillRect(centerX + topWidth/2 - sleeveWidth/2, centerY, sleeveWidth, topHeight * 0.3);
        
        // Outline
        this.ctx.strokeRect(centerX - topWidth/2, centerY, topWidth, topHeight);
        this.ctx.strokeRect(centerX - topWidth/2 - sleeveWidth/2, centerY, sleeveWidth, topHeight * 0.3);
        this.ctx.strokeRect(centerX + topWidth/2 - sleeveWidth/2, centerY, sleeveWidth, topHeight * 0.3);
    }

    calculateMeasurements(pose) {
        const keypoints = pose.keypoints;
        
        const leftShoulder = keypoints.find(kp => kp.part === 'leftShoulder');
        const rightShoulder = keypoints.find(kp => kp.part === 'rightShoulder');
        const leftHip = keypoints.find(kp => kp.part === 'leftHip');
        
        if (leftShoulder && rightShoulder) {
            const shoulderWidth = Math.abs(leftShoulder.position.x - rightShoulder.position.x);
            
            // Recommend size based on shoulder width
            if (shoulderWidth < 120) this.bodyData.recommendedSize = 'XS';
            else if (shoulderWidth < 140) this.bodyData.recommendedSize = 'S';
            else if (shoulderWidth < 160) this.bodyData.recommendedSize = 'M';
            else if (shoulderWidth < 180) this.bodyData.recommendedSize = 'L';
            else this.bodyData.recommendedSize = 'XL';
            
            this.bodyData.measurements.shoulderWidth = shoulderWidth;
        }
    }

    updateUI() {
        // Update body detection status
        const bodyStatus = document.getElementById('body-status');
        const poseScore = document.getElementById('pose-score');
        const sizeRec = document.getElementById('size-rec');
        
        if (bodyStatus) {
            bodyStatus.textContent = this.bodyData.confidence > 0.3 ? '✅' : '❌';
        }
        
        if (poseScore) {
            poseScore.textContent = `${Math.round(this.bodyData.confidence * 100)}%`;
        }
        
        if (sizeRec) {
            sizeRec.textContent = this.bodyData.recommendedSize;
        }
    }

    // Control Methods
    changeColor(color) {
        this.currentClothing.color = color;
        
        // Update active button
        document.querySelectorAll('.color-dot').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-color="${color}"]`).classList.add('active');
        
        this.showFeedback(`Color changed to ${this.getColorName(color)}`);
    }

    changeSize(size) {
        this.currentClothing.size = size;
        
        // Update active button
        document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-size="${size}"]`).classList.add('active');
        
        this.showFeedback(`Size changed to ${size.toUpperCase()}`);
    }

    getColorName(color) {
        const colors = {
            '#ff6b6b': 'Red',
            '#4ecdc4': 'Teal',
            '#45b7d1': 'Blue',
            '#96ceb4': 'Green',
            '#feca57': 'Yellow'
        };
        return colors[color] || 'Custom';
    }

    // UI Helpers
    updateProgress(percent, message) {
        const progressBar = document.getElementById('progress-bar');
        const loadingContent = document.querySelector('.loading-content p');
        
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (loadingContent) loadingContent.textContent = message;
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
    }

    showError(message) {
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        
        if (loading) loading.style.display = 'none';
        if (error) {
            error.classList.remove('d-none');
            error.querySelector('p').textContent = message;
        }
    }

    showFeedback(message) {
        // Create temporary feedback
        const feedback = document.createElement('div');
        feedback.className = 'ar-feedback';
        feedback.innerHTML = `<i class="fas fa-check-circle me-2"></i>${message}`;
        feedback.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(40, 167, 69, 0.9);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            z-index: 1000;
            animation: fadeInOut 2s ease;
        `;
        
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }

    capturePhoto() {
        if (!this.canvas) return null;
        
        const captureCanvas = document.getElementById('capture-canvas');
        const captureCtx = captureCanvas.getContext('2d');
        
        captureCanvas.width = this.canvas.width;
        captureCanvas.height = this.canvas.height;
        
        // Copy current frame
        captureCtx.drawImage(this.canvas, 0, 0);
        
        return captureCanvas;
    }

    // Cleanup
    destroy() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.video && this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
    }
}

// Global instance
let arSystem = null;

// Global functions
function selectClothingType(type) {
    if (arSystem) {
        arSystem.currentClothing.type = type;
        
        // Update active button
        document.querySelectorAll('.cloth-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-type="${type}"]`).classList.add('active');
        
        arSystem.showFeedback(`Selected ${type}`);
    }
}

function changeColor(color) {
    if (arSystem) {
        arSystem.changeColor(color);
    }
}

function capturePhoto() {
    if (arSystem) {
        const canvas = arSystem.capturePhoto();
        if (canvas) {
            const modal = new bootstrap.Modal(document.getElementById('captureModal'));
            modal.show();
            arSystem.showFeedback('Photo captured!');
        }
    }
}

function downloadCapture() {
    const canvas = document.getElementById('capture-canvas');
    const link = document.createElement('a');
    link.download = `ar-tryon-${Date.now()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
}

function addToCartFromAR() {
    if (arSystem && arSystem.bodyData.pose) {
        const item = {
            id: Date.now(),
            name: `${arSystem.currentClothing.type.toUpperCase()} (AR Fitted)`,
            price: 49.99,
            color: arSystem.getColorName(arSystem.currentClothing.color),
            size: arSystem.bodyData.recommendedSize,
            arTried: true,
            bodyTracked: true
        };
        
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        updateCartCount();
        arSystem.showFeedback('Perfect fit added to cart!');
    } else {
        alert('Please stand in front of the camera for body detection!');
    }
}

function addToCartFromCapture() {
    addToCartFromAR();
    const modal = bootstrap.Modal.getInstance(document.getElementById('captureModal'));
    modal.hide();
}

function retryCamera() {
    window.location.reload();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (getCurrentPage() === 'ar-tryon') {
        arSystem = new WorkingARSystem();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (arSystem) {
        arSystem.destroy();
    }
});

// CSS Animation for feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        10%, 90% { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(style);
