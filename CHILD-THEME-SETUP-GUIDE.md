# Child Theme Setup Guide for myTech.Today Unified Header

## Overview
This guide explains how to set up the myTech.Today Unified Header in a child theme environment with JavaScript files managed through Simple Custom CSS and JS PRO.

## File Structure

### Child Theme Directory Structure
```
your-child-theme/
├── functions.php (✅ Updated for child theme)
├── style.css (✅ Contains all unified header styles)
├── wordpress-header.php (✅ Updated - no JS loading)
└── README.md (this file)
```

### JavaScript Files (Managed via Simple Custom CSS and JS PRO)
```
utilities.js (Load Order: 1)
sticky-header.js (Load Order: 2)
table-of-contents.js (Load Order: 3)
gradient-controller.js (Load Order: 4)
main.js (Load Order: 5)
```

## Setup Instructions

### Step 1: Child Theme Setup
1. **Copy files to your child theme directory:**
   - `functions.php`
   - `style.css`
   - `wordpress-header.php` (if customizing header)

2. **Verify child theme is active:**
   - Go to **Appearance > Themes**
   - Ensure your child theme is activated

### Step 2: Simple Custom CSS and JS PRO Setup

#### A. Install and Activate Plugin
1. Install **Simple Custom CSS and JS PRO**
2. Activate the plugin
3. Go to **Custom CSS & JS > Custom JS**

#### B. Add JavaScript Files in Order

**File 1: utilities.js**
- **Name**: `MyTech Utilities`
- **Type**: `JavaScript`
- **Location**: `Header`
- **Priority**: `1`
- **Content**: Copy entire content from `utilities.js`

**File 2: sticky-header.js**
- **Name**: `MyTech Sticky Header`
- **Type**: `JavaScript`
- **Location**: `Header`
- **Priority**: `2`
- **Content**: Copy entire content from `sticky-header.js`

**File 3: table-of-contents.js**
- **Name**: `MyTech Table of Contents`
- **Type**: `JavaScript`
- **Location**: `Header`
- **Priority**: `3`
- **Content**: Copy entire content from `table-of-contents.js`

**File 4: gradient-controller.js**
- **Name**: `MyTech Gradient Controller`
- **Type**: `JavaScript`
- **Location**: `Header`
- **Priority**: `4`
- **Content**: Copy entire content from `gradient-controller.js`

**File 5: main.js**
- **Name**: `MyTech Main Application`
- **Type**: `JavaScript`
- **Location**: `Header`
- **Priority**: `5`
- **Content**: Copy entire content from `main.js`

### Step 3: Configuration Settings

#### WordPress Customizer Settings
Navigate to **Appearance > Customize > myTech.Today Header Settings**:

- **Business Location**: `Barrington, IL 60010`
- **Phone Number**: `(847) 767-4914`
- **Contact Email**: `sales@mytech.today`
- **CTA Button Text**: `Start Your AI‑First Project Today`
- **CTA Button URL**: `mailto:sales@mytech.today?subject=MCP%20Inquiry`
- **GitHub URL**: `https://github.com/mytech-today-now`
- **LinkedIn URL**: `https://www.linkedin.com/in/kylerode/`
- **Yesterday Page URL**: `[your-site]/yesterday/`

## Key Changes Made

### functions.php Changes
```php
// OLD (Parent Theme)
get_template_directory_uri() . '/style.css'

// NEW (Child Theme)
get_stylesheet_directory_uri() . '/style.css'
```

### JavaScript Loading Changes
```php
// OLD (Direct file loading)
<script src="<?php echo get_template_directory_uri(); ?>/js/utilities.js" defer></script>

// NEW (Simple Custom CSS and JS PRO)
// Files managed through plugin interface
```

## Benefits of This Setup

### Child Theme Benefits
1. **Update Safe**: Parent theme updates won't overwrite customizations
2. **Proper Inheritance**: Inherits parent theme functionality
3. **Easy Maintenance**: Clear separation of custom code

### Simple Custom CSS and JS PRO Benefits
1. **Better Performance**: Optimized loading and caching
2. **Easy Management**: GUI interface for JS files
3. **Load Order Control**: Precise control over script dependencies
4. **Minification**: Automatic code optimization
5. **Conditional Loading**: Load scripts only where needed

## Troubleshooting

### Common Issues

**Issue**: Header not displaying correctly
**Solution**: 
1. Verify child theme is active
2. Check that `style.css` is in child theme directory
3. Clear any caching plugins

**Issue**: JavaScript functionality not working
**Solution**:
1. Check Simple Custom CSS and JS PRO is active
2. Verify all 5 JS files are added in correct order
3. Check browser console for errors
4. Ensure jQuery is loaded

**Issue**: Customizer settings not saving
**Solution**:
1. Verify `functions.php` is in child theme
2. Check for PHP errors in error logs
3. Ensure proper permissions on child theme directory

### Verification Checklist
- [ ] Child theme is active
- [ ] `style.css` loads from child theme directory
- [ ] All 5 JavaScript files are added to Simple Custom CSS and JS PRO
- [ ] JavaScript files are in correct load order (1-5)
- [ ] Header displays with all elements (logo, nav, contact info)
- [ ] Social media icons are visible and clickable
- [ ] Contact buttons (phone, email) work correctly
- [ ] Mobile menu functions properly
- [ ] Sticky header behavior works on scroll
- [ ] Customizer settings can be modified

## File Dependencies

### CSS Dependencies
- `style.css` contains all unified header styles
- No external CSS dependencies

### JavaScript Dependencies
```
utilities.js (no dependencies)
├── sticky-header.js (depends on utilities.js)
├── table-of-contents.js (depends on utilities.js)
├── gradient-controller.js (depends on utilities.js)
└── main.js (depends on all above files)
```

### WordPress Dependencies
- jQuery (automatically loaded)
- WordPress Customizer API
- WordPress Navigation Menus

## Performance Optimization

### Recommended Settings in Simple Custom CSS and JS PRO
1. **Enable Minification**: Yes
2. **Enable Caching**: Yes
3. **Load Location**: Header (for critical functionality)
4. **Combine Files**: No (maintain load order)
5. **Defer Loading**: Yes (where possible)

### Caching Considerations
- Clear cache after making changes
- Test functionality after cache clearing
- Monitor Core Web Vitals for performance impact

## Support and Maintenance

### Regular Maintenance Tasks
1. **Monthly**: Check for plugin updates
2. **Quarterly**: Verify all functionality still works
3. **After Parent Theme Updates**: Test child theme compatibility
4. **After WordPress Updates**: Verify customizer settings

### Getting Help
1. Check browser console for JavaScript errors
2. Verify file load order in Simple Custom CSS and JS PRO
3. Test with default WordPress theme to isolate issues
4. Check WordPress error logs for PHP issues
