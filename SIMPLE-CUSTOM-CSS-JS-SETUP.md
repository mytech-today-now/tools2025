# Simple Custom CSS and JS PRO Setup Instructions

## Quick Setup Guide

### Step 1: Plugin Installation
1. Install **Simple Custom CSS and JS PRO** plugin
2. Activate the plugin
3. Navigate to **Custom CSS & JS > Custom JS**

### Step 2: Add JavaScript Files

Add these 5 JavaScript files in the exact order shown below:

---

## File 1: MyTech Utilities
**Settings:**
- **Name**: `MyTech Utilities`
- **Type**: `JavaScript`
- **Location**: `Header`
- **Priority**: `1`
- **Minify**: `Yes`
- **Active**: `Yes`

**Code to Copy:**
```javascript
// Copy the entire content from utilities.js file
```

---

## File 2: MyTech Sticky Header
**Settings:**
- **Name**: `MyTech Sticky Header`
- **Type**: `JavaScript`
- **Location**: `Header`
- **Priority**: `2`
- **Minify**: `Yes`
- **Active**: `Yes`

**Code to Copy:**
```javascript
// Copy the entire content from sticky-header.js file
```

---

## File 3: MyTech Table of Contents
**Settings:**
- **Name**: `MyTech Table of Contents`
- **Type**: `JavaScript`
- **Location**: `Header`
- **Priority**: `3`
- **Minify**: `Yes`
- **Active**: `Yes`

**Code to Copy:**
```javascript
// Copy the entire content from table-of-contents.js file
```

---

## File 4: MyTech Gradient Controller
**Settings:**
- **Name**: `MyTech Gradient Controller`
- **Type**: `JavaScript`
- **Location**: `Header`
- **Priority**: `4`
- **Minify**: `Yes`
- **Active**: `Yes`

**Code to Copy:**
```javascript
// Copy the entire content from gradient-controller.js file
```

---

## File 5: MyTech Main Application
**Settings:**
- **Name**: `MyTech Main Application`
- **Type**: `JavaScript`
- **Location**: `Header`
- **Priority**: `5`
- **Minify**: `Yes`
- **Active**: `Yes`

**Code to Copy:**
```javascript
// Copy the entire content from main.js file
```

---

## Important Notes

### Load Order is Critical
The files MUST be loaded in this exact order:
1. utilities.js (provides base functions)
2. sticky-header.js (depends on utilities)
3. table-of-contents.js (depends on utilities)
4. gradient-controller.js (depends on utilities)
5. main.js (depends on all previous files)

### Plugin Settings
- **Location**: All files should be set to `Header`
- **Priority**: Use numbers 1-5 as shown above
- **Minify**: Enable for better performance
- **Active**: Ensure all files are active

### Dependencies
- jQuery is automatically loaded by WordPress
- Each file (except utilities.js) depends on utilities.js
- main.js depends on all other files

## Verification Steps

### After Adding All Files:
1. **Check Load Order**: Go to **Custom CSS & JS > Custom JS** and verify files are listed in priority order 1-5
2. **Test Frontend**: Visit your website and check browser console for errors
3. **Test Functionality**: 
   - Sticky header should work on scroll
   - Table of contents should appear on long pages
   - Mobile menu should function
   - Social media icons should be clickable

### Browser Console Check:
Open browser developer tools (F12) and look for:
- ✅ No JavaScript errors
- ✅ All modules loaded successfully
- ✅ Header functionality working

## Troubleshooting

### Common Issues:

**JavaScript Errors in Console:**
- Check that all 5 files are added
- Verify load order (priority 1-5)
- Ensure no syntax errors when copying code

**Header Not Working:**
- Verify utilities.js is loaded first (priority 1)
- Check that jQuery is available
- Clear any caching plugins

**Mobile Menu Not Working:**
- Ensure sticky-header.js is loaded (priority 2)
- Check that utilities.js loaded successfully
- Verify CSS is properly loaded

### Performance Tips:
1. Enable minification for all files
2. Use caching if available in the plugin
3. Monitor page load speed after implementation
4. Clear cache after making changes

## File Descriptions

### utilities.js
- **Purpose**: Core utility functions used by other modules
- **Dependencies**: None (must load first)
- **Functions**: Logging, viewport detection, element selection

### sticky-header.js
- **Purpose**: Handles sticky header behavior and scroll effects
- **Dependencies**: utilities.js
- **Functions**: Header positioning, scroll detection, visibility control

### table-of-contents.js
- **Purpose**: Generates and manages table of contents
- **Dependencies**: utilities.js
- **Functions**: TOC generation, smooth scrolling, active section highlighting

### gradient-controller.js
- **Purpose**: Manages dynamic background gradients
- **Dependencies**: utilities.js
- **Functions**: Gradient calculation, scroll-based color changes

### main.js
- **Purpose**: Initializes all modules and handles coordination
- **Dependencies**: All other files
- **Functions**: Module initialization, event coordination, error handling

## Success Indicators

When properly set up, you should see:
- ✅ Sticky header that appears/hides on scroll
- ✅ Clickable social media icons (GitHub, LinkedIn)
- ✅ Clickable contact buttons (phone, email)
- ✅ Working mobile menu toggle
- ✅ Table of contents on long pages
- ✅ Dynamic background gradient effects
- ✅ No JavaScript errors in browser console

## Next Steps

After successful setup:
1. Test all functionality on desktop and mobile
2. Customize header settings via WordPress Customizer
3. Monitor website performance
4. Set up regular backups of your custom JS configurations
