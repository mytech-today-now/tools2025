/**
 * Unified Header JavaScript
 * 
 * Handles interactive behavior for the unified header
 * 
 * @package MyTechToday
 */

(function($) {
    'use strict';

    /**
     * Initialize header functionality when document is ready
     */
    $(document).ready(function() {
        initializeUnifiedHeader();
        handleMobileMenu();
        handleScrollBehavior();
    });

    /**
     * Initialize unified header
     */
    function initializeUnifiedHeader() {
        // Add any initialization code here
        console.log('Unified Header initialized');
        
        // Ensure header is visible
        $('#unified-header').addClass('header-loaded');
    }

    /**
     * Handle mobile menu functionality
     */
    function handleMobileMenu() {
        // Create mobile menu toggle if it doesn't exist
        if ($('.mobile-menu-toggle').length === 0 && $('.nav-section .nav-links').length > 0) {
            $('.nav-section').prepend('<button class="mobile-menu-toggle" aria-label="Toggle mobile menu">☰</button>');
        }

        // Toggle mobile menu
        $(document).on('click', '.mobile-menu-toggle', function(e) {
            e.preventDefault();
            
            var $navLinks = $('.nav-section .nav-links');
            var $toggle = $(this);
            
            $navLinks.toggleClass('mobile-menu-open');
            $toggle.toggleClass('menu-open');
            
            // Update aria-expanded attribute
            var isExpanded = $navLinks.hasClass('mobile-menu-open');
            $toggle.attr('aria-expanded', isExpanded);
            
            // Change toggle icon
            $toggle.text(isExpanded ? '✕' : '☰');
        });

        // Close mobile menu when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.nav-section').length) {
                $('.nav-section .nav-links').removeClass('mobile-menu-open');
                $('.mobile-menu-toggle').removeClass('menu-open').attr('aria-expanded', 'false').text('☰');
            }
        });

        // Close mobile menu when window is resized to desktop
        $(window).on('resize', function() {
            if ($(window).width() > 768) {
                $('.nav-section .nav-links').removeClass('mobile-menu-open');
                $('.mobile-menu-toggle').removeClass('menu-open').attr('aria-expanded', 'false').text('☰');
            }
        });
    }

    /**
     * Handle scroll behavior for header
     */
    function handleScrollBehavior() {
        var $header = $('#unified-header');
        var lastScrollTop = 0;
        var scrollThreshold = 100;

        $(window).on('scroll', function() {
            var scrollTop = $(this).scrollTop();
            
            // Add/remove scrolled class based on scroll position
            if (scrollTop > scrollThreshold) {
                $header.addClass('header-scrolled');
            } else {
                $header.removeClass('header-scrolled');
            }

            // Optional: Hide/show header on scroll direction
            // Uncomment the following code if you want the header to hide when scrolling down
            /*
            if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                // Scrolling down
                $header.addClass('header-hidden');
            } else {
                // Scrolling up
                $header.removeClass('header-hidden');
            }
            */

            lastScrollTop = scrollTop;
        });
    }

    /**
     * Handle smooth scrolling for anchor links
     */
    function handleSmoothScrolling() {
        $('a[href^="#"]').on('click', function(e) {
            var target = $(this.getAttribute('href'));
            
            if (target.length) {
                e.preventDefault();
                
                var headerHeight = $('#unified-header').outerHeight();
                var targetOffset = target.offset().top - headerHeight - 20;
                
                $('html, body').animate({
                    scrollTop: targetOffset
                }, 600, 'swing');
            }
        });
    }

    /**
     * Mobile menu styles are now consolidated in style.css
     * This function is no longer needed but kept for compatibility
     */
    function addMobileMenuStyles() {
        // Styles are now in the main stylesheet (style.css)
        // No dynamic CSS injection needed
        console.log('Mobile menu styles loaded from style.css');
    }

    // Initialize mobile menu styles (compatibility)
    addMobileMenuStyles();

    // Initialize smooth scrolling
    handleSmoothScrolling();

})(jQuery);
