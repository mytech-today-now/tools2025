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
        debug: false
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
                parentItem.classList.add(TOCConfig.classes.hasNested);

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
                parentItem.classList.add(TOCConfig.classes.nestedExpanded);

                // Sticky functionality disabled - no special handling needed

                // Update scrollable state
                ScrollableManager.updateScrollableState();

                // Dispatch custom event
                const event = new CustomEvent('nestedListExpand', {
                    detail: {
                        parentItem,
                        nestedList,
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
                if (!nestedList) return;

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
