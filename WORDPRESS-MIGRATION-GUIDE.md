# WordPress Migration Guide - Refactored Modules (2025)

This document outlines the migration of WordPress files to use the new refactored JavaScript modules with tri-lateral gradient support.

## Summary of Changes

The WordPress integration has been updated to use the new modular JavaScript architecture instead of the monolithic approach.

### Files Updated

1. **`wordpress-header.php`** - Updated to load modular JavaScript files
2. **`header-customizer.php`** - Added tertiary color support for tri-lateral gradient
3. **`wordpress-functions-additions.php`** - Updated with modular JavaScript enqueuing options
4. **`wordpress-integration-instructions.md`** - Updated with new file structure

### Key Changes Made

#### 1. JavaScript Architecture Change

**Before:**
```html
<script>
// Include the unified header JavaScript inline to ensure it loads
<?php include get_template_directory() . '/unified-header.js'; ?>
</script>
```

**After:**
```html
<!-- Refactored Modular JavaScript Files (Updated 2025) -->
<script src="<?php echo get_template_directory_uri(); ?>/js/utilities.js" defer></script>
<script src="<?php echo get_template_directory_uri(); ?>/js/sticky-header.js" defer></script>
<script src="<?php echo get_template_directory_uri(); ?>/js/table-of-contents.js" defer></script>
<script src="<?php echo get_template_directory_uri(); ?>/js/gradient-controller.js" defer></script>
<script src="<?php echo get_template_directory_uri(); ?>/js/main.js" defer></script>
```

#### 2. Tri-Lateral Gradient Support

**New Tertiary Color Added:**
- Primary: Blue (#557ea1) - Cool professional tone
- Secondary: Teal (#10a37f) - Fresh accent color  
- **Tertiary: Warm Brown (#8b5a3c) - Complementary warm contrast** *(NEW)*

**WordPress Customizer Integration:**
```php
// Tertiary Color Setting
$wp_customize->add_setting( 'header_tertiary_color', array(
    'default'           => '#8b5a3c',
    'sanitize_callback' => 'sanitize_hex_color',
    'transport'         => 'refresh',
) );
```

#### 3. Enhanced Initialization Script

Added WordPress-specific initialization with:
- Debug mode integration with `WP_DEBUG`
- WordPress-specific event handling
- Admin bar compatibility
- Fallback initialization

```php
// WordPress-specific module initialization
document.addEventListener('DOMContentLoaded', function() {
    <?php if (defined('WP_DEBUG') && WP_DEBUG): ?>
    if (window.GradientController) {
        window.GradientController.debug.enable();
    }
    <?php endif; ?>
    
    // Handle header state changes for WordPress
    document.addEventListener('headerStickyChange', function(event) {
        if (event.detail.isSticky) {
            document.body.classList.add('header-is-sticky');
        } else {
            document.body.classList.remove('header-is-sticky');
        }
    });
});
```

## File Structure Requirements

### JavaScript Files Location
Create the following directory structure in your WordPress theme:

```
/wp-content/themes/your-theme-name/
├── js/
│   ├── utilities.js
│   ├── sticky-header.js
│   ├── table-of-contents.js
│   ├── gradient-controller.js
│   └── main.js
├── css/
│   └── style.css (updated with tri-lateral gradient)
├── wordpress-header.php
├── header-customizer.php
└── functions.php (with additions from wordpress-functions-additions.php)
```

## WordPress Customizer Updates

### New Color Options Available

Navigate to **Appearance > Customize > Unified Header Colors** to configure:

- **Primary Header Color**: Main header background color (default: #557ea1)
- **Secondary Header Color**: Secondary color for tri-lateral gradient (default: #10a37f)
- **Tertiary Header Color**: Tertiary color for tri-lateral gradient (default: #8b5a3c) *(NEW)*

### CSS Output

The customizer now outputs all three colors:

```css
:root {
    --primary-color: #557ea1 !important;
    --secondary-color: #10a37f !important;
    --tertiary-color: #8b5a3c !important;
}
```

## Features Added

### 1. Transparent Sticky Header
- Pure backdrop blur effect (no background color)
- Glassmorphism design
- Auto-hide/show based on scroll direction
- WordPress admin bar compatibility

### 2. Tri-Lateral Page Background
- Dynamic gradient using three complementary colors
- Gets darker and more contrasted as user scrolls
- Combines linear and radial gradients for depth
- Automatically extracts colors from WordPress customizer

### 3. Enhanced Table of Contents
- Nested list support with hover/focus expansion
- Touch-optimized for mobile devices
- Full accessibility compliance (ARIA attributes)
- Independent from header functionality

### 4. WordPress Integration Features
- Debug mode integration with `WP_DEBUG` constant
- URL parameter debug support (`?debug=gradient`, `?debug=all`)
- WordPress-specific event handling
- Admin bar positioning compatibility
- Theme customizer integration

## Debug Features

### WordPress Debug Integration

When `WP_DEBUG` is enabled in `wp-config.php`, gradient debugging is automatically enabled:

```php
define('WP_DEBUG', true); // Enables gradient debug mode
```

### URL Parameters

Add these parameters to any WordPress page URL:
- `?debug=gradient` - Enable gradient controller debugging
- `?debug=all` - Enable all debugging features
- `?debug=init` - Show module initialization status

### Console Commands

Open browser console and run:

```javascript
// Check WordPress-specific module status
console.log('WordPress modules:', {
    utilities: typeof window.Utilities !== 'undefined',
    stickyHeader: typeof window.StickyHeader !== 'undefined',
    toc: typeof window.TableOfContents !== 'undefined',
    gradient: typeof window.GradientController !== 'undefined',
    mainApp: typeof window.MainApp !== 'undefined'
});

// Check if app is ready
if (window.MainApp) {
    console.log('App ready:', window.MainApp.isReady());
    console.log('Health check:', window.MainApp.healthCheck());
}
```

## Compatibility

### WordPress Version Support
- **WordPress 5.0+**: Full functionality
- **WordPress 4.9+**: Basic functionality (some features may be limited)

### Theme Compatibility
- **Custom Themes**: Full integration possible
- **Third-Party Themes**: May require additional CSS adjustments
- **Block Themes**: Compatible with header template parts

### Browser Support
- **Modern Browsers**: Full functionality with backdrop-filter support
- **Legacy Browsers**: Graceful degradation with fallback styles
- **Mobile Devices**: Optimized touch interactions

## Troubleshooting

### Common WordPress Issues

1. **Scripts Not Loading**
   - Check file permissions on `/js/` directory
   - Verify file paths in `wordpress-header.php`
   - Ensure theme directory structure is correct

2. **Customizer Colors Not Applying**
   - Check that `header-customizer.php` is included in `functions.php`
   - Verify CSS custom properties are being output
   - Clear any caching plugins

3. **Admin Bar Conflicts**
   - The header automatically adds `header-is-sticky` class to body
   - Add CSS to adjust admin bar positioning if needed

4. **Plugin Conflicts**
   - Disable caching plugins temporarily for testing
   - Check for JavaScript conflicts in browser console
   - Ensure jQuery is loading before the modules

### WordPress-Specific Debug Commands

```javascript
// Check WordPress admin bar
console.log('Admin bar present:', document.getElementById('wpadminbar') !== null);

// Check theme directory
console.log('Theme directory:', window.location.origin + '/wp-content/themes/');

// Force module reinitialization
if (window.MainApp) {
    window.MainApp.init();
}
```

## Migration Benefits

1. **Better WordPress Integration**: Native customizer support and admin compatibility
2. **Enhanced Performance**: Modular loading and better caching
3. **Improved Accessibility**: Full ARIA support and keyboard navigation
4. **Modern Design**: Glassmorphism header and tri-lateral gradient
5. **Developer Experience**: Better debugging and error handling
6. **Future-Proof**: Modular architecture for easy updates

## Support

For WordPress-specific issues:

1. Check the browser console for error messages
2. Enable `WP_DEBUG` for detailed logging
3. Test with default WordPress theme to isolate conflicts
4. Refer to `wordpress-integration-instructions.md` for detailed setup steps
