<?php
/**
 * Header Customizer Settings for Unified Header
 *
 * This file adds customizer options for the unified header design
 * Include this in your theme's functions.php file
 *
 * @package MyTechToday
 */

// Prevent direct access
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Add customizer settings for unified header
 */
function unified_header_customize_register( $wp_customize ) {
    
    // Add Header Settings Section
    $wp_customize->add_section( 'unified_header_settings', array(
        'title'    => __( 'Unified Header Settings', 'mythechtoday' ),
        'priority' => 30,
    ) );

    // Header Location Setting
    $wp_customize->add_setting( 'header_location', array(
        'default'           => 'Barrington, IL 60010',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ) );

    $wp_customize->add_control( 'header_location', array(
        'label'    => __( 'Header Location', 'mythechtoday' ),
        'section'  => 'unified_header_settings',
        'type'     => 'text',
        'description' => __( 'Enter your business location to display in the header.', 'mythechtoday' ),
    ) );

    // Header Phone Setting
    $wp_customize->add_setting( 'header_phone', array(
        'default'           => '(847) 767-4914',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ) );

    $wp_customize->add_control( 'header_phone', array(
        'label'    => __( 'Header Phone Number', 'mythechtoday' ),
        'section'  => 'unified_header_settings',
        'type'     => 'text',
        'description' => __( 'Enter your phone number to display in the header.', 'mythechtoday' ),
    ) );

    // Header Email Setting
    $wp_customize->add_setting( 'header_email', array(
        'default'           => 'sales@mytech.today',
        'sanitize_callback' => 'sanitize_email',
        'transport'         => 'refresh',
    ) );

    $wp_customize->add_control( 'header_email', array(
        'label'    => __( 'Header Email Address', 'mythechtoday' ),
        'section'  => 'unified_header_settings',
        'type'     => 'email',
        'description' => __( 'Enter your email address to display in the header.', 'mythechtoday' ),
    ) );

    // Header CTA Text Setting
    $wp_customize->add_setting( 'header_cta_text', array(
        'default'           => 'Start Your AI‑First Project Today',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ) );

    $wp_customize->add_control( 'header_cta_text', array(
        'label'    => __( 'Header CTA Button Text', 'mythechtoday' ),
        'section'  => 'unified_header_settings',
        'type'     => 'text',
        'description' => __( 'Enter the text for your call-to-action button.', 'mythechtoday' ),
    ) );

    // Header CTA URL Setting
    $wp_customize->add_setting( 'header_cta_url', array(
        'default'           => 'mailto:sales@mytech.today?subject=Project%20Inquiry',
        'sanitize_callback' => 'esc_url_raw',
        'transport'         => 'refresh',
    ) );

    $wp_customize->add_control( 'header_cta_url', array(
        'label'    => __( 'Header CTA Button URL', 'mythechtoday' ),
        'section'  => 'unified_header_settings',
        'type'     => 'url',
        'description' => __( 'Enter the URL for your call-to-action button.', 'mythechtoday' ),
    ) );

    // Header CTA New Tab Setting
    $wp_customize->add_setting( 'header_cta_new_tab', array(
        'default'           => false,
        'sanitize_callback' => 'wp_validate_boolean',
        'transport'         => 'refresh',
    ) );

    $wp_customize->add_control( 'header_cta_new_tab', array(
        'label'    => __( 'Open CTA Button in New Tab', 'mythechtoday' ),
        'section'  => 'unified_header_settings',
        'type'     => 'checkbox',
        'description' => __( 'Check this to open the CTA button link in a new tab.', 'mythechtoday' ),
    ) );

    // Header Colors Section
    $wp_customize->add_section( 'unified_header_colors', array(
        'title'    => __( 'Unified Header Colors', 'mythechtoday' ),
        'priority' => 31,
    ) );

    // Primary Color Setting
    $wp_customize->add_setting( 'header_primary_color', array(
        'default'           => '#557ea1',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'refresh',
    ) );

    $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'header_primary_color', array(
        'label'    => __( 'Primary Header Color', 'mythechtoday' ),
        'section'  => 'unified_header_colors',
        'description' => __( 'Choose the primary color for your header background.', 'mythechtoday' ),
    ) ) );

    // Secondary Color Setting
    $wp_customize->add_setting( 'header_secondary_color', array(
        'default'           => '#10a37f',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'refresh',
    ) );

    $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'header_secondary_color', array(
        'label'    => __( 'Secondary Header Color', 'mythechtoday' ),
        'section'  => 'unified_header_colors',
        'description' => __( 'Choose the secondary color for your tri-lateral gradient.', 'mythechtoday' ),
    ) ) );

    // Tertiary Color Setting
    $wp_customize->add_setting( 'header_tertiary_color', array(
        'default'           => '#8b5a3c',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'refresh',
    ) );

    $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'header_tertiary_color', array(
        'label'    => __( 'Tertiary Header Color', 'mythechtoday' ),
        'section'  => 'unified_header_colors',
        'description' => __( 'Choose the tertiary color for your tri-lateral gradient (warm accent).', 'mythechtoday' ),
    ) ) );
}
add_action( 'customize_register', 'unified_header_customize_register' );

/**
 * Output custom CSS for header colors (Updated for tri-lateral gradient)
 */
function unified_header_custom_css() {
    $primary_color = get_theme_mod( 'header_primary_color', '#557ea1' );
    $secondary_color = get_theme_mod( 'header_secondary_color', '#10a37f' );
    $tertiary_color = get_theme_mod( 'header_tertiary_color', '#8b5a3c' );

    if ( $primary_color !== '#557ea1' || $secondary_color !== '#10a37f' || $tertiary_color !== '#8b5a3c' ) {
        ?>
        <style type="text/css">
        :root {
            --primary-color: <?php echo esc_attr( $primary_color ); ?> !important;
            --secondary-color: <?php echo esc_attr( $secondary_color ); ?> !important;
            --tertiary-color: <?php echo esc_attr( $tertiary_color ); ?> !important;
        }
        </style>
        <?php
    }
}
add_action( 'wp_head', 'unified_header_custom_css' );

/**
 * Register navigation menus
 */
function unified_header_register_menus() {
    register_nav_menus( array(
        'primary' => __( 'Primary Menu', 'mythechtoday' ),
        'social'  => __( 'Social Links Menu', 'mythechtoday' ),
    ) );
}
add_action( 'after_setup_theme', 'unified_header_register_menus' );

/**
 * Add theme support for custom logo
 */
function unified_header_theme_support() {
    add_theme_support( 'custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ) );
    
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'unified_header_theme_support' );

/**
 * Enqueue scripts and styles
 */
function unified_header_scripts() {
    // Add any additional scripts or styles here if needed
    wp_enqueue_style( 'unified-header-style', get_template_directory_uri() . '/style.css' );
}
add_action( 'wp_enqueue_scripts', 'unified_header_scripts' );

/**
 * Add body classes for header styling
 */
function unified_header_body_classes( $classes ) {
    $classes[] = 'unified-header-active';
    return $classes;
}
add_filter( 'body_class', 'unified_header_body_classes' );
