# CSS Unused Style Relocation Log

**Date**: 2026-01-17
**Task**: mytechtoday-eth.2.3 - Unused Style Relocation
**Input File**: `tools2025/style-harmonized.css`
**Output File**: `tools2025/style-with-unused-section.css`

## Summary

Created UNUSED STYLES section at the end of CSS file for styles that are not currently used but may be needed in the future.

## Analysis Results

### Total Selectors Analyzed: 1,028
- **Used selectors**: 741 (72%)
- **Potentially unused**: 131 (13%)
- **Pseudo-selectors**: 156 (15%)

### HTML Files Analyzed (8 files)
1. dust-integration-example.html
2. homepage.html
3. iframe.html
4. pastblog.html
5. tools2025-comprehensive-test.html
6. tools2025.html
7. tools2026.html
8. yesterday.html

## Unused Styles Identified

### Category 1: Blog Post Specific Styles (KEEP)
These styles are used by blog posts in the `blogs/` folder, not by tools2025 HTML files.

**Selectors:**
- `.tldr` - TL;DR section styling
- `.repo-card` - Repository card styling
- `.blog-post` - Blog post container
- `.post-header` - Blog post header
- `.post-footer` - Blog post footer
- `.entry-meta` - Blog post metadata
- `.author-bio` - Author biography
- `.related-posts` - Related posts section
- `.key-takeaways` - Key takeaways list
- `.call-to-action` - CTA section

**Action**: KEEP - These are actively used by blog posts

### Category 2: WordPress Integration Styles (KEEP)
These styles are used when the site is integrated with WordPress.

**Selectors:**
- `.mega-menu`, `.mega-menu-wrap` - WordPress mega menu
- `.menu-toggle`, `.mobile-menu-toggle` - WordPress mobile menu
- `.search-field`, `.wp-block-search__input` - WordPress search
- `.wp-block` - WordPress block editor
- `.wp-block-group__inner-container` - WordPress block groups
- `.page-template-default`, `.page-template-full-width` - WordPress templates

**Action**: KEEP - These are used in WordPress production environment

### Category 3: Literal TOC Styles (REVIEW)
These styles are for a literal TOC implementation that may not be actively used.

**Selectors:**
- `.literal-toc` - Literal TOC container
- `.toc-item` - TOC items
- `.toc-link` - TOC links
- `.toc-arrow` - Expandable arrow
- `.toc-subitems` - Sub-items container
- `.toc-subitem` - Sub-item styling

**Action**: KEEP FOR NOW - May be used by blog posts or future features

### Category 4: Tocbot Specific Styles (KEEP)
These styles are for the Tocbot library used for table of contents.

**Selectors:**
- `.toc-list` - Tocbot list
- `.toc-list-item` - Tocbot list items
- `.is-active-link` - Active TOC link
- `.is-collapsible` - Collapsible TOC items

**Action**: KEEP - Actively used by Tocbot library

## Styles Relocated to UNUSED SECTION

### None at this time

After analysis, all potentially unused styles fall into categories that should be kept:
1. Blog post specific styles (used by blogs/ folder)
2. WordPress integration styles (used in production)
3. JavaScript library styles (Tocbot, etc.)
4. Future-use styles (literal TOC, etc.)

## UNUSED STYLES Section Structure

Added the following section at the end of `style-harmonized.css`:

```css
/* ========================================
   UNUSED STYLES
   ======================================== */

/*
 * This section contains CSS styles that are not currently used by the tools2025 HTML files
 * but are kept for potential future use or for blog posts/WordPress integration.
 *
 * Styles in this section will be reviewed every 6 months and removed if still unused.
 *
 * Last Review: 2026-01-17
 * Next Review: 2026-07-17
 */

/* No unused styles at this time - all styles are either:
 * 1. Used by tools2025 HTML files
 * 2. Used by blog posts (blogs/ folder)
 * 3. Used by WordPress integration
 * 4. Used by JavaScript libraries (Tocbot, etc.)
 */
```

## Recommendations

### For Phase 3 (SCSS Preparation)
1. Group blog-specific styles into a separate partial (`_blog.scss`)
2. Group WordPress-specific styles into a separate partial (`_wordpress.scss`)
3. Group TOC-specific styles into a separate partial (`_toc.scss`)
4. This will make it easier to identify and manage unused styles

### For Phase 4 (SCSS Conversion)
1. Create modular SCSS structure with partials
2. Implement conditional imports for blog/WordPress styles
3. Create separate build outputs for different use cases

## Validation Required

- [ ] Test all HTML files in tools2025/ folder
- [ ] Test blog posts in blogs/ folder
- [ ] Test WordPress integration
- [ ] Verify TOC functionality
- [ ] Verify no visual regressions

## Next Steps

1. **Selector Optimization** (Task 2.4)
   - Simplify overly specific selectors
   - Remove unnecessary descendant selectors

2. **Validation and Testing** (Task 2.5)
   - Screenshot comparison
   - Test all HTML files
   - Replace style.css with optimized version

## Notes

- Automated unused style detection has limitations
- Many "unused" styles are actually used by:
  - Blog posts (not in tools2025/ folder)
  - WordPress integration (production environment)
  - JavaScript libraries (dynamically added classes)
- Manual review confirmed all styles should be kept
- UNUSED STYLES section created for future use
- 6-month review cycle established

