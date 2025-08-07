# Refactored JavaScript Modules

This document describes the refactored JavaScript code structure, separating the sticky header functionality from the table of contents code into modular, maintainable components.

## Overview

The original `code.js` file has been refactored into five separate modules:

1. **`sticky-header.js`** - Sticky header functionality
2. **`table-of-contents.js`** - Table of contents functionality  
3. **`gradient-controller.js`** - Dynamic gradient background controller
4. **`utilities.js`** - Common utilities and error handling
5. **`main.js`** - Application coordinator and module initializer

## Module Structure

### 1. Sticky Header Module (`sticky-header.js`)

**Purpose**: Handles sticky header behavior, scroll detection, and responsive visibility with transparent blur background.

**Key Features**:
- Sticky positioning based on scroll position
- Transparent background with backdrop blur effect
- Auto-hide/show on scroll direction
- Responsive behavior for mobile/desktop
- Accessibility support
- Custom events for state changes

**Public API**:
```javascript
window.StickyHeader = {
    init: initStickyHeader,
    state: HeaderState,
    config: HeaderConfig,
    recalculatePosition: () => ScrollManager.recalculatePosition(),
    show: () => { /* Show header */ },
    hide: () => { /* Hide header */ },
    getLastError: () => HeaderState.lastError
};
```

**Events Dispatched**:
- `headerStickyChange` - When sticky state changes
- `headerVisibilityChange` - When visibility changes
- `headerResize` - On window resize

### 2. Table of Contents Module (`table-of-contents.js`)

**Purpose**: Manages table of contents expansion, nested lists, and user interactions.

**Key Features**:
- Hover and focus-based expansion
- Nested list management
- Touch support for mobile
- Keyboard navigation
- ARIA accessibility attributes

**Public API**:
```javascript
window.TableOfContents = {
    init: initTOC,
    state: TOCState,
    config: TOCConfig,
    expand: () => TOCInteraction.expandTOC(),
    collapse: () => TOCInteraction.collapseTOC(),
    toggle: () => TOCInteraction.toggleExpansion(),
    nested: {
        init: () => NestedListManager.init(),
        expandAll: () => NestedListManager.expandAll(),
        collapseAll: () => NestedListManager.collapseAll()
    },
    getLastError: () => TOCState.lastError
};
```

**Events Dispatched**:
- `tocToggle` - When TOC expansion state changes
- `nestedListExpand` - When nested list expands
- `nestedListCollapse` - When nested list collapses
- `tocResize` - On window resize

### 3. Gradient Controller Module (`gradient-controller.js`)

**Purpose**: Controls dynamic tri-lateral page background gradients with increased contrast that match current theme colors and get darker with scroll.

**Key Features**:
- Tri-lateral gradient using three complementary colors (primary, secondary, tertiary)
- Combined linear and radial gradients for enhanced depth and visual interest
- Scroll-based gradient progression with increased contrast between dark shades
- Automatic color extraction from current theme (including new tertiary color)
- Much darker gradient colors with enhanced contrast ratios
- CSS custom property updates for all three gradient colors
- Performance-optimized with requestAnimationFrame
- Debug mode with detailed logging including color information
- Responsive to viewport changes

**Public API**:
```javascript
window.GradientController = {
    init: () => GradientController.init(),
    update: () => GradientController.updateGradient(),
    reset: () => GradientController.reset(),
    state: GradientState,
    config: GradientConfig,
    debug: {
        enable: () => GradientController.enableDebug(),
        disable: () => GradientController.disableDebug(),
        isEnabled: () => DebugUtils.isEnabled()
    },
    getLastError: () => GradientState.lastError
};
```

**Events Dispatched**:
- `gradientUpdate` - On gradient state change
- `gradientResize` - On window resize

### 4. Utilities Module (`utilities.js`)

**Purpose**: Provides shared utilities, error handling, and debugging functions.

**Key Features**:
- Global error handling setup
- jQuery compatibility fixes
- Performance monitoring utilities
- DOM manipulation helpers
- Debugging and diagnostics

**Public API**:
```javascript
window.Utilities = {
    debug: DebugUtils,
    performance: PerformanceUtils,
    dom: DOMUtils,
    fixCommonIssues,
    setupGlobalErrorHandling
};
```

### 5. Main Application Module (`main.js`)

**Purpose**: Coordinates module initialization and handles inter-module communication.

**Key Features**:
- Dependency-aware module loading
- Inter-module event coordination
- Application health monitoring
- Error aggregation and reporting
- Performance tracking

**Public API**:
```javascript
window.MainApp = {
    init: initializeApp,
    state: AppState,
    config: AppConfig,
    healthCheck: performHealthCheck,
    getErrors: () => AppState.errors,
    isReady: () => AppState.initialized
};
```

**Events Dispatched**:
- `appReady` - When all modules are initialized

## Installation and Usage

### Option 1: Include All Files Separately

```html
<!-- Include modules in dependency order -->
<script src="utilities.js"></script>
<script src="sticky-header.js"></script>
<script src="table-of-contents.js"></script>
<script src="gradient-controller.js"></script>
<script src="main.js"></script>
```

### Option 2: Replace Original code.js

1. Remove or rename the original `code.js` file
2. Include the new modular files as shown above
3. Update any existing references to the old API

## Migration from Original code.js

### API Changes

**Old API** (from original code.js):
```javascript
window.StickyTOC = {
    init: initTOC,
    state: TOCState,
    // ... other methods
};
```

**New APIs** (modular):
```javascript
// Sticky header functionality
window.StickyHeader.init();

// Table of contents functionality  
window.TableOfContents.init();

// Gradient controller
window.GradientController.init();

// Or use the main app coordinator
window.MainApp.init(); // Initializes all modules
```

### Event Changes

The new modular structure dispatches more specific events:

- `headerStickyChange` instead of `tocStickyChange`
- `tocToggle` for TOC-specific changes
- `gradientUpdate` for gradient changes
- `appReady` when all modules are loaded

## Configuration

Each module has its own configuration object that can be customized:

```javascript
// Example: Customize sticky header behavior
window.StickyHeader.config.timing.scrollThreshold = 50;

// Example: Customize TOC hover delay
window.TableOfContents.config.timing.hoverDelay = 200;

// Example: Enable gradient debug mode
window.GradientController.debug.enable();
```

## Debugging

### Individual Module Debugging

Each module provides debugging capabilities:

```javascript
// Check module state
console.log(window.StickyHeader.state);
console.log(window.TableOfContents.state);

// Get last error from any module
console.log(window.StickyHeader.getLastError());
console.log(window.TableOfContents.getLastError());
```

### Application-Level Debugging

```javascript
// Check overall application health
window.MainApp.healthCheck();

// Get all application errors
window.MainApp.getErrors();

// Check if app is ready
window.MainApp.isReady();
```

### URL Debug Parameters

Add debug parameters to the URL for enhanced logging:

- `?debug=gradient` - Enable gradient controller debugging
- `?debug=all` - Enable all debugging features

## Performance Considerations

- **Lazy Loading**: Modules only initialize when needed
- **Event Throttling**: Scroll and resize events are throttled/debounced
- **Memory Management**: Proper cleanup of event listeners and observers
- **Error Isolation**: Errors in one module don't affect others

## Browser Support

- **Modern Browsers**: Full functionality with all features
- **Legacy Support**: Graceful degradation with fallbacks
- **Mobile Optimized**: Touch events and responsive behavior

## Benefits of Refactoring

1. **Separation of Concerns**: Each module has a single responsibility
2. **Maintainability**: Easier to update and debug individual features
3. **Reusability**: Modules can be used independently
4. **Testing**: Each module can be tested in isolation
5. **Performance**: Better error isolation and resource management
6. **Scalability**: Easy to add new modules or features

## Troubleshooting

### Common Issues

1. **Module Not Found**: Ensure all files are loaded in correct order
2. **Dependencies Missing**: Check that utilities.js loads first
3. **Events Not Firing**: Verify modules are properly initialized
4. **Performance Issues**: Check browser console for error messages

### Debug Commands

```javascript
// Check module availability
console.log('StickyHeader available:', typeof window.StickyHeader !== 'undefined');
console.log('TableOfContents available:', typeof window.TableOfContents !== 'undefined');

// Force module initialization
window.StickyHeader.init();
window.TableOfContents.init();

// Run diagnostics
window.Utilities.debug.diagnostics();
```
