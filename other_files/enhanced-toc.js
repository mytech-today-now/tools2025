/**
 * Enhanced Table of Contents Module
 * 
 * A sophisticated TOC module that:
 * - Detects existing nav#toc content or generates from h2-h5 headers
 * - Provides sticky behavior when main element is at viewport top
 * - Features hover-based expansion with blur effects
 * - Supports nested sub-item expansion with proper indentation
 * - Responsive design with muted scroll bars
 * 
 * @author myTech.Today
 * @version 1.0.0
 */

(function() {
    'use strict';

    /**
     * Enhanced TOC Configuration
     */
    const EnhancedTOCConfig = {
        selectors: {
            toc: 'nav#toc',
            main: 'main',
            stickyHeader: 'header',
            body: 'body',
            headings: 'h2, h3, h4, h5'
        },
        classes: {
            tocContainer: 'enhanced-toc',
            tocSticky: 'enhanced-toc-sticky',
            tocExpanded: 'enhanced-toc-expanded',
            tocCollapsed: 'enhanced-toc-collapsed',
            tocTitle: 'enhanced-toc-title',
            tocContent: 'enhanced-toc-content',
            tocScrollable: 'enhanced-toc-scrollable',
            tocItem: 'enhanced-toc-item',
            tocLink: 'enhanced-toc-link',
            tocSubItems: 'enhanced-toc-subitems',
            tocSubItem: 'enhanced-toc-subitem',
            hasSubItems: 'has-subitems',
            subItemsExpanded: 'subitems-expanded',
            bodyTocActive: 'enhanced-toc-active'
        },
        timing: {
            hoverDelay: 150,
            expandDelay: 200,
            collapseDelay: 300,
            scrollDebounce: 16
        },
        breakpoints: {
            mobile: 768,
            tablet: 1024,
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
     * Enhanced TOC State Management
     */
    const EnhancedTOCState = {
        initialized: false,
        isSticky: false,
        isExpanded: false,
        hasExistingTOC: false,
        generatedTOC: null,
        mainElement: null,
        stickyHeader: null,
        tocElement: null,
        hoverTimeout: null,
        scrollTimeout: null,
        lastScrollTop: 0,
        originalTOCPosition: null,
        errors: []
    };

    /**
     * Utility Functions
     */
    const Utils = {
        /**
         * Safe query selector with error handling
         */
        safeQuerySelector(selector, context = document) {
            try {
                return context.querySelector(selector);
            } catch (error) {
                this.logError('safeQuerySelector', `Invalid selector: ${selector}`, error);
                return null;
            }
        },

        /**
         * Safe query selector all with error handling
         */
        safeQuerySelectorAll(selector, context = document) {
            try {
                return context.querySelectorAll(selector);
            } catch (error) {
                this.logError('safeQuerySelectorAll', `Invalid selector: ${selector}`, error);
                return [];
            }
        },

        /**
         * Log error with context
         */
        logError(context, message, error = null) {
            const errorObj = {
                context,
                message,
                error: error ? error.message : null,
                timestamp: new Date().toISOString()
            };
            
            EnhancedTOCState.errors.push(errorObj);
            
            if (EnhancedTOCConfig.debug) {
                console.error(`[Enhanced TOC] ${context}: ${message}`, error);
            }
        },

        /**
         * Debounce function
         */
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Generate unique ID for TOC items
         */
        generateId(text) {
            return text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
        },

        /**
         * Get element's offset top relative to document
         */
        getOffsetTop(element) {
            let offsetTop = 0;
            while (element) {
                offsetTop += element.offsetTop;
                element = element.offsetParent;
            }
            return offsetTop;
        }
    };

    /**
     * TOC Detection and Generation
     */
    const TOCGenerator = {
        /**
         * Check if existing nav#toc exists and has content
         */
        detectExistingTOC() {
            const existingTOC = Utils.safeQuerySelector(EnhancedTOCConfig.selectors.toc);
            
            if (existingTOC && existingTOC.innerHTML.trim()) {
                EnhancedTOCState.hasExistingTOC = true;
                EnhancedTOCState.tocElement = existingTOC;
                return true;
            }
            
            return false;
        },

        /**
         * Generate TOC from document headings h2-h5
         */
        generateFromHeadings() {
            const headings = Utils.safeQuerySelectorAll(EnhancedTOCConfig.selectors.headings);
            
            if (headings.length === 0) {
                Utils.logError('generateFromHeadings', 'No headings found to generate TOC');
                return null;
            }

            const tocStructure = this.buildTOCStructure(headings);
            const tocHTML = this.generateTOCHTML(tocStructure);
            
            return this.createTOCElement(tocHTML);
        },

        /**
         * Build hierarchical TOC structure from headings
         */
        buildTOCStructure(headings) {
            const structure = [];
            const stack = [];

            headings.forEach(heading => {
                const level = parseInt(heading.tagName.charAt(1));
                const text = heading.textContent.trim();
                const id = heading.id || Utils.generateId(text);
                
                // Ensure heading has an ID for linking
                if (!heading.id) {
                    heading.id = id;
                }

                const item = {
                    level,
                    text,
                    id,
                    children: []
                };

                // Find the correct parent level
                while (stack.length > 0 && stack[stack.length - 1].level >= level) {
                    stack.pop();
                }

                if (stack.length === 0) {
                    structure.push(item);
                } else {
                    stack[stack.length - 1].children.push(item);
                }

                stack.push(item);
            });

            return structure;
        },

        /**
         * Generate HTML from TOC structure
         */
        generateTOCHTML(structure) {
            if (structure.length === 0) return '';

            let html = '<ul class="' + EnhancedTOCConfig.classes.tocScrollable + '">';
            
            structure.forEach(item => {
                html += this.generateItemHTML(item);
            });
            
            html += '</ul>';
            return html;
        },

        /**
         * Generate HTML for individual TOC item
         */
        generateItemHTML(item) {
            const hasChildren = item.children && item.children.length > 0;
            const itemClass = EnhancedTOCConfig.classes.tocItem + 
                            (hasChildren ? ' ' + EnhancedTOCConfig.classes.hasSubItems : '');

            let html = `<li class="${itemClass}">`;
            html += `<a href="#${item.id}" class="${EnhancedTOCConfig.classes.tocLink}">${item.text}</a>`;
            
            if (hasChildren) {
                html += `<ul class="${EnhancedTOCConfig.classes.tocSubItems}">`;
                item.children.forEach(child => {
                    html += this.generateItemHTML(child);
                });
                html += '</ul>';
            }
            
            html += '</li>';
            return html;
        },

        /**
         * Create TOC element with generated content
         */
        createTOCElement(tocHTML) {
            const tocElement = document.createElement('nav');
            tocElement.id = 'toc';
            tocElement.className = EnhancedTOCConfig.classes.tocContainer;
            
            tocElement.innerHTML = `
                <h2 class="${EnhancedTOCConfig.classes.tocTitle}">Table of Contents</h2>
                <div class="${EnhancedTOCConfig.classes.tocContent}">
                    ${tocHTML}
                </div>
            `;

            return tocElement;
        }
    };

    /**
     * Sticky Behavior Management
     */
    const StickyManager = {
        /**
         * Initialize sticky behavior
         */
        init() {
            this.setupScrollListener();
            this.checkStickyState();
        },

        /**
         * Setup scroll event listener with debouncing
         */
        setupScrollListener() {
            const debouncedScrollHandler = Utils.debounce(() => {
                this.handleScroll();
            }, EnhancedTOCConfig.timing.scrollDebounce);

            window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
        },

        /**
         * Handle scroll events
         */
        handleScroll() {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            EnhancedTOCState.lastScrollTop = currentScrollTop;

            this.checkStickyState();
        },

        /**
         * Check if TOC should be sticky based on main element position
         */
        checkStickyState() {
            if (!EnhancedTOCState.mainElement || !EnhancedTOCState.tocElement) {
                return;
            }

            const mainRect = EnhancedTOCState.mainElement.getBoundingClientRect();
            const shouldBeSticky = mainRect.top <= 0;

            if (shouldBeSticky !== EnhancedTOCState.isSticky) {
                this.toggleStickyState(shouldBeSticky);
            }
        },

        /**
         * Toggle sticky state
         */
        toggleStickyState(makeSticky) {
            EnhancedTOCState.isSticky = makeSticky;
            const tocElement = EnhancedTOCState.tocElement;
            const body = Utils.safeQuerySelector(EnhancedTOCConfig.selectors.body);

            if (makeSticky) {
                tocElement.classList.add(EnhancedTOCConfig.classes.tocSticky);
                tocElement.classList.add(EnhancedTOCConfig.classes.tocCollapsed);
                body?.classList.add(EnhancedTOCConfig.classes.bodyTocActive);

                // Position TOC below sticky header if it exists
                this.positionStickyTOC();
            } else {
                tocElement.classList.remove(EnhancedTOCConfig.classes.tocSticky);
                tocElement.classList.remove(EnhancedTOCConfig.classes.tocCollapsed);
                tocElement.classList.remove(EnhancedTOCConfig.classes.tocExpanded);
                body?.classList.remove(EnhancedTOCConfig.classes.bodyTocActive);
            }

            // Dispatch custom event
            const event = new CustomEvent('enhancedTOCStickyChange', {
                detail: { isSticky: makeSticky }
            });
            document.dispatchEvent(event);
        },

        /**
         * Position sticky TOC below header
         */
        positionStickyTOC() {
            const tocElement = EnhancedTOCState.tocElement;
            const stickyHeader = EnhancedTOCState.stickyHeader;

            if (stickyHeader) {
                const headerHeight = stickyHeader.offsetHeight;
                tocElement.style.top = `${headerHeight}px`;
            } else {
                tocElement.style.top = '0px';
            }
        }
    };

    /**
     * Hover and Expansion Management
     */
    const InteractionManager = {
        /**
         * Initialize interaction handlers
         */
        init() {
            this.setupHoverHandlers();
            this.setupClickHandlers();
            this.setupKeyboardHandlers();
        },

        /**
         * Setup hover event handlers
         */
        setupHoverHandlers() {
            const tocElement = EnhancedTOCState.tocElement;
            if (!tocElement) return;

            // Main TOC hover handlers
            tocElement.addEventListener('mouseenter', () => {
                this.handleTOCHover(true);
            });

            tocElement.addEventListener('mouseleave', () => {
                this.handleTOCHover(false);
            });

            // Sub-item hover handlers
            this.setupSubItemHoverHandlers();
        },

        /**
         * Setup sub-item hover handlers
         */
        setupSubItemHoverHandlers() {
            const tocElement = EnhancedTOCState.tocElement;
            const subItemContainers = tocElement.querySelectorAll('.' + EnhancedTOCConfig.classes.hasSubItems);

            subItemContainers.forEach(container => {
                container.addEventListener('mouseenter', () => {
                    this.handleSubItemHover(container, true);
                });

                container.addEventListener('mouseleave', () => {
                    this.handleSubItemHover(container, false);
                });
            });
        },

        /**
         * Handle main TOC hover
         */
        handleTOCHover(isHovering) {
            if (!EnhancedTOCState.isSticky) return;

            clearTimeout(EnhancedTOCState.hoverTimeout);

            if (isHovering) {
                EnhancedTOCState.hoverTimeout = setTimeout(() => {
                    this.expandTOC();
                }, EnhancedTOCConfig.timing.hoverDelay);
            } else {
                EnhancedTOCState.hoverTimeout = setTimeout(() => {
                    this.collapseTOC();
                }, EnhancedTOCConfig.timing.collapseDelay);
            }
        },

        /**
         * Handle sub-item hover
         */
        handleSubItemHover(container, isHovering) {
            if (!EnhancedTOCState.isSticky || !EnhancedTOCState.isExpanded) return;

            if (isHovering) {
                container.classList.add(EnhancedTOCConfig.classes.subItemsExpanded);
                this.updateScrollableArea();
            } else {
                setTimeout(() => {
                    container.classList.remove(EnhancedTOCConfig.classes.subItemsExpanded);
                    this.updateScrollableArea();
                }, EnhancedTOCConfig.timing.collapseDelay);
            }
        },

        /**
         * Expand TOC
         */
        expandTOC() {
            const tocElement = EnhancedTOCState.tocElement;

            tocElement.classList.remove(EnhancedTOCConfig.classes.tocCollapsed);
            tocElement.classList.add(EnhancedTOCConfig.classes.tocExpanded);

            EnhancedTOCState.isExpanded = true;
            this.updateScrollableArea();

            // Dispatch custom event
            const event = new CustomEvent('enhancedTOCExpanded');
            document.dispatchEvent(event);
        },

        /**
         * Collapse TOC
         */
        collapseTOC() {
            const tocElement = EnhancedTOCState.tocElement;

            tocElement.classList.remove(EnhancedTOCConfig.classes.tocExpanded);
            tocElement.classList.add(EnhancedTOCConfig.classes.tocCollapsed);

            // Collapse all sub-items
            const expandedSubItems = tocElement.querySelectorAll('.' + EnhancedTOCConfig.classes.subItemsExpanded);
            expandedSubItems.forEach(item => {
                item.classList.remove(EnhancedTOCConfig.classes.subItemsExpanded);
            });

            EnhancedTOCState.isExpanded = false;

            // Dispatch custom event
            const event = new CustomEvent('enhancedTOCCollapsed');
            document.dispatchEvent(event);
        },

        /**
         * Update scrollable area based on content height
         */
        updateScrollableArea() {
            const tocElement = EnhancedTOCState.tocElement;
            const scrollableContainer = tocElement.querySelector('.' + EnhancedTOCConfig.classes.tocScrollable);

            if (!scrollableContainer) return;

            // Calculate available height
            const viewportHeight = window.innerHeight;
            const tocRect = tocElement.getBoundingClientRect();
            const titleHeight = tocElement.querySelector('.' + EnhancedTOCConfig.classes.tocTitle)?.offsetHeight || 0;

            let maxHeight;
            if (window.innerWidth <= EnhancedTOCConfig.breakpoints.mobile) {
                maxHeight = EnhancedTOCConfig.maxHeight.mobile;
            } else if (window.innerWidth <= EnhancedTOCConfig.breakpoints.tablet) {
                maxHeight = EnhancedTOCConfig.maxHeight.tablet;
            } else {
                maxHeight = EnhancedTOCConfig.maxHeight.desktop;
            }

            // Convert percentage to pixels
            const maxHeightPx = (parseFloat(maxHeight) / 100) * viewportHeight;
            const availableHeight = Math.min(maxHeightPx, viewportHeight - tocRect.top - titleHeight - 20);

            scrollableContainer.style.maxHeight = `${availableHeight}px`;
        },

        /**
         * Setup click handlers for TOC links
         */
        setupClickHandlers() {
            const tocElement = EnhancedTOCState.tocElement;
            const tocLinks = tocElement.querySelectorAll('.' + EnhancedTOCConfig.classes.tocLink);

            tocLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    this.handleTOCLinkClick(e, link);
                });
            });
        },

        /**
         * Handle TOC link clicks
         */
        handleTOCLinkClick(event, link) {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            event.preventDefault();

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                this.scrollToElement(targetElement);
            }
        },

        /**
         * Smooth scroll to target element
         */
        scrollToElement(element) {
            const headerOffset = EnhancedTOCState.stickyHeader?.offsetHeight || 0;
            const tocOffset = EnhancedTOCState.isSticky ? 60 : 0; // Approximate TOC title height
            const totalOffset = headerOffset + tocOffset + 20; // Extra padding

            const elementPosition = Utils.getOffsetTop(element);
            const offsetPosition = elementPosition - totalOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        },

        /**
         * Setup keyboard navigation handlers
         */
        setupKeyboardHandlers() {
            const tocElement = EnhancedTOCState.tocElement;

            tocElement.addEventListener('keydown', (e) => {
                this.handleKeyboardNavigation(e);
            });
        },

        /**
         * Handle keyboard navigation
         */
        handleKeyboardNavigation(event) {
            const { key } = event;
            const focusedElement = document.activeElement;

            if (!focusedElement.classList.contains(EnhancedTOCConfig.classes.tocLink)) {
                return;
            }

            switch (key) {
                case 'ArrowDown':
                    event.preventDefault();
                    this.focusNextLink(focusedElement);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    this.focusPreviousLink(focusedElement);
                    break;
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    focusedElement.click();
                    break;
                case 'Escape':
                    if (EnhancedTOCState.isExpanded) {
                        this.collapseTOC();
                    }
                    break;
            }
        },

        /**
         * Focus next TOC link
         */
        focusNextLink(currentLink) {
            const allLinks = Array.from(EnhancedTOCState.tocElement.querySelectorAll('.' + EnhancedTOCConfig.classes.tocLink));
            const currentIndex = allLinks.indexOf(currentLink);
            const nextIndex = (currentIndex + 1) % allLinks.length;
            allLinks[nextIndex].focus();
        },

        /**
         * Focus previous TOC link
         */
        focusPreviousLink(currentLink) {
            const allLinks = Array.from(EnhancedTOCState.tocElement.querySelectorAll('.' + EnhancedTOCConfig.classes.tocLink));
            const currentIndex = allLinks.indexOf(currentLink);
            const prevIndex = currentIndex === 0 ? allLinks.length - 1 : currentIndex - 1;
            allLinks[prevIndex].focus();
        }
    };

    /**
     * Main Enhanced TOC Controller
     */
    const EnhancedTOC = {
        /**
         * Initialize the Enhanced TOC module
         */
        init() {
            try {
                if (EnhancedTOCState.initialized) {
                    Utils.logError('init', 'Enhanced TOC already initialized');
                    return false;
                }

                // Get required elements
                EnhancedTOCState.mainElement = Utils.safeQuerySelector(EnhancedTOCConfig.selectors.main);
                EnhancedTOCState.stickyHeader = Utils.safeQuerySelector(EnhancedTOCConfig.selectors.stickyHeader);

                if (!EnhancedTOCState.mainElement) {
                    Utils.logError('init', 'Main element not found - TOC requires a <main> element');
                    return false;
                }

                // Check for existing TOC or generate new one
                if (!TOCGenerator.detectExistingTOC()) {
                    const generatedTOC = TOCGenerator.generateFromHeadings();
                    if (!generatedTOC) {
                        Utils.logError('init', 'Failed to generate TOC from headings');
                        return false;
                    }

                    // Insert TOC after the main element or at the beginning of body
                    const insertionPoint = EnhancedTOCState.mainElement.parentNode;
                    insertionPoint.insertBefore(generatedTOC, EnhancedTOCState.mainElement);

                    EnhancedTOCState.tocElement = generatedTOC;
                    EnhancedTOCState.generatedTOC = generatedTOC;
                }

                // Enhance existing TOC with required classes
                this.enhanceExistingTOC();

                // Initialize managers
                StickyManager.init();
                InteractionManager.init();

                // Setup resize handler
                this.setupResizeHandler();

                EnhancedTOCState.initialized = true;

                // Dispatch initialization event
                const event = new CustomEvent('enhancedTOCInitialized', {
                    detail: {
                        hasExistingTOC: EnhancedTOCState.hasExistingTOC,
                        tocElement: EnhancedTOCState.tocElement
                    }
                });
                document.dispatchEvent(event);

                if (EnhancedTOCConfig.debug) {
                    console.log('[Enhanced TOC] Initialized successfully', {
                        hasExistingTOC: EnhancedTOCState.hasExistingTOC,
                        tocElement: EnhancedTOCState.tocElement
                    });
                }

                return true;

            } catch (error) {
                Utils.logError('init', 'Failed to initialize Enhanced TOC', error);
                return false;
            }
        },

        /**
         * Enhance existing TOC with required classes and structure
         */
        enhanceExistingTOC() {
            const tocElement = EnhancedTOCState.tocElement;
            if (!tocElement) return;

            // Add base classes
            tocElement.classList.add(EnhancedTOCConfig.classes.tocContainer);

            // Ensure proper structure
            let titleElement = tocElement.querySelector('h2, h3, .toc-title');
            if (!titleElement) {
                titleElement = document.createElement('h2');
                titleElement.textContent = 'Table of Contents';
                tocElement.insertBefore(titleElement, tocElement.firstChild);
            }
            titleElement.className = EnhancedTOCConfig.classes.tocTitle;

            // Wrap content if not already wrapped
            let contentElement = tocElement.querySelector('.' + EnhancedTOCConfig.classes.tocContent);
            if (!contentElement) {
                contentElement = document.createElement('div');
                contentElement.className = EnhancedTOCConfig.classes.tocContent;

                // Move all children except title to content wrapper
                const children = Array.from(tocElement.children);
                children.forEach(child => {
                    if (child !== titleElement) {
                        contentElement.appendChild(child);
                    }
                });

                tocElement.appendChild(contentElement);
            }

            // Enhance lists and links
            this.enhanceTOCElements(tocElement);
        },

        /**
         * Enhance TOC elements with proper classes
         */
        enhanceTOCElements(tocElement) {
            // Add scrollable class to main ul
            const mainList = tocElement.querySelector('ul');
            if (mainList) {
                mainList.classList.add(EnhancedTOCConfig.classes.tocScrollable);
            }

            // Enhance all list items
            const listItems = tocElement.querySelectorAll('li');
            listItems.forEach(item => {
                item.classList.add(EnhancedTOCConfig.classes.tocItem);

                // Check if item has sub-items
                const subList = item.querySelector('ul');
                if (subList) {
                    item.classList.add(EnhancedTOCConfig.classes.hasSubItems);
                    subList.classList.add(EnhancedTOCConfig.classes.tocSubItems);

                    // Mark sub-items
                    const subItems = subList.querySelectorAll('li');
                    subItems.forEach(subItem => {
                        subItem.classList.add(EnhancedTOCConfig.classes.tocSubItem);
                    });
                }
            });

            // Enhance all links
            const links = tocElement.querySelectorAll('a');
            links.forEach(link => {
                link.classList.add(EnhancedTOCConfig.classes.tocLink);
            });
        },

        /**
         * Setup window resize handler
         */
        setupResizeHandler() {
            const debouncedResizeHandler = Utils.debounce(() => {
                this.handleResize();
            }, 250);

            window.addEventListener('resize', debouncedResizeHandler);
        },

        /**
         * Handle window resize
         */
        handleResize() {
            if (EnhancedTOCState.isSticky) {
                StickyManager.positionStickyTOC();
            }

            if (EnhancedTOCState.isExpanded) {
                InteractionManager.updateScrollableArea();
            }
        },

        /**
         * Destroy the Enhanced TOC
         */
        destroy() {
            try {
                // Remove event listeners
                window.removeEventListener('scroll', StickyManager.handleScroll);
                window.removeEventListener('resize', this.handleResize);

                // Remove generated TOC if it was created
                if (EnhancedTOCState.generatedTOC && EnhancedTOCState.generatedTOC.parentNode) {
                    EnhancedTOCState.generatedTOC.parentNode.removeChild(EnhancedTOCState.generatedTOC);
                }

                // Reset state
                Object.keys(EnhancedTOCState).forEach(key => {
                    if (typeof EnhancedTOCState[key] === 'boolean') {
                        EnhancedTOCState[key] = false;
                    } else if (Array.isArray(EnhancedTOCState[key])) {
                        EnhancedTOCState[key] = [];
                    } else {
                        EnhancedTOCState[key] = null;
                    }
                });

                // Remove body classes
                const body = Utils.safeQuerySelector(EnhancedTOCConfig.selectors.body);
                body?.classList.remove(EnhancedTOCConfig.classes.bodyTocActive);

                // Dispatch destroy event
                const event = new CustomEvent('enhancedTOCDestroyed');
                document.dispatchEvent(event);

                if (EnhancedTOCConfig.debug) {
                    console.log('[Enhanced TOC] Destroyed successfully');
                }

                return true;

            } catch (error) {
                Utils.logError('destroy', 'Failed to destroy Enhanced TOC', error);
                return false;
            }
        },

        /**
         * Get current state
         */
        getState() {
            return { ...EnhancedTOCState };
        },

        /**
         * Get configuration
         */
        getConfig() {
            return { ...EnhancedTOCConfig };
        },

        /**
         * Update configuration
         */
        updateConfig(newConfig) {
            Object.assign(EnhancedTOCConfig, newConfig);
        }
    };

    /**
     * Auto-initialize when DOM is ready
     */
    function autoInit() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                EnhancedTOC.init();
            });
        } else {
            EnhancedTOC.init();
        }
    }

    /**
     * Public API
     */
    window.EnhancedTOC = {
        init: EnhancedTOC.init.bind(EnhancedTOC),
        destroy: EnhancedTOC.destroy.bind(EnhancedTOC),
        getState: EnhancedTOC.getState.bind(EnhancedTOC),
        getConfig: EnhancedTOC.getConfig.bind(EnhancedTOC),
        updateConfig: EnhancedTOC.updateConfig.bind(EnhancedTOC),
        expand: InteractionManager.expandTOC.bind(InteractionManager),
        collapse: InteractionManager.collapseTOC.bind(InteractionManager),
        version: '1.0.0'
    };

    // Auto-initialize
    autoInit();

})();
