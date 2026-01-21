# Responsive Breakpoints Guide

**Last Updated**: 2026-01-21  
**Purpose**: Comprehensive guide to responsive design breakpoints in myTech.Today SCSS framework

---

## Overview

The myTech.Today SCSS framework uses a **mobile-first** responsive design strategy with five standardized breakpoints for optimal display across all device sizes.

---

## Breakpoint Values

### Defined in `_variables.scss`

```scss
$breakpoint-mobile: 480px;      // Small phones (max-width)
$breakpoint-tablet: 768px;      // Tablets and large phones (max-width)
$breakpoint-desktop: 1024px;    // Desktop and laptops (min-width)
$breakpoint-large: 1200px;      // Large desktops (min-width)
$breakpoint-xlarge: 1440px;     // Extra large screens (min-width)
```

---

## Responsive Mixins

### Defined in `_mixins.scss`

All responsive mixins are available for use throughout the SCSS codebase. These mixins automatically generate media queries with the correct breakpoint values.

### 1. Mobile (480px and below)

**Mixin**: `@include mobile { ... }`  
**Media Query**: `@media (max-width: 480px)`  
**Target Devices**: Small phones (iPhone SE, older Android phones)

**Usage Example**:
```scss
.container {
  padding: $spacing-lg;
  
  @include mobile {
    padding: $spacing-sm;  // Reduce padding on small phones
  }
}
```

### 2. Tablet (768px and below)

**Mixin**: `@include tablet { ... }`  
**Media Query**: `@media (max-width: 768px)`  
**Target Devices**: Tablets, large phones (iPad, iPhone 12/13/14)

**Usage Example**:
```scss
.grid {
  grid-template-columns: repeat(3, 1fr);
  
  @include tablet {
    grid-template-columns: repeat(2, 1fr);  // 2 columns on tablets
  }
}
```

### 3. Tablet-Up (769px and above)

**Mixin**: `@include tablet-up { ... }`  
**Media Query**: `@media (min-width: 769px)`  
**Target Devices**: Tablets and larger screens

**Usage Example**:
```scss
.sidebar {
  display: none;
  
  @include tablet-up {
    display: block;  // Show sidebar on tablet and larger
  }
}
```

### 4. Desktop (1024px and above)

**Mixin**: `@include desktop { ... }`  
**Media Query**: `@media (min-width: 1024px)`  
**Target Devices**: Desktop computers, laptops

**Usage Example**:
```scss
.hero-title {
  font-size: $font-size-xl;
  
  @include desktop {
    font-size: $font-size-xxl;  // Larger font on desktop
  }
}
```

### 5. Desktop-Down (1023px and below)

**Mixin**: `@include desktop-down { ... }`  
**Media Query**: `@media (max-width: 1023px)`  
**Target Devices**: Mobile and tablet screens

**Usage Example**:
```scss
.navigation {
  @include desktop-down {
    position: fixed;
    bottom: 0;  // Bottom navigation on mobile/tablet
  }
}
```

### 6. Large (1200px and above)

**Mixin**: `@include large { ... }`  
**Media Query**: `@media (min-width: 1200px)`  
**Target Devices**: Large desktop screens

**Usage Example**:
```scss
.container {
  max-width: 1000px;
  
  @include large {
    max-width: 1140px;  // Wider container on large screens
  }
}
```

### 7. XLarge (1440px and above)

**Mixin**: `@include xlarge { ... }`  
**Media Query**: `@media (min-width: 1440px)`  
**Target Devices**: Extra large screens (27"+ monitors, 4K displays)

**Usage Example**:
```scss
.content {
  font-size: $font-size-base;
  
  @include xlarge {
    font-size: $font-size-md;  // Slightly larger text on huge screens
  }
}
```

### 8. Custom Breakpoint

**Mixin**: `@include breakpoint($width) { ... }`  
**Media Query**: `@media (max-width: $width)`  
**Purpose**: One-off responsive needs

**Usage Example**:
```scss
.special-element {
  @include breakpoint(900px) {
    display: none;  // Hide at exactly 900px and below
  }
}
```

---

## Mobile-First Strategy

### Base Styles (No Media Query)

Start with mobile styles as the default. These apply to all screen sizes unless overridden.

```scss
.card {
  width: 100%;           // Mobile: Full width
  padding: $spacing-sm;  // Mobile: Small padding
}
```

### Progressive Enhancement

Add complexity as screen size increases:

```scss
.card {
  width: 100%;           // Mobile: Full width
  padding: $spacing-sm;  // Mobile: Small padding

  @include tablet {
    width: 50%;          // Tablet: Half width
    padding: $spacing-md;
  }

  @include desktop {
    width: 33.33%;       // Desktop: Third width
    padding: $spacing-lg;
  }
}
```

---

## Best Practices

### 1. Nest Media Queries Inside Selectors

**✅ Recommended** (SCSS nesting):
```scss
.element {
  font-size: $font-size-base;

  @include tablet {
    font-size: $font-size-sm;
  }
}
```

**❌ Avoid** (Separate media queries):
```scss
.element {
  font-size: $font-size-base;
}

@media (max-width: 768px) {
  .element {
    font-size: $font-size-sm;
  }
}
```

### 2. Use Semantic Mixin Names

**✅ Recommended**:
```scss
@include mobile { ... }
@include tablet { ... }
@include desktop { ... }
```

**❌ Avoid**:
```scss
@media (max-width: 480px) { ... }
@media (max-width: 768px) { ... }
```

### 3. Test All Breakpoints

Always test responsive designs at:
- 375px (iPhone SE)
- 480px (Small phones)
- 768px (Tablets)
- 1024px (Desktop)
- 1440px (Large screens)

### 4. Consider Touch Targets

On mobile/tablet, ensure interactive elements are at least 44x44px for touch accessibility.

```scss
.button {
  padding: $spacing-sm $spacing-md;

  @include tablet {
    min-height: 44px;  // Touch-friendly size
    min-width: 44px;
  }
}
```

---

## Common Responsive Patterns

### 1. Grid Columns

```scss
.grid {
  display: grid;
  grid-template-columns: 1fr;  // Mobile: 1 column
  gap: $spacing-md;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);  // Tablet: 2 columns
  }

  @include desktop {
    grid-template-columns: repeat(3, 1fr);  // Desktop: 3 columns
  }

  @include large {
    grid-template-columns: repeat(4, 1fr);  // Large: 4 columns
  }
}
```

### 2. Font Scaling

```scss
h1 {
  font-size: $font-size-xl;  // Mobile: 24px

  @include tablet {
    font-size: $font-size-xxl;  // Tablet: 32px
  }

  @include desktop {
    font-size: 2.5rem;  // Desktop: 40px
  }
}
```

### 3. Navigation Toggle

```scss
.nav-menu {
  display: none;  // Mobile: Hidden by default

  &.active {
    display: block;  // Mobile: Show when active
  }

  @include desktop {
    display: flex !important;  // Desktop: Always visible
  }
}
```

### 4. Spacing Adjustments

```scss
.section {
  padding: $spacing-md 0;  // Mobile: Medium padding

  @include tablet {
    padding: $spacing-lg 0;  // Tablet: Large padding
  }

  @include desktop {
    padding: $spacing-xxl 0;  // Desktop: Extra large padding
  }
}
```

---

## Breakpoint Usage Statistics

Based on analysis of original CSS (7,939 lines):

- **50+ instances** of responsive patterns
- **Most common breakpoint**: 768px (tablet)
- **Most common pattern**: Grid column adjustments
- **Most common use case**: Font size scaling

---

## Testing Checklist

- [ ] Test at 375px (iPhone SE)
- [ ] Test at 480px (Small phones)
- [ ] Test at 768px (iPad portrait)
- [ ] Test at 1024px (iPad landscape / small laptop)
- [ ] Test at 1200px (Desktop)
- [ ] Test at 1440px (Large desktop)
- [ ] Test landscape orientation on mobile/tablet
- [ ] Verify touch targets are 44x44px minimum
- [ ] Check text readability at all sizes
- [ ] Verify images scale properly

---

## References

- **Variables**: `tools2025/_variables.scss` (lines 162-177)
- **Mixins**: `tools2025/_mixins.scss` (lines 101-185)
- **SCSS Guide**: `tools2025/SCSS-GUIDE.md`
- **Maintenance Guide**: `tools2025/SCSS-MAINTENANCE-GUIDE.md`

---

**Version**: 1.0
**Author**: myTech.Today
**Contact**: sales@mytech.today


