# SCSS Partials Structure Plan

**Task**: mytechtoday-aw7n - Partial Structure Planning  
**Date**: 2026-01-21  
**Status**: Complete

## Overview

This document outlines the SCSS partial structure for the tools2025 project. The goal is to organize CSS into logical, maintainable partials following SCSS best practices.

## Current Structure

```
tools2025/
├── _variables.scss    ✓ Complete (174 lines)
├── _mixins.scss       ✓ Complete (319 lines)
├── style.scss         ✓ Complete (463 lines - nesting examples)
└── style.css          ✓ Compiled (558 lines)
```

## Proposed Partial Structure

### Core Files (Already Complete)
1. **_variables.scss** - All SCSS variables (colors, spacing, typography, etc.)
2. **_mixins.scss** - Reusable mixins (backdrop-blur, gradients, responsive, etc.)

### Component Partials (To Be Created)
3. **_base.scss** - Base styles (body, section, general elements)
4. **_toc.scss** - Table of Contents navigation component
5. **_dust.scss** - Dust container and particle effects
6. **_blog.scss** - Blog grid and masonry layout
7. **_iframe.scss** - Iframe container and aspect ratio
8. **_series-navigation.scss** - Series navigation component

### Main File
9. **style.scss** - Main SCSS file that imports all partials

## Partial Breakdown

### 1. _base.scss (Lines: ~80)
**Purpose**: Foundation styles for body, sections, and general elements

**Content**:
- Body element with gradient backgrounds
- Pseudo-elements (::before, ::after)
- WordPress page templates
- Section element with backdrop filter
- General typography and layout

**Nesting Depth**: 2-3 levels
**Dependencies**: _variables.scss, _mixins.scss

### 2. _toc.scss (Lines: ~180)
**Purpose**: Table of Contents navigation component

**Content**:
- TOC container (nav.toc)
- TOC title (h2)
- TOC list structure (ul > li > a)
- Nested lists (3 levels deep)
- Sticky TOC modifier (.toc-sticky)
- Responsive adjustments

**Nesting Depth**: 3-4 levels (maximum allowed)
**Dependencies**: _variables.scss, _mixins.scss

### 3. _dust.scss (Lines: ~20)
**Purpose**: Dust particle container and effects

**Content**:
- #dust-container fixed positioning
- Opacity and transitions
- Responsive hiding (mobile/tablet)

**Nesting Depth**: 1-2 levels
**Dependencies**: _variables.scss, _mixins.scss

### 4. _blog.scss (Lines: ~40)
**Purpose**: Blog grid and masonry layout

**Content**:
- .blog-grid.element.column-3.masonry-brick
- Responsive column widths (33% → 50% → 100%)
- Hover effects
- Attribute selector overrides

**Nesting Depth**: 2-3 levels
**Dependencies**: _variables.scss, _mixins.scss

### 5. _iframe.scss (Lines: ~30)
**Purpose**: Iframe container with aspect ratio

**Content**:
- .iframe-container positioning
- 16:9 aspect ratio (padding-top: 56.25%)
- Iframe absolute positioning
- Border radius and overflow

**Nesting Depth**: 2 levels
**Dependencies**: _variables.scss, _mixins.scss

### 6. _series-navigation.scss (Lines: ~150)
**Purpose**: Series navigation component for multi-part blog posts

**Content**:
- .series-navigation container
- .series-nav-header
- .series-nav-list
- .series-nav-list li a (with hover/focus states)
- .current article highlight
- .article-card (for overview pages)
- Responsive design (tablet/mobile)

**Nesting Depth**: 2-3 levels
**Dependencies**: _variables.scss, _mixins.scss

## Import Order in style.scss

```scss
// 1. Configuration
@import 'variables';
@import 'mixins';

// 2. Base Styles
@import 'base';

// 3. Components (alphabetical)
@import 'blog';
@import 'dust';
@import 'iframe';
@import 'series-navigation';
@import 'toc';
```

## File Size Estimates

| File | Lines | Purpose |
|------|-------|---------|
| _variables.scss | 174 | ✓ Complete |
| _mixins.scss | 319 | ✓ Complete |
| _base.scss | ~80 | Base styles |
| _toc.scss | ~180 | TOC navigation |
| _dust.scss | ~20 | Dust effects |
| _blog.scss | ~40 | Blog grid |
| _iframe.scss | ~30 | Iframe container |
| _series-navigation.scss | ~150 | Series navigation |
| style.scss | ~30 | Main import file |
| **Total** | **~1023** | **All partials** |

## Compilation

**Command**: `sass style.scss style.css`  
**Watch**: `sass --watch style.scss:style.css`  
**Output**: `style.css` (558 lines compiled)

## Validation Checklist

- [ ] All partials created
- [ ] style.scss imports all partials in correct order
- [ ] Compiled CSS matches original style.css
- [ ] All HTML files work correctly
- [ ] No breaking changes
- [ ] Performance maintained

## Next Steps

1. Create _base.scss partial
2. Create _toc.scss partial
3. Create _dust.scss partial
4. Create _blog.scss partial
5. Create _iframe.scss partial
6. Create _series-navigation.scss partial
7. Update style.scss to import all partials
8. Compile and test
9. Validate against all HTML files

