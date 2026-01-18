<?php
/**
 * WordPress Functions.php Additions for myTech.Today Unified Header
 * Add this code to your theme's functions.php file
 */

// Enqueue styles and scripts for the unified header (Updated 2025 - Modular)
function mytech_enqueue_unified_header_assets() {
    // Enqueue the unified header CSS
    wp_enqueue_style(
        'mytech-unified-header',
        get_template_directory_uri() . '/css/unified-header.css',
        array(),
        wp_get_theme()->get('Version')
    );

    // Enqueue jQuery (required by some modules)
    wp_enqueue_script('jquery');

    // Enqueue refactored modular JavaScript files
    // Note: These are loaded in the header template with defer attribute for optimal loading
    // If you prefer to enqueue them here instead, uncomment the following lines:

    /*
    wp_enqueue_script(
        'mytech-utilities',
        get_template_directory_uri() . '/js/utilities.js',
        array(),
        wp_get_theme()->get('Version'),
        true // Load in footer
    );

    wp_enqueue_script(
        'mytech-sticky-header',
        get_template_directory_uri() . '/js/sticky-header.js',
        array('mytech-utilities'),
        wp_get_theme()->get('Version'),
        true
    );

    wp_enqueue_script(
        'mytech-table-of-contents',
        get_template_directory_uri() . '/js/table-of-contents.js',
        array('mytech-utilities'),
        wp_get_theme()->get('Version'),
        true
    );

    wp_enqueue_script(
        'mytech-gradient-controller',
        get_template_directory_uri() . '/js/gradient-controller.js',
        array('mytech-utilities'),
        wp_get_theme()->get('Version'),
        true
    );

    wp_enqueue_script(
        'mytech-main-app',
        get_template_directory_uri() . '/js/main.js',
        array('mytech-utilities', 'mytech-sticky-header', 'mytech-table-of-contents', 'mytech-gradient-controller'),
        wp_get_theme()->get('Version'),
        true
    );
    */
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

    // Location setting
    $wp_customize->add_setting('mytech_location', array(
        'default'           => 'Barrington, IL 60010',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('mytech_location', array(
        'label'   => __('Business Location', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'text',
    ));

    // Phone number setting
    $wp_customize->add_setting('mytech_phone', array(
        'default'           => '(847) 767-4914',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('mytech_phone', array(
        'label'   => __('Phone Number (Display)', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'text',
    ));

    // Phone link setting
    $wp_customize->add_setting('mytech_phone_link', array(
        'default'           => '+18477674914',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('mytech_phone_link', array(
        'label'   => __('Phone Number (Link Format)', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'text',
    ));

    // Email setting
    $wp_customize->add_setting('mytech_email', array(
        'default'           => 'sales@mytech.today',
        'sanitize_callback' => 'sanitize_email',
    ));
    $wp_customize->add_control('mytech_email', array(
        'label'   => __('Contact Email', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'email',
    ));

    // Email subject setting
    $wp_customize->add_setting('mytech_email_subject', array(
        'default'           => 'MCP Inquiry',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('mytech_email_subject', array(
        'label'   => __('Email Subject', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'text',
    ));

    // CTA button text setting
    $wp_customize->add_setting('mytech_cta_text', array(
        'default'           => 'Start Your AI‑First Project Today',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('mytech_cta_text', array(
        'label'   => __('CTA Button Text', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'text',
    ));

    // CTA button link setting
    $wp_customize->add_setting('mytech_cta_link', array(
        'default'           => 'mailto:sales@mytech.today?subject=MCP%20Inquiry',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('mytech_cta_link', array(
        'label'   => __('CTA Button Link', 'mytech'),
        'section' => 'mytech_header_settings',
        'type'    => 'url',
    ));
}
add_action('customize_register', 'mytech_customize_register');

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
            echo '<p><strong>myTech.Today Unified Header:</strong> Don\'t forget to create the CSS file at <code>/css/unified-header.css</code> and customize your header settings in the <a href="' . admin_url('customize.php') . '">Customizer</a>.</p>';
            echo '</div>';
        }
    }
}
add_action('admin_notices', 'mytech_admin_notice');
