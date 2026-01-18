# Identify Unused CSS Selectors
# Analyzes all HTML files to find CSS selectors that are not used

$cssFile = "tools2025/style-harmonized.css"
$htmlFiles = Get-ChildItem "tools2025/*.html"

Write-Host "=== UNUSED CSS SELECTOR ANALYSIS ===" -ForegroundColor Cyan
Write-Host ""

# Read CSS content
$cssContent = Get-Content $cssFile -Raw

# Extract all CSS selectors (simplified approach)
# This regex captures selectors before opening braces
$selectorPattern = '(?m)^\s*([^{}/\*@][^{]*?)\s*\{'
$allSelectors = [regex]::Matches($cssContent, $selectorPattern) | 
    ForEach-Object { $_.Groups[1].Value.Trim() }

Write-Host "Total CSS selectors found: $($allSelectors.Count)" -ForegroundColor Yellow
Write-Host ""

# Read all HTML content
$allHtmlContent = ""
foreach ($htmlFile in $htmlFiles) {
    $allHtmlContent += Get-Content $htmlFile.FullName -Raw
    $allHtmlContent += "`n"
}

Write-Host "HTML files analyzed: $($htmlFiles.Count)" -ForegroundColor Yellow
$htmlFiles | ForEach-Object { Write-Host "  - $($_.Name)" }
Write-Host ""

# Analyze selector usage
$unusedSelectors = @()
$usedSelectors = @()
$pseudoSelectors = @()
$mediaQuerySelectors = @()

foreach ($selector in $allSelectors) {
    # Skip media queries, keyframes, and other at-rules
    if ($selector -match '^@') {
        continue
    }
    
    # Skip pseudo-elements and pseudo-classes for now (they're harder to detect)
    if ($selector -match '::(before|after|webkit-scrollbar|placeholder)' -or 
        $selector -match ':(hover|focus|active|visited|checked|disabled|first-child|last-child|nth-child)') {
        $pseudoSelectors += $selector
        continue
    }
    
    # Extract class names and IDs from selector
    $classes = [regex]::Matches($selector, '\.([a-zA-Z0-9_-]+)') | ForEach-Object { $_.Groups[1].Value }
    $ids = [regex]::Matches($selector, '#([a-zA-Z0-9_-]+)') | ForEach-Object { $_.Groups[1].Value }
    $elements = [regex]::Matches($selector, '\b(body|html|div|span|p|a|h1|h2|h3|h4|h5|h6|ul|ol|li|nav|header|footer|section|article|aside|main|table|tr|td|th|thead|tbody|tfoot|form|input|button|select|textarea|label|img|canvas|svg|path|circle|rect|line|polygon|polyline|iframe|video|audio|source|track|embed|object|param|pre|code|blockquote|cite|q|abbr|address|time|mark|del|ins|sub|sup|small|strong|em|b|i|u|s|strike|big|tt|kbd|samp|var|dfn|bdi|bdo|br|wbr|hr|figure|figcaption|picture|details|summary|dialog|menu|menuitem|datalist|optgroup|option|fieldset|legend|caption|col|colgroup)\b') | 
        ForEach-Object { $_.Groups[1].Value }
    
    # Check if any class, ID, or element is used in HTML
    $isUsed = $false
    
    foreach ($class in $classes) {
        if ($allHtmlContent -match "class=[`"'][^`"']*\b$class\b") {
            $isUsed = $true
            break
        }
    }
    
    if (-not $isUsed) {
        foreach ($id in $ids) {
            if ($allHtmlContent -match "id=[`"']$id[`"']") {
                $isUsed = $true
                break
            }
        }
    }
    
    if (-not $isUsed) {
        foreach ($element in $elements) {
            if ($allHtmlContent -match "<$element[\s>]") {
                $isUsed = $true
                break
            }
        }
    }
    
    if ($isUsed) {
        $usedSelectors += $selector
    } else {
        $unusedSelectors += $selector
    }
}

Write-Host "=== ANALYSIS RESULTS ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Used selectors: $($usedSelectors.Count)" -ForegroundColor Green
Write-Host "Potentially unused selectors: $($unusedSelectors.Count)" -ForegroundColor Yellow
Write-Host "Pseudo-selectors (skipped): $($pseudoSelectors.Count)" -ForegroundColor Cyan
Write-Host ""

if ($unusedSelectors.Count -gt 0) {
    Write-Host "=== POTENTIALLY UNUSED SELECTORS ===" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "First 50 potentially unused selectors:"
    $unusedSelectors | Select-Object -First 50 | ForEach-Object {
        Write-Host "  $_"
    }
    Write-Host ""
    
    if ($unusedSelectors.Count -gt 50) {
        Write-Host "... and $($unusedSelectors.Count - 50) more" -ForegroundColor Gray
        Write-Host ""
    }
}

# Save results to file
$reportPath = "tools2025/unused-selectors-report.txt"
$report = @"
UNUSED CSS SELECTOR ANALYSIS
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

HTML Files Analyzed:
$($htmlFiles | ForEach-Object { "  - $($_.Name)" } | Out-String)

Summary:
  Total CSS selectors: $($allSelectors.Count)
  Used selectors: $($usedSelectors.Count)
  Potentially unused selectors: $($unusedSelectors.Count)
  Pseudo-selectors (skipped): $($pseudoSelectors.Count)

POTENTIALLY UNUSED SELECTORS:
$($unusedSelectors | ForEach-Object { "  $_" } | Out-String)

NOTE: This is an automated analysis and may have false positives.
Selectors may be used by:
  - JavaScript (dynamically added classes)
  - Blog posts (not analyzed)
  - Future HTML files
  - WordPress integration

Manual review is required before removing any selectors.
"@

$report | Set-Content $reportPath

Write-Host "Report saved to: $reportPath" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT NOTES:" -ForegroundColor Red
Write-Host "  - This analysis may have false positives"
Write-Host "  - Selectors may be used by JavaScript"
Write-Host "  - Selectors may be used by blog posts (not analyzed)"
Write-Host "  - Manual review is REQUIRED before removing any selectors"

