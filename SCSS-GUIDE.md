# SCSS Compilation Guide

**Task**: mytechtoday-5iy - Documentation Updates
**Date**: 2026-01-19
**Version**: 1.0

---

## Quick Start

### Prerequisites

Install Dart Sass (if not already installed):

```bash
# Using npm
npm install -g sass

# Using Chocolatey (Windows)
choco install sass

# Verify installation
sass --version
```

### Basic Compilation

```bash
# Navigate to tools2025 directory
cd tools2025

# Compile SCSS to CSS
sass style.scss style.css

# Watch for changes (auto-compile)
sass --watch style.scss:style.css
```

---

## File Structure

```
tools2025/
├── style.scss          # Main SCSS file (imports partials, contains nesting)
├── _variables.scss     # SCSS variables (46 CSS custom properties)
├── _mixins.scss        # SCSS mixins (11 reusable mixins)
├── style.css           # Compiled CSS (production file)
└── style.css.map       # Source map (optional, for debugging)
```

---

## SCSS Features

### 1. Variables (_variables.scss)

**Purpose**: Centralize color, spacing, and breakpoint values

**Example**:
```scss
// Import in style.scss
@import 'variables';

// Use in styles
.element {
  color: $primary-color;
  padding: $spacing-md;
  border-radius: $border-radius;
}
```

**Available Variables**:
- Colors: `$primary-color`, `$secondary-color`, `$text-color`, etc.
- Spacing: `$spacing-xs`, `$spacing-sm`, `$spacing-md`, `$spacing-lg`, etc.
- Breakpoints: `$breakpoint-mobile`, `$breakpoint-tablet`, `$breakpoint-desktop`
- Typography: `$font-family-base`, `$font-size-base`, `$line-height-base`

### 2. Mixins (_mixins.scss)

**Purpose**: Reusable style patterns

**Example**:
```scss
// Import in style.scss
@import 'mixins';

// Use in styles
.card {
  @include backdrop-blur(10px);
  @include gradient-background(135deg, $primary-color, $secondary-color);
  
  @include mobile {
    padding: $spacing-sm;
  }
}
```

**Available Mixins**:
- `@include backdrop-blur($amount)` - Glassmorphic blur effect
- `@include gradient-background($angle, $color1, $color2)` - Linear gradients
- `@include mobile { ... }` - Mobile breakpoint (max-width: 768px)
- `@include tablet { ... }` - Tablet breakpoint (769px - 1024px)
- `@include desktop { ... }` - Desktop breakpoint (min-width: 1025px)
- `@include flex-center` - Flexbox centering
- `@include transition($properties, $duration, $easing)` - Smooth transitions

### 3. Nesting (style.scss)

**Purpose**: Organize related styles hierarchically

**Example**:
```scss
nav.toc {
  // Level 1: Component
  background: white;
  
  ul {
    // Level 2: Child element
    list-style: none;
    
    li {
      // Level 3: Nested child
      padding: $spacing-sm;
      
      a {
        // Level 4: Link
        color: $text-color;
        
        &:hover {
          // Level 5: Pseudo-class (MAX DEPTH)
          color: $primary-color;
        }
      }
    }
  }
}
```

**Nesting Guidelines**:
- Maximum depth: 3-4 levels
- Use `&` for pseudo-classes (`:hover`, `:focus`, `:active`)
- Use `&` for pseudo-elements (`::before`, `::after`)
- Nest media queries within selectors

---

## Compilation Options

### Development (with source maps)
```bash
sass --source-map style.scss style.css
```

### Production (compressed)
```bash
sass --style=compressed style.scss style.css
```

### Watch mode (auto-compile on save)
```bash
sass --watch style.scss:style.css
```

### Using npm scripts
```bash
npm run compile-css              # Standard compilation
npm run compile-css:watch        # Watch mode
npm run compile-css:compressed   # Compressed output
npm run compile-css:dev          # With source maps
```

---

## Validation

### Verify Compilation

```bash
# Run validation script
npm run validate-css

# Or use PowerShell script
powershell -ExecutionPolicy Bypass -File validate-scss-compilation.ps1
```

### Manual Validation

1. **File Size**: Compiled CSS should be similar size to original (±5%)
2. **Line Count**: Should be comparable to original CSS
3. **Visual Test**: HTML files should render identically
4. **No Errors**: Compilation should complete without errors

---

## Troubleshooting

### Common Errors

**Error**: `Error: Can't find stylesheet to import`
- **Cause**: Missing partial files (_variables.scss or _mixins.scss)
- **Solution**: Verify partial files exist in tools2025/

**Error**: `Error: Invalid CSS after "..."`
- **Cause**: Syntax error in SCSS
- **Solution**: Check for missing semicolons, curly braces, or invalid nesting

**Error**: `Error: Undefined variable`
- **Cause**: Variable used before import or typo in variable name
- **Solution**: Verify @import 'variables' is at top of file, check variable name

### Performance Issues

**Issue**: Compilation is slow
- **Solution**: Use `--no-source-map` flag for faster compilation

**Issue**: CSS file is too large
- **Solution**: Use `--style=compressed` for production builds

---

## Best Practices

1. **Always compile before committing**: Ensure style.css is up-to-date
2. **Test HTML files**: Verify no visual regressions after changes
3. **Use variables**: Replace hardcoded values with SCSS variables
4. **Use mixins**: Avoid repeating common patterns
5. **Limit nesting**: Keep nesting depth to 3-4 levels maximum
6. **Comment your code**: Explain complex styles or calculations

---

## References

- **Maintenance Guide**: `SCSS-MAINTENANCE-GUIDE.md`
- **Structure Documentation**: `scss-structure.md`
- **Variables Reference**: `other_files/scss-variables.md`
- **Mixins Reference**: `other_files/scss-mixins.md`
- **Nesting Guide**: `other_files/scss-nesting-plan.md`

---

**Last Updated**: 2026-01-19
**Version**: 1.0

