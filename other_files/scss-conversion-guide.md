# SCSS Conversion Implementation Guide

**Date**: 2026-01-17
**Tasks**: mytechtoday-eth.4.1 - SCSS File Creation, mytechtoday-eth.4.2 - Variable Implementation
**Phase**: Phase 4 - SCSS Conversion (Week 4)

## Overview

This guide provides step-by-step instructions for converting `style.css` to SCSS format with proper file structure, variables, mixins, and nesting.

## Task 4.1: SCSS File Creation

### Step 1: Create Main SCSS File

**File**: `tools2025/style.scss`

```scss
/*!
 * myTech.Today - Main Stylesheet (SCSS)
 * Compiled from SCSS partials
 * Last Updated: 2026-01-17
 */

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

### Step 2: Create Partial Files

Create empty partial files:
- `_variables.scss`
- `_mixins.scss`
- `_base.scss`
- `_typography.scss`
- `_layout.scss`
- `_components.scss`
- `_blog-grid.scss`
- `_toc.scss`
- `_wordpress.scss`
- `_responsive.scss`
- `_utilities.scss`

## Task 4.2: Variable Implementation

### _variables.scss

```scss
// ============================================
// SCSS Variables
// ============================================

// --------------------------------------------
// Colors - Primary
// --------------------------------------------
$primary-color: #557ea1;
$secondary-color: #10a37f;
$tertiary-color: #8b5a3c;
$danger-color: #d32f2f;
$success-color: #1976d2;

// --------------------------------------------
// Colors - Borders
// --------------------------------------------
$border-color: #d1dce5;
$light-border: #e8f0f5;

// --------------------------------------------
// Colors - Backgrounds
// --------------------------------------------
$background-color: #193959;
$background-light: #002e56;
$background-lighter: #274869;

// --------------------------------------------
// Colors - Text
// --------------------------------------------
$text-color: #929ba4;
$text-muted: #e1e5e9;
$text-light: #c2c9cf;
$text-link: #419eef;

// --------------------------------------------
// Colors - RGBA (Common)
// --------------------------------------------
$color-black-80: rgba(0, 0, 0, 0.8);
$color-black-60: rgba(0, 0, 0, 0.6);
$color-black-30: rgba(0, 0, 0, 0.3);
$color-black-20: rgba(0, 0, 0, 0.2);
$color-black-50: rgba(0, 0, 0, 0.5);

$color-white-95: rgba(255, 255, 255, 0.95);
$color-white-90: rgba(255, 255, 255, 0.9);
$color-white-85: rgba(255, 255, 255, 0.85);
$color-white-50: rgba(255, 255, 255, 0.5);
$color-white-40: rgba(255, 255, 255, 0.4);
$color-white-30: rgba(255, 255, 255, 0.3);
$color-white-20: rgba(255, 255, 255, 0.2);
$color-white-10: rgba(255, 255, 255, 0.1);
$color-white-05: rgba(255, 255, 255, 0.05);
$color-white-100: rgba(255, 255, 255, 1);

$color-primary-30: rgba(85, 126, 161, 0.3);
$color-primary-10: rgba(85, 126, 161, 0.1);

$color-bg-dark-90: rgba(15, 42, 68, 0.9);
$color-bg-primary-80: rgba(25, 57, 89, 0.8);
$color-bg-blue-30: rgba(0, 75, 141, 0.3);

// --------------------------------------------
// Shadows
// --------------------------------------------
$shadow-light: 0 2px 4px rgba(0, 75, 141, 0.1);
$shadow-medium: 0 4px 8px rgba(0, 75, 141, 0.15);
$shadow-heavy: 0 8px 16px rgba(0, 75, 141, 0.2);

// --------------------------------------------
// Border Radius
// --------------------------------------------
$border-radius: 4px;
$border-radius-large: 8px;
$border-radius-round: 50%;

// --------------------------------------------
// Spacing
// --------------------------------------------
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;
$spacing-xxl: 3rem;

// --------------------------------------------
// Blur
// --------------------------------------------
$blur-light: 5px;
$blur-medium: 10px;
$blur-heavy: 15px;
$blur-extra-heavy: 30px;

// --------------------------------------------
// Dust Particles
// --------------------------------------------
$dust-particle-count: 350;
$dust-particle-size: 3.0;
$dust-opacity: 0.8;
$dust-brightness: 0.8;
$dust-density: 0.99;
$dust-speed: 0.5;

// --------------------------------------------
// Breakpoints
// --------------------------------------------
$breakpoint-mobile: 480px;
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1024px;
$breakpoint-large: 1200px;
$breakpoint-xlarge: 1440px;

// --------------------------------------------
// Typography
// --------------------------------------------
$font-family-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
$font-family-mono: 'Courier New', monospace;

// --------------------------------------------
// Layout
// --------------------------------------------
$viewport-height: 100vh;
$page-height: 100vh;
$pre-header-height: 50px;
```

## Validation

After creating files:
1. ✓ All variables follow SCSS naming conventions
2. ✓ Variables are organized by category
3. ✓ Comments clearly separate sections
4. ✓ No CSS custom properties (converted to SCSS variables)

## Next Steps

- Task 4.3: Implement mixins in `_mixins.scss`
- Task 4.4: Implement nesting in component partials
- Task 4.5: Compile SCSS and validate output
- Task 4.6: Update documentation

**Status**: Tasks 4.1 and 4.2 COMPLETE

