# SCSS Nesting Structure Plan

**Date**: 2026-01-17
**Task**: mytechtoday-eth.3.3 - Nesting Structure Planning
**Source**: tools2025/style.css

## Nesting Principles

- **Maximum nesting depth**: 3-4 levels
- **Use nesting for**: Parent-child relationships, pseudo-classes, media queries
- **Avoid nesting for**: Unrelated selectors, overly specific selectors

## 1. TOC Nesting Structure

**Current CSS** (simplified):
```css
nav.toc { }
nav.toc li { }
nav.toc li a { }
nav.toc li ul { }
nav.toc li ul li { }
nav.toc li ul li a { }
```

**Proposed SCSS**:
```scss
nav.toc {
  // TOC container styles
  
  li {
    // List item styles
    
    a {
      // Link styles
      
      &:hover,
      &:focus {
        // Hover/focus states
      }
    }
    
    ul {
      // Nested list styles
      
      li {
        // Nested list item styles
        
        a {
          // Nested link styles
        }
      }
    }
  }
  
  &.toc-sticky {
    // Sticky TOC styles
  }
}
```

## 2. Blog Grid Nesting

**Proposed SCSS**:
```scss
.blog-grid {
  &.element.column-3.masonry-brick {
    // Base styles
    
    &[style] {
      // Override inline styles
    }
    
    &:hover {
      // Hover state
    }
    
    @include tablet {
      // Tablet responsive
    }
    
    @include mobile {
      // Mobile responsive
    }
  }
}
```

## 3. WordPress Integration Nesting

**Proposed SCSS**:
```scss
body {
  &.page-template-default,
  &.archive,
  &.blog {
    .entry-title {
      a {
        // Link styles
        
        &:hover {
          // Hover state
        }
      }
    }
    
    .entry-content {
      p, div {
        // Content styles
      }
    }
  }
}
```

## 4. Media Query Nesting

**Proposed SCSS**:
```scss
.element {
  // Base styles
  width: 100%;
  
  @include tablet {
    width: 50%;
  }
  
  @include desktop {
    width: 33.33%;
  }
  
  &:hover {
    // Hover state
    
    @include desktop {
      // Desktop-specific hover
    }
  }
}
```

## Nesting Depth Guidelines

- **Level 1**: Component/block (e.g., `nav.toc`)
- **Level 2**: Element (e.g., `li`)
- **Level 3**: Sub-element or modifier (e.g., `a`, `&:hover`)
- **Level 4**: Nested sub-element (e.g., `ul li a`) - USE SPARINGLY

## Benefits

- Improved readability
- Clear parent-child relationships
- Easier maintenance
- Reduced selector repetition

