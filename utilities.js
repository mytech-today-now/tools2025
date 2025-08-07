/**
 * Common Utilities Module
 * 
 * Provides shared utilities, error handling, and debugging functions
 * for all modules in the application.
 * 
 * @author myTech.Today
 * @version 1.0.0
 * @requires DOM API
 */

(function() {
    'use strict';

    /**
     * Global error handler for unhandled JavaScript errors
     */
    function setupGlobalErrorHandling() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', function(event) {
            console.error('[Utilities] Unhandled promise rejection:', event.reason);
            event.preventDefault(); // Prevent the default browser behavior
        });

        // Handle general JavaScript errors
        window.addEventListener('error', function(event) {
            console.error('[Utilities] JavaScript error:', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });

        // Wrap jQuery load function to prevent indexOf errors
        if (window.jQuery && window.jQuery.fn && window.jQuery.fn.load) {
            const originalLoad = window.jQuery.fn.load;
            window.jQuery.fn.load = function(url, params, callback) {
                try {
                    // Ensure url is a string
                    if (typeof url !== 'string') {
                        console.warn('[Utilities] jQuery load called with non-string URL:', url);
                        return this;
                    }
                    return originalLoad.call(this, url, params, callback);
                } catch (error) {
                    console.error('[Utilities] jQuery load error:', error);
                    return this;
                }
            };
        }

        // Wrap IntersectionObserver to prevent element type errors
        if (window.IntersectionObserver) {
            const OriginalIntersectionObserver = window.IntersectionObserver;
            window.IntersectionObserver = function(callback, options) {
                const observer = new OriginalIntersectionObserver(callback, options);
                const originalObserve = observer.observe;

                observer.observe = function(target) {
                    try {
                        // Check if target is a valid Element
                        if (!target || !(target instanceof Element)) {
                            console.warn('[Utilities] IntersectionObserver.observe called with invalid target:', target);
                            return;
                        }
                        return originalObserve.call(this, target);
                    } catch (error) {
                        console.error('[Utilities] IntersectionObserver.observe error:', error);
                    }
                };

                return observer;
            };
        }
    }

    /**
     * Utility functions for debugging and fixing common issues
     */
    const DebugUtils = {
        /**
         * Check for and fix common jQuery issues
         */
        fixJQueryIssues() {
            try {
                if (window.jQuery) {
                    // Fix waypoints plugin issues
                    if (window.jQuery.fn.waypoint) {
                        const originalWaypoint = window.jQuery.fn.waypoint;
                        window.jQuery.fn.waypoint = function(options) {
                            try {
                                return originalWaypoint.call(this, options);
                            } catch (error) {
                                console.error('[Utilities] Waypoint error:', error);
                                return this;
                            }
                        };
                    }

                    // Fix potential issues with jQuery selectors
                    const originalFind = window.jQuery.fn.find;
                    window.jQuery.fn.find = function(selector) {
                        try {
                            if (typeof selector !== 'string') {
                                console.warn('[Utilities] jQuery find called with non-string selector:', selector);
                                return window.jQuery();
                            }
                            return originalFind.call(this, selector);
                        } catch (error) {
                            console.error('[Utilities] jQuery find error:', error);
                            return window.jQuery();
                        }
                    };
                }
            } catch (error) {
                console.error('[Utilities] Error fixing jQuery issues:', error);
            }
        },

        /**
         * Check for and report potential issues
         */
        diagnostics() {
            const issues = [];

            try {
                // Check for jQuery
                if (!window.jQuery) {
                    issues.push('jQuery not loaded');
                } else {
                    issues.push(`jQuery version: ${window.jQuery.fn.jquery || 'unknown'}`);
                }

                // Check for common problematic scripts
                const scripts = document.querySelectorAll('script[src]');
                scripts.forEach(script => {
                    if (script.src.includes('fbevents.js') || script.src.includes('pixel.js')) {
                        issues.push(`Blocked external script: ${script.src}`);
                    }
                });

                // Check for required elements
                const requiredElements = [
                    { selector: '#unified-header', name: 'Unified Header' },
                    { selector: 'nav.toc', name: 'Table of Contents' }
                ];

                requiredElements.forEach(({ selector, name }) => {
                    const element = document.querySelector(selector);
                    if (!element) {
                        issues.push(`${name} element not found (${selector})`);
                    } else {
                        issues.push(`${name} element found`);
                    }
                });

                console.log('[Utilities] Diagnostics:', issues);
                return issues;
            } catch (error) {
                console.error('[Utilities] Diagnostics error:', error);
                return ['Diagnostics failed'];
            }
        }
    };

    /**
     * Fix common jQuery and DOM issues
     */
    function fixCommonIssues() {
        try {
            // Fix missing images-slides directory issue
            const brokenImages = document.querySelectorAll('img[src*="images-slides"]');
            brokenImages.forEach(img => {
                img.addEventListener('error', function() {
                    console.warn('[Utilities] Broken image detected:', this.src);
                    // Optionally replace with placeholder or hide
                    this.style.display = 'none';
                });
            });

            // Fix potential syntax errors in inline scripts
            const scripts = document.querySelectorAll('script:not([src])');
            scripts.forEach((script, index) => {
                try {
                    // Check for common syntax issues
                    const content = script.textContent || script.innerHTML;
                    if (content) {
                        // Check for unmatched quotes or brackets
                        const singleQuotes = (content.match(/'/g) || []).length;
                        const doubleQuotes = (content.match(/"/g) || []).length;
                        const openBrackets = (content.match(/\{/g) || []).length;
                        const closeBrackets = (content.match(/\}/g) || []).length;

                        if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0 || openBrackets !== closeBrackets) {
                            console.warn(`[Utilities] Potential syntax error in inline script #${index + 1}`);
                        }
                    }
                } catch (error) {
                    console.error(`[Utilities] Error checking inline script #${index + 1}:`, error);
                }
            });

        } catch (error) {
            console.error('[Utilities] Error in fixCommonIssues:', error);
        }
    }

    /**
     * Performance monitoring utilities
     */
    const PerformanceUtils = {
        /**
         * Measure execution time of a function
         * @param {Function} fn - Function to measure
         * @param {string} name - Name for logging
         * @returns {*} Function result
         */
        measure(fn, name = 'Function') {
            const startTime = performance.now();
            const result = fn();
            const endTime = performance.now();
            console.log(`[Utilities] ${name} execution time: ${(endTime - startTime).toFixed(2)}ms`);
            return result;
        },

        /**
         * Create a debounced function
         * @param {Function} func - Function to debounce
         * @param {number} wait - Wait time in milliseconds
         * @param {boolean} immediate - Execute immediately
         * @returns {Function} Debounced function
         */
        debounce(func, wait, immediate = false) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(this, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(this, args);
            };
        },

        /**
         * Create a throttled function
         * @param {Function} func - Function to throttle
         * @param {number} limit - Time limit in milliseconds
         * @returns {Function} Throttled function
         */
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };

    /**
     * DOM utilities
     */
    const DOMUtils = {
        /**
         * Safely query DOM elements with error handling
         * @param {string} selector - CSS selector
         * @param {boolean} multiple - Whether to query multiple elements
         * @param {Element} context - Context element (default: document)
         * @returns {Element|NodeList|null} Found element(s) or null
         */
        safeQuery(selector, multiple = false, context = document) {
            try {
                return multiple ? 
                    context.querySelectorAll(selector) : 
                    context.querySelector(selector);
            } catch (error) {
                console.error(`[Utilities] Failed to query selector: ${selector}. ${error.message}`);
                return null;
            }
        },

        /**
         * Check if element is visible in viewport
         * @param {Element} element - Element to check
         * @returns {boolean} True if visible
         */
        isInViewport(element) {
            try {
                const rect = element.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            } catch (error) {
                console.error('[Utilities] Error checking viewport visibility:', error);
                return false;
            }
        },

        /**
         * Add event listener with error handling
         * @param {Element} element - Target element
         * @param {string} event - Event type
         * @param {Function} handler - Event handler
         * @param {Object} options - Event options
         */
        safeAddEventListener(element, event, handler, options = {}) {
            try {
                if (element && typeof handler === 'function') {
                    element.addEventListener(event, handler, options);
                }
            } catch (error) {
                console.error(`[Utilities] Error adding event listener for ${event}:`, error);
            }
        }
    };

    /**
     * Public API for external access
     */
    window.Utilities = {
        debug: DebugUtils,
        performance: PerformanceUtils,
        dom: DOMUtils,
        fixCommonIssues,
        setupGlobalErrorHandling
    };

    // Setup global error handling immediately
    setupGlobalErrorHandling();

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            DebugUtils.fixJQueryIssues();
            fixCommonIssues();
            DebugUtils.diagnostics();
        });
    } else {
        DebugUtils.fixJQueryIssues();
        fixCommonIssues();
        DebugUtils.diagnostics();
    }

})();
