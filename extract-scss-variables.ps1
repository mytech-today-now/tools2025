# Extract SCSS Variables from CSS
# Analyzes CSS file and extracts potential SCSS variables

$cssFile = "tools2025/style.css"

Write-Host "=== SCSS VARIABLE EXTRACTION ===" -ForegroundColor Cyan
Write-Host ""

# Read CSS content
$content = Get-Content $cssFile -Raw

# 1. Extract existing CSS custom properties
Write-Host "1. EXISTING CSS CUSTOM PROPERTIES" -ForegroundColor Yellow
Write-Host "-----------------------------------"

$cssVarPattern = '--([a-zA-Z0-9-]+):\s*([^;]+);'
$cssVars = [regex]::Matches($content, $cssVarPattern) | ForEach-Object {
    [PSCustomObject]@{
        Name = $_.Groups[1].Value
        Value = $_.Groups[2].Value.Trim()
    }
}

Write-Host "Found $($cssVars.Count) CSS custom properties"
Write-Host ""
Write-Host "SCSS Variable Mapping:"
$cssVars | ForEach-Object {
    $scssName = "`$$($_.Name)"
    $value = $_.Value
    Write-Host "  ${scssName}: ${value};"
}
Write-Host ""

# 2. Extract color values (rgba, rgb, hex)
Write-Host "2. COLOR VALUES" -ForegroundColor Yellow
Write-Host "----------------"

$rgbaPattern = 'rgba\(([^)]+)\)'
$rgbaValues = [regex]::Matches($content, $rgbaPattern) | 
    ForEach-Object { $_.Value } | 
    Group-Object | 
    Sort-Object Count -Descending | 
    Select-Object -First 20

Write-Host "Top 20 rgba() values (candidates for variables):"
$rgbaValues | ForEach-Object {
    $varName = "`$color-rgba-" + ($_.Name -replace '[(),\s]', '-' -replace '--+', '-')
    Write-Host "  $($_.Count)x: $($_.Name)"
    Write-Host "      → $varName"
}
Write-Host ""

# 3. Extract spacing values
Write-Host "3. SPACING VALUES" -ForegroundColor Yellow
Write-Host "------------------"

# Find hardcoded pixel values
$pxPattern = '\b(\d+)px\b'
$pxValues = [regex]::Matches($content, $pxPattern) | 
    ForEach-Object { $_.Groups[1].Value } | 
    Group-Object | 
    Sort-Object { [int]$_.Name } | 
    Where-Object { [int]$_.Name -le 100 }

Write-Host "Common pixel values (candidates for spacing variables):"
$pxValues | ForEach-Object {
    $px = [int]$_.Name
    $rem = [math]::Round($px / 16, 3)
    Write-Host "  $($_.Count)x: ${px}px (${rem}rem)"
}
Write-Host ""

# 4. Extract breakpoints
Write-Host "4. BREAKPOINTS" -ForegroundColor Yellow
Write-Host "---------------"

$breakpointPattern = '@media[^{]*\((?:min-width|max-width):\s*(\d+)px\)'
$breakpoints = [regex]::Matches($content, $breakpointPattern) | 
    ForEach-Object { $_.Groups[1].Value } | 
    Group-Object | 
    Sort-Object { [int]$_.Name }

Write-Host "Breakpoints found:"
$breakpoints | ForEach-Object {
    $bp = [int]$_.Name
    $varName = switch ($bp) {
        { $_ -le 480 } { "`$breakpoint-mobile" }
        { $_ -le 768 } { "`$breakpoint-tablet" }
        { $_ -le 1024 } { "`$breakpoint-desktop" }
        { $_ -le 1200 } { "`$breakpoint-large" }
        default { "`$breakpoint-xlarge" }
    }
    Write-Host "  $($_.Count)x: ${bp}px → $varName"
}
Write-Host ""

# 5. Extract font families
Write-Host "5. FONT FAMILIES" -ForegroundColor Yellow
Write-Host "-----------------"

$fontPattern = 'font-family:\s*([^;]+);'
$fonts = [regex]::Matches($content, $fontPattern) | 
    ForEach-Object { $_.Groups[1].Value.Trim() } | 
    Group-Object | 
    Sort-Object Count -Descending

Write-Host "Font families found:"
$fonts | ForEach-Object {
    Write-Host "  $($_.Count)x: $($_.Name)"
}
Write-Host ""

# 6. Extract font sizes
Write-Host "6. FONT SIZES" -ForegroundColor Yellow
Write-Host "--------------"

$fontSizePattern = 'font-size:\s*([^;]+);'
$fontSizes = [regex]::Matches($content, $fontSizePattern) | 
    ForEach-Object { $_.Groups[1].Value.Trim() } | 
    Group-Object | 
    Sort-Object Count -Descending | 
    Select-Object -First 15

Write-Host "Top 15 font sizes:"
$fontSizes | ForEach-Object {
    Write-Host "  $($_.Count)x: $($_.Name)"
}
Write-Host ""

# Save report
$reportPath = "tools2025/scss-variables.md"
$report = @"
# SCSS Variables Extraction Report

**Date**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
**Source**: tools2025/style.css

## 1. CSS Custom Properties → SCSS Variables

``````scss
// Colors
$($cssVars | Where-Object { $_.Name -match 'color' } | ForEach-Object { "`$$($_.Name): $($_.Value);" } | Out-String)

// Spacing
$($cssVars | Where-Object { $_.Name -match 'spacing' } | ForEach-Object { "`$$($_.Name): $($_.Value);" } | Out-String)

// Border Radius
$($cssVars | Where-Object { $_.Name -match 'border-radius' } | ForEach-Object { "`$$($_.Name): $($_.Value);" } | Out-String)

// Shadows
$($cssVars | Where-Object { $_.Name -match 'shadow' } | ForEach-Object { "`$$($_.Name): $($_.Value);" } | Out-String)

// Blur
$($cssVars | Where-Object { $_.Name -match 'blur' } | ForEach-Object { "`$$($_.Name): $($_.Value);" } | Out-String)

// Dust Particles
$($cssVars | Where-Object { $_.Name -match 'dust' } | ForEach-Object { "`$$($_.Name): $($_.Value);" } | Out-String)
``````

## 2. Breakpoints

``````scss
`$breakpoint-mobile: 480px;
`$breakpoint-tablet: 768px;
`$breakpoint-desktop: 1024px;
`$breakpoint-large: 1200px;
`$breakpoint-xlarge: 1440px;
``````

## 3. Font Families

``````scss
$($fonts | ForEach-Object { "`$font-family-" + ($_.Name -replace '[^a-zA-Z0-9]', '-') + ": $($_.Name);" } | Out-String)
``````

## 4. Common RGBA Colors

``````scss
$($rgbaValues | Select-Object -First 10 | ForEach-Object {
    $varName = "color-rgba-" + ($_.Name -replace '[(),\s]', '-' -replace '--+', '-')
    $colorValue = $_.Name
    "`$${varName}: ${colorValue};"
} | Out-String)
``````

## Notes

- All CSS custom properties should be converted to SCSS variables
- Breakpoints should use SCSS variables for consistency
- Common rgba() values should be extracted as variables
- Font families should be extracted as variables
"@

$report | Set-Content $reportPath

Write-Host "Report saved to: $reportPath" -ForegroundColor Green

