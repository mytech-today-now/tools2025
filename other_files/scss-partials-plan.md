# SCSS Partials Structure Plan

**Date**: 2026-01-17
**Task**: mytechtoday-eth.3.4 - Partial Structure Planning
**Source**: tools2025/style.css

## Proposed File Structure

```
tools2025/
├── style.scss                 # Main file (imports all partials)
├── _variables.scss            # All SCSS variables
├── _mixins.scss               # All SCSS mixins
├── _base.scss                 # Reset and base styles
├── _typography.scss           # Font and text styles
├── _layout.scss               # Layout and grid
├── _components.scss           # Reusable components
├── _blog-grid.scss            # Blog grid specific styles
├── _toc.scss                  # Table of contents styles
├── _wordpress.scss            # WordPress integration styles
├── _responsive.scss           # Media queries
└── _utilities.scss            # Utility classes
```

## Import Order (style.scss)

```scss
// 1. Configuration
@import 'variables';
@import 'mixins';

// 2. Base
@import 'base';
@import 'typography';

// 3. Layout
@import 'layout';

// 4. Components
@import 'components';
@import 'blog-grid';
@import 'toc';

// 5. Integration
@import 'wordpress';

// 6. Responsive
@import 'responsive';

// 7. Utilities
@import 'utilities';
```

## Partial Breakdown

### _variables.scss
- Color variables
- Spacing variables
- Typography variables
- Breakpoint variables
- Shadow variables
- Blur variables

### _mixins.scss
- Backdrop blur mixin
- Gradient mixin
- Box shadow mixin
- Responsive mixins
- Flexbox mixins
- Text shadow mixin
- Transition mixin
- Scrollbar mixin

### _base.scss
- CSS reset
- Box-sizing
- Body styles
- Background gradients
- Dust particle container

### _typography.scss
- Font families
- Font sizes
- Headings
- Paragraphs
- Links

### _layout.scss
- Container styles
- Grid systems
- Flexbox layouts
- Positioning

### _components.scss
- Buttons
- Cards
- Forms
- Modals
- Alerts

### _blog-grid.scss
- Blog grid layout
- Masonry overrides
- Blog card styles
- Blog post list

### _toc.scss
- TOC container
- TOC list styles
- TOC link styles
- Sticky TOC behavior
- Tocbot integration

### _wordpress.scss
- WordPress header
- WordPress navigation
- WordPress content
- WordPress admin bar
- WordPress templates

### _responsive.scss
- Mobile styles
- Tablet styles
- Desktop styles
- Large screen styles

### _utilities.scss
- Helper classes
- Visibility classes
- Spacing utilities
- Text utilities

## Benefits

- **Modularity**: Each file has a single responsibility
- **Maintainability**: Easy to find and update specific styles
- **Scalability**: Easy to add new features
- **Collaboration**: Multiple developers can work on different partials
- **Performance**: Only import what you need

