# WordPress Integration Instructions for myTech.Today Unified Header (Updated 2025)

This guide will help you integrate the refactored unified header with tri-lateral gradient into a WordPress site.

## Files Created/Updated

1. **wordpress-header.php** - WordPress header template file (Updated with modular JS)
2. **header-customizer.php** - WordPress Customizer settings (Updated with tertiary color)
3. **wordpress-functions-additions.php** - Code to add to your theme's functions.php (Updated for modular JS)
4. **New Modular JavaScript Files:**
   - `utilities.js` - Common utilities and error handling
   - `sticky-header.js` - Transparent sticky header functionality
   - `table-of-contents.js` - TOC with nested list support
   - `gradient-controller.js` - Tri-lateral gradient background controller
   - `main.js` - Application coordinator
5. **style.css** - Updated with tri-lateral gradient and tertiary color support
6. **wordpress-integration-instructions.md** - This instruction file

## Step-by-Step Integration

### Step 1: Backup Your Current Theme

Before making any changes, create a backup of your current WordPress theme:
- Access your WordPress files via FTP or hosting control panel
- Download a copy of your active theme folder from `/wp-content/themes/your-theme-name/`

### Step 2: Add the JavaScript Files

1. Create a `js` folder in your active theme directory if it doesn't exist:
   ```
   /wp-content/themes/your-theme-name/js/
   ```

2. Upload the modular JavaScript files to this directory:
   ```
   /wp-content/themes/your-theme-name/js/utilities.js
   /wp-content/themes/your-theme-name/js/sticky-header.js
   /wp-content/themes/your-theme-name/js/table-of-contents.js
   /wp-content/themes/your-theme-name/js/gradient-controller.js
   /wp-content/themes/your-theme-name/js/main.js
   ```

### Step 3: Add/Update the CSS File

1. Create a `css` folder in your active theme directory if it doesn't exist:
   ```
   /wp-content/themes/your-theme-name/css/
   ```

2. Upload the updated `style.css` file or merge its contents with your existing theme CSS:
   ```
   /wp-content/themes/your-theme-name/style.css
   ```

   **Important:** The updated CSS includes:
   - Tri-lateral gradient support
   - Tertiary color variable (`--tertiary-color: #8b5a3c`)
   - Enhanced header transparency
   - Page background gradient styles

### Step 4: Update functions.php

1. Open your theme's `functions.php` file:
   ```
   /wp-content/themes/your-theme-name/functions.php
   ```

2. Add the code from `wordpress-functions-additions.php` to the end of your `functions.php` file (before the closing `?>` tag if it exists).

### Step 4: Replace or Update header.php

**Option A: Replace Existing Header (Recommended for new themes)**
1. Backup your current `header.php` file
2. Replace it with the content from `wordpress-header.php`
3. Rename `wordpress-header.php` to `header.php`

**Option B: Integrate into Existing Header (For existing themes with custom functionality)**
1. Open your current `header.php` file
2. Replace the existing header HTML structure with the unified header HTML from `wordpress-header.php`
3. Keep any existing WordPress functions and hooks that your theme requires

### Step 5: Customize Header Settings

1. Go to **WordPress Admin → Appearance → Customize**
2. Look for the new **"myTech.Today Header Settings"** section
3. Customize the following settings:
   - GitHub URL
   - LinkedIn URL
   - Yesterday Page URL
   - Business Location
   - Phone Number (Display and Link formats)
   - Contact Email
   - Email Subject
   - CTA Button Text and Link

### Step 6: Set Up Navigation Menu (Optional)

1. Go to **WordPress Admin → Appearance → Menus**
2. Create a new menu or edit an existing one
3. Assign it to the **"Header Menu"** location
4. The menu items will appear in the navigation section of the header

### Step 7: Test and Adjust

1. Visit your website to see the new header
2. Test on different screen sizes (desktop, tablet, mobile)
3. Verify all links work correctly
4. Check that the header doesn't conflict with your theme's content

## Customization Options

### Adjusting Header Position

If the header overlaps your content, you may need to adjust the body padding. In your theme's CSS or the unified-header.css file, modify:

```css
.has-unified-header {
  padding-top: 120px; /* Adjust this value as needed */
}
```

### Changing Colors

The header uses CSS custom properties. You can modify these in the unified-header.css file:

```css
:root {
  --primary-color: #557ea1;    /* Change to your brand color */
  --secondary-color: #10a37f;  /* Change to your accent color */
}
```

### Adding More Navigation Items

You can add more navigation items by:
1. Using the WordPress menu system (recommended)
2. Modifying the header.php file directly to add custom links

## Troubleshooting

### Header Not Showing
- Check that the CSS file is properly enqueued
- Verify the file path in functions.php is correct
- Clear any caching plugins

### Styling Issues
- Check for CSS conflicts with your theme
- Use browser developer tools to inspect elements
- Ensure the unified-header.css file is loading

### Mobile Display Problems
- The header is responsive by default
- Check viewport meta tag is present in your header
- Test on actual mobile devices, not just browser resize

### Content Overlap
- Adjust the `padding-top` value for `.has-unified-header`
- Consider the header's fixed positioning

## Advanced Customization

### Adding Custom Fields
You can add more customizer options by extending the `mytech_customize_register` function in functions.php.

### Modifying the Blur Effect
The header uses CSS backdrop-filter for the blur effect. You can adjust the blur intensity by modifying the `backdrop-filter: blur(25px)` values in the CSS.

### Integration with Page Builders
If you're using page builders like Elementor or Gutenberg, you may need to:
1. Disable the theme's default header
2. Ensure the unified header doesn't conflict with page builder headers
3. Test thoroughly with your page builder's preview modes

## Support

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Verify all file paths are correct
3. Ensure your WordPress theme supports custom headers
4. Test with a default WordPress theme to isolate issues

## File Structure After Integration

```
your-theme-name/
├── header.php (updated with unified header)
├── functions.php (updated with new functions)
├── css/
│   └── unified-header.css
└── ... (other theme files)
```

The unified header will now be active on your WordPress site with full customization options available through the WordPress Customizer.
