/**
 * Anchors.js - Adds hover hyperlink icons to elements with id attributes
 * Provides fully qualified URLs that are copied to clipboard when clicked
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        // Icon to display (using Unicode link symbol)
        icon: '🔗',
        // Alternative: use SVG icon
        // icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"/></svg>',
        
        // CSS classes
        anchorClass: 'anchor-link',
        iconClass: 'anchor-icon',
        
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
        icon.innerHTML = config.icon;
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
        if (shouldExcludeElement(element)) {
            return;
        }

        const id = element.getAttribute('id');
        if (!id) {
            return;
        }

        // Skip if anchor already exists
        if (element.querySelector('.' + config.iconClass)) {
            return;
        }

        // Create wrapper if needed
        if (element.style.position !== 'relative') {
            element.style.position = 'relative';
        }

        // Create and insert anchor icon
        const anchorIcon = createAnchorIcon(id);
        
        // Position the icon to the left of the element
        anchorIcon.style.cssText = `
            position: absolute;
            left: -25px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
            transition: opacity 0.2s ease;
            text-decoration: none;
            color: #666;
            font-size: 16px;
            line-height: 1;
            cursor: pointer;
        `;

        // Add hover effects
        element.addEventListener('mouseenter', function() {
            anchorIcon.style.opacity = '1';
        });

        element.addEventListener('mouseleave', function() {
            anchorIcon.style.opacity = '0';
        });

        // Insert the icon
        element.appendChild(anchorIcon);
        
        // Add class to mark as processed
        element.classList.add(config.anchorClass);
    }

    /**
     * Initialize anchors for all eligible elements
     */
    function initializeAnchors() {
        const elements = document.querySelectorAll(config.selector);
        elements.forEach(addAnchorToElement);
    }

    /**
     * Initialize when DOM is ready
     */
    function init() {
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
        init: initializeAnchors,
        addToElement: addAnchorToElement,
        config: config
    };

})();
