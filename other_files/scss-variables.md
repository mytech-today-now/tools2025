# SCSS Variables Extraction Report

**Date**: 2026-01-16 19:11:02
**Source**: tools2025/style.css

## 1. CSS Custom Properties → SCSS Variables

```scss
// Colors
$primary-color: #557ea1;
$secondary-color: #10a37f;
$tertiary-color: #8b5a3c;
$danger-color: #d32f2f;
$success-color: #1976d2;
$border-color: #d1dce5;
$background-color: #193959;
$text-color: #929ba4;


// Spacing
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;
$spacing-xxl: 3rem;


// Border Radius
$border-radius: 4px;
$border-radius-large: 8px;


// Shadows
$shadow-light: 0 2px 4px rgba(0, 75, 141, 0.1);
$shadow-medium: 0 4px 8px rgba(0, 75, 141, 0.15);
$shadow-heavy: 0 8px 16px rgba(0, 75, 141, 0.2);


// Blur
$blur-light: 5px;
$blur-medium: 10px;
$blur-heavy: 15px;
$blur-extra-heavy: 30px;


// Dust Particles
$dust-particle-count: 350;
$dust-particle-size: 3.0;
$dust-opacity: 0.8;
$dust-brightness: 0.8;
$dust-density: 0.99;
$dust-speed: 0.5;

```

## 2. Breakpoints

```scss
$breakpoint-mobile: 480px;
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1024px;
$breakpoint-large: 1200px;
$breakpoint-xlarge: 1440px;
```

## 3. Font Families

```scss
$font-family--apple-system--BlinkMacSystemFont---Segoe-UI---Arial--sans-serif--important: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif !important;
$font-family--Courier-New---monospace--important: 'Courier New', monospace !important;
$font-family--apple-system--BlinkMacSystemFont---Segoe-UI---Arial--sans-serif: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
$font-family--Courier-New---Courier--monospace: 'Courier New', Courier, monospace;
$font-family--Courier-New---monospace: 'Courier New', monospace;
$font-family--FontAwesome---important: 'FontAwesome' !important;
$font-family-inherit: inherit;
$font-family-inherit--important: inherit !important;

```

## 4. Common RGBA Colors

```scss
$color-rgba-rgba-0-0-0-0.8-: rgba(0, 0, 0, 0.8);
$color-rgba-rgba-255-255-255-0.1-: rgba(255, 255, 255, 0.1);
$color-rgba-rgba-0-0-0-0.3-: rgba(0, 0, 0, 0.3);
$color-rgba-rgba-255-255-255-0.95-: rgba(255, 255, 255, 0.95);
$color-rgba-rgba-255-255-255-0.2-: rgba(255, 255, 255, 0.2);
$color-rgba-rgba-255-255-255-0.9-: rgba(255, 255, 255, 0.9);
$color-rgba-rgba-0-0-0-0.6-: rgba(0, 0, 0, 0.6);
$color-rgba-rgba-0-0-0-0.2-: rgba(0, 0, 0, 0.2);
$color-rgba-rgba-0-0-0-0.5-: rgba(0, 0, 0, 0.5);
$color-rgba-rgba-255-255-255-0.3-: rgba(255, 255, 255, 0.3);

```

## Notes

- All CSS custom properties should be converted to SCSS variables
- Breakpoints should use SCSS variables for consistency
- Common rgba() values should be extracted as variables
- Font families should be extracted as variables
