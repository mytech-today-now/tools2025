# Vertical Slideshow TOC - Usage Examples

## Overview

The Vertical Slideshow TOC transforms a traditional table of contents into an interactive slideshow with skeuomorphic design. Each H2 section becomes an individual slide with smooth transitions and multiple navigation methods.

## Basic Usage

### Auto-Initialization

The slideshow automatically initializes when the DOM is ready. No manual setup required!

```html
<!-- Just include the HTML structure and JavaScript -->
<nav class="toc toc-slideshow" id="literal-toc">
  <h2>Table of Contents</h2>
  <div class="toc-slideshow-nav">...</div>
  <div class="toc-slideshow-container">
    <div class="toc-slide" data-slide="1">...</div>
    <div class="toc-slide" data-slide="2">...</div>
  </div>
</nav>

<script src="tools2026-consolidated.js" defer></script>
```

### Manual Initialization

If you need to initialize manually (e.g., after dynamic content loading):

```javascript
// Initialize the slideshow
window.SlideshowTOC.init();
```

## Navigation Examples

### Programmatic Navigation

```javascript
// Navigate to next slide
window.SlideshowTOC.nextSlide();

// Navigate to previous slide
window.SlideshowTOC.prevSlide();

// Jump to specific slide (1-based index)
window.SlideshowTOC.showSlide(3);

// Jump to first slide
window.SlideshowTOC.firstSlide();

// Jump to last slide
window.SlideshowTOC.lastSlide();
```

### Get Current State

```javascript
// Get current slide number (1-based)
const currentSlide = window.SlideshowTOC.getCurrentSlide();
console.log(`Currently on slide ${currentSlide}`);

// Get total number of slides
const totalSlides = window.SlideshowTOC.getTotalSlides();
console.log(`Total slides: ${totalSlides}`);

// Check if initialized
const isReady = window.SlideshowTOC.isInitialized();
console.log(`Slideshow ready: ${isReady}`);
```

## Configuration Examples

### Enable Debug Mode

```javascript
// Enable debug logging to console
window.SlideshowTOC.config.debug = true;
```

### Disable Keyboard Navigation

```javascript
// Disable keyboard navigation
window.SlideshowTOC.config.keyboard.enabled = false;

// Re-enable keyboard navigation
window.SlideshowTOC.config.keyboard.enabled = true;
```

### Disable Touch Gestures

```javascript
// Disable touch/swipe gestures
window.SlideshowTOC.config.touch.enabled = false;
```

### Adjust Transition Duration

```javascript
// Change slide transition duration to 800ms (default: 500ms)
window.SlideshowTOC.config.timing.transitionDuration = 800;
```

### Customize Keyboard Shortcuts

```javascript
// Add custom keyboard shortcuts
window.SlideshowTOC.config.keyboard.keys.prev = ['ArrowLeft', 'ArrowUp', 'w'];
window.SlideshowTOC.config.keyboard.keys.next = ['ArrowRight', 'ArrowDown', 's'];
```

### Adjust Swipe Sensitivity

```javascript
// Increase minimum swipe distance to 100px (default: 50px)
window.SlideshowTOC.config.touch.minSwipeDistance = 100;
```

## Advanced Examples

### Create Custom Navigation Controls

```html
<button onclick="window.SlideshowTOC.firstSlide()">First</button>
<button onclick="window.SlideshowTOC.prevSlide()">Previous</button>
<button onclick="window.SlideshowTOC.nextSlide()">Next</button>
<button onclick="window.SlideshowTOC.lastSlide()">Last</button>
```

### Display Current Slide Info

```html
<div id="slide-info"></div>

<script>
function updateSlideInfo() {
  const current = window.SlideshowTOC.getCurrentSlide();
  const total = window.SlideshowTOC.getTotalSlides();
  document.getElementById('slide-info').textContent = `Slide ${current} of ${total}`;
}

// Update on page load
window.addEventListener('DOMContentLoaded', updateSlideInfo);

// Update when navigating (you'd need to add event listeners to navigation buttons)
</script>
```

### Jump to Slide Based on URL Hash

```javascript
// Jump to slide based on URL hash (e.g., #slide-3)
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;
  const match = hash.match(/#slide-(\d+)/);
  if (match) {
    const slideNumber = parseInt(match[1], 10);
    window.SlideshowTOC.showSlide(slideNumber);
  }
});
```

### Auto-Advance Slideshow

```javascript
// Auto-advance every 5 seconds
let autoAdvanceInterval = setInterval(() => {
  const current = window.SlideshowTOC.getCurrentSlide();
  const total = window.SlideshowTOC.getTotalSlides();
  
  if (current < total) {
    window.SlideshowTOC.nextSlide();
  } else {
    window.SlideshowTOC.firstSlide(); // Loop back to first slide
  }
}, 5000);

// Stop auto-advance
clearInterval(autoAdvanceInterval);
```

### Monitor Slide Changes

```javascript
// Create a custom event listener for slide changes
const originalShowSlide = window.SlideshowTOC.showSlide;
window.SlideshowTOC.showSlide = function(slideNumber) {
  // Call original function
  originalShowSlide.call(this, slideNumber);

  // Custom logic after slide change
  console.log(`Slide changed to ${slideNumber}`);

  // Track with analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'slideshow_navigation', {
      'slide_number': slideNumber
    });
  }
};
```

### Conditional Navigation

```javascript
// Only allow navigation if user has scrolled to TOC
function navigateIfVisible() {
  const toc = document.querySelector('.toc.toc-slideshow');
  const rect = toc.getBoundingClientRect();
  const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

  if (isVisible) {
    window.SlideshowTOC.nextSlide();
  } else {
    console.log('TOC not visible, scroll to view');
  }
}
```

### Keyboard Shortcut Override

```javascript
// Override default keyboard behavior for specific keys
document.addEventListener('keydown', (event) => {
  // Use Ctrl+Arrow keys instead of just Arrow keys
  if (event.ctrlKey) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      window.SlideshowTOC.nextSlide();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      window.SlideshowTOC.prevSlide();
    }
  }
});

// Disable default keyboard navigation
window.SlideshowTOC.config.keyboard.enabled = false;
```

## User Interaction Examples

### Keyboard Navigation

Users can navigate using:
- **Arrow Up** or **Arrow Left**: Previous slide
- **Arrow Down** or **Arrow Right**: Next slide
- **Home**: Jump to first slide
- **End**: Jump to last slide

### Touch Gestures (Mobile)

Users can navigate using:
- **Swipe Left**: Next slide
- **Swipe Right**: Previous slide

### Mouse Wheel Navigation

Users can navigate using:
- **Scroll Up** (while hovering): Previous slide
- **Scroll Down** (while hovering): Next slide

### Click Navigation

Users can navigate using:
- **▲ Button**: Previous slide
- **▼ Button**: Next slide
- **Indicator Dots**: Jump to specific slide

## Accessibility Features

### ARIA Labels

All interactive elements include proper ARIA labels:

```html
<!-- Navigation buttons -->
<button class="toc-nav-btn toc-nav-prev" aria-label="Previous slide">
  <span aria-hidden="true">▲</span>
</button>

<!-- Slide indicators -->
<button class="toc-indicator" role="tab" aria-label="Slide 1: Most useful to most users" aria-selected="true"></button>

<!-- Slides -->
<div class="toc-slide" role="group" aria-label="Most useful to most users" aria-hidden="false">
  ...
</div>
```

### Screen Reader Support

- Slides use `aria-hidden` to hide inactive slides from screen readers
- Indicators use `aria-selected` to indicate current slide
- Navigation controls use `aria-label` for descriptive labels
- Container uses `aria-live="polite"` for dynamic updates

## Troubleshooting

### Slideshow Not Initializing

```javascript
// Check if slideshow is initialized
if (!window.SlideshowTOC.isInitialized()) {
  console.log('Slideshow not initialized');

  // Try manual initialization
  window.SlideshowTOC.init();
}
```

### Slides Not Transitioning

```javascript
// Check if animation is stuck
console.log('Is animating:', window.SlideshowTOC.state.isAnimating);

// Force reset animation state
window.SlideshowTOC.state.isAnimating = false;
```

### Debug Mode

```javascript
// Enable debug mode to see detailed logs
window.SlideshowTOC.config.debug = true;

// Check current state
console.log('Current slide:', window.SlideshowTOC.state.currentSlide);
console.log('Total slides:', window.SlideshowTOC.state.totalSlides);
console.log('Initialized:', window.SlideshowTOC.state.initialized);
```

## Best Practices

1. **Wait for DOM Ready**: Ensure DOM is fully loaded before calling API methods
2. **Check Initialization**: Verify slideshow is initialized before navigation
3. **Respect Animation State**: Don't force navigation during transitions
4. **Use Semantic HTML**: Maintain proper heading hierarchy in slides
5. **Test Accessibility**: Verify keyboard navigation and screen reader support
6. **Mobile Testing**: Test touch gestures on actual mobile devices
7. **Performance**: Avoid excessive slide content to maintain smooth transitions

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features Used**: CSS Grid, Flexbox, Touch Events API, Intersection Observer
- **Fallback**: Gracefully degrades to static TOC if JavaScript disabled

## Related Files

- **HTML**: `tools2026.html` - Main HTML structure
- **CSS**: `style.css` - Slideshow styles (lines 6772-7175)
- **JavaScript**: `tools2026-consolidated.js` - Slideshow module (lines 3770-4430)
- **Documentation**: This file (`SLIDESHOW-TOC-USAGE.md`)

## Support

For issues, questions, or feature requests:
- **GitHub**: [mytech-today-now/tools2025](https://github.com/mytech-today-now/tools2025)
- **Email**: sales@mytech.today
- **Website**: [mytech.today](https://mytech.today)

---

**Version**: 1.0.0
**Last Updated**: 2026-01-11
**Author**: myTech.Today

