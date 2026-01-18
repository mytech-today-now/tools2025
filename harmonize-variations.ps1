# CSS Variation Harmonization Script
# Standardizes color, spacing, border-radius, and box-shadow values

$inputFile = "tools2025/style-optimized.css"
$outputFile = "tools2025/style-harmonized.css"

Write-Host "=== CSS VARIATION HARMONIZATION ===" -ForegroundColor Cyan
Write-Host ""

# Read the CSS file
$content = Get-Content $inputFile -Raw

Write-Host "Analyzing variations..." -ForegroundColor Yellow
Write-Host ""

# Track changes
$changesLog = @()
$changeCount = 0

# 1. Harmonize rgba(255, 255, 255, 0.1) variations
Write-Host "1. Harmonizing white overlay colors..." -ForegroundColor Green

# rgba(255, 255, 255, 0.05) -> keep as is (very light)
# rgba(255, 255, 255, 0.1) -> keep as is (light)
# rgba(255, 255, 255, 0.2) -> keep as is (medium-light)
# rgba(255, 255, 255, 0.3) -> keep as is (medium)
# rgba(255, 255, 255, 0.5) -> keep as is (medium-heavy)
# rgba(255, 255, 255, 0.9) -> keep as is (heavy)
# rgba(255, 255, 255, 0.95) -> keep as is (very heavy)
# rgba(255, 255, 255, 0.98) -> standardize to 0.95

$before = ($content | Select-String "rgba\(255, 255, 255, 0\.98\)" -AllMatches).Matches.Count
$content = $content -replace 'rgba\(255, 255, 255, 0\.98\)', 'rgba(255, 255, 255, 0.95)'
$after = ($content | Select-String "rgba\(255, 255, 255, 0\.98\)" -AllMatches).Matches.Count
if ($before -gt 0) {
    $changesLog += "Standardized rgba(255, 255, 255, 0.98) -> rgba(255, 255, 255, 0.95): $before occurrences"
    $changeCount += $before
    Write-Host "  rgba(255, 255, 255, 0.98) -> 0.95: $before changes"
}

# 2. Harmonize black overlay colors
Write-Host "2. Harmonizing black overlay colors..." -ForegroundColor Green

# rgba(0, 0, 0, 0.2) -> keep as is (light)
# rgba(0, 0, 0, 0.3) -> keep as is (medium-light)
# rgba(0, 0, 0, 0.4) -> standardize to 0.3
# rgba(0, 0, 0, 0.5) -> keep as is (medium)
# rgba(0, 0, 0, 0.6) -> keep as is (medium-heavy)
# rgba(0, 0, 0, 0.8) -> keep as is (heavy)

$before = ($content | Select-String "rgba\(0, 0, 0, 0\.4\)" -AllMatches).Matches.Count
$content = $content -replace 'rgba\(0, 0, 0, 0\.4\)', 'rgba(0, 0, 0, 0.3)'
$after = ($content | Select-String "rgba\(0, 0, 0, 0\.4\)" -AllMatches).Matches.Count
if ($before -gt 0) {
    $changesLog += "Standardized rgba(0, 0, 0, 0.4) -> rgba(0, 0, 0, 0.3): $before occurrences"
    $changeCount += $before
    Write-Host "  rgba(0, 0, 0, 0.4) -> 0.3: $before changes"
}

# 3. Harmonize border-radius values
Write-Host "3. Harmonizing border-radius values..." -ForegroundColor Green

# 3px -> 4px (standardize to var(--border-radius))
$before = ($content | Select-String "border-radius:\s*3px" -AllMatches).Matches.Count
$content = $content -replace 'border-radius:\s*3px', 'border-radius: 4px'
if ($before -gt 0) {
    $changesLog += "Standardized border-radius: 3px -> 4px: $before occurrences"
    $changeCount += $before
    Write-Host "  3px -> 4px: $before changes"
}

# 6px -> 8px (standardize to var(--border-radius-large))
$before = ($content | Select-String "border-radius:\s*6px" -AllMatches).Matches.Count
$content = $content -replace 'border-radius:\s*6px', 'border-radius: 8px'
if ($before -gt 0) {
    $changesLog += "Standardized border-radius: 6px -> 8px: $before occurrences"
    $changeCount += $before
    Write-Host "  6px -> 8px: $before changes"
}

# 4. Harmonize box-shadow blur values
Write-Host "4. Harmonizing box-shadow values..." -ForegroundColor Green

# Standardize similar box-shadow values
# 0 2px 8px rgba(0, 0, 0, 0.2) -> use var(--shadow-light) where appropriate
# This is complex, so we'll document it for manual review

$uniqueShadows = [regex]::Matches($content, 'box-shadow:\s*([^;]+);') | 
    ForEach-Object { $_.Groups[1].Value } | 
    Group-Object | 
    Sort-Object Count -Descending | 
    Select-Object -First 10

Write-Host "  Top 10 box-shadow values (for manual review):"
$uniqueShadows | ForEach-Object {
    Write-Host "    $($_.Count)x: $($_.Name)"
}

# 5. Harmonize spacing values (hardcoded px to variables)
Write-Host "5. Harmonizing spacing values..." -ForegroundColor Green

# Common hardcoded values to standardize
# 10px -> var(--spacing-sm) where appropriate
# 20px -> var(--spacing-md) where appropriate
# This requires context, so we'll document for manual review

$hardcodedPadding = [regex]::Matches($content, 'padding:\s*([^;]+);') | 
    Where-Object { $_.Groups[1].Value -match '\d+px' -and $_.Groups[1].Value -notmatch 'var\(' } |
    ForEach-Object { $_.Groups[1].Value } |
    Group-Object |
    Sort-Object Count -Descending |
    Select-Object -First 10

Write-Host "  Top 10 hardcoded padding values (for manual review):"
$hardcodedPadding | ForEach-Object {
    Write-Host "    $($_.Count)x: $($_.Name)"
}

# Write the harmonized file
$content | Set-Content $outputFile -NoNewline

Write-Host ""
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Total automated changes: $changeCount"
Write-Host ""

Write-Host "=== CHANGES LOG ===" -ForegroundColor Cyan
if ($changesLog.Count -gt 0) {
    $changesLog | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "  No automated changes made"
}
Write-Host ""

Write-Host "Harmonized CSS saved to: $outputFile" -ForegroundColor Green
Write-Host ""
Write-Host "Manual review required for:" -ForegroundColor Yellow
Write-Host "  - Box-shadow values (consider using CSS variables)"
Write-Host "  - Hardcoded spacing values (consider using CSS variables)"
Write-Host "  - Color variations (review if more consolidation is possible)"

