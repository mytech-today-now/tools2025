/**
 * Sticky Table of Contents Module
 * 
 * Enhances the sticky TOC functionality with error handling, state management,
 * and enhanced interaction support for touch devices and accessibility.
 * 
 * @author myTech.Today
 * @version 1.0.0
 * @requires DOM API, CSS Transitions
 */

(function() {
    'use strict';

    /**
     * TOC State Management Object
     * Tracks the current state of the TOC component
     */
    const TOCState = {
        isExpanded: false,
        isHovered: false,
        isFocused: false,
        isSticky: false,
        originalPosition: null,
        touchStartTime: 0,
        lastError: null,
        initialized: false
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
            mainContent: 'main'
        },
        timing: {
            hoverDelay: 150,
            nestedHoverDelay: 100,
            touchThreshold: 300,
            transitionDuration: 300
        },
        breakpoints: {
            mobile: 768,
            desktop: 1200
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
     * Scroll management for sticky behavior
     */
    const ScrollManager = {
        /**
         * Handle scroll events to determine sticky state
         */
        handleScroll() {
            try {
                const toc = safeQuerySelector(TOCConfig.selectors.toc);
                if (!toc) {
                    logError('nav', 11, 'TOC element not found during scroll handling', 0, 0);
                    return;
                }

                // Get TOC's original position if not already stored
                if (!TOCState.originalPosition) {
                    const rect = toc.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    TOCState.originalPosition = rect.top + scrollTop;
                }

                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const shouldBeSticky = currentScrollTop > TOCState.originalPosition;

                // Update sticky state if changed
                if (shouldBeSticky !== TOCState.isSticky) {
                    this.toggleStickyState(shouldBeSticky);
                }

            } catch (error) {
                logError('scroll', 1, `Scroll handler error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Toggle sticky state
         * @param {boolean} makeSticky - Whether to make TOC sticky
         */
        toggleStickyState(makeSticky) {
            try {
                const toc = safeQuerySelector(TOCConfig.selectors.toc);
                const body = document.body;

                if (!toc || !body) {
                    logError('nav', 12, 'Required elements not found for sticky toggle', 0, 0);
                    return;
                }

                TOCState.isSticky = makeSticky;

                if (makeSticky) {
                    // Make TOC sticky
                    toc.classList.add('toc-sticky');
                    body.classList.add('toc-sticky-active');
                    toc.setAttribute('aria-expanded', 'false');

                    // Enable scrollable behavior for sticky TOC
                    this.enableStickyScrolling(toc);

                    // Reset expansion state when becoming sticky
                    TOCState.isExpanded = false;
                } else {
                    // Return TOC to normal document flow
                    toc.classList.remove('toc-sticky');
                    body.classList.remove('toc-sticky-active');
                    toc.removeAttribute('aria-expanded');

                    // Disable scrollable behavior when not sticky
                    this.disableStickyScrolling(toc);

                    // Reset expansion state when returning to normal flow
                    TOCState.isExpanded = false;
                }

                // Dispatch custom event
                const event = new CustomEvent('tocStickyChange', {
                    detail: { isSticky: makeSticky }
                });
                document.dispatchEvent(event);

            } catch (error) {
                logError('nav', 13, `Sticky state toggle error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Enable scrollable behavior for sticky TOC
         * @param {Element} toc - The TOC element
         */
        enableStickyScrolling(toc) {
            try {
                const tocList = toc.querySelector('ul');
                if (!tocList) return;

                // Add scrollable container class for CSS targeting
                tocList.classList.add('toc-scrollable');

                // Set up scroll behavior attributes
                tocList.setAttribute('tabindex', '0');
                tocList.setAttribute('role', 'region');
                tocList.setAttribute('aria-label', 'Scrollable table of contents');

                // Add scroll event listener for accessibility
                tocList.addEventListener('scroll', this.handleTOCScroll.bind(this));

                // Check if content is scrollable and add indicator
                this.updateScrollIndicator(tocList);

                // Add resize observer to update scroll indicator when content changes
                if (window.ResizeObserver) {
                    const resizeObserver = new ResizeObserver(() => {
                        this.updateScrollIndicator(tocList);
                    });
                    resizeObserver.observe(tocList);

                    // Store observer for cleanup
                    tocList._scrollResizeObserver = resizeObserver;
                }

            } catch (error) {
                logError('scroll', 3, `Enable sticky scrolling error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Disable scrollable behavior for non-sticky TOC
         * @param {Element} toc - The TOC element
         */
        disableStickyScrolling(toc) {
            try {
                const tocList = toc.querySelector('ul');
                if (!tocList) return;

                // Remove scrollable container class
                tocList.classList.remove('toc-scrollable');

                // Remove scroll behavior attributes
                tocList.removeAttribute('tabindex');
                tocList.removeAttribute('role');
                tocList.removeAttribute('aria-label');
                tocList.removeAttribute('data-scrollable');

                // Remove scroll event listener
                tocList.removeEventListener('scroll', this.handleTOCScroll.bind(this));

                // Clean up resize observer
                if (tocList._scrollResizeObserver) {
                    tocList._scrollResizeObserver.disconnect();
                    delete tocList._scrollResizeObserver;
                }

            } catch (error) {
                logError('scroll', 4, `Disable sticky scrolling error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Update scroll indicator based on content overflow
         * @param {Element} tocList - The TOC list element
         */
        updateScrollIndicator(tocList) {
            try {
                if (!tocList) return;

                // Check if content is scrollable
                const isScrollable = tocList.scrollHeight > tocList.clientHeight;

                // Update data attribute for CSS targeting
                if (isScrollable) {
                    tocList.setAttribute('data-scrollable', 'true');
                } else {
                    tocList.removeAttribute('data-scrollable');
                }

                // Update ARIA label to indicate scrollable state
                const baseLabel = 'Table of contents';
                const scrollableLabel = isScrollable ? `${baseLabel} - scrollable content` : baseLabel;
                tocList.setAttribute('aria-label', scrollableLabel);

            } catch (error) {
                logError('scroll', 6, `Update scroll indicator error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Handle TOC internal scrolling for accessibility
         * @param {Event} event - Scroll event
         */
        handleTOCScroll(event) {
            try {
                const tocList = event.target;
                const scrollTop = tocList.scrollTop;
                const scrollHeight = tocList.scrollHeight;
                const clientHeight = tocList.clientHeight;

                // Check if content is scrollable
                const isScrollable = scrollHeight > clientHeight;

                if (!isScrollable) {
                    tocList.setAttribute('aria-label', 'Table of contents');
                    return;
                }

                // Update ARIA attributes based on scroll position
                if (scrollTop === 0) {
                    tocList.setAttribute('aria-label', 'Scrollable table of contents - at top');
                } else if (scrollTop + clientHeight >= scrollHeight - 5) {
                    tocList.setAttribute('aria-label', 'Scrollable table of contents - at bottom');
                } else {
                    tocList.setAttribute('aria-label', 'Scrollable table of contents - scrolling');
                }

                // Update scroll indicator visibility
                this.updateScrollIndicator(tocList);

            } catch (error) {
                logError('scroll', 5, `TOC scroll handler error: ${error.message}`, 0, 0);
            }
        },

        /**
         * Recalculate original position (useful after layout changes)
         */
        recalculatePosition() {
            try {
                const toc = safeQuerySelector(TOCConfig.selectors.toc);
                if (!toc) return;

                // Temporarily remove sticky state to get original position
                const wasSticky = TOCState.isSticky;
                if (wasSticky) {
                    toc.classList.remove('toc-sticky');
                    document.body.classList.remove('toc-sticky-active');
                }

                // Get new position
                const rect = toc.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                TOCState.originalPosition = rect.top + scrollTop;

                // Restore sticky state if it was active
                if (wasSticky) {
                    toc.classList.add('toc-sticky');
                    document.body.classList.add('toc-sticky-active');
                }

            } catch (error) {
                logError('scroll', 2, `Position recalculation error: ${error.message}`, 0, 0);
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
                const parentItems = safeQuerySelector(TOCConfig.selectors.tocParentItems, true);

                if (!parentItems || parentItems.length === 0) {
                    // Use fallback selector for browsers that don't support :has()
                    this.initFallbackNestedInteractions();
                    return;
                }

                parentItems.forEach(item => {
                    this.setupParentItemInteractions(item);
                });

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
                const allListItems = safeQuerySelector('nav.toc li', true);

                if (!allListItems) return;

                allListItems.forEach(item => {
                    const nestedList = item.querySelector('ul');
                    if (nestedList) {
                        this.setupParentItemInteractions(item);
                    }
                });

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
                parentItem.classList.add('has-nested');

                // Add hover events for nested list expansion
                parentItem.addEventListener('mouseenter', (event) => {
                    event.stopPropagation();
                    this.handleParentHover(parentItem, true);
                });

                parentItem.addEventListener('mouseleave', (event) => {
                    event.stopPropagation();
                    this.handleParentHover(parentItem, false);
                });

                // Add focus events for keyboard navigation
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
                if (!nestedList) return;

                parentItem.setAttribute('aria-expanded', 'true');
                nestedList.setAttribute('aria-hidden', 'false');
                parentItem.classList.add('nested-expanded');

                // Dispatch custom event
                const event = new CustomEvent('nestedListExpand', {
                    detail: { parentItem, nestedList }
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
                if (!nestedList) return;

                parentItem.setAttribute('aria-expanded', 'false');
                nestedList.setAttribute('aria-hidden', 'true');
                parentItem.classList.remove('nested-expanded');

                // Dispatch custom event
                const event = new CustomEvent('nestedListCollapse', {
                    detail: { parentItem, nestedList }
                });
                document.dispatchEvent(event);

            } catch (error) {
                logError('nested', 7, `Nested collapse error: ${error.message}`, 0, 0);
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

                TOCState.isExpanded = !TOCState.isExpanded;
                
                if (TOCState.isExpanded) {
                    toc.classList.add('toc-expanded');
                    toc.setAttribute('aria-expanded', 'true');
                } else {
                    toc.classList.remove('toc-expanded');
                    toc.setAttribute('aria-expanded', 'false');
                }

                // Dispatch custom event for other components
                const event = new CustomEvent('tocToggle', {
                    detail: { expanded: TOCState.isExpanded }
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

                // Delay expansion slightly to prevent accidental triggers
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

                // Update scroll indicator after expansion
                setTimeout(() => {
                    const toc = safeQuerySelector(TOCConfig.selectors.toc);
                    if (toc && TOCState.isSticky) {
                        const tocList = toc.querySelector('ul.toc-scrollable');
                        if (tocList) {
                            ScrollManager.updateScrollIndicator(tocList);
                        }
                    }
                }, TOCConfig.timing.transitionDuration);
            }
        },

        /**
         * Collapse TOC programmatically
         */
        collapseTOC() {
            if (TOCState.isExpanded) {
                this.toggleExpansion();
            }
        }
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
                
                // Reset state on viewport change
                if (ViewportUtils.isMobile() && TOCState.isExpanded) {
                    TOCInteraction.collapseTOC();
                }
                
                // Dispatch resize event for other components
                const event = new CustomEvent('tocResize', {
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

            // Initialize accessibility
            AccessibilityManager.init();

            // Initialize nested list interactions
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

            // Scroll handler for sticky behavior - this is the key missing piece
            window.addEventListener('scroll', () => ScrollManager.handleScroll(), { passive: true });

            // Mark as initialized
            TOCState.initialized = true;
            
            console.log('[TOC Module] Successfully initialized sticky TOC functionality');
            
        } catch (error) {
            logError('module', 2, `Initialization error: ${error.message}`, 0, 0);
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
                                console.error('[TOC Module] Waypoint error:', error);
                                return this;
                            }
                        };
                    }

                    // Fix potential issues with jQuery selectors
                    const originalFind = window.jQuery.fn.find;
                    window.jQuery.fn.find = function(selector) {
                        try {
                            if (typeof selector !== 'string') {
                                console.warn('[TOC Module] jQuery find called with non-string selector:', selector);
                                return window.jQuery();
                            }
                            return originalFind.call(this, selector);
                        } catch (error) {
                            console.error('[TOC Module] jQuery find error:', error);
                            return window.jQuery();
                        }
                    };
                }
            } catch (error) {
                console.error('[TOC Module] Error fixing jQuery issues:', error);
            }
        },

        /**
         * Check for and report potential issues
         */
        diagnostics() {
            const issues = [];

            try {
                // Check for TOC element
                const toc = document.querySelector('nav.toc');
                if (!toc) {
                    issues.push('TOC element not found');
                }

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

                console.log('[TOC Module] Diagnostics:', issues);
                return issues;
            } catch (error) {
                console.error('[TOC Module] Diagnostics error:', error);
                return ['Diagnostics failed'];
            }
        }
    };

    /**
     * Public API for external access
     */
    window.StickyTOC = {
        init: initTOC,
        state: TOCState,
        config: TOCConfig,
        expand: () => TOCInteraction.expandTOC(),
        collapse: () => TOCInteraction.collapseTOC(),
        toggle: () => TOCInteraction.toggleExpansion(),
        nested: {
            init: () => NestedListManager.init(),
            expandAll: () => {
                try {
                    const parentItems = document.querySelectorAll('nav.toc li:has(ul)');
                    if (parentItems.length === 0) {
                        // Fallback for browsers without :has() support
                        const allItems = document.querySelectorAll('nav.toc li');
                        allItems.forEach(item => {
                            if (item.querySelector('ul')) {
                                NestedListManager.expandNestedList(item);
                            }
                        });
                    } else {
                        parentItems.forEach(item => NestedListManager.expandNestedList(item));
                    }
                } catch (error) {
                    console.error('[TOC Module] expandAll error:', error);
                }
            },
            collapseAll: () => {
                try {
                    const parentItems = document.querySelectorAll('nav.toc li:has(ul)');
                    if (parentItems.length === 0) {
                        // Fallback for browsers without :has() support
                        const allItems = document.querySelectorAll('nav.toc li');
                        allItems.forEach(item => {
                            if (item.querySelector('ul')) {
                                NestedListManager.collapseNestedList(item);
                            }
                        });
                    } else {
                        parentItems.forEach(item => NestedListManager.collapseNestedList(item));
                    }
                } catch (error) {
                    console.error('[TOC Module] collapseAll error:', error);
                }
            }
        },
        debug: DebugUtils,
        getLastError: () => TOCState.lastError
    };

    /**
     * Global error handler for unhandled JavaScript errors
     */
    function setupGlobalErrorHandling() {
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', function(event) {
            console.error('[TOC Module] Unhandled promise rejection:', event.reason);
            event.preventDefault(); // Prevent the default browser behavior
        });

        // Handle general JavaScript errors
        window.addEventListener('error', function(event) {
            console.error('[TOC Module] JavaScript error:', {
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
                        console.warn('[TOC Module] jQuery load called with non-string URL:', url);
                        return this;
                    }
                    return originalLoad.call(this, url, params, callback);
                } catch (error) {
                    console.error('[TOC Module] jQuery load error:', error);
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
                            console.warn('[TOC Module] IntersectionObserver.observe called with invalid target:', target);
                            return;
                        }
                        return originalObserve.call(this, target);
                    } catch (error) {
                        console.error('[TOC Module] IntersectionObserver.observe error:', error);
                    }
                };

                return observer;
            };
        }
    }

    /**
     * Fix common jQuery and DOM issues
     */
    function fixCommonIssues() {
        try {
            // Fix missing images-slides directory issue
            const brokenImages = document.querySelectorAll('img[src*="images-slides"]');
            brokenImages.forEach(img => {
                img.addEventListener('error', function() {
                    console.warn('[TOC Module] Broken image detected:', this.src);
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
                            console.warn(`[TOC Module] Potential syntax error in inline script #${index + 1}`);
                        }
                    }
                } catch (error) {
                    console.error(`[TOC Module] Error checking inline script #${index + 1}:`, error);
                }
            });

        } catch (error) {
            console.error('[TOC Module] Error in fixCommonIssues:', error);
        }
    }

    // Setup global error handling first
    setupGlobalErrorHandling();

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            DebugUtils.fixJQueryIssues();
            initTOC();
            fixCommonIssues();
            DebugUtils.diagnostics();
        });
    } else {
        DebugUtils.fixJQueryIssues();
        initTOC();
        fixCommonIssues();
        DebugUtils.diagnostics();
    }

})();
