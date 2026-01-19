# SCSS Parallel Maintenance Guide

**Task**: mytechtoday-brvw - Parallel Maintenance Setup
**Date**: 2026-01-19
**Status**: COMPLETE

---

## Overview

This guide documents the parallel maintenance workflow for CSS and SCSS files in the tools2025 directory. Both `style.css` and `style.scss` are maintained in parallel to support:

1. **Development**: SCSS source files with variables, mixins, and nesting
2. **Production**: Compiled CSS for direct browser use
3. **Compatibility**: Existing HTML files continue to reference style.css

---

## File Structure

```
tools2025/
├── style.scss          # Main SCSS file (source of truth for new development)
├── _variables.scss     # SCSS variables (46 CSS custom properties)
├── _mixins.scss        # SCSS mixins (11 mixins)
├── style.css           # Compiled CSS (production file)
├── style.css.backup    # Backup of original CSS
├── compile-scss.ps1    # Compilation automation script
└── validate-scss-compilation.ps1  # Validation script
```

---

## Compilation Commands

### Using npm Scripts (Recommended)

```bash
# Compile SCSS to CSS (production)
npm run compile-css

# Watch for changes and auto-compile (development)
npm run compile-css:watch

# Compile with compression (production deployment)
npm run compile-css:compressed

# Compile with source maps (debugging)
npm run compile-css:dev

# Validate compilation
npm run validate-css
```

### Using PowerShell Scripts

```powershell
# Compile and validate
.\tools2025\compile-scss.ps1

# Validate existing compilation
.\tools2025\validate-scss-compilation.ps1
```

### Using Sass CLI Directly

```bash
# Basic compilation
sass tools2025/style.scss tools2025/style.css

# Watch mode
sass --watch tools2025/style.scss:tools2025/style.css

# Compressed output
sass --style=compressed tools2025/style.scss tools2025/style.css

# With source maps
sass --source-map tools2025/style.scss tools2025/style.css
```

---

## Workflow

### Making CSS Changes

**Option 1: Edit SCSS (Recommended for new development)**
1. Edit `style.scss`, `_variables.scss`, or `_mixins.scss`
2. Run `npm run compile-css` to compile to CSS
3. Test HTML files with compiled CSS
4. Commit both SCSS and CSS files

**Option 2: Edit CSS (Quick fixes)**
1. Edit `style.css` directly
2. Manually update `style.scss` to match
3. Verify compilation produces identical output
4. Commit both files

### Development Workflow

```bash
# Start watch mode for automatic compilation
npm run compile-css:watch

# Make changes to SCSS files
# Changes automatically compile to style.css

# Test in browser (HTML files reference style.css)
# Commit when satisfied
```

---

## Git Tracking

Both CSS and SCSS files are tracked in git:

```bash
# Add both files when making changes
git add tools2025/style.css tools2025/style.scss

# Commit with descriptive message
git commit -m "Update styles: [description of changes]"
```

**Note**: Do NOT add `style.css` to `.gitignore`. Both files must be tracked for parallel maintenance.

---

## Validation Checklist

Before committing changes:

- [ ] SCSS compiles without errors
- [ ] Compiled CSS matches expected output
- [ ] HTML files render correctly with compiled CSS
- [ ] No visual regressions (screenshot comparison)
- [ ] File sizes are reasonable (no unexpected bloat)
- [ ] Both style.css and style.scss are committed

---

## SCSS Features Used

### Variables (_variables.scss)
- 46 CSS custom properties
- Colors, spacing, breakpoints, typography
- Example: `$primary-color`, `$spacing-md`, `$breakpoint-tablet`

### Mixins (_mixins.scss)
- 11 reusable mixins
- Backdrop blur, gradients, responsive breakpoints, flexbox, typography
- Example: `@include backdrop-blur(10px)`, `@include mobile { ... }`

### Nesting (style.scss)
- Maximum 3-4 levels deep
- Parent-child relationships, pseudo-classes, media queries
- Example: `nav.toc { li { a { &:hover { ... } } } }`

---

## Troubleshooting

### Compilation Errors

**Error**: `Error: Can't find stylesheet to import`
**Solution**: Verify `_variables.scss` and `_mixins.scss` exist in tools2025/

**Error**: `Error: Invalid CSS`
**Solution**: Check SCSS syntax (curly braces, semicolons, proper nesting)

### Visual Differences

**Issue**: Compiled CSS looks different from original
**Solution**: Run `npm run validate-css` to compare file sizes and structure

### Performance Issues

**Issue**: CSS file is larger than expected
**Solution**: Use compressed compilation: `npm run compile-css:compressed`

---

## Future Enhancements

Planned improvements for SCSS workflow:

1. **SCSS Partials**: Break style.scss into component-specific partials
2. **Advanced Mixins**: Add more utility mixins for common patterns
3. **CSS Grid Mixins**: Simplify grid layouts
4. **Animation Mixins**: Reusable animation patterns
5. **Theme Variables**: Support for multiple color themes

---

## References

- **OpenSpec Proposal**: `openspec/changes/convert-css-to-scss/`
- **SCSS Documentation**: `tools2025/other_files/scss-implementation-complete.md`
- **Nesting Guide**: `tools2025/other_files/scss-nesting-plan.md`
- **Variables Guide**: `tools2025/other_files/scss-variables.md`
- **Mixins Guide**: `tools2025/other_files/scss-mixins.md`

---

**Last Updated**: 2026-01-19
**Maintained By**: myTech.Today Development Team

