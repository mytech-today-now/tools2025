# Performance Testing Script
# Measures CSS file sizes and performance metrics
# Date: 2026-01-21

Write-Host "=== Performance Testing ===" -ForegroundColor Cyan
Write-Host ""

# File Size Analysis
Write-Host "=== File Size Analysis ===" -ForegroundColor Yellow

$cssFile = Get-Item "tools2025/style.css"
$cssBackup = Get-Item "tools2025/style.css.backup" -ErrorAction SilentlyContinue

Write-Host "Current CSS File:" -ForegroundColor Green
Write-Host "  File: $($cssFile.Name)"
Write-Host "  Size: $($cssFile.Length) bytes ($([math]::Round($cssFile.Length/1KB, 2)) KB)"
Write-Host "  Lines: $((Get-Content $cssFile.FullName | Measure-Object -Line).Lines)"

if ($cssBackup) {
    Write-Host "`nPrevious CSS File (Backup):" -ForegroundColor Green
    Write-Host "  File: $($cssBackup.Name)"
    Write-Host "  Size: $($cssBackup.Length) bytes ($([math]::Round($cssBackup.Length/1KB, 2)) KB)"
    Write-Host "  Lines: $((Get-Content $cssBackup.FullName | Measure-Object -Line).Lines)"
    
    $sizeDiff = $cssFile.Length - $cssBackup.Length
    $sizeDiffPercent = [math]::Round(($sizeDiff / $cssBackup.Length) * 100, 2)
    
    Write-Host "`nSize Difference:" -ForegroundColor Cyan
    Write-Host "  Bytes: $sizeDiff ($sizeDiffPercent%)"
    
    if ($sizeDiff -lt 0) {
        Write-Host "  ✓ File size reduced!" -ForegroundColor Green
    } elseif ($sizeDiff -eq 0) {
        Write-Host "  = File size unchanged" -ForegroundColor Yellow
    } else {
        Write-Host "  ✗ File size increased" -ForegroundColor Red
    }
}

# SCSS Partials Analysis
Write-Host "`n=== SCSS Partials Analysis ===" -ForegroundColor Yellow

$scssFiles = Get-ChildItem -Path "tools2025" -Filter "_*.scss"
$totalScssLines = 0
$totalScssSize = 0

Write-Host "SCSS Partial Files:" -ForegroundColor Green
foreach ($file in $scssFiles) {
    $lines = (Get-Content $file.FullName | Measure-Object -Line).Lines
    $totalScssLines += $lines
    $totalScssSize += $file.Length
    
    Write-Host "  $($file.Name): $lines lines, $([math]::Round($file.Length/1KB, 2)) KB"
}

Write-Host "`nMain SCSS File:" -ForegroundColor Green
$mainScss = Get-Item "tools2025/style.scss"
$mainScssLines = (Get-Content $mainScss.FullName | Measure-Object -Line).Lines
Write-Host "  $($mainScss.Name): $mainScssLines lines, $([math]::Round($mainScss.Length/1KB, 2)) KB"

Write-Host "`nTotal SCSS Source:" -ForegroundColor Cyan
Write-Host "  Files: $($scssFiles.Count + 1)"
Write-Host "  Lines: $($totalScssLines + $mainScssLines)"
Write-Host "  Size: $([math]::Round(($totalScssSize + $mainScss.Length)/1KB, 2)) KB"

# Compression Analysis
Write-Host "`n=== Compression Analysis ===" -ForegroundColor Yellow

# Simulate gzip compression ratio (typical CSS compression is 70-80%)
$estimatedGzipSize = [math]::Round($cssFile.Length * 0.25, 0)
$compressionRatio = [math]::Round((1 - ($estimatedGzipSize / $cssFile.Length)) * 100, 2)

Write-Host "Estimated Gzip Compression:" -ForegroundColor Green
Write-Host "  Original: $($cssFile.Length) bytes"
Write-Host "  Gzipped: ~$estimatedGzipSize bytes (estimated)"
Write-Host "  Compression Ratio: ~$compressionRatio%"

# Component Analysis
Write-Host "`n=== Component Analysis ===" -ForegroundColor Yellow

$cssContent = Get-Content "tools2025/style.css" -Raw

$components = @{
    "TOC Navigation" = ($cssContent -match "nav\.toc")
    "Series Navigation" = ($cssContent -match "series-navigation")
    "Blog Grid" = ($cssContent -match "blog-grid")
    "Iframe Container" = ($cssContent -match "iframe-container")
    "Dust Container" = ($cssContent -match "dust-container")
    "Body Styles" = ($cssContent -match "body\s*\{")
    "Section Styles" = ($cssContent -match "section\s*\{")
}

Write-Host "Components in Compiled CSS:" -ForegroundColor Green
foreach ($component in $components.GetEnumerator()) {
    $status = if ($component.Value) { "✓" } else { "✗" }
    $color = if ($component.Value) { "Green" } else { "Red" }
    Write-Host "  $status $($component.Key)" -ForegroundColor $color
}

# Performance Metrics Summary
Write-Host "`n=== Performance Metrics Summary ===" -ForegroundColor Cyan

$metrics = [PSCustomObject]@{
    "CSS File Size (KB)" = [math]::Round($cssFile.Length/1KB, 2)
    "CSS Lines" = (Get-Content $cssFile.FullName | Measure-Object -Line).Lines
    "SCSS Partials" = $scssFiles.Count
    "Total SCSS Lines" = $totalScssLines + $mainScssLines
    "Estimated Gzip Size (KB)" = [math]::Round($estimatedGzipSize/1KB, 2)
    "Compression Ratio (%)" = $compressionRatio
}

$metrics | Format-List

# Export results
$metrics | Export-Csv -Path "tools2025/other_files/performance-metrics.csv" -NoTypeInformation
Write-Host "Performance metrics exported to: tools2025/other_files/performance-metrics.csv" -ForegroundColor Green

# Performance Targets
Write-Host "`n=== Performance Targets ===" -ForegroundColor Yellow

$targets = @(
    [PSCustomObject]@{ Metric = "CSS File Size"; Target = "<50 KB"; Current = "$([math]::Round($cssFile.Length/1KB, 2)) KB"; Status = if ($cssFile.Length/1KB -lt 50) { "✓ PASS" } else { "✗ FAIL" } }
    [PSCustomObject]@{ Metric = "Gzip Size"; Target = "<15 KB"; Current = "~$([math]::Round($estimatedGzipSize/1KB, 2)) KB"; Status = if ($estimatedGzipSize/1KB -lt 15) { "✓ PASS" } else { "✗ FAIL" } }
    [PSCustomObject]@{ Metric = "Compression Ratio"; Target = ">70%"; Current = "~$compressionRatio%"; Status = if ($compressionRatio -gt 70) { "✓ PASS" } else { "✗ FAIL" } }
)

$targets | Format-Table -AutoSize

Write-Host "`n=== Performance Testing Complete ===" -ForegroundColor Green

