// Real AR Body Tracking System with MediaPipe and Body Segmentation
class RealARSystem {
    constructor() {
        this.camera = null;
        this.canvases = {};
        this.contexts = {};
        
        // MediaPipe Models
        this.pose = null;
        this.selfieSegmentation = null;
        this.bodySegmenter = null;
        
        // Body Analysis Data
        this.bodyData = {
            landmarks: null,
            segmentation: null,
            measurements: {},
            bodyType: 'medium',
            confidence: 0
        };
        
        // Clothing Configuration
        this.currentClothing = {
            type: 'tshirt',
            color: '#ff6b6b',
            size: 'm',
            texture: null,
            mesh: null
        };
        
        // Three.js Setup
        this.scene = null;
        this.renderer = null;
        this.clothingMesh = null;
        
        this.isInitialized = false;
        this.animationFrame = null;
        
        this.init();
    }

    async init() {
        try {
            this.showLoadingStatus('Initializing camera...', 10);
            await this.setupCamera();
            
            this.showLoadingStatus('Setting up canvases...', 20);
            this.setupCanvases();
            
            this.showLoadingStatus('Loading MediaPipe Pose...', 40);
            await this.initializePose();
            
            this.showLoadingStatus('Loading Body Segmentation...', 60);
            await this.initializeBodySegmentation();
            
            this.showLoadingStatus('Setting up 3D clothing...', 80);
            await this.initializeThreeJS();
            
            this.showLoadingStatus('Starting AR tracking...', 95);
            this.setupEventListeners();
            this.startARLoop();
            
            this.showLoadingStatus('AR Ready!', 100);
            setTimeout(() => this.hideLoading(), 1000);
            
            this.isInitialized = true;
            console.log('Real AR System initialized successfully!');
            
        } catch (error) {
            console.error('Failed to initialize AR system:', error);
            this.showError('Failed to initialize AR system: ' + error.message);
        }
    }

    async setupCamera() {
        this.camera = document.getElementById('camera-feed');
        
        const constraints = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user',
                frameRate: { ideal: 30 }
            }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.camera.srcObject = stream;
        
        return new Promise((resolve) => {
            this.camera.addEventListener('loadedmetadata', () => {
                resolve();
            });
        });
    }

    setupCanvases() {
        const canvasIds = ['segmentation-canvas', 'pose-canvas', 'clothing-canvas'];
        
        canvasIds.forEach(id => {
            const canvas = document.getElementById(id);
            canvas.width = this.camera.videoWidth;
            canvas.height = this.camera.videoHeight;
            
            this.canvases[id] = canvas;
            this.contexts[id] = canvas.getContext('2d');
        });
    }

    async initializePose() {
        this.pose = new Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });
        
        this.pose.setOptions({
            modelComplexity: 2,
            smoothLandmarks: true,
            enableSegmentation: true,
            smoothSegmentation: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        
        this.pose.onResults((results) => {
            this.processPoseResults(results);
        });
    }

    async initializeBodySegmentation() {
        const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
        const segmenterConfig = {
            runtime: 'mediapipe',
            modelType: 'general'
        };
        
        this.bodySegmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
    }

    async initializeThreeJS() {
        const container = document.getElementById('threejs-container');
        
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        const camera = new THREE.PerspectiveCamera(75, this.camera.videoWidth / this.camera.videoHeight, 0.1, 1000);
        camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(this.camera.videoWidth, this.camera.videoHeight);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.pointerEvents = 'none';
        
        container.appendChild(this.renderer.domElement);
        
        // Load initial clothing
        await this.loadClothing('tshirt');
    }

    async loadClothing(type) {
        // Remove existing clothing
        if (this.clothingMesh) {
            this.scene.remove(this.clothingMesh);
        }
        
        // Create clothing geometry based on type
        let geometry;
        
        switch (type) {
            case 'tshirt':
                geometry = this.createTShirtGeometry();
                break;
            case 'hoodie':
                geometry = this.createHoodieGeometry();
                break;
            case 'dress':
                geometry = this.createDressGeometry();
                break;
            case 'jacket':
                geometry = this.createJacketGeometry();
                break;
            default:
                geometry = this.createTShirtGeometry();
        }
        
        // Create material with current color
        const material = new THREE.MeshStandardMaterial({
            color: this.currentClothing.color,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        // Create mesh
        this.clothingMesh = new THREE.Mesh(geometry, material);
        this.clothingMesh.visible = false; // Hidden until body is detected
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight.position.set(1, 1, 1);
        
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
        this.scene.add(this.clothingMesh);
    }

    createTShirtGeometry() {
        const shape = new THREE.Shape();
        
        // T-Shirt outline
        shape.moveTo(-1.5, 1);     // Left shoulder
        shape.lineTo(-1.8, 0.7);   // Left sleeve
        shape.lineTo(-1.5, -0.3);  // Left sleeve end
        shape.lineTo(-1, -0.3);    // Left side
        shape.lineTo(-1, -2.5);    // Left bottom
        shape.lineTo(1, -2.5);     // Bottom
        shape.lineTo(1, -0.3);     // Right side
        shape.lineTo(1.5, -0.3);   // Right sleeve end
        shape.lineTo(1.8, 0.7);    // Right sleeve
        shape.lineTo(1.5, 1);      // Right shoulder
        shape.lineTo(0.3, 1.2);    // Right neck
        shape.lineTo(-0.3, 1.2);   // Left neck
        shape.closePath();
        
        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 0.1,
            bevelEnabled: false
        });
        
        return geometry;
    }

    createHoodieGeometry() {
        const shape = new THREE.Shape();
        
        // Hoodie with hood
        shape.moveTo(-1.7, 1.2);   // Left shoulder
        shape.lineTo(-2, 0.8);     // Left sleeve
        shape.lineTo(-1.7, -0.5);  // Left sleeve end
        shape.lineTo(-1.2, -0.5);  // Left side
        shape.lineTo(-1.2, -3);    // Left bottom
        shape.lineTo(1.2, -3);     // Bottom
        shape.lineTo(1.2, -0.5);   // Right side
        shape.lineTo(1.7, -0.5);   // Right sleeve end
        shape.lineTo(2, 0.8);      // Right sleeve
        shape.lineTo(1.7, 1.2);    // Right shoulder
        shape.lineTo(0.5, 1.5);    // Hood right
        shape.lineTo(0, 1.8);      // Hood top
        shape.lineTo(-0.5, 1.5);   // Hood left
        shape.closePath();
        
        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 0.15,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02
        });
        
        return geometry;
    }

    createDressGeometry() {
        const shape = new THREE.Shape();
        
        // Dress shape
        shape.moveTo(-1, 1);       // Left shoulder
        shape.lineTo(-1.3, 0.8);   // Left sleeve
        shape.lineTo(-1, 0.2);     // Left sleeve end
        shape.lineTo(-0.8, 0.2);   // Left side top
        shape.lineTo(-1.5, -3.5);  // Left bottom (flared)
        shape.lineTo(1.5, -3.5);   // Bottom
        shape.lineTo(0.8, 0.2);    // Right side top
        shape.lineTo(1, 0.2);      // Right sleeve end
        shape.lineTo(1.3, 0.8);    // Right sleeve
        shape.lineTo(1, 1);        // Right shoulder
        shape.lineTo(0.2, 1.2);    // Right neck
        shape.lineTo(-0.2, 1.2);   // Left neck
        shape.closePath();
        
        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 0.08,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 0.01
        });
        
        return geometry;
    }

    createJacketGeometry() {
        const shape = new THREE.Shape();
        
        // Jacket with lapels
        shape.moveTo(-1.8, 1.3);   // Left shoulder
        shape.lineTo(-2.2, 0.9);   // Left sleeve
        shape.lineTo(-1.9, -0.7);  // Left sleeve end
        shape.lineTo(-1.4, -0.7);  // Left side
        shape.lineTo(-1.4, -3.2);  // Left bottom
        shape.lineTo(1.4, -3.2);   // Bottom
        shape.lineTo(1.4, -0.7);   // Right side
        shape.lineTo(1.9, -0.7);   // Right sleeve end
        shape.lineTo(2.2, 0.9);    // Right sleeve
        shape.lineTo(1.8, 1.3);    // Right shoulder
        shape.lineTo(0.8, 1.5);    // Right lapel
        shape.lineTo(0.3, 1.3);    // Right neck
        shape.lineTo(-0.3, 1.3);   // Left neck
        shape.lineTo(-0.8, 1.5);   // Left lapel
        shape.closePath();
        
        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 0.12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02
        });
        
        return geometry;
    }

    startARLoop() {
        const processFrame = async () => {
            if (!this.isInitialized) return;
            
            if (this.camera.readyState === 4) {
                // Send frame to MediaPipe Pose
                await this.pose.send({ image: this.camera });
                
                // Perform body segmentation
                await this.performBodySegmentation();
                
                // Render Three.js scene
                if (this.renderer && this.scene) {
                    this.renderer.render(this.scene, this.scene.children.find(child => child.isCamera) || new THREE.PerspectiveCamera());
                }
            }
            
            this.animationFrame = requestAnimationFrame(processFrame);
        };
        
        processFrame();
    }

    async performBodySegmentation() {
        if (!this.bodySegmenter || !this.camera) return;
        
        try {
            const segmentation = await this.bodySegmenter.segmentPeople(this.camera);
            
            if (segmentation.length > 0) {
                this.drawBodySegmentation(segmentation[0]);
                this.bodyData.segmentation = segmentation[0];
            }
        } catch (error) {
            console.error('Body segmentation error:', error);
        }
    }

    drawBodySegmentation(segmentation) {
        const canvas = this.canvases['segmentation-canvas'];
        const ctx = this.contexts['segmentation-canvas'];
        
        if (!canvas || !ctx) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create colored mask
        const { width, height, data } = segmentation.mask;
        const imageData = new ImageData(width, height);
        
        for (let i = 0; i < data.length; i++) {
            const pixel = data[i];
            const pixelIndex = i * 4;
            
            if (pixel > 0.5) {
                // Person detected - semi-transparent overlay
                imageData.data[pixelIndex] = 255;     // R
                imageData.data[pixelIndex + 1] = 255; // G
                imageData.data[pixelIndex + 2] = 0;   // B
                imageData.data[pixelIndex + 3] = 50;  // A (transparency)
            } else {
                // Background - fully transparent
                imageData.data[pixelIndex + 3] = 0;
            }
        }
        
        // Draw segmentation mask
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(imageData, 0, 0);
        
        ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    }

    processPoseResults(results) {
        if (!results.poseLandmarks) return;
        
        this.bodyData.landmarks = results.poseLandmarks;
        this.bodyData.confidence = this.calculatePoseConfidence(results.poseLandmarks);
        
        // Draw pose landmarks
        this.drawPoseLandmarks(results.poseLandmarks);
        
        // Calculate body measurements
        this.calculateBodyMeasurements(results.poseLandmarks);
        
        // Position 3D clothing based on pose
        this.positionClothingOnBody(results.poseLandmarks);
        
        // Update UI
        this.updateBodyAnalysisUI();
        
        // Show clothing if body detected
        if (this.clothingMesh && this.bodyData.confidence > 0.7) {
            this.clothingMesh.visible = true;
        }
    }

    drawPoseLandmarks(landmarks) {
        const canvas = this.canvases['pose-canvas'];
        const ctx = this.contexts['pose-canvas'];
        
        if (!canvas || !ctx) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw key body points for clothing positioning
        const keyPoints = [
            11, 12, // Shoulders
            23, 24, // Hips
            13, 14, // Elbows
            15, 16  // Wrists
        ];
        
        keyPoints.forEach(index => {
            const landmark = landmarks[index];
            if (landmark && landmark.visibility > 0.5) {
                const x = landmark.x * canvas.width;
                const y = landmark.y * canvas.height;
                
                // Draw point
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = '#ff6b6b';
                ctx.fill();
                
                // Draw label
                ctx.fillStyle = '#fff';
                ctx.font = '12px Arial';
                ctx.fillText(`${index}`, x + 8, y - 8);
            }
        });
        
        // Draw skeleton connections
        this.drawSkeletonConnections(ctx, landmarks, canvas.width, canvas.height);
    }

    drawSkeletonConnections(ctx, landmarks, width, height) {
        const connections = [
            [11, 12], // Shoulders
            [11, 13], [13, 15], // Left arm
            [12, 14], [14, 16], // Right arm
            [11, 23], [12, 24], // Torso
            [23, 24] // Hips
        ];
        
        ctx.strokeStyle = 'rgba(255, 107, 107, 0.6)';
        ctx.lineWidth = 3;
        
        connections.forEach(([start, end]) => {
            const startPoint = landmarks[start];
            const endPoint = landmarks[end];
            
            if (startPoint?.visibility > 0.5 && endPoint?.visibility > 0.5) {
                ctx.beginPath();
                ctx.moveTo(startPoint.x * width, startPoint.y * height);
                ctx.lineTo(endPoint.x * width, endPoint.y * height);
                ctx.stroke();
            }
        });
    }

    calculateBodyMeasurements(landmarks) {
        const measurements = {};
        
        // Shoulder width (distance between shoulders)
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        
        if (leftShoulder && rightShoulder) {
            measurements.shoulderWidth = this.calculateDistance(leftShoulder, rightShoulder);
        }
        
        // Chest width (approximate)
        measurements.chestWidth = measurements.shoulderWidth * 0.8;
        
        // Torso length (shoulder to hip)
        const leftHip = landmarks[23];
        if (leftShoulder && leftHip) {
            measurements.torsoLength = this.calculateDistance(leftShoulder, leftHip);
        }
        
        this.bodyData.measurements = measurements;
        this.recommendSize(measurements);
    }

    calculateDistance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    positionClothingOnBody(landmarks) {
        if (!this.clothingMesh) return;
        
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        
        if (leftShoulder && rightShoulder && leftHip && rightHip) {
            // Calculate center position
            const centerX = (leftShoulder.x + rightShoulder.x) / 2;
            const centerY = (leftShoulder.y + leftHip.y) / 2;
            
            // Convert to 3D coordinates
            const x = (centerX - 0.5) * 8;  // Scale and center
            const y = (0.5 - centerY) * 6;  // Scale and center (flip Y)
            const z = 0;
            
            this.clothingMesh.position.set(x, y, z);
            
            // Scale based on body size
            const shoulderWidth = this.calculateDistance(leftShoulder, rightShoulder);
            const scale = shoulderWidth * 8; // Adjust multiplier as needed
            
            this.clothingMesh.scale.set(scale, scale, scale);
            
            // Rotate slightly for natural look
            this.clothingMesh.rotation.z = (leftShoulder.y - rightShoulder.y) * 0.5;
        }
    }

    calculatePoseConfidence(landmarks) {
        let totalConfidence = 0;
        let visibleLandmarks = 0;
        
        landmarks.forEach(landmark => {
            if (landmark.visibility > 0.5) {
                totalConfidence += landmark.visibility;
                visibleLandmarks++;
            }
        });
        
        return visibleLandmarks > 0 ? totalConfidence / visibleLandmarks : 0;
    }

    recommendSize(measurements) {
        let recommendedSize = 'M'; // Default
        
        if (measurements.shoulderWidth) {
            if (measurements.shoulderWidth < 0.15) recommendedSize = 'XS';
            else if (measurements.shoulderWidth < 0.18) recommendedSize = 'S';
            else if (measurements.shoulderWidth < 0.22) recommendedSize = 'M';
            else if (measurements.shoulderWidth < 0.26) recommendedSize = 'L';
            else recommendedSize = 'XL';
        }
        
        this.bodyData.recommendedSize = recommendedSize;
    }

    updateBodyAnalysisUI() {
        // Update body detected status
        const bodyDetected = document.getElementById('body-detected');
        if (bodyDetected) {
            bodyDetected.textContent = this.bodyData.landmarks ? '✅' : '❌';
        }
        
        // Update pose confidence
        const poseConfidence = document.getElementById('pose-confidence');
        if (poseConfidence) {
            poseConfidence.textContent = `${Math.round(this.bodyData.confidence * 100)}%`;
        }
        
        // Update body measurements
        if (this.bodyData.measurements.shoulderWidth) {
            const shoulderWidth = document.getElementById('shoulder-width');
            const chestWidth = document.getElementById('chest-width');
            const torsoLength = document.getElementById('torso-length');
            const recommendedSize = document.getElementById('recommended-size');
            
            if (shoulderWidth) shoulderWidth.textContent = `${(this.bodyData.measurements.shoulderWidth * 100).toFixed(1)}cm`;
            if (chestWidth) chestWidth.textContent = `${(this.bodyData.measurements.chestWidth * 100).toFixed(1)}cm`;
            if (torsoLength) torsoLength.textContent = `${(this.bodyData.measurements.torsoLength * 100).toFixed(1)}cm`;
            if (recommendedSize) recommendedSize.textContent = this.bodyData.recommendedSize;
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Color change
        document.querySelectorAll('.color-btn-new').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                this.changeClothingColor(color);
                
                // Update active state
                document.querySelectorAll('.color-btn-new').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // Size change
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const size = e.target.dataset.size;
                this.changeClothingSize(size);
                
                // Update active state
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    changeClothingColor(color) {
        this.currentClothing.color = color;
        
        if (this.clothingMesh && this.clothingMesh.material) {
            this.clothingMesh.material.color.setHex(color.replace('#', '0x'));
        }
    }

    changeClothingSize(size) {
        this.currentClothing.size = size;
        
        // Adjust scale based on size
        const sizeMultipliers = {
            'xs': 0.85,
            's': 0.92,
            'm': 1.0,
            'l': 1.08,
            'xl': 1.15
        };
        
        if (this.clothingMesh && sizeMultipliers[size]) {
            const currentScale = this.clothingMesh.scale.x;
            const newScale = currentScale * sizeMultipliers[size] / sizeMultipliers[this.currentClothing.size];
            this.clothingMesh.scale.set(newScale, newScale, newScale);
        }
    }

    // UI Helper Methods
    showLoadingStatus(message, progress) {
        const statusEl = document.getElementById('loading-status');
        const progressEl = document.getElementById('loading-progress');
        
        if (statusEl) statusEl.textContent = message;
        if (progressEl) progressEl.style.width = `${progress}%`;
    }

    hideLoading() {
        const loadingEl = document.getElementById('ar-loading');
        if (loadingEl) {
            loadingEl.style.display = 'none';
        }
    }

    showError(message) {
        console.error(message);
        alert(message); // Simple error display - enhance as needed
    }

    // Cleanup
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        if (this.camera && this.camera.srcObject) {
            this.camera.srcObject.getTracks().forEach(track => track.stop());
        }
        
        this.isInitialized = false;
    }
}

// Global instance
let realARSystem = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (getCurrentPage() === 'ar-tryon') {
        realARSystem = new RealARSystem();
    }
});

// Global functions for UI controls
function selectClothing(type) {
    if (realARSystem) {
        realARSystem.currentClothing.type = type;
        realARSystem.loadClothing(type);
        
        // Update active button
        document.querySelectorAll('.clothing-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-type="${type}"]`).classList.add('active');
    }
}

function captureRealAR() {
    if (!realARSystem) return;
    
    // Create capture canvas combining all layers
    const captureCanvas = document.createElement('canvas');
    const captureCtx = captureCanvas.getContext('2d');
    
    captureCanvas.width = realARSystem.camera.videoWidth;
    captureCanvas.height = realARSystem.camera.videoHeight;
    
    // Draw video background
    captureCtx.drawImage(realARSystem.camera, 0, 0);
    
    // Draw AR overlays
    Object.values(realARSystem.canvases).forEach(canvas => {
        captureCtx.drawImage(canvas, 0, 0);
    });
    
    // Draw Three.js render
    if (realARSystem.renderer) {
        captureCtx.drawImage(realARSystem.renderer.domElement, 0, 0);
    }
    
    // Download or display capture
    const link = document.createElement('a');
    link.download = `ar-tryon-real-${Date.now()}.jpg`;
    link.href = captureCanvas.toDataURL('image/jpeg', 0.9);
    link.click();
    
    // Show success message
    showNotification('AR photo captured with body tracking!', 'success');
}

function addToCartWithBodyData() {
    if (!realARSystem || !realARSystem.bodyData.landmarks) {
        showNotification('Please stand in front of the camera first!', 'warning');
        return;
    }
    
    // Add to cart with body measurements
    const cartItem = {
        id: Date.now(),
        name: `${realARSystem.currentClothing.type.toUpperCase()} (AR Fitted)`,
        price: 59.99,
        color: realARSystem.currentClothing.color,
        size: realARSystem.bodyData.recommendedSize,
        measurements: realARSystem.bodyData.measurements,
        arTried: true,
        bodyTracked: true,
        confidence: realARSystem.bodyData.confidence
    };
    
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    showNotification('Perfect fit added to cart!', 'success');
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (realARSystem) {
        realARSystem.destroy();
    }
});
