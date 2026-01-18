# CSS Optimization Script - Step 1: Remove Outdated Vendor Prefixes
# This script removes IE11 and outdated Edge-specific vendor prefixes

$inputFile = "tools2025/style.css"
$outputFile = "tools2025/style-optimized.css"

Write-Host "=== CSS OPTIMIZATION - STEP 1: REDUNDANCY REMOVAL ===" -ForegroundColor Cyan
Write-Host ""

# Read the CSS file
$content = Get-Content $inputFile -Raw
$lines = Get-Content $inputFile

Write-Host "Original file stats:" -ForegroundColor Yellow
Write-Host "  Lines: $($lines.Count)"
Write-Host "  Characters: $($content.Length)"
Write-Host ""

# Track changes
$changesLog = @()

# 1. Remove -ms-transform (IE11 is dead)
Write-Host "1. Removing -ms-transform..." -ForegroundColor Green
$beforeCount = ($content | Select-String "-ms-transform" -AllMatches).Matches.Count
$content = $content -replace '(?m)^\s*-ms-transform:[^;]+;\s*\r?\n', ''
$afterCount = ($content | Select-String "-ms-transform" -AllMatches).Matches.Count
$changesLog += "Removed -ms-transform: $beforeCount occurrences"
Write-Host "  Removed: $beforeCount occurrences"

# 2. Remove @supports (-ms-ime-align: auto) block (IE11/Edge Legacy)
Write-Host "2. Removing IE11/Edge Legacy @supports blocks..." -ForegroundColor Green
$beforeCount = ($content | Select-String "-ms-ime-align" -AllMatches).Matches.Count

# Find and remove the entire @supports (-ms-ime-align: auto) block
$pattern = '(?s)/\*\s*Edge browser specific fixes for TOC column behavior\s*\*/\s*@supports\s*\(-ms-ime-align:\s*auto\)\s*\{[^}]*\{[^}]*\}[^}]*\}'
$content = $content -replace $pattern, ''

$afterCount = ($content | Select-String "-ms-ime-align" -AllMatches).Matches.Count
$changesLog += "Removed @supports (-ms-ime-align) blocks: $beforeCount occurrences"
Write-Host "  Removed: $beforeCount occurrences"

# 3. Remove @media screen and (-ms-high-contrast) block (IE11/Edge Legacy)
Write-Host "3. Removing IE11/Edge Legacy @media blocks..." -ForegroundColor Green
$beforeCount = ($content | Select-String "-ms-high-contrast" -AllMatches).Matches.Count

# Find and remove the entire @media screen and (-ms-high-contrast) block
$pattern = '(?s)/\*\s*Edge browser specific hover stabilization and positioning fixes\s*\*/\s*@media\s+screen\s+and\s+\(-ms-high-contrast:[^)]+\)[^{]*\{[^}]*\{[^}]*\}[^}]*\}'
$content = $content -replace $pattern, ''

$afterCount = ($content | Select-String "-ms-high-contrast" -AllMatches).Matches.Count
$changesLog += "Removed @media (-ms-high-contrast) blocks: $beforeCount occurrences"
Write-Host "  Removed: $beforeCount occurrences"

# 4. Remove -ms-overflow-style (Edge Legacy)
Write-Host "4. Removing -ms-overflow-style..." -ForegroundColor Green
$beforeCount = ($content | Select-String "-ms-overflow-style" -AllMatches).Matches.Count
$content = $content -replace '(?m)^\s*-ms-overflow-style:[^;]+;\s*\r?\n', ''
$afterCount = ($content | Select-String "-ms-overflow-style" -AllMatches).Matches.Count
$changesLog += "Removed -ms-overflow-style: $beforeCount occurrences"
Write-Host "  Removed: $beforeCount occurrences"

# 5. Review and potentially remove outdated -webkit-column-* and -moz-column-*
# These are still needed for older browsers, so we'll keep them for now
# But we'll log them for review
Write-Host "5. Reviewing column prefixes (keeping for now)..." -ForegroundColor Yellow
$webkitColumnCount = ($content | Select-String "-webkit-column" -AllMatches).Matches.Count
$mozColumnCount = ($content | Select-String "-moz-column" -AllMatches).Matches.Count
$changesLog += "Reviewed -webkit-column-*: $webkitColumnCount occurrences (kept)"
$changesLog += "Reviewed -moz-column-*: $mozColumnCount occurrences (kept)"
Write-Host "  -webkit-column-*: $webkitColumnCount occurrences (kept)"
Write-Host "  -moz-column-*: $mozColumnCount occurrences (kept)"

# 6. Remove -webkit-transform where transform is also present
Write-Host "6. Removing redundant -webkit-transform..." -ForegroundColor Green
$beforeCount = ($content | Select-String "-webkit-transform:" -AllMatches).Matches.Count

# Find patterns where both -webkit-transform and transform are present
$pattern = '(?m)^\s*-webkit-transform:\s*translateZ\(0\);\s*\r?\n'
$content = $content -replace $pattern, ''

# Also remove -webkit-transform: translateX(-50%)
$pattern = '(?m)^\s*-webkit-transform:\s*translateX\([^)]+\);\s*\r?\n'
$content = $content -replace $pattern, ''

$afterCount = ($content | Select-String "-webkit-transform:" -AllMatches).Matches.Count
$changesLog += "Removed redundant -webkit-transform: $($beforeCount - $afterCount) occurrences"
Write-Host "  Removed: $($beforeCount - $afterCount) occurrences"

# 7. Remove -webkit-font-smoothing (keep -moz-osx-font-smoothing)
Write-Host "7. Removing -webkit-font-smoothing..." -ForegroundColor Green
$beforeCount = ($content | Select-String "-webkit-font-smoothing" -AllMatches).Matches.Count
$content = $content -replace '(?m)^\s*-webkit-font-smoothing:[^;]+;\s*\r?\n', ''
$afterCount = ($content | Select-String "-webkit-font-smoothing" -AllMatches).Matches.Count
$changesLog += "Removed -webkit-font-smoothing: $beforeCount occurrences"
Write-Host "  Removed: $beforeCount occurrences"

# 8. Remove -webkit-column-break-inside (modern browsers support break-inside)
Write-Host "8. Removing -webkit-column-break-inside..." -ForegroundColor Green
$beforeCount = ($content | Select-String "-webkit-column-break-inside" -AllMatches).Matches.Count
$content = $content -replace '(?m)^\s*-webkit-column-break-inside:[^;]+;\s*\r?\n', ''
$afterCount = ($content | Select-String "-webkit-column-break-inside" -AllMatches).Matches.Count
$changesLog += "Removed -webkit-column-break-inside: $beforeCount occurrences"
Write-Host "  Removed: $beforeCount occurrences"

# Clean up multiple consecutive blank lines
$content = $content -replace '(?m)^\s*\r?\n(\s*\r?\n){2,}', "`r`n`r`n"

# Write the optimized file
$content | Set-Content $outputFile -NoNewline

Write-Host ""
Write-Host "Optimized file stats:" -ForegroundColor Yellow
$newLines = Get-Content $outputFile
$newContent = Get-Content $outputFile -Raw
Write-Host "  Lines: $($newLines.Count)"
Write-Host "  Characters: $($newContent.Length)"
Write-Host "  Reduction: $($lines.Count - $newLines.Count) lines, $($content.Length - $newContent.Length) characters"
Write-Host ""

Write-Host "=== CHANGES LOG ===" -ForegroundColor Cyan
$changesLog | ForEach-Object { Write-Host "  $_" }
Write-Host ""

Write-Host "Optimized CSS saved to: $outputFile" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review the optimized CSS"
Write-Host "  2. Test with all HTML files"
Write-Host "  3. Compare screenshots"
Write-Host "  4. If all looks good, replace style.css with style-optimized.css"

