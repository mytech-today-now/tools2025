# SCSS Structure Documentation

**Task**: mytechtoday-5iy - Documentation Updates
**Date**: 2026-01-19
**Version**: 1.0

---

## Overview

The tools2025 SCSS architecture follows a modular structure with partial files for variables and mixins, and a main file for component styles with nesting.

---

## File Organization

```
tools2025/
├── style.scss          # Main SCSS file (463 lines)
├── _variables.scss     # Variables partial (174 lines, 46 variables)
├── _mixins.scss        # Mixins partial (319 lines, 11 mixins)
├── style.css           # Compiled output (7,939 lines)
└── style.css.map       # Source map (optional)
```

---

## 1. _variables.scss (174 lines)

### Purpose
Centralize all color, spacing, breakpoint, and typography values for consistency and easy maintenance.

### Structure

```scss
// ============================================
// SCSS Variables for tools2025
// ============================================

// 1. Colors (Primary, Secondary, Tertiary)
$primary-color: #557ea1;
$secondary-color: #10a37f;
$tertiary-color: #8b5a3c;
// ... (20+ color variables)

// 2. Spacing (XS to XXL)
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
// ... (30+ spacing variables)

// 3. Typography
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
$font-size-base: 1rem;
$line-height-base: 1.5;

// 4. Breakpoints
$breakpoint-mobile: 768px;
$breakpoint-tablet: 1024px;
$breakpoint-desktop: 1280px;

// 5. Borders and Shadows
$border-radius: 4px;
$border-radius-large: 8px;
$shadow-light: 0 2px 4px rgba(0, 75, 141, 0.1);
// ... (shadow variables)
```

### Variable Categories
- **Colors**: 20+ variables (primary, secondary, text, background, borders)
- **Spacing**: 30+ variables (xs, sm, md, lg, xl, xxl)
- **Typography**: Font families, sizes, weights, line heights
- **Breakpoints**: Mobile, tablet, desktop
- **Borders**: Radius values
- **Shadows**: Light, medium, heavy

---

## 2. _mixins.scss (319 lines)

### Purpose
Provide reusable style patterns for common UI elements and responsive design.

### Structure

```scss
// ============================================
// SCSS Mixins for tools2025
// ============================================

// 1. Visual Effects
@mixin backdrop-blur($amount: 10px) { ... }
@mixin gradient-background($angle, $color1, $color2) { ... }
@mixin neumorphic-shadow($size: medium) { ... }

// 2. Responsive Breakpoints
@mixin mobile { @media (max-width: $breakpoint-mobile) { @content; } }
@mixin tablet { @media (min-width: $breakpoint-mobile + 1) and (max-width: $breakpoint-tablet) { @content; } }
@mixin desktop { @media (min-width: $breakpoint-desktop) { @content; } }

// 3. Layout Utilities
@mixin flex-center { ... }
@mixin flex-column-center { ... }
@mixin absolute-center { ... }

// 4. Typography
@mixin font-smoothing { ... }
@mixin truncate { ... }
@mixin line-clamp($lines: 3) { ... }

// 5. Transitions
@mixin transition($properties, $duration: 0.3s, $easing: ease) { ... }
```

### Mixin Categories
- **Visual Effects**: Backdrop blur, gradients, shadows (3 mixins)
- **Responsive**: Mobile, tablet, desktop breakpoints (3 mixins)
- **Layout**: Flexbox utilities, positioning (3 mixins)
- **Typography**: Font smoothing, truncation, line clamping (3 mixins)
- **Transitions**: Smooth animations (1 mixin)

---

## 3. style.scss (463 lines)

### Purpose
Main SCSS file that imports partials and contains component styles with nesting.

### Structure

```scss
// ============================================
// Main SCSS File for tools2025
// ============================================

// 1. Configuration - Import Partials
@import 'variables';
@import 'mixins';

// 2. SCSS Nesting Examples
// Demonstrates proper nesting patterns

// Example 1: TOC Nesting (4 levels)
nav.toc {
  position: relative;
  background: white;
  
  ul {
    list-style: none;
    
    li {
      padding: $spacing-sm;
      
      a {
        color: $text-color;
        
        &:hover {
          color: $primary-color;
        }
      }
    }
  }
}

// Example 2: Body and Pseudo-elements
body {
  font-family: $font-family-base;
  margin: 0;
  padding: $spacing-sm;
  
  &::before {
    content: '';
    position: fixed;
    background: linear-gradient(135deg, #193959 0%, #274869 100%);
  }
}

// 3. Responsive Nesting
.element {
  width: 100%;
  
  @include tablet {
    width: 50%;
  }
  
  @include desktop {
    width: 33.33%;
  }
}
```

### Nesting Principles
- **Maximum Depth**: 3-4 levels
- **Parent Reference**: Use `&` for pseudo-classes and pseudo-elements
- **Media Queries**: Nest within selectors using mixins
- **Readability**: Maintain clear parent-child relationships

---

## Compilation Output

### style.css (7,939 lines)

The compiled CSS file contains:
- All CSS custom properties from variables
- Expanded mixin code
- Flattened nesting structure
- All original CSS styles

**File Size**: ~227 KB (uncompressed)

---

## Import Order

Critical: Partials must be imported in this order:

1. **_variables.scss** - Must be first (other files depend on variables)
2. **_mixins.scss** - Must be second (uses variables, used by main styles)
3. **Component styles** - Main style.scss content

---

## Naming Conventions

### Variables
- Lowercase with hyphens: `$primary-color`, `$spacing-md`
- Descriptive names: `$text-color` not `$tc`
- Grouped by category: `$color-*`, `$spacing-*`, `$breakpoint-*`

### Mixins
- Lowercase with hyphens: `@mixin backdrop-blur`
- Verb-based names: `@mixin flex-center`, `@mixin truncate`
- Parameters with defaults: `@mixin backdrop-blur($amount: 10px)`

### Selectors
- Follow CSS naming conventions
- Use nesting for parent-child relationships
- Use `&` for pseudo-classes and modifiers

---

## Future Enhancements

Planned improvements:

1. **Component Partials**: Break style.scss into component-specific files
   - `_header.scss`, `_navigation.scss`, `_blog.scss`, etc.

2. **Utility Classes**: Create utility partial for common patterns
   - `_utilities.scss` with margin, padding, text utilities

3. **Theme Support**: Add theme variables for dark mode
   - `_theme-light.scss`, `_theme-dark.scss`

4. **Grid System**: Create grid mixin library
   - `_grid.scss` with responsive grid utilities

---

## References

- **Compilation Guide**: `SCSS-GUIDE.md`
- **Maintenance Guide**: `SCSS-MAINTENANCE-GUIDE.md`
- **Variables Reference**: `other_files/scss-variables.md`
- **Mixins Reference**: `other_files/scss-mixins.md`
- **Nesting Guide**: `other_files/scss-nesting-plan.md`

---

**Last Updated**: 2026-01-19
**Version**: 1.0

