# CSS Selector Optimization Analysis
# Identifies overly specific selectors and unnecessary descendant selectors

$cssFile = "tools2025/style-with-unused-section.css"

Write-Host "=== CSS SELECTOR OPTIMIZATION ANALYSIS ===" -ForegroundColor Cyan
Write-Host ""

# Read CSS content
$content = Get-Content $cssFile -Raw

# Extract all CSS selectors
$selectorPattern = '(?m)^\s*([^{}/\*@][^{]*?)\s*\{'
$allSelectors = [regex]::Matches($content, $selectorPattern) | 
    ForEach-Object { $_.Groups[1].Value.Trim() }

Write-Host "Total selectors analyzed: $($allSelectors.Count)" -ForegroundColor Yellow
Write-Host ""

# Analyze selector complexity
$overlySpecific = @()
$unnecessaryDescendants = @()
$longSelectors = @()
$idSelectors = @()

foreach ($selector in $allSelectors) {
    # Skip at-rules
    if ($selector -match '^@') {
        continue
    }
    
    # Count selector parts (separated by spaces or >)
    $parts = $selector -split '[\s>]' | Where-Object { $_ -ne '' }
    $partCount = $parts.Count
    
    # Flag selectors with more than 4 parts as overly specific
    if ($partCount -gt 4) {
        $overlySpecific += [PSCustomObject]@{
            Selector = $selector
            Parts = $partCount
        }
    }
    
    # Flag selectors with more than 100 characters as too long
    if ($selector.Length -gt 100) {
        $longSelectors += [PSCustomObject]@{
            Selector = $selector
            Length = $selector.Length
        }
    }
    
    # Flag selectors using IDs (not recommended for styling)
    if ($selector -match '#[a-zA-Z]' -and $selector -notmatch ':target') {
        $idSelectors += $selector
    }
    
    # Flag potential unnecessary descendant selectors
    # Example: body.blog article.blog-post div.content p.text
    if ($partCount -ge 3 -and $selector -match '\w+\.\w+\s+\w+\.\w+') {
        $unnecessaryDescendants += [PSCustomObject]@{
            Selector = $selector
            Parts = $partCount
        }
    }
}

Write-Host "=== ANALYSIS RESULTS ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. OVERLY SPECIFIC SELECTORS (>4 parts)" -ForegroundColor Yellow
Write-Host "   Count: $($overlySpecific.Count)"
if ($overlySpecific.Count -gt 0) {
    Write-Host ""
    Write-Host "   Top 20 most specific selectors:"
    $overlySpecific | Sort-Object Parts -Descending | Select-Object -First 20 | ForEach-Object {
        Write-Host "     [$($_.Parts) parts] $($_.Selector)"
    }
}
Write-Host ""

Write-Host "2. LONG SELECTORS (>100 characters)" -ForegroundColor Yellow
Write-Host "   Count: $($longSelectors.Count)"
if ($longSelectors.Count -gt 0) {
    Write-Host ""
    Write-Host "   Top 10 longest selectors:"
    $longSelectors | Sort-Object Length -Descending | Select-Object -First 10 | ForEach-Object {
        Write-Host "     [$($_.Length) chars] $($_.Selector.Substring(0, [Math]::Min(80, $_.Selector.Length)))..."
    }
}
Write-Host ""

Write-Host "3. ID SELECTORS (not recommended)" -ForegroundColor Yellow
Write-Host "   Count: $($idSelectors.Count)"
if ($idSelectors.Count -gt 0) {
    Write-Host ""
    Write-Host "   First 20 ID selectors:"
    $idSelectors | Select-Object -First 20 | ForEach-Object {
        Write-Host "     $_"
    }
}
Write-Host ""

Write-Host "4. POTENTIALLY UNNECESSARY DESCENDANT SELECTORS" -ForegroundColor Yellow
Write-Host "   Count: $($unnecessaryDescendants.Count)"
if ($unnecessaryDescendants.Count -gt 0) {
    Write-Host ""
    Write-Host "   First 20 potentially unnecessary descendant selectors:"
    $unnecessaryDescendants | Select-Object -First 20 | ForEach-Object {
        Write-Host "     [$($_.Parts) parts] $($_.Selector)"
    }
}
Write-Host ""

# Save report
$reportPath = "tools2025/selector-optimization-report.txt"
$report = @"
CSS SELECTOR OPTIMIZATION ANALYSIS
Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

Total selectors analyzed: $($allSelectors.Count)

1. OVERLY SPECIFIC SELECTORS (>4 parts): $($overlySpecific.Count)
$($overlySpecific | Sort-Object Parts -Descending | ForEach-Object { "   [$($_.Parts) parts] $($_.Selector)" } | Out-String)

2. LONG SELECTORS (>100 characters): $($longSelectors.Count)
$($longSelectors | Sort-Object Length -Descending | ForEach-Object { "   [$($_.Length) chars] $($_.Selector)" } | Out-String)

3. ID SELECTORS (not recommended): $($idSelectors.Count)
$($idSelectors | ForEach-Object { "   $_" } | Out-String)

4. POTENTIALLY UNNECESSARY DESCENDANT SELECTORS: $($unnecessaryDescendants.Count)
$($unnecessaryDescendants | ForEach-Object { "   [$($_.Parts) parts] $($_.Selector)" } | Out-String)

RECOMMENDATIONS:
1. Simplify selectors with >4 parts where possible
2. Replace ID selectors with class selectors
3. Remove unnecessary descendant selectors
4. Use BEM or similar naming convention for clarity
5. Leverage CSS custom properties for theming

NOTE: Manual review required before making changes.
Some specific selectors may be necessary for:
- Overriding WordPress styles
- Targeting specific blog post elements
- Ensuring proper cascade
"@

$report | Set-Content $reportPath

Write-Host "Report saved to: $reportPath" -ForegroundColor Green
Write-Host ""
Write-Host "RECOMMENDATIONS:" -ForegroundColor Green
Write-Host "  1. Simplify selectors with >4 parts where possible"
Write-Host "  2. Replace ID selectors with class selectors"
Write-Host "  3. Remove unnecessary descendant selectors"
Write-Host "  4. Use BEM or similar naming convention"
Write-Host "  5. Leverage CSS custom properties for theming"

