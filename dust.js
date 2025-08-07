/**
 * Dust Particle Effect Module
 * 
 * Creates a subtle floating dust particle effect using Three.js GPU particles.
 * Positioned between the gradient background and page content.
 * 
 * @author myTech.Today
 * @version 1.0.0
 * @requires Three.js
 */

(function() {
    'use strict';

    /**
     * Dust Effect Configuration
     */
    const DustConfig = {
        container: {
            id: 'dust-container',
            zIndex: 0
        },
        particles: {
            count: 150, // Default value, will be overridden by CSS variable
            size: 2.0,  // Default value, will be overridden by CSS variable
            sizeVariation: 1.5,
            speed: 0.3,
            drift: 0.1,
            opacity: 0.4,
            color: 0xffffff
        },
        animation: {
            rotationSpeed: 0.001,
            floatSpeed: 0.0005,
            windStrength: 0.0002
        },
        performance: {
            enableOnMobile: false,
            reduceOnTablet: true,
            maxFPS: 30
        }
    };

    /**
     * Dust Effect State
     */
    const DustState = {
        scene: null,
        camera: null,
        renderer: null,
        particles: null,
        geometry: null,
        material: null,
        container: null,
        animationId: null,
        isInitialized: false,
        isRunning: false,
        lastTime: 0,
        frameCount: 0
    };

    /**
     * Vertex shader for dust particles
     */
    const vertexShader = `
        attribute float size;
        attribute float opacity;
        attribute vec3 velocity;
        
        varying float vOpacity;
        
        uniform float time;
        uniform float globalOpacity;
        uniform float globalBrightness;
        
        void main() {
            vOpacity = opacity * globalOpacity;
            
            // Apply floating motion
            vec3 pos = position;
            pos.x += sin(time * 0.001 + position.y * 0.01) * 2.0;
            pos.y += cos(time * 0.0008 + position.x * 0.01) * 1.5;
            pos.z += sin(time * 0.0012 + position.z * 0.01) * 1.0;
            
            // Add drift motion
            pos += velocity * time * 0.1;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * (300.0 / -mvPosition.z);
        }
    `;

    /**
     * Fragment shader for dust particles
     */
    const fragmentShader = `
        varying float vOpacity;
        uniform float globalBrightness;
        
        void main() {
            // Create circular particle shape
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            
            if (dist > 0.5) discard;
            
            // Soft edge falloff
            float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
            alpha *= vOpacity * globalBrightness;
            
            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
    `;

    /**
     * Utility Functions
     */
    const DustUtils = {
        /**
         * Check if device should show dust effect
         */
        shouldEnableDust() {
            const isMobile = window.innerWidth <= 768;
            const isTablet = window.innerWidth <= 1024;
            
            if (isMobile && !DustConfig.performance.enableOnMobile) {
                return false;
            }
            
            // Check for reduced motion preference
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return false;
            }
            
            // Check WebGL support
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                return !!gl;
            } catch (e) {
                return false;
            }
        },

        /**
         * Get CSS custom property value
         */
        getCSSVariable(name) {
            return getComputedStyle(document.documentElement)
                .getPropertyValue(name).trim();
        },

        /**
         * Random number between min and max
         */
        random(min, max) {
            return Math.random() * (max - min) + min;
        },

        /**
         * Log error with context
         */
        logError(message, error) {
            console.warn(`[Dust Effect] ${message}:`, error);
        }
    };

    /**
     * Dust Effect Core Functions
     */
    const DustCore = {
        /**
         * Initialize Three.js scene
         */
        initScene() {
            try {
                // Create container
                DustState.container = document.createElement('div');
                DustState.container.id = DustConfig.container.id;
                document.body.appendChild(DustState.container);

                // Create scene
                DustState.scene = new THREE.Scene();

                // Create camera
                DustState.camera = new THREE.PerspectiveCamera(
                    75,
                    window.innerWidth / window.innerHeight,
                    0.1,
                    1000
                );
                DustState.camera.position.z = 100;

                // Create renderer
                DustState.renderer = new THREE.WebGLRenderer({
                    alpha: true,
                    antialias: false,
                    powerPreference: 'low-power'
                });
                
                DustState.renderer.setSize(window.innerWidth, window.innerHeight);
                DustState.renderer.setClearColor(0x000000, 0);
                DustState.container.appendChild(DustState.renderer.domElement);

                return true;
            } catch (error) {
                DustUtils.logError('Failed to initialize scene', error);
                return false;
            }
        },

        /**
         * Create particle system
         */
        createParticles() {
            try {
                // Get particle count from CSS variable or use default
                const particleCount = parseInt(DustUtils.getCSSVariable('--dust-particle-count')) || DustConfig.particles.count;

                // Get particle size from CSS variable or use default
                const particleSize = parseFloat(DustUtils.getCSSVariable('--dust-particle-size')) || DustConfig.particles.size;
                
                // Create geometry
                DustState.geometry = new THREE.BufferGeometry();
                
                // Position array
                const positions = new Float32Array(particleCount * 3);
                const sizes = new Float32Array(particleCount);
                const opacities = new Float32Array(particleCount);
                const velocities = new Float32Array(particleCount * 3);
                
                // Initialize particle attributes
                for (let i = 0; i < particleCount; i++) {
                    const i3 = i * 3;
                    
                    // Random positions across viewport
                    positions[i3] = DustUtils.random(-200, 200);
                    positions[i3 + 1] = DustUtils.random(-200, 200);
                    positions[i3 + 2] = DustUtils.random(-50, 50);
                    
                    // Random sizes
                    sizes[i] = DustUtils.random(
                        particleSize - DustConfig.particles.sizeVariation,
                        particleSize + DustConfig.particles.sizeVariation
                    );
                    
                    // Random opacities
                    opacities[i] = DustUtils.random(0.1, DustConfig.particles.opacity);
                    
                    // Random velocities for drift
                    velocities[i3] = DustUtils.random(-DustConfig.particles.drift, DustConfig.particles.drift);
                    velocities[i3 + 1] = DustUtils.random(-DustConfig.particles.drift, DustConfig.particles.drift);
                    velocities[i3 + 2] = DustUtils.random(-DustConfig.particles.drift, DustConfig.particles.drift);
                }
                
                // Set geometry attributes
                DustState.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                DustState.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
                DustState.geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
                DustState.geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
                
                // Create material with shaders
                DustState.material = new THREE.ShaderMaterial({
                    uniforms: {
                        time: { value: 0 },
                        globalOpacity: { value: parseFloat(DustUtils.getCSSVariable('--dust-opacity')) || 0.15 },
                        globalBrightness: { value: parseFloat(DustUtils.getCSSVariable('--dust-brightness')) || 0.3 }
                    },
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false
                });
                
                // Create particle system
                DustState.particles = new THREE.Points(DustState.geometry, DustState.material);
                DustState.scene.add(DustState.particles);
                
                return true;
            } catch (error) {
                DustUtils.logError('Failed to create particles', error);
                return false;
            }
        },

        /**
         * Animation loop
         */
        animate(currentTime) {
            if (!DustState.isRunning) return;
            
            // Throttle to target FPS
            if (currentTime - DustState.lastTime < 1000 / DustConfig.performance.maxFPS) {
                DustState.animationId = requestAnimationFrame(DustCore.animate);
                return;
            }
            
            DustState.lastTime = currentTime;
            
            try {
                // Update uniforms
                if (DustState.material) {
                    DustState.material.uniforms.time.value = currentTime;
                    
                    // Update opacity from CSS variable
                    const newOpacity = parseFloat(DustUtils.getCSSVariable('--dust-opacity')) || 0.15;
                    DustState.material.uniforms.globalOpacity.value = newOpacity;
                    
                    // Update brightness from CSS variable
                    const newBrightness = parseFloat(DustUtils.getCSSVariable('--dust-brightness')) || 0.3;
                    DustState.material.uniforms.globalBrightness.value = newBrightness;
                }
                
                // Render scene
                if (DustState.renderer && DustState.scene && DustState.camera) {
                    DustState.renderer.render(DustState.scene, DustState.camera);
                }
                
                DustState.animationId = requestAnimationFrame(DustCore.animate);
            } catch (error) {
                DustUtils.logError('Animation error', error);
                DustCore.stop();
            }
        },

        /**
         * Handle window resize
         */
        handleResize() {
            if (!DustState.camera || !DustState.renderer) return;
            
            try {
                DustState.camera.aspect = window.innerWidth / window.innerHeight;
                DustState.camera.updateProjectionMatrix();
                DustState.renderer.setSize(window.innerWidth, window.innerHeight);
            } catch (error) {
                DustUtils.logError('Resize error', error);
            }
        },

        /**
         * Start dust effect
         */
        start() {
            if (DustState.isRunning) return;
            
            DustState.isRunning = true;
            DustState.animationId = requestAnimationFrame(DustCore.animate);
        },

        /**
         * Stop dust effect
         */
        stop() {
            DustState.isRunning = false;
            if (DustState.animationId) {
                cancelAnimationFrame(DustState.animationId);
                DustState.animationId = null;
            }
        },

        /**
         * Clean up resources
         */
        dispose() {
            DustCore.stop();
            
            if (DustState.geometry) {
                DustState.geometry.dispose();
            }
            
            if (DustState.material) {
                DustState.material.dispose();
            }
            
            if (DustState.renderer) {
                DustState.renderer.dispose();
            }
            
            if (DustState.container && DustState.container.parentNode) {
                DustState.container.parentNode.removeChild(DustState.container);
            }
            
            // Reset state
            Object.keys(DustState).forEach(key => {
                if (key !== 'isInitialized') {
                    DustState[key] = null;
                }
            });
            DustState.isInitialized = false;
            DustState.isRunning = false;
        }
    };

    /**
     * Public API
     */
    const DustEffect = {
        /**
         * Initialize dust effect
         */
        init() {
            if (DustState.isInitialized) {
                console.warn('[Dust Effect] Already initialized');
                return false;
            }

            // Check if dust should be enabled
            if (!DustUtils.shouldEnableDust()) {
                console.info('[Dust Effect] Disabled for this device/preference');
                return false;
            }

            // Check if Three.js is available
            if (typeof THREE === 'undefined') {
                console.warn('[Dust Effect] Three.js not found, loading from CDN...');
                DustEffect.loadThreeJS(() => DustEffect.init());
                return false;
            }

            try {
                // Initialize scene
                if (!DustCore.initScene()) {
                    throw new Error('Failed to initialize scene');
                }

                // Create particles
                if (!DustCore.createParticles()) {
                    throw new Error('Failed to create particles');
                }

                // Set up event listeners
                window.addEventListener('resize', DustCore.handleResize);

                // Handle visibility change
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        DustCore.stop();
                    } else if (DustState.isInitialized) {
                        DustCore.start();
                    }
                });

                DustState.isInitialized = true;
                DustCore.start();

                console.info('[Dust Effect] Initialized successfully');
                return true;
            } catch (error) {
                DustUtils.logError('Initialization failed', error);
                DustCore.dispose();
                return false;
            }
        },

        /**
         * Load Three.js from CDN
         */
        loadThreeJS(callback) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = callback;
            script.onerror = () => {
                console.error('[Dust Effect] Failed to load Three.js');
            };
            document.head.appendChild(script);
        },

        /**
         * Update dust opacity
         */
        setOpacity(opacity) {
            document.documentElement.style.setProperty('--dust-opacity', opacity);
        },

        /**
         * Update dust brightness
         */
        setBrightness(brightness) {
            document.documentElement.style.setProperty('--dust-brightness', brightness);
        },

        /**
         * Update dust density (particle count)
         */
        setDensity(density) {
            document.documentElement.style.setProperty('--dust-density', density);
            // Note: Changing particle count requires reinitialization
            if (DustState.isInitialized) {
                console.info('[Dust Effect] Density change requires reinitialization');
            }
        },

        /**
         * Toggle dust effect
         */
        toggle(enable) {
            if (enable === undefined) {
                enable = !DustState.isRunning;
            }

            if (enable && DustState.isInitialized) {
                DustCore.start();
            } else {
                DustCore.stop();
            }
        },

        /**
         * Destroy dust effect
         */
        destroy() {
            DustCore.dispose();
            window.removeEventListener('resize', DustCore.handleResize);
            console.info('[Dust Effect] Destroyed');
        },

        /**
         * Get current state
         */
        getState() {
            return {
                isInitialized: DustState.isInitialized,
                isRunning: DustState.isRunning,
                particleCount: DustConfig.particles.count,
                opacity: DustUtils.getCSSVariable('--dust-opacity'),
                brightness: DustUtils.getCSSVariable('--dust-brightness')
            };
        }
    };

    /**
     * Auto-initialize when DOM is ready
     */
    function autoInit() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', DustEffect.init);
        } else {
            // DOM is already ready
            setTimeout(DustEffect.init, 100);
        }
    }

    // Expose to global scope
    window.DustEffect = DustEffect;

    // Auto-initialize
    autoInit();

    // Expose configuration for debugging
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.DustConfig = DustConfig;
        window.DustState = DustState;
    }

})();
