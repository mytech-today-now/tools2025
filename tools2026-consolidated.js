/**
 * Tools2026 Consolidated JavaScript
 * 
 * This file consolidates all modular JavaScript files into a single file:
 * - utilities.js: Common utilities and error handling
 * - sticky-header.js: Transparent sticky header with blur effect
 * - table-of-contents.js: TOC functionality with nested list support
 * - gradient-controller.js: Tri-lateral page background gradient controller
 * - anchors.js: Anchor link functionality
 * - dust.js: Subtle floating dust particle effect using Three.js GPU particles
 * - main.js: Application coordinator and module initializer
 * 
 * @author myTech.Today
 * @version 1.0.0
 * @date 2026-01-09
 * @generated Automatically generated - do not edit directly
 */


// ============================================================================
// MODULE: UTILITIES
// ============================================================================

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
                    if (content && content.trim().length > 0) {
                        // Remove comments and strings before checking
                        const cleanContent = content
                            .replace(/\/\/.*$/gm, '') // Remove single-line comments
                            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
                            .replace(/'[^'\\]*(\\.[^'\\]*)*'/g, '""') // Replace single-quoted strings
                            .replace(/"[^"\\]*(\\.[^"\\]*)*"/g, '""') // Replace double-quoted strings
                            .replace(/`[^`\\]*(\\.[^`\\]*)*`/g, '""'); // Replace template literals

                        // Check for unmatched brackets only (quotes are handled by string replacement)
                        const openBrackets = (cleanContent.match(/\{/g) || []).length;
                        const closeBrackets = (cleanContent.match(/\}/g) || []).length;
                        const openParens = (cleanContent.match(/\(/g) || []).length;
                        const closeParens = (cleanContent.match(/\)/g) || []).length;
                        const openSquare = (cleanContent.match(/\[/g) || []).length;
                        const closeSquare = (cleanContent.match(/\]/g) || []).length;

                        if (openBrackets !== closeBrackets || openParens !== closeParens || openSquare !== closeSquare) {
                            console.warn(`[Utilities] Potential syntax error in inline script #${index + 1}:`, {
                                brackets: { open: openBrackets, close: closeBrackets },
                                parens: { open: openParens, close: closeParens },
                                square: { open: openSquare, close: closeSquare }
                            });
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

// ============================================================================
// MODULE: STICKY-HEADER
// ============================================================================

/**
 * Sticky Header Module
 * 
 * Handles sticky header functionality with scroll detection,
 * responsive behavior, and accessibility features.
 * 
 * @author myTech.Today
 * @version 1.0.0
 * @requires DOM API, CSS Transitions
 */

(function() {
    'use strict';

    /**
     * Header State Management Object
     * Tracks the current state of the header component
     */
    const HeaderState = {
        isSticky: false,
        originalPosition: null,
        lastScrollTop: 0,
        scrollDirection: 'down',
        isVisible: true,
        initialized: false,
        lastError: null
    };

    /**
     * Configuration object for header behavior
     */
    const HeaderConfig = {
        selectors: {
            header: '#unified-header',
            body: 'body'
        },
        classes: {
            sticky: 'header-sticky',
            hidden: 'header-hidden',
            scrolled: 'header-scrolled',
            bodySticky: 'header-sticky-active'
        },
        timing: {
            scrollThreshold: 100,
            hideThreshold: 200,
            transitionDuration: 300
        },
        breakpoints: {
            mobile: 768,
            desktop: 1200
        },
        blur: {
            intensity: 20, // Backdrop blur intensity in pixels
            fallbackOpacity: 0.1 // Fallback opacity for browsers without backdrop-filter support
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
        HeaderState.lastError = {
            timestamp,
            element,
            tagNumber,
            message,
            line,
            column
        };
    }

    /**
     * Safely query DOM elements with error handling
     * @param {string} selector - CSS selector
     * @returns {Element|null} Found element or null
     */
    function safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            logError('DOM', 1, `Failed to query selector: ${selector}. ${error.message}`, 0, 0);
            return null;
        }
    }

    /**
     * Viewport utilities for responsive behavior
     */
    const ViewportUtils = {
        /**
         * Get current viewport width
         * @returns {number} Viewport width in pixels
         */
        getWidth() {
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        },

        /**
         * Check if current viewport is mobile
         * @returns {boolean} True if mobile viewport
         */
        isMobile() {
            return this.getWidth() <= HeaderConfig.breakpoints.mobile;
        },

        /**
         * Check if current viewport is desktop
         * @returns {boolean} True if desktop viewport
         */
        isDesktop() {
            return this.getWidth() >= HeaderConfig.breakpoints.desktop;
        }
    };

    /**
     * Scroll management for sticky behavior
     */
    const ScrollManager = {
        /**
         * Handle scroll events to determine sticky state
         */
        handleScroll() {
            try {
                const header = safeQuerySelector(HeaderConfig.selectors.header);
                if (!header) {
                    logError('header', 1, 'Header element not found during scroll handling', 0, 0);
                    return;
                }

                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Determine scroll direction
                HeaderState.scrollDirection = currentScrollTop > HeaderState.lastScrollTop ? 'down' : 'up';
                HeaderState.lastScrollTop = currentScrollTop;

                // Get header's original position if not already stored
                if (!HeaderState.originalPosition) {
                    const rect = header.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    HeaderState.originalPosition = rect.top + scrollTop;
                }

                const shouldBeSticky = currentScrollTop > HeaderState.originalPosition;
                const shouldBeHidden = currentScrollTop > HeaderConfig.timing.hideThreshold && 
                                     HeaderState.scrollDirection === 'down';

                // Update sticky state if changed
                if (shouldBeSticky !== HeaderState.isSticky) {
                    this.toggleStickyState(shouldBeSticky);
                }

                // Update visibility state
                this.updateVisibility(shouldBeHidden);

                // Update scrolled state for styling
                this.updateScrolledState(currentScrollTop > HeaderConfig.timing.scrollThreshold);

            } catch (error) {
                logError('scroll', 1, `Scroll handler error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Toggle sticky state
         * @param {boolean} makeSticky - Whether to make header sticky
         */
        toggleStickyState(makeSticky) {
            try {
                const header = safeQuerySelector(HeaderConfig.selectors.header);
                const body = safeQuerySelector(HeaderConfig.selectors.body);

                if (!header || !body) {
                    logError('header', 2, 'Required elements not found for sticky toggle', 0, 0);
                    return;
                }

                HeaderState.isSticky = makeSticky;

                if (makeSticky) {
                    header.classList.add(HeaderConfig.classes.sticky);
                    body.classList.add(HeaderConfig.classes.bodySticky);
                } else {
                    header.classList.remove(HeaderConfig.classes.sticky);
                    body.classList.remove(HeaderConfig.classes.bodySticky);
                }

                // Dispatch custom event
                const event = new CustomEvent('headerStickyChange', {
                    detail: { isSticky: makeSticky }
                });
                document.dispatchEvent(event);

            } catch (error) {
                logError('header', 3, `Sticky state toggle error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Update header visibility
         * @param {boolean} shouldHide - Whether to hide the header
         */
        updateVisibility(shouldHide) {
            try {
                const header = safeQuerySelector(HeaderConfig.selectors.header);
                if (!header) return;

                // Don't hide on mobile or when scrolling up
                if (ViewportUtils.isMobile() || HeaderState.scrollDirection === 'up') {
                    shouldHide = false;
                }

                if (shouldHide !== !HeaderState.isVisible) {
                    HeaderState.isVisible = !shouldHide;
                    
                    if (shouldHide) {
                        header.classList.add(HeaderConfig.classes.hidden);
                    } else {
                        header.classList.remove(HeaderConfig.classes.hidden);
                    }

                    // Dispatch custom event
                    const event = new CustomEvent('headerVisibilityChange', {
                        detail: { isVisible: HeaderState.isVisible }
                    });
                    document.dispatchEvent(event);
                }

            } catch (error) {
                logError('header', 4, `Visibility update error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Update scrolled state for styling
         * @param {boolean} isScrolled - Whether page is scrolled
         */
        updateScrolledState(isScrolled) {
            try {
                const header = safeQuerySelector(HeaderConfig.selectors.header);
                if (!header) return;

                if (isScrolled) {
                    header.classList.add(HeaderConfig.classes.scrolled);
                } else {
                    header.classList.remove(HeaderConfig.classes.scrolled);
                }

            } catch (error) {
                logError('header', 5, `Scrolled state update error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Recalculate original position (useful after layout changes)
         */
        recalculatePosition() {
            try {
                const header = safeQuerySelector(HeaderConfig.selectors.header);
                if (!header) return;

                // Temporarily remove sticky state to get original position
                const wasSticky = HeaderState.isSticky;
                if (wasSticky) {
                    header.classList.remove(HeaderConfig.classes.sticky);
                    document.body.classList.remove(HeaderConfig.classes.bodySticky);
                }

                // Get new position
                const rect = header.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                HeaderState.originalPosition = rect.top + scrollTop;

                // Restore sticky state if it was active
                if (wasSticky) {
                    header.classList.add(HeaderConfig.classes.sticky);
                    document.body.classList.add(HeaderConfig.classes.bodySticky);
                }

            } catch (error) {
                logError('header', 6, `Position recalculation error: ${error.message}`, 0, 0);
            }
        }
    };

    /**
     * Resize handler for responsive behavior
     */
    function handleResize() {
        try {
            // Debounce resize events
            clearTimeout(window.headerResizeTimeout);
            window.headerResizeTimeout = setTimeout(() => {
                
                // Recalculate position on resize
                ScrollManager.recalculatePosition();
                
                // Dispatch resize event for other components
                const event = new CustomEvent('headerResize', {
                    detail: { 
                        width: ViewportUtils.getWidth(),
                        isMobile: ViewportUtils.isMobile(),
                        isDesktop: ViewportUtils.isDesktop()
                    }
                });
                document.dispatchEvent(event);
                
            }, 250);
        } catch (error) {
            logError('window', 1, `Resize handler error: ${error.message}`, 0, 0);
        }
    }

    /**
     * Initialize the sticky header module
     */
    function initStickyHeader() {
        try {
            // Check if already initialized
            if (HeaderState.initialized) {
                logError('module', 1, 'Sticky header module already initialized', 0, 0);
                return;
            }

            const header = safeQuerySelector(HeaderConfig.selectors.header);
            
            if (!header) {
                logError('header', 7, 'Header element not found during initialization', 0, 0);
                return;
            }

            // Add scroll event listener
            window.addEventListener('scroll', () => ScrollManager.handleScroll(), { passive: true });

            // Add resize event listener
            window.addEventListener('resize', handleResize);

            // Initial scroll check
            ScrollManager.handleScroll();

            // Mark as initialized
            HeaderState.initialized = true;
            
            console.log('[Sticky Header Module] Successfully initialized');
            
        } catch (error) {
            logError('module', 2, `Initialization error: ${error.message}`, 0, 0);
        }
    }

    /**
     * Public API for external access
     */
    window.StickyHeader = {
        init: initStickyHeader,
        state: HeaderState,
        config: HeaderConfig,
        recalculatePosition: () => ScrollManager.recalculatePosition(),
        show: () => {
            const header = safeQuerySelector(HeaderConfig.selectors.header);
            if (header) {
                header.classList.remove(HeaderConfig.classes.hidden);
                HeaderState.isVisible = true;
            }
        },
        hide: () => {
            const header = safeQuerySelector(HeaderConfig.selectors.header);
            if (header) {
                header.classList.add(HeaderConfig.classes.hidden);
                HeaderState.isVisible = false;
            }
        },
        getLastError: () => HeaderState.lastError
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStickyHeader);
    } else {
        initStickyHeader();
    }

})();

// ============================================================================
// MODULE: TABLE-OF-CONTENTS
// ============================================================================

/**
 * Table of Contents Module
 *
 * Handles table of contents functionality with sticky behavior, expansion/collapse,
 * nested lists, scrollable content, accessibility features, and responsive behavior.
 *
 * @author myTech.Today
 * @version 2.0.0
 * @requires DOM API, CSS Transitions, Intersection Observer API
 */

(function() {
    'use strict';

    /**
     * TOC State Management Object
     * Tracks the current state of the TOC component
     */
    const TOCState = {
        isExpanded: false,
        isSticky: false,
        isHovered: false,
        isFocused: false,
        isScrollable: false,
        touchStartTime: 0,
        lastError: null,
        initialized: false,
        stickyThreshold: 0,
        originalPosition: null,
        expandedHeight: 0,
        collapsedHeight: 60
    };

    /**
     * Configuration object for TOC behavior
     */
    const TOCConfig = {
        selectors: {
            toc: 'nav.toc',
            tocTitle: 'nav.toc h2',
            tocList: 'nav.toc ul',
            tocNestedList: 'nav.toc li ul',
            tocParentItems: 'nav.toc li:has(ul)',
            tocLinks: 'nav.toc a',
            mainContent: 'main',
            stickyHeader: 'header',
            body: 'body'
        },
        classes: {
            expanded: 'toc-expanded',
            sticky: 'toc-sticky',
            collapsed: 'toc-collapsed',
            nestedExpanded: 'nested-expanded',
            hasNested: 'has-nested',
            scrollable: 'toc-scrollable',
            bodySticky: 'toc-sticky-active'
        },
        timing: {
            hoverDelay: 150,
            nestedHoverDelay: 100,
            touchThreshold: 300,
            transitionDuration: 300,
            scrollDebounce: 16
        },
        breakpoints: {
            mobile: 768,
            desktop: 1200
        },
        maxHeight: {
            mobile: '50vh',
            tablet: '60vh',
            desktop: '70vh'
        },
        debug: false // Disable verbose debug logging (enable for troubleshooting)
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
        TOCState.lastError = {
            timestamp,
            element,
            tagNumber,
            message,
            line,
            column
        };
    }

    /**
     * Safely query DOM elements with error handling
     * @param {string} selector - CSS selector
     * @param {boolean} multiple - Whether to query multiple elements
     * @returns {Element|NodeList|null} Found element(s) or null
     */
    function safeQuerySelector(selector, multiple = false) {
        try {
            return multiple ? 
                document.querySelectorAll(selector) : 
                document.querySelector(selector);
        } catch (error) {
            logError('DOM', 1, `Failed to query selector: ${selector}. ${error.message}`, 0, 0);
            return null;
        }
    }

    /**
     * Viewport utilities for responsive behavior
     */
    const ViewportUtils = {
        /**
         * Get current viewport width
         * @returns {number} Viewport width in pixels
         */
        getWidth() {
            return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        },

        /**
         * Get current viewport height
         * @returns {number} Viewport height in pixels
         */
        getHeight() {
            return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        },

        /**
         * Check if current viewport is mobile
         * @returns {boolean} True if mobile viewport
         */
        isMobile() {
            return this.getWidth() <= TOCConfig.breakpoints.mobile;
        },

        /**
         * Check if current viewport is desktop
         * @returns {boolean} True if desktop viewport
         */
        isDesktop() {
            return this.getWidth() >= TOCConfig.breakpoints.desktop;
        },

        /**
         * Get appropriate max height for current viewport
         * @returns {string} CSS max-height value
         */
        getMaxHeight() {
            if (this.isMobile()) {
                return TOCConfig.maxHeight.mobile;
            } else if (this.isDesktop()) {
                return TOCConfig.maxHeight.desktop;
            } else {
                return TOCConfig.maxHeight.tablet;
            }
        }
    };

    // StickyManager removed - sticky functionality disabled

    /**
     * Scrollable content management for TOC
     */
    const ScrollableManager = {
        /**
         * Initialize scrollable behavior
         */
        init() {
            try {
                this.setupScrollableContainer();
                this.updateScrollableState();

            } catch (error) {
                logError('scrollable', 1, `Scrollable manager init error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Setup scrollable container
         */
        setupScrollableContainer() {
            try {
                const tocList = safeQuerySelector(TOCConfig.selectors.tocList);
                if (!tocList) return;

                // Add scrollable class
                tocList.classList.add(TOCConfig.classes.scrollable);

                // Add scroll event listeners for scroll indicators
                tocList.addEventListener('scroll', this.handleScroll.bind(this));

            } catch (error) {
                logError('scrollable', 2, `Container setup error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Handle scroll events within TOC
         * @param {Event} event - Scroll event
         */
        handleScroll(event) {
            try {
                const container = event.target;
                const isScrollable = container.scrollHeight > container.clientHeight;

                // Update scrollable indicator
                container.setAttribute('data-scrollable', isScrollable.toString());

            } catch (error) {
                logError('scrollable', 3, `Scroll handler error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Update scrollable state based on content and viewport
         */
        updateScrollableState() {
            try {
                const tocList = safeQuerySelector(TOCConfig.selectors.tocList);
                if (!tocList) return;

                // Calculate if content needs scrolling
                const maxHeight = this.calculateMaxHeight();
                const contentHeight = this.calculateContentHeight();

                TOCState.isScrollable = contentHeight > maxHeight;

                // Update container attributes
                tocList.setAttribute('data-scrollable', TOCState.isScrollable.toString());

                // Set max height for sticky mode
                if (TOCState.isSticky) {
                    tocList.style.maxHeight = ViewportUtils.getMaxHeight();
                }

            } catch (error) {
                logError('scrollable', 4, `State update error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Calculate maximum allowed height for TOC content
         * @returns {number} Maximum height in pixels
         */
        calculateMaxHeight() {
            try {
                const viewportHeight = ViewportUtils.getHeight();
                const maxHeightPercent = ViewportUtils.isMobile() ? 0.5 : 0.7;

                return Math.floor(viewportHeight * maxHeightPercent);

            } catch (error) {
                logError('scrollable', 5, `Max height calculation error: ${error.message}`, 0, 0);
                return 400; // Fallback
            }
        },

        /**
         * Calculate total content height
         * @returns {number} Content height in pixels
         */
        calculateContentHeight() {
            try {
                const tocList = safeQuerySelector(TOCConfig.selectors.tocList);
                if (!tocList) return 0;

                // Temporarily expand all nested lists to get full height
                const expandedItems = [];
                const nestedLists = tocList.querySelectorAll('li ul');

                nestedLists.forEach(list => {
                    const parent = list.closest('li');
                    if (parent && !parent.classList.contains(TOCConfig.classes.nestedExpanded)) {
                        parent.classList.add(TOCConfig.classes.nestedExpanded);
                        expandedItems.push(parent);
                    }
                });

                // Get scroll height
                const contentHeight = tocList.scrollHeight;

                // Restore original state
                expandedItems.forEach(item => {
                    item.classList.remove(TOCConfig.classes.nestedExpanded);
                });

                return contentHeight;

            } catch (error) {
                logError('scrollable', 6, `Content height calculation error: ${error.message}`, 0, 0);
                return 0;
            }
        },

        /**
         * Scroll to specific element within TOC
         * @param {Element} element - Element to scroll to
         */
        scrollToElement(element) {
            try {
                const tocList = safeQuerySelector(TOCConfig.selectors.tocList);
                if (!tocList || !element) return;

                const elementRect = element.getBoundingClientRect();
                const containerRect = tocList.getBoundingClientRect();

                const scrollTop = tocList.scrollTop + elementRect.top - containerRect.top - 20;

                tocList.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth'
                });

            } catch (error) {
                logError('scrollable', 7, `Scroll to element error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Ensure expanded nested content is visible
         * @param {Element} parentItem - Parent item that was expanded
         */
        ensureNestedVisible(parentItem) {
            try {
                if (!TOCState.isSticky || !TOCState.isScrollable) return;

                const nestedList = parentItem.querySelector('ul');
                if (!nestedList) return;

                // Wait for expansion animation to complete
                setTimeout(() => {
                    const lastNestedItem = nestedList.querySelector('li:last-child');
                    if (lastNestedItem) {
                        this.scrollToElement(lastNestedItem);
                    }
                }, TOCConfig.timing.transitionDuration);

            } catch (error) {
                logError('scrollable', 8, `Nested visibility error: ${error.message}`, 0, 0);
            }
        }
    };

    /**
     * Touch interaction handler for mobile devices
     */
    const TouchHandler = {
        /**
         * Handle touch start event
         * @param {TouchEvent} event - Touch start event
         */
        handleTouchStart(event) {
            try {
                TOCState.touchStartTime = Date.now();
                
                // Prevent default to avoid conflicts with hover
                if (ViewportUtils.isMobile()) {
                    event.preventDefault();
                }
            } catch (error) {
                logError('touch', 1, `Touch start error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Handle touch end event
         * @param {TouchEvent} event - Touch end event
         */
        handleTouchEnd(event) {
            try {
                const touchDuration = Date.now() - TOCState.touchStartTime;
                
                if (touchDuration < TOCConfig.timing.touchThreshold) {
                    // Short touch - toggle TOC
                    TOCInteraction.toggleExpansion();
                }
            } catch (error) {
                logError('touch', 2, `Touch end error: ${error.message}`, 0, 0);
            }
        }
    };

    /**
     * Nested list interaction management
     */
    const NestedListManager = {
        /**
         * Initialize nested list interactions
         */
        init() {
            try {
                console.log('[TOC] Initializing nested list interactions...');

                const parentItems = safeQuerySelector(TOCConfig.selectors.tocParentItems, true);

                if (!parentItems || parentItems.length === 0) {
                    console.log('[TOC] No parent items found with :has() selector, using fallback...');
                    // Use fallback selector for browsers that don't support :has()
                    this.initFallbackNestedInteractions();
                    return;
                }

                console.log(`[TOC] Found ${parentItems.length} parent items with nested lists`);

                parentItems.forEach((item, index) => {
                    const link = item.querySelector('a');
                    const text = link ? link.textContent.trim() : `Item ${index + 1}`;
                    if (TOCConfig.debug) {
                        console.log(`[TOC] Setting up interactions for: "${text}"`);
                    }
                    this.setupParentItemInteractions(item);
                });

                console.log('[TOC] Nested list interactions initialized successfully');

            } catch (error) {
                logError('nested', 1, `Nested list init error: ${error.message}`, 0, 0);
                // Fallback to manual detection
                this.initFallbackNestedInteractions();
            }
        },

        /**
         * Fallback initialization for browsers without :has() support
         */
        initFallbackNestedInteractions() {
            try {
                console.log('[TOC] Using fallback method to detect nested lists...');

                const allListItems = safeQuerySelector('nav.toc li', true);

                if (!allListItems) {
                    console.warn('[TOC] No list items found in TOC');
                    return;
                }

                let parentCount = 0;
                allListItems.forEach((item, index) => {
                    const nestedList = item.querySelector('ul');
                    if (nestedList) {
                        parentCount++;
                        const link = item.querySelector('a');
                        const text = link ? link.textContent.trim() : `Item ${index + 1}`;
                        if (TOCConfig.debug) {
                            console.log(`[TOC] Fallback: Setting up interactions for: "${text}"`);
                        }
                        this.setupParentItemInteractions(item);
                    }
                });

                console.log(`[TOC] Fallback method found ${parentCount} parent items with nested lists`);

            } catch (error) {
                logError('nested', 2, `Fallback nested init error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Setup interactions for a parent item with nested lists
         * @param {Element} parentItem - The parent list item
         */
        setupParentItemInteractions(parentItem) {
            try {
                const nestedList = parentItem.querySelector('ul');
                if (!nestedList) return;

                // Add class for CSS fallback (browsers without :has() support)
                parentItem.classList.add(TOCConfig.classes.hasNested);

                // Add JavaScript hover events for both sticky and non-sticky TOCs
                const toc = parentItem.closest('nav.toc');
                const isSticky = toc && toc.classList.contains('toc-sticky');

                if (isSticky) {
                    // Add hover events for nested list expansion (sticky TOC only)
                    parentItem.addEventListener('mouseenter', (event) => {
                        event.stopPropagation();
                        this.handleParentHover(parentItem, true);
                    });

                    parentItem.addEventListener('mouseleave', (event) => {
                        event.stopPropagation();
                        this.handleParentHover(parentItem, false);
                    });
                }
                // For non-sticky TOC: No hover events needed - CSS shows all nested lists expanded

                // Add focus events for keyboard navigation (all TOC types)
                parentItem.addEventListener('focusin', (event) => {
                    this.handleParentFocus(parentItem, true);
                });

                parentItem.addEventListener('focusout', (event) => {
                    // Check if focus is moving outside the parent item
                    setTimeout(() => {
                        if (!parentItem.contains(document.activeElement)) {
                            this.handleParentFocus(parentItem, false);
                        }
                    }, 10);
                });

                // Add ARIA attributes for accessibility
                parentItem.setAttribute('aria-haspopup', 'true');
                parentItem.setAttribute('aria-expanded', 'false');
                nestedList.setAttribute('aria-hidden', 'true');

            } catch (error) {
                logError('nested', 3, `Parent item setup error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Handle parent item hover
         * @param {Element} parentItem - The parent list item
         * @param {boolean} isEntering - Whether mouse is entering or leaving
         */
        handleParentHover(parentItem, isEntering) {
            try {
                const nestedList = parentItem.querySelector('ul');
                if (!nestedList) return;

                if (isEntering) {
                    // Delay expansion slightly to prevent accidental triggers
                    setTimeout(() => {
                        if (parentItem.matches(':hover') && !ViewportUtils.isMobile()) {
                            this.expandNestedList(parentItem);
                        }
                    }, TOCConfig.timing.nestedHoverDelay);
                } else {
                    this.collapseNestedList(parentItem);
                }

            } catch (error) {
                logError('nested', 4, `Parent hover error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Handle parent item focus
         * @param {Element} parentItem - The parent list item
         * @param {boolean} isFocusing - Whether gaining or losing focus
         */
        handleParentFocus(parentItem, isFocusing) {
            try {
                if (isFocusing) {
                    this.expandNestedList(parentItem);
                } else {
                    this.collapseNestedList(parentItem);
                }

            } catch (error) {
                logError('nested', 5, `Parent focus error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Expand nested list
         * @param {Element} parentItem - The parent list item
         */
        expandNestedList(parentItem) {
            try {
                const nestedList = parentItem.querySelector('ul');
                if (!nestedList) {
                    if (TOCConfig.debug) {
                        console.warn('[TOC] No nested list found for parent item:', parentItem);
                    }
                    return;
                }

                const parentLink = parentItem.querySelector('a');
                const parentText = parentLink ? parentLink.textContent.trim() : 'Unknown';

                if (TOCConfig.debug) {
                    console.log(`[TOC] Expanding nested list for: "${parentText}"`);
                }

                parentItem.setAttribute('aria-expanded', 'true');
                nestedList.setAttribute('aria-hidden', 'false');
                parentItem.classList.add(TOCConfig.classes.nestedExpanded);

                // Sticky functionality disabled - no special handling needed

                // Update scrollable state
                ScrollableManager.updateScrollableState();

                // Dispatch custom event
                const event = new CustomEvent('nestedListExpand', {
                    detail: {
                        parentItem,
                        nestedList,
                        parentText,
                        isSticky: false, // Always false since sticky is disabled
                        isScrollable: TOCState.isScrollable
                    }
                });
                document.dispatchEvent(event);

            } catch (error) {
                logError('nested', 6, `Nested expand error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Collapse nested list
         * @param {Element} parentItem - The parent list item
         */
        collapseNestedList(parentItem) {
            try {
                const nestedList = parentItem.querySelector('ul');
                if (!nestedList) {
                    if (TOCConfig.debug) {
                        console.warn('[TOC] No nested list found for parent item:', parentItem);
                    }
                    return;
                }

                const parentLink = parentItem.querySelector('a');
                const parentText = parentLink ? parentLink.textContent.trim() : 'Unknown';

                if (TOCConfig.debug) {
                    console.log(`[TOC] Collapsing nested list for: "${parentText}"`);
                }

                parentItem.setAttribute('aria-expanded', 'false');
                nestedList.setAttribute('aria-hidden', 'true');
                parentItem.classList.remove(TOCConfig.classes.nestedExpanded);

                // Update scrollable state
                ScrollableManager.updateScrollableState();

                // Dispatch custom event
                const event = new CustomEvent('nestedListCollapse', {
                    detail: {
                        parentItem,
                        nestedList,
                        parentText,
                        isSticky: false // Always false since sticky is disabled
                    }
                });
                document.dispatchEvent(event);

            } catch (error) {
                logError('nested', 7, `Nested collapse error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Expand all nested lists
         */
        expandAll() {
            try {
                const parentItems = document.querySelectorAll('nav.toc li:has(ul)');
                if (parentItems.length === 0) {
                    // Fallback for browsers without :has() support
                    const allItems = document.querySelectorAll('nav.toc li');
                    allItems.forEach(item => {
                        if (item.querySelector('ul')) {
                            this.expandNestedList(item);
                        }
                    });
                } else {
                    parentItems.forEach(item => this.expandNestedList(item));
                }
            } catch (error) {
                logError('nested', 8, `Expand all error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Collapse all nested lists
         */
        collapseAll() {
            try {
                const parentItems = document.querySelectorAll('nav.toc li:has(ul)');
                if (parentItems.length === 0) {
                    // Fallback for browsers without :has() support
                    const allItems = document.querySelectorAll('nav.toc li');
                    allItems.forEach(item => {
                        if (item.querySelector('ul')) {
                            this.collapseNestedList(item);
                        }
                    });
                } else {
                    parentItems.forEach(item => this.collapseNestedList(item));
                }
            } catch (error) {
                logError('nested', 9, `Collapse all error: ${error.message}`, 0, 0);
            }
        }
    };

    /**
     * TOC interaction management
     */
    const TOCInteraction = {
        /**
         * Toggle TOC expansion state
         */
        toggleExpansion() {
            try {
                const toc = safeQuerySelector(TOCConfig.selectors.toc);
                if (!toc) {
                    logError('nav', 1, 'TOC element not found for toggle', 0, 0);
                    return;
                }

                // Sticky functionality disabled - allow normal toggle
                TOCState.isExpanded = !TOCState.isExpanded;

                if (TOCState.isExpanded) {
                    toc.classList.add(TOCConfig.classes.expanded);
                    toc.classList.remove(TOCConfig.classes.collapsed);
                    toc.setAttribute('aria-expanded', 'true');
                } else {
                    toc.classList.remove(TOCConfig.classes.expanded);
                    toc.classList.add(TOCConfig.classes.collapsed);
                    toc.setAttribute('aria-expanded', 'false');
                }

                // Update scrollable state
                ScrollableManager.updateScrollableState();

                // Dispatch custom event for other components
                const event = new CustomEvent('tocToggle', {
                    detail: {
                        expanded: TOCState.isExpanded,
                        isSticky: false // Always false since sticky is disabled
                    }
                });
                document.dispatchEvent(event);

            } catch (error) {
                logError('nav', 2, `Toggle expansion error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Handle mouse enter event
         */
        handleMouseEnter() {
            try {
                TOCState.isHovered = true;

                // Sticky functionality disabled - use standard expansion only
                setTimeout(() => {
                    if (TOCState.isHovered && !ViewportUtils.isMobile()) {
                        this.expandTOC();
                    }
                }, TOCConfig.timing.hoverDelay);
            } catch (error) {
                logError('nav', 3, `Mouse enter error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Handle mouse leave event
         */
        handleMouseLeave() {
            try {
                TOCState.isHovered = false;

                if (!TOCState.isFocused && !ViewportUtils.isMobile()) {
                    this.collapseTOC();
                }
            } catch (error) {
                logError('nav', 4, `Mouse leave error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Handle focus events
         */
        handleFocus() {
            try {
                TOCState.isFocused = true;

                // Sticky functionality disabled - use standard expansion only
                this.expandTOC();
            } catch (error) {
                logError('nav', 5, `Focus error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Handle blur events
         */
        handleBlur() {
            try {
                TOCState.isFocused = false;

                if (!TOCState.isHovered) {
                    this.collapseTOC();
                }
            } catch (error) {
                logError('nav', 6, `Blur error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Expand TOC programmatically
         */
        expandTOC() {
            if (!TOCState.isExpanded) {
                this.toggleExpansion();
            }
        },

        /**
         * Collapse TOC programmatically
         */
        collapseTOC() {
            if (TOCState.isExpanded) {
                this.toggleExpansion();
            }
        },

        // Sticky TOC methods removed - functionality disabled
    };

    /**
     * Accessibility enhancements
     */
    const AccessibilityManager = {
        /**
         * Initialize accessibility features
         */
        init() {
            try {
                const toc = safeQuerySelector(TOCConfig.selectors.toc);
                const tocTitle = safeQuerySelector(TOCConfig.selectors.tocTitle);

                if (!toc || !tocTitle) {
                    logError('nav', 7, 'TOC elements not found for accessibility setup', 0, 0);
                    return;
                }

                // Set ARIA attributes
                toc.setAttribute('role', 'navigation');
                toc.setAttribute('aria-label', 'Table of Contents');
                toc.setAttribute('aria-expanded', 'false');

                tocTitle.setAttribute('tabindex', '0');
                tocTitle.setAttribute('role', 'button');
                tocTitle.setAttribute('aria-controls', 'toc-list');

                const tocList = safeQuerySelector(TOCConfig.selectors.tocList);
                if (tocList) {
                    tocList.setAttribute('id', 'toc-list');
                }

                // Add keyboard navigation
                this.setupKeyboardNavigation();

            } catch (error) {
                logError('nav', 8, `Accessibility init error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Setup keyboard navigation
         */
        setupKeyboardNavigation() {
            try {
                const tocTitle = safeQuerySelector(TOCConfig.selectors.tocTitle);

                if (tocTitle) {
                    tocTitle.addEventListener('keydown', (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            TOCInteraction.toggleExpansion();
                        } else if (event.key === 'Escape') {
                            TOCInteraction.collapseTOC();
                            tocTitle.blur();
                        }
                    });
                }
            } catch (error) {
                logError('nav', 9, `Keyboard navigation setup error: ${error.message}`, 0, 0);
            }
        }
    };

    /**
     * Resize handler for responsive behavior
     */
    function handleResize() {
        try {
            // Debounce resize events
            clearTimeout(window.tocResizeTimeout);
            window.tocResizeTimeout = setTimeout(() => {

                // Sticky functionality disabled
                // StickyManager.recalculate();

                // Update scrollable state
                ScrollableManager.updateScrollableState();

                // Reset state on viewport change
                if (ViewportUtils.isMobile() && TOCState.isExpanded) {
                    TOCInteraction.collapseTOC();
                }

                // Sticky positioning disabled
                // if (TOCState.isSticky) {
                //     StickyManager.positionStickyTOC();
                // }

                // Dispatch resize event for other components
                const event = new CustomEvent('tocResize', {
                    detail: {
                        width: ViewportUtils.getWidth(),
                        height: ViewportUtils.getHeight(),
                        isMobile: ViewportUtils.isMobile(),
                        isDesktop: ViewportUtils.isDesktop(),
                        isSticky: false, // Always false since sticky is disabled
                        isScrollable: TOCState.isScrollable
                    }
                });
                document.dispatchEvent(event);

            }, 250);
        } catch (error) {
            logError('window', 1, `Resize handler error: ${error.message}`, 0, 0);
        }
    }

    /**
     * Initialize the TOC module
     */
    function initTOC() {
        try {
            // Check if already initialized
            if (TOCState.initialized) {
                logError('module', 1, 'TOC module already initialized', 0, 0);
                return;
            }

            const toc = safeQuerySelector(TOCConfig.selectors.toc);
            const tocTitle = safeQuerySelector(TOCConfig.selectors.tocTitle);

            if (!toc || !tocTitle) {
                logError('nav', 10, 'Required TOC elements not found during initialization', 0, 0);
                return;
            }

            // Initialize core managers (sticky functionality disabled)
            // StickyManager.init(); // Disabled sticky functionality
            ScrollableManager.init();
            AccessibilityManager.init();
            NestedListManager.init();

            // Add event listeners
            toc.addEventListener('mouseenter', () => TOCInteraction.handleMouseEnter());
            toc.addEventListener('mouseleave', () => TOCInteraction.handleMouseLeave());
            toc.addEventListener('focusin', () => TOCInteraction.handleFocus());
            toc.addEventListener('focusout', () => TOCInteraction.handleBlur());

            // Touch events for mobile
            tocTitle.addEventListener('touchstart', TouchHandler.handleTouchStart, { passive: false });
            tocTitle.addEventListener('touchend', TouchHandler.handleTouchEnd);

            // Window resize handler
            window.addEventListener('resize', handleResize);

            // Header sticky change listener disabled (sticky functionality removed)
            // document.addEventListener('headerStickyChange', (event) => {
            //     if (TOCState.isSticky) {
            //         StickyManager.positionStickyTOC();
            //     }
            // });

            // Mark as initialized
            TOCState.initialized = true;

            console.log('[TOC Module] Successfully initialized table of contents functionality with sticky behavior');

        } catch (error) {
            logError('module', 2, `Initialization error: ${error.message}`, 0, 0);
        }
    }

    /**
     * Public API for external access
     */
    window.TableOfContents = {
        init: initTOC,
        state: TOCState,
        config: TOCConfig,
        expand: () => TOCInteraction.expandTOC(),
        collapse: () => TOCInteraction.collapseTOC(),
        toggle: () => TOCInteraction.toggleExpansion(),
        // Sticky functionality removed
        scrollable: {
            updateState: () => ScrollableManager.updateScrollableState(),
            scrollToElement: (element) => ScrollableManager.scrollToElement(element),
            isScrollable: () => TOCState.isScrollable
        },
        nested: {
            init: () => NestedListManager.init(),
            expandAll: () => NestedListManager.expandAll(),
            collapseAll: () => NestedListManager.collapseAll()
        },
        getLastError: () => TOCState.lastError
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTOC);
    } else {
        initTOC();
    }

})();

// ============================================================================
// MODULE: GRADIENT-CONTROLLER
// ============================================================================

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
                const documentDimensions = ViewportUtils.getDocumentDimensions();

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
                    pageHeight: `${documentDimensions.height}px`,
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
                        document: documentDimensions,
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

// ============================================================================
// MODULE: ANCHORS
// ============================================================================

/**
 * Anchors.js - Adds hover hyperlink icons to elements with id attributes
 * Provides fully qualified URLs that are copied to clipboard when clicked
 */

(function() {
    'use strict';

    // State tracking
    let initialized = false;

    // Configuration
    const config = {
        // Icon to display (using Unicode link symbol)
        icon: '🔗',
        // Alternative: use SVG icon
        // icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"/></svg>',
        
        // CSS classes
        anchorClass: 'anchor-link',
        iconClass: 'header-anchor-link',
        
        // Selector for elements to process (elements with id attributes)
        selector: '[id]',
        
        // Elements to exclude (typically navigation, scripts, etc.)
        excludeSelectors: [
            'script',
            'style',
            'meta',
            'link',
            'title',
            'head',
            'html',
            'body',
            'header',
            'footer',
            'nav'
        ],

        // Specific IDs to exclude
        excludeIds: [
            'pre-header',
            'preheader'
        ]
    };

    /**
     * Get the current page's fully qualified URL
     */
    function getCurrentPageUrl() {
        return window.location.origin + window.location.pathname;
    }

    /**
     * Create the anchor icon element
     */
    function createAnchorIcon(targetId) {
        const icon = document.createElement('a');
        icon.className = config.iconClass;
        icon.href = getCurrentPageUrl() + '#' + targetId;

        // Use SVG icon to match existing CSS
        icon.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"/>
            </svg>
        `;

        icon.title = 'Copy link to this section';
        icon.setAttribute('aria-label', 'Copy link to this section');

        // Prevent default link behavior
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            copyToClipboard(this.href);
        });

        return icon;
    }

    /**
     * Copy text to clipboard
     */
    function copyToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            // Use modern clipboard API
            navigator.clipboard.writeText(text).then(function() {
                showCopyFeedback('Link copied to clipboard!');
            }).catch(function(err) {
                console.error('Failed to copy to clipboard:', err);
                fallbackCopyToClipboard(text);
            });
        } else {
            // Fallback for older browsers or non-secure contexts
            fallbackCopyToClipboard(text);
        }
    }

    /**
     * Fallback clipboard copy method
     */
    function fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showCopyFeedback('Link copied to clipboard!');
        } catch (err) {
            console.error('Fallback copy failed:', err);
            showCopyFeedback('Failed to copy link');
        }
        
        document.body.removeChild(textArea);
    }

    /**
     * Show feedback when link is copied
     */
    function showCopyFeedback(message) {
        // Remove any existing feedback
        const existingFeedback = document.querySelector('.anchor-copy-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = 'anchor-copy-feedback';
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(feedback);

        // Animate in
        setTimeout(() => {
            feedback.style.opacity = '1';
        }, 10);

        // Remove after delay
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 2000);
    }

    /**
     * Check if element should be excluded
     */
    function shouldExcludeElement(element) {
        const tagName = element.tagName.toLowerCase();
        const elementId = element.getAttribute('id');

        // Check if tag name is excluded
        if (config.excludeSelectors.includes(tagName)) {
            return true;
        }

        // Check if specific ID is excluded
        if (elementId && config.excludeIds.includes(elementId)) {
            return true;
        }

        // Check if element is inside an excluded container
        if (isInsideExcludedContainer(element)) {
            return true;
        }

        return false;
    }

    /**
     * Check if element is inside a header, footer, or nav container
     */
    function isInsideExcludedContainer(element) {
        const excludedContainers = ['header', 'footer', 'nav'];
        let parent = element.parentElement;

        while (parent) {
            if (excludedContainers.includes(parent.tagName.toLowerCase())) {
                return true;
            }
            parent = parent.parentElement;
        }

        return false;
    }

    /**
     * Add anchor icon to an element
     */
    function addAnchorToElement(element) {
        const id = element.getAttribute('id');
        console.log(`[Anchors] Processing element with ID: ${id}, tag: ${element.tagName}`);

        if (shouldExcludeElement(element)) {
            console.log(`[Anchors] Excluding element: ${id}`);
            return;
        }

        if (!id) {
            console.log('[Anchors] Element has no ID, skipping');
            return;
        }

        // Skip if anchor already exists
        if (element.querySelector('.' + config.iconClass)) {
            console.log(`[Anchors] Anchor already exists for: ${id}`);
            return;
        }

        // Create wrapper if needed
        if (element.style.position !== 'relative') {
            element.style.position = 'relative';
        }

        // Create and insert anchor icon
        const anchorIcon = createAnchorIcon(id);
        
        // CSS styling and hover effects are handled by the stylesheet

        // Insert the icon
        element.appendChild(anchorIcon);
        
        // Add class to mark as processed
        element.classList.add(config.anchorClass);
    }

    /**
     * Initialize anchors for all eligible elements
     */
    function initializeAnchors() {
        console.log('[Anchors] Initializing anchors...');
        const elements = document.querySelectorAll(config.selector);
        console.log(`[Anchors] Found ${elements.length} elements with IDs`);
        elements.forEach(addAnchorToElement);
        console.log('[Anchors] Initialization complete');
    }

    /**
     * Initialize when DOM is ready
     */
    function init() {
        if (initialized) {
            console.log('[Anchors] Already initialized, skipping');
            return;
        }

        console.log('[Anchors] Starting initialization...');
        initialized = true;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeAnchors);
        } else {
            initializeAnchors();
        }

        // Watch for dynamically added elements
        if (window.MutationObserver) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.getAttribute && node.getAttribute('id')) {
                                addAnchorToElement(node);
                            }
                            // Check child elements
                            const childElements = node.querySelectorAll && node.querySelectorAll(config.selector);
                            if (childElements) {
                                childElements.forEach(addAnchorToElement);
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // Start initialization
    init();

    // Expose public API
    window.Anchors = {
        init: init,
        initializeAnchors: initializeAnchors,
        addToElement: addAnchorToElement,
        config: config
    };

})();

// ============================================================================
// MODULE: DUST
// ============================================================================

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
        frameCount: 0,
        isLoadingThreeJS: false
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
                // Prevent multiple simultaneous loads
                if (DustState.isLoadingThreeJS) {
                    console.info('[Dust Effect] Three.js is already being loaded...');
                    return false;
                }
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
            // Check if already loaded or loading
            if (typeof THREE !== 'undefined') {
                console.info('[Dust Effect] Three.js already loaded');
                if (callback) callback();
                return;
            }

            if (DustState.isLoadingThreeJS) {
                console.info('[Dust Effect] Three.js load already in progress');
                return;
            }

            DustState.isLoadingThreeJS = true;
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = () => {
                DustState.isLoadingThreeJS = false;
                console.info('[Dust Effect] Three.js loaded successfully');
                if (callback) callback();
            };
            script.onerror = () => {
                DustState.isLoadingThreeJS = false;
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

// ============================================================================
// MODULE: MAIN
// ============================================================================

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


// ============================================================================
// MODULE: SLIDESHOW-TOC
// ============================================================================

/**
 * Vertical Slideshow TOC Module
 *
 * Transforms the table of contents into an engaging vertical slideshow
 * where each H2 section becomes an individual slide with skeuomorphic design.
 *
 * Features:
 * - Slide navigation (prev/next buttons)
 * - Keyboard navigation (arrow keys, Home, End)
 * - Touch/swipe gestures
 * - Slide indicators (dots)
 * - Accessibility (ARIA labels, keyboard support)
 * - Responsive design
 * - Mouse wheel navigation
 * - Sticky behavior on scroll
 *
 * Architecture:
 * - State management: SlideshowState object tracks current slide, animation state, touch positions
 * - Configuration: SlideshowConfig object defines selectors, classes, timing, keyboard/touch settings
 * - Event handlers: Setup functions for navigation, keyboard, touch, mouse wheel, indicators
 * - Public API: Exposed via window.SlideshowTOC for external control
 *
 * Usage:
 *   // Initialize (auto-initializes on DOM ready)
 *   window.SlideshowTOC.init();
 *
 *   // Navigate programmatically
 *   window.SlideshowTOC.nextSlide();
 *   window.SlideshowTOC.prevSlide();
 *   window.SlideshowTOC.showSlide(3);
 *
 *   // Get state
 *   const currentSlide = window.SlideshowTOC.getCurrentSlide();
 *   const totalSlides = window.SlideshowTOC.getTotalSlides();
 *
 * @author myTech.Today
 * @version 1.0.0
 * @requires DOM API, Touch Events API
 */

(function() {
    'use strict';

    /**
     * Slideshow State Management
     *
     * Tracks the current state of the slideshow including:
     * - currentSlide: {number} - Index of currently displayed slide (1-based)
     * - totalSlides: {number} - Total number of slides in the slideshow
     * - isAnimating: {boolean} - Flag to prevent overlapping animations
     * - touchStartX/Y: {number} - Touch gesture start coordinates
     * - touchEndX/Y: {number} - Touch gesture end coordinates
     * - initialized: {boolean} - Flag indicating if slideshow has been initialized
     */
    const SlideshowState = {
        currentSlide: 1,
        totalSlides: 0,
        isAnimating: false,
        touchStartX: 0,
        touchStartY: 0,
        touchEndX: 0,
        touchEndY: 0,
        initialized: false
    };

    /**
     * Slideshow Configuration
     *
     * Customize the behavior and appearance of the vertical slideshow TOC.
     *
     * Configuration Options:
     *
     * selectors: {Object} - CSS selectors for slideshow elements
     *   - container: {string} - Main slideshow container selector (default: '.toc-slideshow-container')
     *   - slides: {string} - Individual slide selector (default: '.toc-slide')
     *   - prevBtn: {string} - Previous button selector (default: '.toc-nav-prev')
     *   - nextBtn: {string} - Next button selector (default: '.toc-nav-next')
     *   - indicators: {string} - Slide indicator dots selector (default: '.toc-indicator')
     *   - nav: {string} - Navigation controls container selector (default: '.toc-slideshow-nav')
     *
     * classes: {Object} - CSS class names for state management
     *   - active: {string} - Class applied to active slide/indicator (default: 'active')
     *   - animating: {string} - Class applied during slide transitions (default: 'animating')
     *
     * timing: {Object} - Animation and interaction timing settings
     *   - transitionDuration: {number} - Slide transition duration in milliseconds (default: 500)
     *   - swipeThreshold: {number} - Minimum swipe distance in pixels to trigger navigation (default: 50)
     *
     * keyboard: {Object} - Keyboard navigation settings
     *   - enabled: {boolean} - Enable/disable keyboard navigation (default: true)
     *   - keys: {Object} - Key mappings for navigation actions
     *     - prev: {Array<string>} - Keys to navigate to previous slide (default: ['ArrowLeft', 'ArrowUp'])
     *     - next: {Array<string>} - Keys to navigate to next slide (default: ['ArrowRight', 'ArrowDown'])
     *     - first: {Array<string>} - Keys to jump to first slide (default: ['Home'])
     *     - last: {Array<string>} - Keys to jump to last slide (default: ['End'])
     *
     * touch: {Object} - Touch gesture settings
     *   - enabled: {boolean} - Enable/disable touch gestures (default: true)
     *   - minSwipeDistance: {number} - Minimum swipe distance in pixels (default: 50)
     *
     * debug: {boolean} - Enable/disable debug logging to console (default: false)
     *
     * Example Usage:
     *   // Enable debug mode
     *   window.SlideshowTOC.config.debug = true;
     *
     *   // Disable keyboard navigation
     *   window.SlideshowTOC.config.keyboard.enabled = false;
     *
     *   // Change transition duration
     *   window.SlideshowTOC.config.timing.transitionDuration = 800;
     */
    const SlideshowConfig = {
        selectors: {
            container: '.toc-slideshow-container',
            slides: '.toc-slide',
            prevBtn: '.toc-nav-prev',
            nextBtn: '.toc-nav-next',
            indicators: '.toc-indicator',
            nav: '.toc-slideshow-nav'
        },
        classes: {
            active: 'active',
            animating: 'animating'
        },
        timing: {
            transitionDuration: 500,
            swipeThreshold: 50
        },
        keyboard: {
            enabled: true,
            keys: {
                prev: ['ArrowLeft', 'ArrowUp'],
                next: ['ArrowRight', 'ArrowDown'],
                first: ['Home'],
                last: ['End']
            }
        },
        touch: {
            enabled: true,
            minSwipeDistance: 50
        },
        debug: false
    };

    /**
     * Utility: Safe query selector
     */
    function safeQuerySelector(selector, all = false) {
        try {
            return all ? document.querySelectorAll(selector) : document.querySelector(selector);
        } catch (error) {
            console.error(`[SlideshowTOC] Query selector error for "${selector}":`, error);
            return all ? [] : null;
        }
    }

    /**
     * Utility: Log debug messages
     */
    function logDebug(message, data = null) {
        if (SlideshowConfig.debug) {
            console.log(`[SlideshowTOC] ${message}`, data || '');
        }
    }

    /**
     * Initialize the slideshow
     *
     * Main initialization function that:
     * 1. Counts and validates slides
     * 2. Shows the first slide
     * 3. Sets up all event handlers (navigation, keyboard, touch, mouse wheel)
     * 4. Configures slide indicators
     * 5. Enables sticky TOC behavior
     * 6. Adds window resize handler for responsive behavior
     *
     * Called automatically on DOM ready, or can be called manually via window.SlideshowTOC.init()
     *
     * @returns {void}
     */
    function initSlideshow() {
        try {
            logDebug('Initializing slideshow...');

            // Find all slides in the DOM
            const slides = safeQuerySelector(SlideshowConfig.selectors.slides, true);
            if (!slides || slides.length === 0) {
                logDebug('No slides found, slideshow not initialized');
                return;
            }

            // Store total slide count
            SlideshowState.totalSlides = slides.length;
            logDebug(`Found ${SlideshowState.totalSlides} slides`);

            // Display the first slide
            showSlide(1);

            // Setup prev/next button navigation
            setupNavigation();

            // Setup keyboard navigation (arrow keys, Home, End)
            if (SlideshowConfig.keyboard.enabled) {
                setupKeyboardNavigation();
            }

            // Setup touch/swipe gestures for mobile
            if (SlideshowConfig.touch.enabled) {
                setupTouchGestures();
            }

            // Setup clickable slide indicator dots
            setupIndicators();

            // Setup mouse wheel navigation when hovering over slideshow
            setupMouseWheelNavigation();

            // Setup sticky TOC behavior (collapses when scrolled past)
            setupStickyTOC();

            // Setup window resize handler to adjust container height dynamically
            window.addEventListener('resize', () => {
                if (SlideshowState.initialized) {
                    adjustContainerHeight();
                }
            });

            // Mark as initialized
            SlideshowState.initialized = true;
            logDebug('Slideshow initialized successfully');

        } catch (error) {
            console.error('[SlideshowTOC] Initialization error:', error);
        }
    }

    /**
     * Show a specific slide
     *
     * Displays the requested slide and hides all others. Updates:
     * - Slide visibility (adds/removes 'active' class)
     * - ARIA attributes for accessibility
     * - Indicator dots to reflect current slide
     * - Navigation button states (disable at boundaries)
     * - Container height to fit active slide content
     *
     * Prevents overlapping animations by checking isAnimating flag.
     *
     * @param {number} slideNumber - The slide to display (1-based index)
     * @returns {void}
     */
    function showSlide(slideNumber) {
        try {
            // Prevent overlapping animations
            if (SlideshowState.isAnimating) {
                logDebug('Animation in progress, ignoring slide change');
                return;
            }

            // Clamp slide number to valid range [1, totalSlides]
            if (slideNumber < 1) slideNumber = 1;
            if (slideNumber > SlideshowState.totalSlides) slideNumber = SlideshowState.totalSlides;

            logDebug(`Showing slide ${slideNumber}`);

            // Set animation flag to prevent concurrent transitions
            SlideshowState.isAnimating = true;
            SlideshowState.currentSlide = slideNumber;

            const slides = safeQuerySelector(SlideshowConfig.selectors.slides, true);
            const indicators = safeQuerySelector(SlideshowConfig.selectors.indicators, true);

            // Update slide visibility and accessibility attributes
            slides.forEach((slide, index) => {
                if (index + 1 === slideNumber) {
                    slide.classList.add(SlideshowConfig.classes.active);
                    slide.setAttribute('aria-hidden', 'false'); // Make visible to screen readers
                } else {
                    slide.classList.remove(SlideshowConfig.classes.active);
                    slide.setAttribute('aria-hidden', 'true'); // Hide from screen readers
                }
            });

            // Update indicator dots to reflect current slide
            indicators.forEach((indicator, index) => {
                if (index + 1 === slideNumber) {
                    indicator.classList.add(SlideshowConfig.classes.active);
                    indicator.setAttribute('aria-selected', 'true');
                } else {
                    indicator.classList.remove(SlideshowConfig.classes.active);
                    indicator.setAttribute('aria-selected', 'false');
                }
            });

            // Disable prev/next buttons at boundaries
            updateNavigationButtons();

            // Adjust container height to fit active slide content
            adjustContainerHeight();

            // Reset animation flag after transition completes
            setTimeout(() => {
                SlideshowState.isAnimating = false;
            }, SlideshowConfig.timing.transitionDuration);

        } catch (error) {
            console.error('[SlideshowTOC] Show slide error:', error);
            SlideshowState.isAnimating = false;
        }
    }

    /**
     * Navigate to previous slide
     */
    function prevSlide() {
        logDebug('Previous slide');
        showSlide(SlideshowState.currentSlide - 1);
    }

    /**
     * Navigate to next slide
     */
    function nextSlide() {
        logDebug('Next slide');
        showSlide(SlideshowState.currentSlide + 1);
    }

    /**
     * Navigate to first slide
     */
    function firstSlide() {
        logDebug('First slide');
        showSlide(1);
    }

    /**
     * Navigate to last slide
     */
    function lastSlide() {
        logDebug('Last slide');
        showSlide(SlideshowState.totalSlides);
    }

    /**
     * Update navigation button states
     */
    function updateNavigationButtons() {
        const prevBtn = safeQuerySelector(SlideshowConfig.selectors.prevBtn);
        const nextBtn = safeQuerySelector(SlideshowConfig.selectors.nextBtn);

        if (prevBtn) {
            prevBtn.disabled = SlideshowState.currentSlide === 1;
        }

        if (nextBtn) {
            nextBtn.disabled = SlideshowState.currentSlide === SlideshowState.totalSlides;
        }
    }

    /**
     * Adjust container height to fit active slide
     */
    function adjustContainerHeight() {
        try {
            const container = safeQuerySelector(SlideshowConfig.selectors.container);
            const activeSlide = safeQuerySelector('.toc-slide.active');

            if (!container || !activeSlide) return;

            // Get the actual height of the active slide
            const slideHeight = activeSlide.offsetHeight;

            // Set container height to match active slide
            container.style.height = slideHeight + 'px';

            logDebug(`Container height adjusted to ${slideHeight}px`);

        } catch (error) {
            console.error('[SlideshowTOC] Adjust container height error:', error);
        }
    }

    /**
     * Setup navigation buttons
     */
    function setupNavigation() {
        try {
            const prevBtn = safeQuerySelector(SlideshowConfig.selectors.prevBtn);
            const nextBtn = safeQuerySelector(SlideshowConfig.selectors.nextBtn);

            if (prevBtn) {
                prevBtn.addEventListener('click', prevSlide);
                logDebug('Previous button setup');
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', nextSlide);
                logDebug('Next button setup');
            }

        } catch (error) {
            console.error('[SlideshowTOC] Navigation setup error:', error);
        }
    }

    /**
     * Setup keyboard navigation
     */
    function setupKeyboardNavigation() {
        try {
            document.addEventListener('keydown', (event) => {
                // Only handle keyboard events when TOC is visible
                const container = safeQuerySelector(SlideshowConfig.selectors.container);
                if (!container) return;

                const key = event.key;

                if (SlideshowConfig.keyboard.keys.prev.includes(key)) {
                    event.preventDefault();
                    prevSlide();
                } else if (SlideshowConfig.keyboard.keys.next.includes(key)) {
                    event.preventDefault();
                    nextSlide();
                } else if (SlideshowConfig.keyboard.keys.first.includes(key)) {
                    event.preventDefault();
                    firstSlide();
                } else if (SlideshowConfig.keyboard.keys.last.includes(key)) {
                    event.preventDefault();
                    lastSlide();
                }
            });

            logDebug('Keyboard navigation setup');

        } catch (error) {
            console.error('[SlideshowTOC] Keyboard navigation setup error:', error);
        }
    }

    /**
     * Setup touch gestures
     */
    function setupTouchGestures() {
        try {
            const container = safeQuerySelector(SlideshowConfig.selectors.container);
            if (!container) return;

            container.addEventListener('touchstart', handleTouchStart, { passive: true });
            container.addEventListener('touchmove', handleTouchMove, { passive: true });
            container.addEventListener('touchend', handleTouchEnd, { passive: true });

            logDebug('Touch gestures setup');

        } catch (error) {
            console.error('[SlideshowTOC] Touch gestures setup error:', error);
        }
    }

    /**
     * Handle touch start
     *
     * Records the initial touch position when user touches the screen.
     * Used to calculate swipe direction and distance in handleTouchEnd.
     *
     * @param {TouchEvent} event - Touch start event
     * @returns {void}
     */
    function handleTouchStart(event) {
        SlideshowState.touchStartX = event.touches[0].clientX;
        SlideshowState.touchStartY = event.touches[0].clientY;
    }

    /**
     * Handle touch move
     *
     * Tracks the current touch position as user moves their finger.
     * Updates continuously during the swipe gesture.
     *
     * @param {TouchEvent} event - Touch move event
     * @returns {void}
     */
    function handleTouchMove(event) {
        SlideshowState.touchEndX = event.touches[0].clientX;
        SlideshowState.touchEndY = event.touches[0].clientY;
    }

    /**
     * Handle touch end
     *
     * Processes the completed swipe gesture:
     * - Calculates horizontal (deltaX) and vertical (deltaY) distances
     * - Ignores vertical swipes (deltaY > 50px) to allow normal scrolling
     * - Triggers slide navigation if horizontal swipe exceeds minSwipeDistance
     * - Swipe left (deltaX > 0) = next slide
     * - Swipe right (deltaX < 0) = previous slide
     *
     * @returns {void}
     */
    function handleTouchEnd() {
        const deltaX = SlideshowState.touchStartX - SlideshowState.touchEndX;
        const deltaY = Math.abs(SlideshowState.touchStartY - SlideshowState.touchEndY);

        // Only process horizontal swipes (ignore vertical scrolling)
        if (deltaY > 50) return;

        if (Math.abs(deltaX) > SlideshowConfig.touch.minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
        }
    }

    /**
     * Setup slide indicators
     */
    function setupIndicators() {
        try {
            const indicators = safeQuerySelector(SlideshowConfig.selectors.indicators, true);
            if (!indicators || indicators.length === 0) return;

            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    showSlide(index + 1);
                });

                // Keyboard support for indicators
                indicator.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        showSlide(index + 1);
                    }
                });
            });

            logDebug('Indicators setup');

        } catch (error) {
            console.error('[SlideshowTOC] Indicators setup error:', error);
        }
    }

    /**
     * Setup mouse wheel navigation
     */
    function setupMouseWheelNavigation() {
        try {
            const container = safeQuerySelector(SlideshowConfig.selectors.container);
            if (!container) return;

            let wheelTimeout = null;
            let isHovering = false;

            // Track hover state
            container.addEventListener('mouseenter', () => {
                isHovering = true;
                logDebug('Mouse entered slideshow container');
            });

            container.addEventListener('mouseleave', () => {
                isHovering = false;
                logDebug('Mouse left slideshow container');
            });

            // Handle wheel events
            container.addEventListener('wheel', (event) => {
                if (!isHovering) return;

                // Prevent default scroll behavior
                event.preventDefault();

                // Clear existing timeout
                if (wheelTimeout) {
                    clearTimeout(wheelTimeout);
                }

                // Debounce wheel events (wait for scroll to finish)
                wheelTimeout = setTimeout(() => {
                    const delta = event.deltaY;

                    if (delta > 0) {
                        // Scrolling down - next slide
                        nextSlide();
                        logDebug('Wheel scroll down - next slide');
                    } else if (delta < 0) {
                        // Scrolling up - previous slide
                        prevSlide();
                        logDebug('Wheel scroll up - previous slide');
                    }
                }, 50); // 50ms debounce

            }, { passive: false }); // passive: false to allow preventDefault

            logDebug('Mouse wheel navigation setup');

        } catch (error) {
            console.error('[SlideshowTOC] Mouse wheel setup error:', error);
        }
    }

    /**
     * Setup sticky TOC behavior
     */
    function setupStickyTOC() {
        try {
            const tocElement = document.querySelector('.toc.toc-slideshow');
            if (!tocElement) {
                logDebug('TOC element not found for sticky behavior');
                return;
            }

            // Store original position and dimensions
            const tocOriginalTop = tocElement.offsetTop;
            let isSticky = false;

            // Function to update sticky positioning
            function updateStickyPosition() {
                if (!isSticky) return;

                // Calculate the left offset to match content edges
                const viewportWidth = window.innerWidth;
                const contentMaxWidth = 1200;
                const desiredTotalWidth = Math.min(contentMaxWidth, viewportWidth);
                const leftOffset = Math.max(0, (viewportWidth - desiredTotalWidth) / 2);

                // Set left position and width using setProperty with !important
                // With box-sizing: border-box, the width includes padding
                tocElement.style.setProperty('left', leftOffset + 'px', 'important');
                tocElement.style.setProperty('width', desiredTotalWidth + 'px', 'important');
                tocElement.style.setProperty('right', 'auto', 'important');
                tocElement.style.setProperty('box-sizing', 'border-box', 'important');

                logDebug(`Sticky TOC positioned: left=${leftOffset}px, width=${desiredTotalWidth}px`);
            }

            // Handle scroll events
            function handleScroll() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (scrollTop > tocOriginalTop && !isSticky) {
                    // Add sticky class
                    tocElement.classList.add('sticky');
                    isSticky = true;
                    updateStickyPosition();
                    logDebug('TOC is now sticky');
                } else if (scrollTop <= tocOriginalTop && isSticky) {
                    // Remove sticky class and clear inline styles
                    tocElement.classList.remove('sticky');
                    tocElement.style.removeProperty('left');
                    tocElement.style.removeProperty('right');
                    tocElement.style.removeProperty('width');
                    tocElement.style.removeProperty('box-sizing');
                    isSticky = false;
                    logDebug('TOC is no longer sticky');
                }
            }

            // Handle window resize
            function handleResize() {
                updateStickyPosition();
            }

            // Attach listeners
            window.addEventListener('scroll', handleScroll);
            window.addEventListener('resize', handleResize);

            logDebug('Sticky TOC setup complete');

        } catch (error) {
            console.error('[SlideshowTOC] Sticky TOC setup error:', error);
        }
    }

    /**
     * Public API
     */
    window.SlideshowTOC = {
        init: initSlideshow,
        showSlide: showSlide,
        nextSlide: nextSlide,
        prevSlide: prevSlide,
        firstSlide: firstSlide,
        lastSlide: lastSlide,
        getCurrentSlide: () => SlideshowState.currentSlide,
        getTotalSlides: () => SlideshowState.totalSlides,
        isInitialized: () => SlideshowState.initialized,
        state: SlideshowState,
        config: SlideshowConfig
    };

    /**
     * Auto-initialize when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlideshow);
    } else {
        initSlideshow();
    }

    logDebug('Slideshow TOC module loaded');

})();


// ============================================================================
// END OF CONSOLIDATED FILE
// ============================================================================

console.log('[Tools2026] All modules loaded successfully from consolidated file');
