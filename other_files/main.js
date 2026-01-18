/**
 * Main Application Initializer
 * 
 * Coordinates the initialization of all modules and handles
 * inter-module communication and dependencies.
 * 
 * @author myTech.Today
 * @version 1.0.0
 * @requires sticky-header.js, table-of-contents.js, gradient-controller.js, utilities.js, dust.js
 */

(function() {
    'use strict';

    /**
     * Application State Management
     */
    const AppState = {
        initialized: false,
        modules: {
            utilities: false,
            stickyHeader: false,
            tableOfContents: false,
            gradientController: false,
            anchors: false,
            dustEffect: false
        },
        errors: [],
        startTime: null
    };

    /**
     * Configuration for module loading and initialization
     */
    const AppConfig = {
        modules: [
            {
                name: 'utilities',
                global: 'Utilities',
                required: true,
                dependencies: []
            },
            {
                name: 'stickyHeader',
                global: 'StickyHeader',
                required: false,
                dependencies: ['utilities']
            },
            {
                name: 'tableOfContents',
                global: 'TableOfContents',
                required: false,
                dependencies: ['utilities']
            },
            {
                name: 'gradientController',
                global: 'GradientController',
                required: false,
                dependencies: ['utilities']
            },
            {
                name: 'anchors',
                global: 'Anchors',
                required: false,
                dependencies: []
            },
            {
                name: 'dustEffect',
                global: 'DustEffect',
                required: false,
                dependencies: []
            }
        ],
        timing: {
            initTimeout: 5000,
            moduleCheckInterval: 100
        }
    };

    /**
     * Error logging with application context
     * @param {string} module - Module name
     * @param {string} message - Error message
     * @param {Error} error - Error object
     */
    function logError(module, message, error = null) {
        const timestamp = new Date().toISOString();
        const errorEntry = {
            timestamp,
            module,
            message,
            error: error ? error.message : null,
            stack: error ? error.stack : null
        };
        
        AppState.errors.push(errorEntry);
        console.error(`[Main App] ${module}: ${message}`, error);
    }

    /**
     * Check if a module is available
     * @param {string} globalName - Global variable name
     * @returns {boolean} True if module is available
     */
    function isModuleAvailable(globalName) {
        return typeof window[globalName] !== 'undefined' && window[globalName] !== null;
    }

    /**
     * Wait for a module to become available
     * @param {string} globalName - Global variable name
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise} Promise that resolves when module is available
     */
    function waitForModule(globalName, timeout = AppConfig.timing.initTimeout) {
        return new Promise((resolve, reject) => {
            if (isModuleAvailable(globalName)) {
                resolve(window[globalName]);
                return;
            }

            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                if (isModuleAvailable(globalName)) {
                    clearInterval(checkInterval);
                    resolve(window[globalName]);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    reject(new Error(`Module ${globalName} not available after ${timeout}ms`));
                }
            }, AppConfig.timing.moduleCheckInterval);
        });
    }

    /**
     * Initialize a single module
     * @param {Object} moduleConfig - Module configuration
     * @returns {Promise} Promise that resolves when module is initialized
     */
    async function initializeModule(moduleConfig) {
        try {
            console.log(`[Main App] Initializing ${moduleConfig.name}...`);

            // Wait for module to be available
            const module = await waitForModule(moduleConfig.global);

            // Initialize the module if it has an init method
            if (typeof module.init === 'function') {
                await module.init();
            }

            AppState.modules[moduleConfig.name] = true;
            console.log(`[Main App] ${moduleConfig.name} initialized successfully`);

            return module;
        } catch (error) {
            logError(moduleConfig.name, `Failed to initialize: ${error.message}`, error);
            
            if (moduleConfig.required) {
                throw error;
            }
            
            return null;
        }
    }

    /**
     * Check if all dependencies for a module are satisfied
     * @param {Object} moduleConfig - Module configuration
     * @returns {boolean} True if all dependencies are satisfied
     */
    function areDependenciesSatisfied(moduleConfig) {
        return moduleConfig.dependencies.every(dep => AppState.modules[dep]);
    }

    /**
     * Initialize all modules in dependency order
     */
    async function initializeModules() {
        const remainingModules = [...AppConfig.modules];
        const maxAttempts = remainingModules.length * 2; // Prevent infinite loops
        let attempts = 0;

        while (remainingModules.length > 0 && attempts < maxAttempts) {
            attempts++;
            
            for (let i = remainingModules.length - 1; i >= 0; i--) {
                const moduleConfig = remainingModules[i];
                
                if (areDependenciesSatisfied(moduleConfig)) {
                    try {
                        await initializeModule(moduleConfig);
                        remainingModules.splice(i, 1);
                    } catch (error) {
                        if (moduleConfig.required) {
                            throw error;
                        }
                        // Remove failed optional module
                        remainingModules.splice(i, 1);
                    }
                }
            }
        }

        // Check for unresolved dependencies
        if (remainingModules.length > 0) {
            const unresolved = remainingModules.map(m => m.name);
            logError('dependency', `Unresolved module dependencies: ${unresolved.join(', ')}`);
        }
    }

    /**
     * Setup inter-module communication
     */
    function setupInterModuleCommunication() {
        try {
            // Listen for header sticky changes and update other modules
            document.addEventListener('headerStickyChange', (event) => {
                console.log('[Main App] Header sticky state changed:', event.detail.isSticky);
                
                // Notify other modules if needed
                if (window.TableOfContents && typeof window.TableOfContents.state !== 'undefined') {
                    // TOC might need to adjust behavior when header becomes sticky
                }
            });

            // Listen for TOC changes
            document.addEventListener('tocToggle', (event) => {
                console.log('[Main App] TOC toggle state changed:', event.detail.expanded);
            });

            // Listen for gradient updates
            document.addEventListener('gradientUpdate', (event) => {
                // Other modules can react to gradient changes if needed
            });

            // Listen for resize events and coordinate module responses
            document.addEventListener('headerResize', (event) => {
                console.log('[Main App] Header resize detected:', event.detail);
            });

            document.addEventListener('tocResize', (event) => {
                console.log('[Main App] TOC resize detected:', event.detail);
            });

            console.log('[Main App] Inter-module communication setup complete');
        } catch (error) {
            logError('communication', 'Failed to setup inter-module communication', error);
        }
    }

    /**
     * Perform application health check
     */
    function performHealthCheck() {
        const healthReport = {
            timestamp: new Date().toISOString(),
            modules: {},
            errors: AppState.errors.length,
            performance: {
                initTime: AppState.startTime ? Date.now() - AppState.startTime : null
            }
        };

        // Check each module's health
        AppConfig.modules.forEach(moduleConfig => {
            const isInitialized = AppState.modules[moduleConfig.name];
            const isAvailable = isModuleAvailable(moduleConfig.global);
            
            healthReport.modules[moduleConfig.name] = {
                initialized: isInitialized,
                available: isAvailable,
                required: moduleConfig.required,
                healthy: isInitialized && isAvailable
            };
        });

        console.log('[Main App] Health Check:', healthReport);
        return healthReport;
    }

    /**
     * Main application initialization
     */
    async function initializeApp() {
        try {
            AppState.startTime = Date.now();
            console.log('[Main App] Starting application initialization...');

            // Initialize modules in dependency order
            await initializeModules();

            // Setup inter-module communication
            setupInterModuleCommunication();

            // Mark application as initialized
            AppState.initialized = true;

            // Perform health check
            const healthReport = performHealthCheck();

            console.log('[Main App] Application initialization complete');
            console.log(`[Main App] Initialization time: ${Date.now() - AppState.startTime}ms`);

            // Dispatch application ready event
            const event = new CustomEvent('appReady', {
                detail: {
                    modules: AppState.modules,
                    healthReport,
                    initTime: Date.now() - AppState.startTime
                }
            });
            document.dispatchEvent(event);

        } catch (error) {
            logError('app', 'Application initialization failed', error);
            throw error;
        }
    }

    /**
     * Public API for external access
     */
    window.MainApp = {
        init: initializeApp,
        state: AppState,
        config: AppConfig,
        healthCheck: performHealthCheck,
        getErrors: () => AppState.errors,
        isReady: () => AppState.initialized
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        // DOM is already ready, initialize immediately
        initializeApp().catch(error => {
            console.error('[Main App] Failed to initialize application:', error);
        });
    }

})();
