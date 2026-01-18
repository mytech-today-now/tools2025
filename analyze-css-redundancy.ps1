# CSS Redundancy Analysis Script
# Analyzes style.css for redundancies, outdated vendor prefixes, and duplicate selectors

$cssFile = "tools2025/style.css"
$content = Get-Content $cssFile -Raw
$lines = Get-Content $cssFile

Write-Host "=== CSS REDUNDANCY ANALYSIS ===" -ForegroundColor Cyan
Write-Host ""

# 1. Vendor Prefix Analysis
Write-Host "1. VENDOR PREFIX ANALYSIS" -ForegroundColor Yellow
Write-Host "-------------------------"

$webkitBackdrop = ($content | Select-String "-webkit-backdrop-filter" -AllMatches).Matches.Count
$webkitTransform = ($content | Select-String "-webkit-transform:" -AllMatches).Matches.Count
$webkitMask = ($content | Select-String "-webkit-mask:" -AllMatches).Matches.Count
$webkitColumn = ($content | Select-String "-webkit-column" -AllMatches).Matches.Count
$webkitScrollbar = ($content | Select-String "::-webkit-scrollbar" -AllMatches).Matches.Count
$mozColumn = ($content | Select-String "-moz-column" -AllMatches).Matches.Count
$mozOsx = ($content | Select-String "-moz-osx-font-smoothing" -AllMatches).Matches.Count
$msTransform = ($content | Select-String "-ms-transform" -AllMatches).Matches.Count
$msIme = ($content | Select-String "-ms-ime-align" -AllMatches).Matches.Count
$msOverflow = ($content | Select-String "-ms-overflow-style" -AllMatches).Matches.Count

Write-Host "  -webkit-backdrop-filter: $webkitBackdrop occurrences (KEEP - Safari needs this)"
Write-Host "  -webkit-transform: $webkitTransform occurrences (REVIEW - may be outdated)"
Write-Host "  -webkit-mask: $webkitMask occurrences (KEEP - Safari needs this)"
Write-Host "  -webkit-column-*: $webkitColumn occurrences (REVIEW - may be outdated)"
Write-Host "  ::-webkit-scrollbar: $webkitScrollbar occurrences (KEEP - Chrome/Safari only)"
Write-Host "  -moz-column-*: $mozColumn occurrences (REVIEW - may be outdated)"
Write-Host "  -moz-osx-font-smoothing: $mozOsx occurrences (KEEP - Firefox Mac)"
Write-Host "  -ms-transform: $msTransform occurrences (REMOVE - IE11 is dead)"
Write-Host "  -ms-ime-align: $msIme occurrences (REMOVE - IE11 is dead)"
Write-Host "  -ms-overflow-style: $msOverflow occurrences (REVIEW - Edge Legacy)"
Write-Host ""

# 2. Duplicate Selector Analysis
Write-Host "2. DUPLICATE SELECTOR ANALYSIS" -ForegroundColor Yellow
Write-Host "------------------------------"

# Extract all selectors (simplified - looks for lines ending with {)
$selectors = $lines | Where-Object { $_ -match '^\s*[^/\*].*\{$' -and $_ -notmatch '^\s*$' }
$selectorCounts = $selectors | Group-Object | Where-Object { $_.Count -gt 1 } | Sort-Object Count -Descending

if ($selectorCounts) {
    Write-Host "  Found $($selectorCounts.Count) potentially duplicate selectors:"
    $selectorCounts | Select-Object -First 10 | ForEach-Object {
        Write-Host "    $($_.Count)x: $($_.Name.Trim())"
    }
} else {
    Write-Host "  No obvious duplicate selectors found"
}
Write-Host ""

# 3. Color Value Analysis
Write-Host "3. COLOR VALUE VARIATIONS" -ForegroundColor Yellow
Write-Host "-------------------------"

$rgbaPattern = 'rgba\([^)]+\)'
$rgbaValues = [regex]::Matches($content, $rgbaPattern) | ForEach-Object { $_.Value }
$rgbaGroups = $rgbaValues | Group-Object | Sort-Object Count -Descending | Select-Object -First 15

Write-Host "  Top 15 most used rgba() values:"
$rgbaGroups | ForEach-Object {
    Write-Host "    $($_.Count)x: $($_.Name)"
}
Write-Host ""

# 4. Spacing Value Analysis
Write-Host "4. SPACING VALUE VARIATIONS" -ForegroundColor Yellow
Write-Host "---------------------------"

# Find hardcoded pixel values for padding/margin
$paddingPattern = 'padding:\s*([^;]+);'
$marginPattern = 'margin:\s*([^;]+);'

$hardcodedPadding = [regex]::Matches($content, $paddingPattern) | 
    Where-Object { $_.Groups[1].Value -match '\d+px' -and $_.Groups[1].Value -notmatch 'var\(' } |
    ForEach-Object { $_.Groups[1].Value }

$hardcodedMargin = [regex]::Matches($content, $marginPattern) | 
    Where-Object { $_.Groups[1].Value -match '\d+px' -and $_.Groups[1].Value -notmatch 'var\(' } |
    ForEach-Object { $_.Groups[1].Value }

Write-Host "  Hardcoded padding values (not using variables): $($hardcodedPadding.Count)"
Write-Host "  Hardcoded margin values (not using variables): $($hardcodedMargin.Count)"
Write-Host ""

# 5. Border-radius Analysis
Write-Host "5. BORDER-RADIUS VARIATIONS" -ForegroundColor Yellow
Write-Host "---------------------------"

$borderRadiusPattern = 'border-radius:\s*([^;]+);'
$borderRadiusValues = [regex]::Matches($content, $borderRadiusPattern) | ForEach-Object { $_.Groups[1].Value }
$borderRadiusGroups = $borderRadiusValues | Group-Object | Sort-Object Count -Descending

Write-Host "  Unique border-radius values: $($borderRadiusGroups.Count)"
$borderRadiusGroups | Select-Object -First 10 | ForEach-Object {
    Write-Host "    $($_.Count)x: $($_.Name)"
}
Write-Host ""

# 6. Box-shadow Analysis
Write-Host "6. BOX-SHADOW VARIATIONS" -ForegroundColor Yellow
Write-Host "------------------------"

$boxShadowPattern = 'box-shadow:\s*([^;]+);'
$boxShadowValues = [regex]::Matches($content, $boxShadowPattern) | ForEach-Object { $_.Groups[1].Value }
$boxShadowGroups = $boxShadowValues | Group-Object | Sort-Object Count -Descending

Write-Host "  Unique box-shadow values: $($boxShadowGroups.Count)"
$boxShadowGroups | Select-Object -First 10 | ForEach-Object {
    Write-Host "    $($_.Count)x: $($_.Name)"
}
Write-Host ""

# 7. Summary
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Total lines: $($lines.Count)"
Write-Host "Total characters: $($content.Length)"
Write-Host ""
Write-Host "Recommendations:" -ForegroundColor Green
Write-Host "  1. Remove -ms-* prefixes (IE11 is dead)"
Write-Host "  2. Review -webkit-column-* and -moz-column-* (may be outdated)"
Write-Host "  3. Keep -webkit-backdrop-filter (Safari needs it)"
Write-Host "  4. Keep ::-webkit-scrollbar (Chrome/Safari only feature)"
Write-Host "  5. Harmonize rgba() color values"
Write-Host "  6. Harmonize border-radius values"
Write-Host "  7. Harmonize box-shadow values"
Write-Host ""

