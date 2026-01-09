# PowerShell script to consolidate all JavaScript files into one
# Usage: .\consolidate-js.ps1

$outputFile = "tools2026-consolidated.js"
$files = @(
    'utilities.js',
    'sticky-header.js',
    'table-of-contents.js',
    'gradient-controller.js',
    'anchors.js',
    'dust.js',
    'main.js'
)

# Create header
$header = @"
/**
 * Tools2026 Consolidated JavaScript
 * 
 * This file consolidates all modular JavaScript files into a single file:
 * - utilities.js: Common utilities and error handling
 * - sticky-header.js: Transparent sticky header with blur effect
 * - table-of-contents.js: TOC functionality with nested list support
 * - gradient-controller.js: Tri-lateral page background gradient controller
 * - anchors.js: Anchor link functionality
 * - dust.js: Subtle floating dust particle effect using Three.js GPU particles
 * - main.js: Application coordinator and module initializer
 * 
 * @author myTech.Today
 * @version 1.0.0
 * @date $(Get-Date -Format 'yyyy-MM-dd')
 * @generated Automatically generated - do not edit directly
 */

"@

# Write header to output file
$header | Out-File -FilePath $outputFile -Encoding UTF8

# Process each file
foreach ($file in $files) {
    Write-Host "Processing $file..."
    
    # Add separator comment
    $separator = @"

// ============================================================================
// MODULE: $($file.ToUpper().Replace('.JS', ''))
// ============================================================================

"@
    
    $separator | Out-File -FilePath $outputFile -Append -Encoding UTF8
    
    # Read and append file content
    $content = Get-Content -Path $file -Raw -Encoding UTF8
    $content | Out-File -FilePath $outputFile -Append -Encoding UTF8 -NoNewline
}

# Add footer
$footer = @"


// ============================================================================
// END OF CONSOLIDATED FILE
// ============================================================================

console.log('[Tools2026] All modules loaded successfully from consolidated file');
"@

$footer | Out-File -FilePath $outputFile -Append -Encoding UTF8

Write-Host "`nConsolidation complete!"
Write-Host "Output file: $outputFile"
Write-Host "Total files consolidated: $($files.Count)"

# Get file size
$fileSize = (Get-Item $outputFile).Length
Write-Host "Output file size: $([math]::Round($fileSize / 1KB, 2)) KB"

