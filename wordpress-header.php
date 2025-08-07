<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up until id="main-core".
 *
 * @package MyTechToday
 */
?><!DOCTYPE html>

<html <?php language_attributes(); ?>>
<head>
<?php thinkup_hook_header(); ?>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width" />
<link rel="profile" href="//gmpg.org/xfn/11" />
<link rel="pingback" href="<?php esc_url( bloginfo( 'pingback_url' ) ); ?>" />



<!--
    JavaScript Files are now managed via Simple Custom CSS and JS PRO
    This provides better control, caching, and performance optimization
    Load order: utilities.js → sticky-header.js → table-of-contents.js → gradient-controller.js → main.js
-->

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?><?php thinkup_bodystyle(); ?>>
<?php /* Body hook */ thinkup_hook_bodyhtml(); ?>
<?php /* Notification Bar */ thinkup_input_notification(); ?>
<?php /* Header Image */ thinkup_input_headerimage(); ?>
<div id="body-core" class="hfeed site">

	<!-- Unified Header Banner -->
	<div id="unified-header">
	  <div class="unified-header-container">
	    <!-- Main Header Row -->
	    <div class="header-main-row">
	      <div class="brand-section">
	        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-name">
	          <?php bloginfo( 'name' ); ?>
	        </a>
	        <?php
	        $description = get_bloginfo( 'description', 'display' );
	        if ( $description || is_customize_preview() ) : ?>
	          <span class="site-tagline"><?php echo $description; ?></span>
	        <?php endif; ?>
	      </div>

	      <div class="nav-section">
	        <?php /* Custom Social Media Icons */ mytech_social_media_icons(); ?>

	        <?php if ( has_nav_menu( 'primary' ) ) : ?>
	          <?php wp_nav_menu( array(
	            'theme_location' => 'primary',
	            'container' => false,
	            'menu_class' => 'nav-links',
	            'fallback_cb' => false,
	            'depth' => 1
	          ) ); ?>
	        <?php endif; ?>
	      </div>
	    </div>

	    <!-- Secondary Info Row -->
	    <div class="header-info-row">
	      <div class="location-info">
	        <span class="icon">📌</span>
	        <span class="text"><?php echo get_theme_mod( 'header_location', 'Your Location' ); ?></span>
	      </div>

	      <div class="contact-section">
	        <?php if ( get_theme_mod( 'header_phone' ) ) : ?>
	          <a href="tel:<?php echo esc_attr( str_replace( array( ' ', '-', '(', ')' ), '', get_theme_mod( 'header_phone' ) ) ); ?>" class="contact-link phone">
	            <span class="icon">📞</span>
	            <span class="text"><?php echo esc_html( get_theme_mod( 'header_phone' ) ); ?></span>
	          </a>
	        <?php endif; ?>

	        <?php if ( get_theme_mod( 'header_email' ) ) : ?>
	          <a href="mailto:<?php echo esc_attr( get_theme_mod( 'header_email' ) ); ?>" class="contact-link email">
	            <span class="icon">📧</span>
	            <span class="text"><?php echo esc_html( get_theme_mod( 'header_email' ) ); ?></span>
	          </a>
	        <?php endif; ?>
	      </div>

	      <div class="cta-info">
	        <?php if ( get_theme_mod( 'header_cta_text' ) && get_theme_mod( 'header_cta_url' ) ) : ?>
	          <a href="<?php echo esc_url( get_theme_mod( 'header_cta_url' ) ); ?>" class="cta-button" <?php echo get_theme_mod( 'header_cta_new_tab' ) ? 'target="_blank"' : ''; ?>>
	            <?php echo esc_html( get_theme_mod( 'header_cta_text' ) ); ?>
	          </a>
	        <?php endif; ?>
	      </div>
	    </div>
	  </div>
	</div>

	<header>
	<div id="site-header">

		<?php if ( get_header_image() ) : ?>
			<div class="custom-header"><img src="<?php header_image(); ?>" width="<?php echo esc_attr( get_custom_header()->width ); ?>" height="<?php echo esc_attr( get_custom_header()->height ); ?>" alt=""></div>
		<?php endif; // End header image check. ?>

		<?php /* Add header - above slider */ thinkup_input_headerlocationabove(); ?>

		<?php /* Add responsive header menu */ thinkup_input_responsivehtml2_above(); ?>

		<?php /* Custom Slider */ thinkup_input_sliderhome(); ?>

		<?php /* Custom Intro - Above */ thinkup_custom_introabove(); ?>

		<?php /* Custom Slider */ thinkup_input_sliderpage(); ?>

		<?php /* Add header - above slider */ thinkup_input_headerlocationbelow(); ?>

		<?php /* Add responsive header menu */ thinkup_input_responsivehtml2_below(); ?>

		<?php /* Custom Intro - Below */ thinkup_custom_introbelow(); ?>

	</div>

	</header>
	<!-- header -->

	<!-- Initialize refactored modules for WordPress -->
	<script>
	// WordPress-specific module initialization
	document.addEventListener('DOMContentLoaded', function() {
	    // Enable debug mode if WordPress debug is enabled or URL parameter is present
	    <?php if (defined('WP_DEBUG') && WP_DEBUG): ?>
	    if (window.GradientController) {
	        window.GradientController.debug.enable();
	        console.log('[WordPress] Debug mode enabled for gradient controller');
	    }
	    <?php endif; ?>

	    if (window.location.search.includes('debug=gradient') || window.location.search.includes('debug=all')) {
	        if (window.GradientController) {
	            window.GradientController.debug.enable();
	            console.log('[WordPress] Gradient debug mode enabled via URL parameter');
	        }
	    }

	    // Log successful module initialization
	    document.addEventListener('appReady', function(event) {
	        console.log('[WordPress] All modules initialized successfully:', event.detail);
	    });

	    // Handle gradient updates for WordPress-specific functionality
	    document.addEventListener('gradientUpdate', function(event) {
	        // WordPress-specific gradient update handling can be added here
	        // Example: Update admin bar styling based on gradient progress
	    });

	    // Handle header state changes for WordPress
	    document.addEventListener('headerStickyChange', function(event) {
	        // WordPress-specific header state handling
	        // Example: Adjust admin bar positioning when header becomes sticky
	        if (event.detail.isSticky) {
	            document.body.classList.add('header-is-sticky');
	        } else {
	            document.body.classList.remove('header-is-sticky');
	        }
	    });

	    // Handle TOC state changes for WordPress
	    document.addEventListener('tocToggle', function(event) {
	        // WordPress-specific TOC handling
	        // Example: Analytics tracking for TOC usage
	    });
	});

	// Fallback initialization for WordPress
	setTimeout(function() {
	    if (window.MainApp && !window.MainApp.isReady()) {
	        console.log('[WordPress] Fallback initialization triggered');
	        window.MainApp.init().catch(function(error) {
	            console.error('[WordPress] Fallback initialization failed:', error);
	        });
	    }
	}, 2000);
	</script>

	<?php /*  Call To Action - Intro */ thinkup_input_ctaintro(); ?>
	<?php /*  Pre-Designed HomePage Content */ thinkup_input_homepagesection(); ?>

	<div id="content">
	<div id="content-core">

		<div id="main">
		<div id="main-core">
