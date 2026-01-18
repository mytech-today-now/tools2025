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
