# HTML File Testing Script
# Tests all HTML files in tools2025 directory
# Date: 2026-01-21

# Get all HTML files
$htmlFiles = Get-ChildItem -Path "tools2025" -Filter "*.html" | Where-Object { $_.Name -notlike "*test*" }

Write-Host "=== HTML File Testing ===" -ForegroundColor Cyan
Write-Host "Found $($htmlFiles.Count) HTML files to test`n" -ForegroundColor Green

$results = @()

foreach ($file in $htmlFiles) {
    Write-Host "Testing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw
    
    # Check for CSS reference
    $hasCSSRef = $content -match 'href="style\.css"'
    
    # Check for common elements
    $hasBody = $content -match '<body'
    $hasHead = $content -match '<head'
    $hasHTML = $content -match '<html'
    
    # Check for components
    $hasTOC = $content -match 'nav\.toc|class="toc"'
    $hasSeriesNav = $content -match 'series-navigation'
    $hasBlogGrid = $content -match 'blog-grid'
    $hasIframe = $content -match 'iframe-container'
    $hasDust = $content -match 'dust-container'
    
    # Create result object
    $result = [PSCustomObject]@{
        File = $file.Name
        HasCSSRef = $hasCSSRef
        HasHTML = $hasHTML
        HasHead = $hasHead
        HasBody = $hasBody
        HasTOC = $hasTOC
        HasSeriesNav = $hasSeriesNav
        HasBlogGrid = $hasBlogGrid
        HasIframe = $hasIframe
        HasDust = $hasDust
        Status = if ($hasCSSRef -and $hasHTML -and $hasHead -and $hasBody) { "PASS" } else { "FAIL" }
    }
    
    $results += $result
    
    # Display result
    if ($result.Status -eq "PASS") {
        Write-Host "  ✓ PASS" -ForegroundColor Green
    } else {
        Write-Host "  ✗ FAIL" -ForegroundColor Red
    }
    
    Write-Host "  CSS Ref: $hasCSSRef | HTML: $hasHTML | Head: $hasHead | Body: $hasBody"
    Write-Host "  Components: TOC=$hasTOC | Series=$hasSeriesNav | Blog=$hasBlogGrid | Iframe=$hasIframe | Dust=$hasDust"
    Write-Host ""
}

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
$passCount = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$failCount = ($results | Where-Object { $_.Status -eq "FAIL" }).Count

Write-Host "Total Files: $($results.Count)" -ForegroundColor White
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red

# Component usage summary
Write-Host "`n=== Component Usage ===" -ForegroundColor Cyan
Write-Host "TOC: $(($results | Where-Object { $_.HasTOC }).Count) files"
Write-Host "Series Navigation: $(($results | Where-Object { $_.HasSeriesNav }).Count) files"
Write-Host "Blog Grid: $(($results | Where-Object { $_.HasBlogGrid }).Count) files"
Write-Host "Iframe: $(($results | Where-Object { $_.HasIframe }).Count) files"
Write-Host "Dust: $(($results | Where-Object { $_.HasDust }).Count) files"

# Export results
$results | Export-Csv -Path "tools2025/other_files/html-test-results.csv" -NoTypeInformation
Write-Host "`nResults exported to: tools2025/other_files/html-test-results.csv" -ForegroundColor Green

# Return results
return $results

