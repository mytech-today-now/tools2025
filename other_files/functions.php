<?php
/**
 * Child Theme Functions
 * Includes myTech.Today Unified Header functionality
 */

// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;

// BEGIN ENQUEUE PARENT ACTION
// AUTO GENERATED - Do not modify or remove comment markers above or below:

if ( !function_exists( 'chld_thm_cfg_locale_css' ) ):
    function chld_thm_cfg_locale_css( $uri ){
        if ( empty( $uri ) && is_rtl() && file_exists( get_template_directory() . '/rtl.css' ) )
            $uri = get_template_directory_uri() . '/rtl.css';
        return $uri;
    }
endif;
add_filter( 'locale_stylesheet_uri', 'chld_thm_cfg_locale_css' );

if ( !function_exists( 'chld_thm_cfg_add_parent_dep' ) ):
function chld_thm_cfg_add_parent_dep() {
    global $wp_styles;
    array_unshift( $wp_styles->registered[ 'thinkup-style' ]->deps, 'thinkup-responsive' );
}
endif;
add_action( 'wp_head', 'chld_thm_cfg_add_parent_dep', 2 );

defined( 'CHLD_THM_CFG_IGNORE_PARENT' ) or define( 'CHLD_THM_CFG_IGNORE_PARENT', TRUE );

// END ENQUEUE PARENT ACTION

// =============================================================================
// myTech.Today Unified Header Functionality
// =============================================================================

// Enqueue styles for the unified header (Updated 2025 - Child Theme Compatible)
function mytech_enqueue_unified_header_assets() {
    // Enqueue the child theme stylesheet (includes unified header CSS)
    wp_enqueue_style(
        'mytech-child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array(),
        wp_get_theme()->get('Version')
    );

    // Enqueue jQuery (required by some modules)
    wp_enqueue_script('jquery');

    // JavaScript files are now loaded via Simple Custom CSS and JS PRO
    // Current JS modules (Updated 2025):
    // - utilities.js: Common utilities and error handling
    // - sticky-header.js: Transparent sticky header with blur effect
    // - table-of-contents.js: TOC functionality with nested list support
    // - gradient-controller.js: Tri-lateral page background gradient controller
    // - anchors.js: Anchor link handling and smooth scrolling
    // - dust.js: Subtle floating dust particle effect using Three.js GPU particles
    // - main.js: Application coordinator and module initializer
    // - Custom JS ID 11946: Additional WordPress-specific functionality
    // This provides better control, caching, and performance optimization
}
add_action('wp_enqueue_scripts', 'mytech_enqueue_unified_header_assets');

// Register navigation menus
function mytech_register_nav_menus() {
    register_nav_menus(array(
        'header-menu' => __('Header Menu', 'mytech'),
        'primary' => __('Primary Menu', 'mytech'),
    ));
}
add_action('after_setup_theme', 'mytech_register_nav_menus');

// Add theme support for various WordPress features
function mytech_theme_setup() {
    // Add theme support for title tag
    add_theme_support('title-tag');

    // Add theme support for custom logo
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ));

    // Add theme support for HTML5 markup
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
}
add_action('after_setup_theme', 'mytech_theme_setup');

// Customizer settings for the unified header
function mytech_customize_register($wp_customize) {
    // Add a section for myTech.Today header settings
    $wp_customize->add_section('mytech_header_settings', array(
        'title'    => __('myTech.Today Header Settings', 'mytech'),
        'priority' => 30,
    ));

    // Location setting (matches header template: header_location)
    $wp_customize->add_setting('header_location', array(
        'default'           => 'Barrington, IL 60010',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('header_location', array(
        'label'   => __('Business Location', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'text',
    ));

    // Phone number setting (matches header template: header_phone)
    $wp_customize->add_setting('header_phone', array(
        'default'           => '(847) 767-4914',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('header_phone', array(
        'label'   => __('Phone Number', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'text',
    ));

    // Email setting (matches header template: header_email)
    $wp_customize->add_setting('header_email', array(
        'default'           => 'sales@mytech.today',
        'sanitize_callback' => 'sanitize_email',
    ));
    $wp_customize->add_control('header_email', array(
        'label'   => __('Contact Email', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'email',
    ));

    // CTA button text setting (matches header template: header_cta_text)
    $wp_customize->add_setting('header_cta_text', array(
        'default'           => 'Start Your AI‑First Project Today',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('header_cta_text', array(
        'label'   => __('CTA Button Text', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'text',
    ));

    // CTA button URL setting (matches header template: header_cta_url)
    $wp_customize->add_setting('header_cta_url', array(
        'default'           => 'mailto:sales@mytech.today?subject=MCP%20Inquiry',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('header_cta_url', array(
        'label'   => __('CTA Button URL', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'url',
    ));

    // CTA button new tab setting (matches header template: header_cta_new_tab)
    $wp_customize->add_setting('header_cta_new_tab', array(
        'default'           => false,
        'sanitize_callback' => 'wp_validate_boolean',
    ));
    $wp_customize->add_control('header_cta_new_tab', array(
        'label'   => __('Open CTA Button in New Tab', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'checkbox',
    ));

    // GitHub URL setting
    $wp_customize->add_setting('mytech_github_url', array(
        'default'           => 'https://github.com/mytech-today-now',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('mytech_github_url', array(
        'label'   => __('GitHub URL', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'url',
    ));

    // LinkedIn URL setting
    $wp_customize->add_setting('mytech_linkedin_url', array(
        'default'           => 'https://www.linkedin.com/in/kylerode/',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('mytech_linkedin_url', array(
        'label'   => __('LinkedIn URL', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'url',
    ));

    // Yesterday page URL setting
    $wp_customize->add_setting('mytech_yesterday_url', array(
        'default'           => home_url('/yesterday/'),
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('mytech_yesterday_url', array(
        'label'   => __('Yesterday Page URL', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'url',
    ));
}
add_action('customize_register', 'mytech_customize_register');

// Custom social media icons function to replace parent theme function
function mytech_social_media_icons() {
    $github_url = get_theme_mod('mytech_github_url', 'https://github.com/mytech-today-now');
    $linkedin_url = get_theme_mod('mytech_linkedin_url', 'https://www.linkedin.com/in/kylerode/');

    echo '<div class="header-contact-social-wrapper">';

    // Email contact icon
    echo '<a href="mailto:sales@mytech.today?subject=I%20have%20a%20question..." target="_blank" class="social-icon email" title="Email Us">';
    echo '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">';
    echo '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>';
    echo '</svg>';
    echo '</a>';

    // Phone contact icon (only show tel: link on mobile)
    echo '<a href="tel:+18477674914" class="social-icon phone mobile-only" title="Call Us">';
    echo '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">';
    echo '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>';
    echo '</svg>';
    echo '</a>';

    // Phone number display (desktop only)
    echo '<span class="phone-display desktop-only">(847) 767-4914</span>';

    if ($github_url || $linkedin_url) {
        echo '<div class="social-media-icons">';

        if ($github_url) {
            echo '<a href="' . esc_url($github_url) . '" target="_blank" rel="noopener noreferrer" class="social-icon github" title="GitHub">';
            echo '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">';
            echo '<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>';
            echo '</svg>';
            echo '</a>';
        }

        if ($linkedin_url) {
            echo '<a href="' . esc_url($linkedin_url) . '" target="_blank" rel="noopener noreferrer" class="social-icon linkedin" title="LinkedIn">';
            echo '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">';
            echo '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>';
            echo '</svg>';
            echo '</a>';
        }

        echo '</div>';
    }

    echo '</div>';
}

// Add body class for unified header styling
function mytech_body_classes($classes) {
    $classes[] = 'has-unified-header';
    return $classes;
}
add_filter('body_class', 'mytech_body_classes');

// Optional: Add admin notice for setup instructions
function mytech_admin_notice() {
    if (current_user_can('manage_options')) {
        $screen = get_current_screen();
        if ($screen->id === 'themes') {
            echo '<div class="notice notice-info is-dismissible">';
            echo '<p><strong>myTech.Today Unified Header:</strong> Child theme ready! Features include:</p>';
            echo '<ul style="margin-left: 20px;">';
            echo '<li>✅ Unified blur header with sticky functionality</li>';
            echo '<li>✅ Blog post styling with blur backgrounds (class: blog-posts)</li>';
            echo '<li>✅ Modular JavaScript architecture</li>';
            echo '<li>✅ CSS root variables for blur effects</li>';
            echo '<li>✅ WordPress customizer integration</li>';
            echo '</ul>';
            echo '<p>Customize settings in the <a href="' . admin_url('customize.php') . '">Customizer</a>.</p>';
            echo '</div>';
        }
    }
}
add_action('admin_notices', 'mytech_admin_notice');