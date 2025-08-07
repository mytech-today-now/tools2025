/**
 * Dynamic Gradient Background Controller
 * 
 * Controls the bi-linear gradient background based on scroll position,
 * viewport changes, and user interactions.
 * 
 * @author myTech.Today
 * @version 1.0.0
 * @requires DOM API, CSS Custom Properties
 */

(function() {
    'use strict';

    /**
     * Gradient State Management Object
     * Tracks the current state of the gradient controller
     */
    const GradientState = {
        scrollProgress: 0,
        gradientProgress: 0,
        isAnimating: false,
        lastScrollTop: 0,
        initialized: false,
        lastError: null
    };

    /**
     * Configuration object for gradient behavior
     */
    const GradientConfig = {
        selectors: {
            root: ':root',
            body: 'body'
        },
        properties: {
            gradientProgress: '--gradient-progress',
            viewportHeight: '--viewport-height',
            pageHeight: '--page-height',
            scrollDirection: '--scroll-direction',
            primaryHue: '--primary-hue',
            primarySaturation: '--primary-saturation',
            primaryLightness: '--primary-lightness'
        },
        colors: {
            // Extract from CSS custom properties or use defaults
            primary: '#557ea1',
            secondary: '#10a37f',
            tertiary: '#8b5a3c', // Complementary warm color for tri-lateral gradient
            background: '#193959'
        },
        timing: {
            animationFrame: 16, // ~60fps
            debounceDelay: 100
        },
        debug: {
            enabled: false,
            logInterval: 1000 // Log every second when debugging
        }
    };

    /**
     * Error logging function with timestamp
     * @param {string} element - Element identifier
     * @param {number} tagNumber - Tag number for identification
     * @param {string} message - Error message
     * @param {number} line - Line number
     * @param {number} column - Column number
     */
    function logError(element, tagNumber, message, line = 0, column = 0) {
        const timestamp = new Date().toLocaleTimeString('en-US', { 
            hour12: true, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        
        const errorMsg = `[${timestamp}] <${element}> tag #${tagNumber}: ${message} at line ${line}, column ${column}`;
        console.error(errorMsg);
        
        // Store last error for debugging
        GradientState.lastError = {
            timestamp,
            element,
            tagNumber,
            message,
            line,
            column
        };
    }

    /**
     * Viewport utilities for responsive behavior
     */
    const ViewportUtils = {
        /**
         * Get current viewport dimensions
         * @returns {Object} Viewport dimensions
         */
        getDimensions() {
            return {
                width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            };
        },

        /**
         * Get document dimensions
         * @returns {Object} Document dimensions
         */
        getDocumentDimensions() {
            return {
                width: Math.max(
                    document.body.scrollWidth,
                    document.body.offsetWidth,
                    document.documentElement.clientWidth,
                    document.documentElement.scrollWidth,
                    document.documentElement.offsetWidth
                ),
                height: Math.max(
                    document.body.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.clientHeight,
                    document.documentElement.scrollHeight,
                    document.documentElement.offsetHeight
                )
            };
        },

        /**
         * Get current scroll position
         * @returns {Object} Scroll position
         */
        getScrollPosition() {
            return {
                top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
                left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
            };
        }
    };

    /**
     * Color utilities for extracting and manipulating colors
     */
    const ColorUtils = {
        /**
         * Convert hex color to HSL
         * @param {string} hex - Hex color string
         * @returns {Object} HSL values
         */
        hexToHsl(hex) {
            try {
                // Remove # if present
                hex = hex.replace('#', '');

                // Parse RGB values
                const r = parseInt(hex.substr(0, 2), 16) / 255;
                const g = parseInt(hex.substr(2, 2), 16) / 255;
                const b = parseInt(hex.substr(4, 2), 16) / 255;

                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                let h, s, l = (max + min) / 2;

                if (max === min) {
                    h = s = 0; // achromatic
                } else {
                    const d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }

                return {
                    h: Math.round(h * 360),
                    s: Math.round(s * 100),
                    l: Math.round(l * 100)
                };
            } catch (error) {
                logError('color', 1, `Failed to convert hex to HSL: ${error.message}`, 0, 0);
                return { h: 210, s: 50, l: 50 }; // Default blue
            }
        },

        /**
         * Extract current theme colors from CSS
         * @returns {Object} Theme colors
         */
        extractThemeColors() {
            try {
                const primaryColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--primary-color').trim() || GradientConfig.colors.primary;
                const secondaryColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--secondary-color').trim() || GradientConfig.colors.secondary;
                const tertiaryColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--tertiary-color').trim() || GradientConfig.colors.tertiary;
                const backgroundColor = getComputedStyle(document.documentElement)
                    .getPropertyValue('--background-color').trim() || GradientConfig.colors.background;

                return {
                    primary: primaryColor,
                    secondary: secondaryColor,
                    tertiary: tertiaryColor,
                    background: backgroundColor
                };
            } catch (error) {
                logError('color', 2, `Failed to extract theme colors: ${error.message}`, 0, 0);
                return GradientConfig.colors;
            }
        },

        /**
         * Generate darker tri-lateral gradient colors based on current theme
         * @param {number} progress - Scroll progress (0-1)
         * @returns {Object} Gradient colors
         */
        generateGradientColors(progress) {
            try {
                const colors = this.extractThemeColors();
                const primaryHsl = this.hexToHsl(colors.primary);
                const secondaryHsl = this.hexToHsl(colors.secondary);
                const tertiaryHsl = this.hexToHsl(colors.tertiary);

                // Create much darker versions with increased contrast for page background
                const baseDarkness = 0.15 + (progress * 0.35); // 15% to 50% darkness based on scroll
                const contrastMultiplier = 1.5; // Increase contrast between colors

                const darkPrimary = {
                    h: primaryHsl.h,
                    s: Math.max(primaryHsl.s - 10, 25), // Maintain more saturation
                    l: Math.max(primaryHsl.l * baseDarkness, 8) // Very dark
                };

                const darkSecondary = {
                    h: secondaryHsl.h,
                    s: Math.max(secondaryHsl.s - 5, 30), // Keep high saturation
                    l: Math.max(secondaryHsl.l * (baseDarkness * contrastMultiplier), 12) // Darker with contrast
                };

                const darkTertiary = {
                    h: tertiaryHsl.h,
                    s: Math.max(tertiaryHsl.s - 15, 20), // Reduce saturation for warmth
                    l: Math.max(tertiaryHsl.l * (baseDarkness * 0.8), 6) // Darkest for maximum contrast
                };

                return {
                    primary: `hsl(${darkPrimary.h}, ${darkPrimary.s}%, ${darkPrimary.l}%)`,
                    secondary: `hsl(${darkSecondary.h}, ${darkSecondary.s}%, ${darkSecondary.l}%)`,
                    tertiary: `hsl(${darkTertiary.h}, ${darkTertiary.s}%, ${darkTertiary.l}%)`,
                    primaryHsl: darkPrimary,
                    secondaryHsl: darkSecondary,
                    tertiaryHsl: darkTertiary
                };
            } catch (error) {
                logError('color', 3, `Failed to generate gradient colors: ${error.message}`, 0, 0);
                return {
                    primary: '#1a365d',
                    secondary: '#0a5d4a',
                    tertiary: '#4a2c1a',
                    primaryHsl: { h: 210, s: 60, l: 20 },
                    secondaryHsl: { h: 160, s: 80, l: 20 },
                    tertiaryHsl: { h: 30, s: 50, l: 15 }
                };
            }
        }
    };

    /**
     * CSS Custom Properties Manager
     */
    const CSSPropertiesManager = {
        /**
         * Set a CSS custom property
         * @param {string} property - Property name
         * @param {string|number} value - Property value
         */
        setProperty(property, value) {
            try {
                document.documentElement.style.setProperty(property, value);
            } catch (error) {
                logError('css', 1, `Failed to set CSS property ${property}: ${error.message}`, 0, 0);
            }
        },

        /**
         * Get a CSS custom property value
         * @param {string} property - Property name
         * @returns {string} Property value
         */
        getProperty(property) {
            try {
                return getComputedStyle(document.documentElement).getPropertyValue(property);
            } catch (error) {
                logError('css', 2, `Failed to get CSS property ${property}: ${error.message}`, 0, 0);
                return '';
            }
        },

        /**
         * Update all gradient-related CSS properties
         * @param {Object} values - Object containing property values
         */
        updateGradientProperties(values) {
            try {
                Object.entries(values).forEach(([key, value]) => {
                    if (GradientConfig.properties[key]) {
                        this.setProperty(GradientConfig.properties[key], value);
                    }
                });
            } catch (error) {
                logError('css', 3, `Failed to update gradient properties: ${error.message}`, 0, 0);
            }
        },

        /**
         * Apply tri-lateral page background gradient
         * @param {Object} gradientColors - Gradient color object
         * @param {number} progress - Scroll progress
         */
        applyPageGradient(gradientColors, progress) {
            try {
                const body = document.body;
                if (!body) return;

                // Create a dynamic tri-lateral gradient that gets darker and more complex as user scrolls
                const opacity = 0.8 + (progress * 0.2); // 80% to 100% opacity
                const baseAngle = 135 + (progress * 30); // 135deg to 165deg

                // Create a complex tri-lateral gradient with multiple layers for depth
                const primaryGradient = `linear-gradient(${baseAngle}deg,
                    ${gradientColors.primary} 0%,
                    ${gradientColors.secondary} 35%,
                    ${gradientColors.tertiary} 70%,
                    ${gradientColors.primary} 100%)`;

                // Add a secondary radial gradient for more depth and contrast
                const radialGradient = `radial-gradient(ellipse at ${20 + progress * 60}% ${30 + progress * 40}%,
                    ${gradientColors.tertiary} 0%,
                    transparent 50%)`;

                // Combine gradients for tri-lateral effect with enhanced contrast
                const combinedGradient = `${radialGradient}, ${primaryGradient}`;

                body.style.background = combinedGradient;
                body.style.minHeight = '100vh';

                // Also set CSS custom properties for other elements to use
                this.setProperty('--page-gradient', combinedGradient);
                this.setProperty('--page-gradient-primary', primaryGradient);
                this.setProperty('--page-gradient-radial', radialGradient);
                this.setProperty('--page-gradient-opacity', opacity);
                this.setProperty('--gradient-angle', `${baseAngle}deg`);

                // Set individual color properties for other components
                this.setProperty('--gradient-primary-dark', gradientColors.primary);
                this.setProperty('--gradient-secondary-dark', gradientColors.secondary);
                this.setProperty('--gradient-tertiary-dark', gradientColors.tertiary);

            } catch (error) {
                logError('css', 4, `Failed to apply page gradient: ${error.message}`, 0, 0);
            }
        }
    };

    /**
     * Scroll Progress Calculator
     */
    const ScrollCalculator = {
        /**
         * Calculate scroll progress (0 to 1)
         * @returns {number} Scroll progress
         */
        calculateScrollProgress() {
            try {
                const scroll = ViewportUtils.getScrollPosition();
                const viewport = ViewportUtils.getDimensions();
                const document = ViewportUtils.getDocumentDimensions();

                const maxScroll = document.height - viewport.height;
                
                if (maxScroll <= 0) {
                    return 0;
                }

                return Math.min(Math.max(scroll.top / maxScroll, 0), 1);
            } catch (error) {
                logError('scroll', 1, `Failed to calculate scroll progress: ${error.message}`, 0, 0);
                return 0;
            }
        },

        /**
         * Calculate gradient progress based on scroll
         * @param {number} scrollProgress - Current scroll progress (0-1)
         * @returns {number} Gradient progress
         */
        calculateGradientProgress(scrollProgress) {
            try {
                // Linear mapping for now, can be customized with easing functions
                return scrollProgress;
            } catch (error) {
                logError('scroll', 2, `Failed to calculate gradient progress: ${error.message}`, 0, 0);
                return 0;
            }
        },

        /**
         * Determine scroll direction
         * @param {number} currentScrollTop - Current scroll position
         * @returns {string} Scroll direction ('up', 'down', or 'none')
         */
        getScrollDirection(currentScrollTop) {
            try {
                if (currentScrollTop > GradientState.lastScrollTop) {
                    return 'down';
                } else if (currentScrollTop < GradientState.lastScrollTop) {
                    return 'up';
                } else {
                    return 'none';
                }
            } catch (error) {
                logError('scroll', 3, `Failed to determine scroll direction: ${error.message}`, 0, 0);
                return 'none';
            }
        }
    };

    /**
     * Debug utilities
     */
    const DebugUtils = {
        /**
         * Check if debug mode is enabled
         * @returns {boolean} True if debug mode is enabled
         */
        isEnabled() {
            return GradientConfig.debug.enabled || 
                   window.location.search.includes('debug=gradient') ||
                   window.location.search.includes('debug=all');
        },

        /**
         * Log debug information
         * @param {Object} data - Debug data to log
         */
        log(data) {
            if (this.isEnabled()) {
                console.log('[Gradient Controller] Debug:', data);
            }
        },

        /**
         * Log performance metrics
         * @param {string} operation - Operation name
         * @param {number} startTime - Start time
         */
        logPerformance(operation, startTime) {
            if (this.isEnabled()) {
                const duration = performance.now() - startTime;
                console.log(`[Gradient Controller] ${operation} took ${duration.toFixed(2)}ms`);
            }
        }
    };

    /**
     * Main Gradient Controller
     */
    const GradientController = {
        /**
         * Initialize gradient control
         */
        init() {
            try {
                if (GradientState.initialized) {
                    logError('module', 1, 'Gradient controller already initialized', 0, 0);
                    return;
                }

                this.setupScrollListener();
                this.setupResizeListener();
                this.updateGradient(); // Initial update
                
                GradientState.initialized = true;
                console.log('[Gradient Controller] Initialized successfully');
            } catch (error) {
                logError('module', 2, `Initialization failed: ${error.message}`, 0, 0);
            }
        },

        /**
         * Setup scroll event listener with throttling
         */
        setupScrollListener() {
            try {
                let ticking = false;

                const handleScroll = () => {
                    if (!ticking) {
                        requestAnimationFrame(() => {
                            this.updateGradient();
                            ticking = false;
                        });
                        ticking = true;
                    }
                };

                window.addEventListener('scroll', handleScroll, { passive: true });
            } catch (error) {
                logError('scroll', 4, `Failed to setup scroll listener: ${error.message}`, 0, 0);
            }
        },

        /**
         * Setup resize event listener with debouncing
         */
        setupResizeListener() {
            try {
                let resizeTimeout;

                const handleResize = () => {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(() => {
                        this.updateGradient();
                        
                        // Dispatch custom event
                        const event = new CustomEvent('gradientResize', {
                            detail: { 
                                viewport: ViewportUtils.getDimensions(),
                                document: ViewportUtils.getDocumentDimensions()
                            }
                        });
                        document.dispatchEvent(event);
                    }, GradientConfig.timing.debounceDelay);
                };

                window.addEventListener('resize', handleResize, { passive: true });
            } catch (error) {
                logError('resize', 1, `Failed to setup resize listener: ${error.message}`, 0, 0);
            }
        },

        /**
         * Update gradient based on current state
         */
        updateGradient() {
            try {
                const startTime = performance.now();

                const scroll = ViewportUtils.getScrollPosition();
                const viewport = ViewportUtils.getDimensions();
                const document = ViewportUtils.getDocumentDimensions();

                // Calculate progress values
                const scrollProgress = ScrollCalculator.calculateScrollProgress();
                const gradientProgress = ScrollCalculator.calculateGradientProgress(scrollProgress);
                const scrollDirection = ScrollCalculator.getScrollDirection(scroll.top);

                // Generate gradient colors based on current theme and scroll progress
                const gradientColors = ColorUtils.generateGradientColors(gradientProgress);

                // Update state
                GradientState.scrollProgress = scrollProgress;
                GradientState.gradientProgress = gradientProgress;
                GradientState.lastScrollTop = scroll.top;

                // Update CSS properties
                CSSPropertiesManager.updateGradientProperties({
                    gradientProgress: gradientProgress,
                    viewportHeight: `${viewport.height}px`,
                    pageHeight: `${document.height}px`,
                    scrollDirection: scrollDirection,
                    primaryHue: gradientColors.primaryHsl.h,
                    primarySaturation: `${gradientColors.primaryHsl.s}%`,
                    primaryLightness: `${gradientColors.primaryHsl.l}%`
                });

                // Apply the gradient to the page background
                CSSPropertiesManager.applyPageGradient(gradientColors, gradientProgress);

                // Dispatch custom event
                const event = new CustomEvent('gradientUpdate', {
                    detail: {
                        scrollProgress,
                        gradientProgress,
                        scrollDirection,
                        viewport,
                        document,
                        colors: gradientColors
                    }
                });
                document.dispatchEvent(event);

                // Debug logging
                DebugUtils.log({
                    scrollTop: scroll.top,
                    scrollProgress: scrollProgress.toFixed(3),
                    gradientProgress: gradientProgress.toFixed(3),
                    scrollDirection,
                    documentHeight: document.height,
                    viewportHeight: viewport.height,
                    colors: gradientColors
                });

                DebugUtils.logPerformance('updateGradient', startTime);

            } catch (error) {
                logError('gradient', 1, `Update failed: ${error.message}`, 0, 0);
            }
        },

        /**
         * Reset gradient to initial state
         */
        reset() {
            try {
                GradientState.scrollProgress = 0;
                GradientState.gradientProgress = 0;
                GradientState.lastScrollTop = 0;

                CSSPropertiesManager.updateGradientProperties({
                    gradientProgress: 0,
                    scrollDirection: 'none'
                });

                console.log('[Gradient Controller] Reset to initial state');
            } catch (error) {
                logError('gradient', 2, `Reset failed: ${error.message}`, 0, 0);
            }
        },

        /**
         * Enable debug mode
         */
        enableDebug() {
            GradientConfig.debug.enabled = true;
            console.log('[Gradient Controller] Debug mode enabled');
        },

        /**
         * Disable debug mode
         */
        disableDebug() {
            GradientConfig.debug.enabled = false;
            console.log('[Gradient Controller] Debug mode disabled');
        }
    };

    /**
     * Public API for external access
     */
    window.GradientController = {
        init: () => GradientController.init(),
        update: () => GradientController.updateGradient(),
        reset: () => GradientController.reset(),
        state: GradientState,
        config: GradientConfig,
        debug: {
            enable: () => GradientController.enableDebug(),
            disable: () => GradientController.disableDebug(),
            isEnabled: () => DebugUtils.isEnabled()
        },
        getLastError: () => GradientState.lastError
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GradientController.init());
    } else {
        GradientController.init();
    }

})();
