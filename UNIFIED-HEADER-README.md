# Unified Header for WordPress

This refactored WordPress header includes the sticky header layout, colors, and design from Tools2025.html, providing a modern, responsive, and professional header experience.

## Features

- **Sticky Header**: Fixed position header that stays at the top of the page
- **Responsive Design**: Adapts to different screen sizes with mobile-first approach
- **Gradient Blur Background**: Modern glassmorphism effect with backdrop blur
- **Customizable Content**: Easy to customize through WordPress Customizer
- **Professional Layout**: Two-row layout with branding, navigation, and contact information
- **Smooth Animations**: Hover effects and transitions for better user experience

## Files Included

1. **wordpress-header.php** - Main header template file
2. **header-customizer.php** - WordPress Customizer settings
3. **unified-header.js** - JavaScript for interactive functionality
4. **UNIFIED-HEADER-README.md** - This documentation file

## Installation

### Step 1: Replace Header File
Replace your existing `header.php` file with `wordpress-header.php`, or integrate the unified header code into your existing header template.

### Step 2: Update CSS File
The unified header styles are now included in `style.css`. Make sure your theme loads this CSS file, or copy the unified header styles from the CSS file to your theme's main stylesheet.

### Step 3: Add Customizer Settings
Add the contents of `header-customizer.php` to your theme's `functions.php` file, or include it as a separate file:

```php
// In your functions.php file
require_once get_template_directory() . '/header-customizer.php';
```

### Step 4: Include JavaScript
The JavaScript is automatically included in the header file. If you prefer to enqueue it separately, you can modify the header file and add this to your functions.php:

```php
function enqueue_unified_header_scripts() {
    wp_enqueue_script('unified-header-js', get_template_directory_uri() . '/unified-header.js', array('jquery'), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'enqueue_unified_header_scripts');
```

## Customization

### WordPress Customizer Options

Navigate to **Appearance > Customize > Unified Header Settings** to configure:

- **Header Location**: Your business location
- **Header Phone Number**: Contact phone number
- **Header Email Address**: Contact email address
- **Header CTA Button Text**: Call-to-action button text
- **Header CTA Button URL**: Call-to-action button link
- **Open CTA Button in New Tab**: Checkbox to open CTA in new tab

### Color Customization

Navigate to **Appearance > Customize > Unified Header Colors** to configure:

- **Primary Header Color**: Main header background color
- **Secondary Header Color**: Secondary color for gradient effect

### Menu Configuration

1. Go to **Appearance > Menus**
2. Create or assign a menu to the "Primary Menu" location
3. The menu will appear in the header navigation section

### CSS Variables

The header uses CSS custom properties that can be overridden:

```css
:root {
  --primary-color: #557ea1;
  --secondary-color: #10a37f;
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --border-radius: 4px;
  --border-radius-large: 8px;
}
```

## Responsive Breakpoints

- **Desktop**: 1200px and above - Full layout with all elements
- **Tablet**: 768px to 1024px - Tagline hidden, adjusted spacing
- **Mobile**: 480px to 768px - Stacked layout, mobile menu
- **Small Mobile**: Below 480px - Compact layout, minimal spacing

## Browser Support

- Chrome 88+
- Firefox 87+
- Safari 14+
- Edge 88+

The header uses modern CSS features like `backdrop-filter` which may not be supported in older browsers. Fallback styles are provided.

## Accessibility Features

- Proper ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators for all interactive elements
- Semantic HTML structure
- Screen reader friendly

## Performance Considerations

- CSS is inlined in the header for faster loading
- JavaScript is optimized and minified
- Uses system fonts for better performance
- Minimal external dependencies (only jQuery)

## Troubleshooting

### Header Not Appearing
- Check that the header file is properly included in your theme
- Ensure CSS is not being overridden by other stylesheets
- Verify that the body padding-top is applied

### Mobile Menu Not Working
- Ensure jQuery is loaded
- Check browser console for JavaScript errors
- Verify that the mobile menu toggle button is present

### Customizer Options Not Showing
- Make sure `header-customizer.php` is properly included
- Check that the customizer functions are not conflicting with other plugins

### Styling Issues
- Check for CSS conflicts with other themes or plugins
- Ensure CSS custom properties are supported in your target browsers
- Verify that the CSS is loading correctly

## Support

For support and customization requests, please refer to the theme documentation or contact the development team.

## Changelog

### Version 1.0.0
- Initial release with unified header design
- Responsive layout implementation
- WordPress Customizer integration
- Mobile menu functionality
- Accessibility improvements
