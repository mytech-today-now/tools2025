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
