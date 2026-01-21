// Automated Screenshot Testing with Playwright
// Task: mytechtoday-f1qz - Screenshot Comparison
// Date: 2026-01-19

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const pages = [
  'tools2025.html',
  'tools2026.html',
  'homepage.html',
  'pastblog.html',
  'yesterday.html',
  'tools2025-comprehensive-test.html'
];

const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 }
];

async function takeScreenshots(outputDir) {
  console.log(`\n========================================`);
  console.log(`Taking screenshots: ${outputDir}`);
  console.log(`========================================\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext();
  
  let successCount = 0;
  let errorCount = 0;

  for (const page of pages) {
    const filePath = path.join(__dirname, page);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${page}`);
      errorCount++;
      continue;
    }

    for (const viewport of viewports) {
      try {
        const browserPage = await context.newPage();
        await browserPage.setViewportSize({ width: viewport.width, height: viewport.height });
        
        const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;
        await browserPage.goto(fileUrl);
        await browserPage.waitForLoadState('networkidle');
        
        const screenshotName = `${page.replace('.html', '')}-${viewport.name}-${viewport.width}x${viewport.height}.png`;
        const screenshotPath = path.join(__dirname, 'screenshots', outputDir, screenshotName);
        
        await browserPage.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`✅ ${screenshotName}`);
        successCount++;
        
        await browserPage.close();
      } catch (error) {
        console.log(`❌ Error: ${page} - ${viewport.name}: ${error.message}`);
        errorCount++;
      }
    }
  }

  await browser.close();

  console.log(`\n========================================`);
  console.log(`Screenshots complete!`);
  console.log(`Success: ${successCount} | Errors: ${errorCount}`);
  console.log(`========================================\n`);
}

// Main execution
(async () => {
  const args = process.argv.slice(2);
  const mode = args[0] || 'baseline';

  if (mode !== 'baseline' && mode !== 'comparison') {
    console.log('Usage: node screenshot-test.js [baseline|comparison]');
    console.log('  baseline    - Take baseline screenshots (original CSS)');
    console.log('  comparison  - Take comparison screenshots (compiled CSS)');
    process.exit(1);
  }

  await takeScreenshots(mode);
})();

