# Enhanced Table of Contents Module

A sophisticated, responsive table of contents module that automatically detects existing TOC content or generates a new TOC from document headings, featuring sticky positioning, hover-based expansion, and comprehensive accessibility support.

## Features

### 🔍 **Smart Detection & Generation**
- Automatically detects existing `nav#toc` elements and enhances them
- Generates TOC from document headings (h2-h5) when no existing TOC is found
- Maintains hierarchical structure with proper nesting
- Automatically generates IDs for headings that don't have them

### 📌 **Sticky Behavior**
- Becomes sticky when the `<main>` element reaches the top of the viewport
- Positions itself below any existing sticky header
- Collapses to a title bar when sticky
- Expands on hover with smooth animations

### 🎨 **Modern Design**
- Borderless design with sophisticated blur effects
- Responsive layout that adapts to all screen sizes
- Muted scroll bars with custom styling
- Smooth CSS transitions and animations
- High contrast and reduced motion support

### 🖱️ **Interactive Features**
- Hover-based expansion of main TOC and sub-items
- Nested sub-item expansion with proper left-padding
- Smooth scrolling to target sections with offset calculation
- Keyboard navigation support (arrow keys, Enter, Escape)
- Touch-friendly interactions for mobile devices

### ♿ **Accessibility**
- Semantic HTML structure with proper ARIA attributes
- Full keyboard navigation support
- Screen reader compatibility
- Focus indicators and high contrast mode support
- Reduced motion preferences respected

## Installation

1. Include the CSS file in your HTML head:
```html
<link rel="stylesheet" href="enhanced-toc.css">
```

2. Include the JavaScript file before the closing body tag:
```html
<script src="enhanced-toc.js"></script>
```

## Usage

### Automatic Initialization

The module automatically initializes when the DOM is ready. No manual setup required!

### With Existing TOC

If you have an existing `nav#toc` element, the module will enhance it:

```html
<nav id="toc">
    <h2>Table of Contents</h2>
    <ul>
        <li><a href="#section1">Section 1</a></li>
        <li><a href="#section2">Section 2</a>
            <ul>
                <li><a href="#subsection">Subsection</a></li>
            </ul>
        </li>
    </ul>
</nav>
```

### Auto-Generation

If no existing TOC is found, the module will generate one from your headings:

```html
<main>
    <h2 id="introduction">Introduction</h2>
    <h3 id="overview">Overview</h3>
    <h4 id="features">Features</h4>
    <h2 id="usage">Usage</h2>
</main>
```

## API Reference

### Public Methods

```javascript
// Initialize the TOC (called automatically)
window.EnhancedTOC.init();

// Destroy the TOC
window.EnhancedTOC.destroy();

// Get current state
const state = window.EnhancedTOC.getState();

// Get configuration
const config = window.EnhancedTOC.getConfig();

// Update configuration
window.EnhancedTOC.updateConfig({
    debug: true,
    timing: {
        hoverDelay: 200
    }
});

// Manual expand/collapse
window.EnhancedTOC.expand();
window.EnhancedTOC.collapse();
```

### Events

The module dispatches custom events for integration:

```javascript
// TOC initialized
document.addEventListener('enhancedTOCInitialized', function(e) {
    console.log('TOC initialized:', e.detail);
});

// Sticky state changed
document.addEventListener('enhancedTOCStickyChange', function(e) {
    console.log('Sticky state:', e.detail.isSticky);
});

// TOC expanded
document.addEventListener('enhancedTOCExpanded', function() {
    console.log('TOC expanded');
});

// TOC collapsed
document.addEventListener('enhancedTOCCollapsed', function() {
    console.log('TOC collapsed');
});

// TOC destroyed
document.addEventListener('enhancedTOCDestroyed', function() {
    console.log('TOC destroyed');
});
```

## Configuration

### Default Configuration

```javascript
const config = {
    selectors: {
        toc: 'nav#toc',
        main: 'main',
        stickyHeader: 'header',
        body: 'body',
        headings: 'h2, h3, h4, h5'
    },
    timing: {
        hoverDelay: 150,
        expandDelay: 200,
        collapseDelay: 300,
        scrollDebounce: 16
    },
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    },
    maxHeight: {
        mobile: '50vh',
        tablet: '60vh',
        desktop: '70vh'
    },
    debug: false
};
```

### Customization

You can customize the configuration by calling `updateConfig()`:

```javascript
window.EnhancedTOC.updateConfig({
    timing: {
        hoverDelay: 300,
        collapseDelay: 500
    },
    maxHeight: {
        mobile: '40vh',
        desktop: '80vh'
    },
    debug: true
});
```

## CSS Classes

The module adds the following CSS classes:

- `.enhanced-toc` - Main TOC container
- `.enhanced-toc-sticky` - Applied when TOC is sticky
- `.enhanced-toc-expanded` - Applied when TOC is expanded
- `.enhanced-toc-collapsed` - Applied when TOC is collapsed
- `.enhanced-toc-title` - TOC title element
- `.enhanced-toc-content` - TOC content container
- `.enhanced-toc-scrollable` - Scrollable list container
- `.enhanced-toc-item` - Individual TOC items
- `.enhanced-toc-link` - TOC links
- `.enhanced-toc-subitems` - Sub-item containers
- `.has-subitems` - Items that contain sub-items
- `.subitems-expanded` - Expanded sub-item containers
- `.enhanced-toc-active` - Applied to body when TOC is active

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Requirements

- A `<main>` element in your HTML (required for sticky behavior)
- Document headings (h2-h5) for auto-generation
- Modern browser with CSS Grid and Flexbox support

## Testing

Two test files are included:

1. `test-enhanced-toc.html` - Tests with existing TOC
2. `test-enhanced-toc-autogen.html` - Tests auto-generation

Open these files in a browser to see the module in action.

## License

MIT License - feel free to use in your projects!

## Version

Current version: 1.0.0
