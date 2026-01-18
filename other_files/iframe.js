/**
 * iframe.js - Enhanced iframe management and interaction handlers
 * Part of the myTech.Today modular JavaScript architecture
 * 
 * Features:
 * - Iframe loading state management
 * - Error handling and user feedback
 * - Smooth scrolling navigation
 * - Performance monitoring
 * - Accessibility enhancements
 */

(function() {
    'use strict';

    // Configuration object
    const config = {
        loadingTimeout: 10000, // 10 seconds
        scrollBehavior: 'smooth',
        scrollBlock: 'start',
        debugMode: false
    };

    // Utility functions
    const utils = {
        log: function(message, type = 'info') {
            if (config.debugMode || type === 'error') {
                console[type]('[iframe.js]', message);
            }
        },

        addClass: function(element, className) {
            if (element && element.classList) {
                element.classList.add(className);
            }
        },

        removeClass: function(element, className) {
            if (element && element.classList) {
                element.classList.remove(className);
            }
        },

        hasClass: function(element, className) {
            return element && element.classList && element.classList.contains(className);
        }
    };

    // Iframe management class
    class IframeManager {
        constructor() {
            this.iframes = [];
            this.loadingTimeouts = new Map();
            this.init();
        }

        init() {
            utils.log('Initializing iframe manager');
            this.setupIframes();
            this.setupSmoothScrolling();
            this.setupAccessibility();
        }

        setupIframes() {
            const iframes = document.querySelectorAll('iframe');
            
            iframes.forEach((iframe, index) => {
                this.iframes.push(iframe);
                this.setupIframeHandlers(iframe, index);
            });

            utils.log(`Initialized ${iframes.length} iframes`);
        }

        setupIframeHandlers(iframe, index) {
            const container = iframe.closest('.iframe-container');
            
            // Add loading state
            if (container) {
                utils.addClass(container, 'loading');
                utils.log(`Added loading state to iframe ${index}`);
            }

            // Set up loading timeout
            const timeoutId = setTimeout(() => {
                if (container && utils.hasClass(container, 'loading')) {
                    utils.log(`Iframe ${index} taking longer than expected to load: ${iframe.title || iframe.src}`, 'warn');
                    this.handleSlowLoading(container, iframe);
                }
            }, config.loadingTimeout);

            this.loadingTimeouts.set(iframe, timeoutId);

            // Handle successful load
            iframe.addEventListener('load', () => {
                this.handleIframeLoad(iframe, container, index);
            });

            // Handle load errors
            iframe.addEventListener('error', () => {
                this.handleIframeError(iframe, container, index);
            });

            // Handle iframe focus for accessibility
            iframe.addEventListener('focus', () => {
                this.handleIframeFocus(iframe, container);
            });
        }

        handleIframeLoad(iframe, container, index) {
            utils.log(`Iframe ${index} loaded successfully: ${iframe.title || iframe.src}`);
            
            // Clear timeout
            const timeoutId = this.loadingTimeouts.get(iframe);
            if (timeoutId) {
                clearTimeout(timeoutId);
                this.loadingTimeouts.delete(iframe);
            }

            if (container) {
                utils.removeClass(container, 'loading');
                utils.addClass(container, 'loaded');
            }

            // Dispatch custom event
            this.dispatchIframeEvent('iframeLoaded', iframe, { index });
        }

        handleIframeError(iframe, container, index) {
            utils.log(`Iframe ${index} failed to load: ${iframe.title || iframe.src}`, 'error');
            
            // Clear timeout
            const timeoutId = this.loadingTimeouts.get(iframe);
            if (timeoutId) {
                clearTimeout(timeoutId);
                this.loadingTimeouts.delete(iframe);
            }

            if (container) {
                utils.removeClass(container, 'loading');
                utils.addClass(container, 'error');
            }

            // Dispatch custom event
            this.dispatchIframeEvent('iframeError', iframe, { index });
        }

        handleSlowLoading(container, iframe) {
            // Add a slow-loading indicator
            if (container && !utils.hasClass(container, 'slow-loading')) {
                utils.addClass(container, 'slow-loading');
                utils.log('Added slow-loading indicator');
            }
        }

        handleIframeFocus(iframe, container) {
            if (container) {
                utils.addClass(container, 'focused');
                
                // Remove focus class after a delay
                setTimeout(() => {
                    utils.removeClass(container, 'focused');
                }, 3000);
            }
        }

        dispatchIframeEvent(eventName, iframe, detail = {}) {
            const event = new CustomEvent(eventName, {
                detail: {
                    iframe: iframe,
                    src: iframe.src,
                    title: iframe.title,
                    ...detail
                }
            });
            document.dispatchEvent(event);
        }

        setupSmoothScrolling() {
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            
            anchorLinks.forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = anchor.getAttribute('href');
                    const target = document.querySelector(targetId);
                    
                    if (target) {
                        target.scrollIntoView({
                            behavior: config.scrollBehavior,
                            block: config.scrollBlock
                        });
                        
                        utils.log(`Smooth scrolled to: ${targetId}`);
                        
                        // Update URL without triggering scroll
                        if (history.pushState) {
                            history.pushState(null, null, targetId);
                        }
                    }
                });
            });

            utils.log(`Set up smooth scrolling for ${anchorLinks.length} anchor links`);
        }

        setupAccessibility() {
            // Add keyboard navigation for iframe containers
            const containers = document.querySelectorAll('.iframe-container');
            
            containers.forEach(container => {
                // Make containers focusable
                if (!container.hasAttribute('tabindex')) {
                    container.setAttribute('tabindex', '0');
                }

                // Add keyboard event listeners
                container.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        const iframe = container.querySelector('iframe');
                        if (iframe) {
                            iframe.focus();
                        }
                    }
                });
            });

            utils.log('Enhanced accessibility for iframe containers');
        }

        // Public methods
        reloadIframe(iframeSelector) {
            const iframe = document.querySelector(iframeSelector);
            if (iframe) {
                const container = iframe.closest('.iframe-container');
                if (container) {
                    utils.removeClass(container, 'error');
                    utils.removeClass(container, 'loaded');
                    utils.addClass(container, 'loading');
                }
                iframe.src = iframe.src; // Reload iframe
                utils.log(`Reloaded iframe: ${iframeSelector}`);
            }
        }

        getIframeStatus() {
            return this.iframes.map((iframe, index) => {
                const container = iframe.closest('.iframe-container');
                return {
                    index,
                    src: iframe.src,
                    title: iframe.title,
                    status: container ? this.getContainerStatus(container) : 'unknown'
                };
            });
        }

        getContainerStatus(container) {
            if (utils.hasClass(container, 'loading')) return 'loading';
            if (utils.hasClass(container, 'loaded')) return 'loaded';
            if (utils.hasClass(container, 'error')) return 'error';
            return 'unknown';
        }
    }

    // Initialize when DOM is ready
    function initializeIframeManager() {
        utils.log('myTech.Today iframe page loaded successfully');
        
        // Create global iframe manager instance
        window.iframeManager = new IframeManager();
        
        // Expose utilities for debugging
        if (config.debugMode) {
            window.iframeUtils = utils;
            window.iframeConfig = config;
        }
    }

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeIframeManager);
    } else {
        initializeIframeManager();
    }

    // Listen for custom iframe events (for debugging or external integration)
    document.addEventListener('iframeLoaded', (e) => {
        utils.log(`Custom event: iframe loaded - ${e.detail.title || e.detail.src}`);
    });

    document.addEventListener('iframeError', (e) => {
        utils.log(`Custom event: iframe error - ${e.detail.title || e.detail.src}`, 'error');
    });

})();
