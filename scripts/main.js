// Main entry point - Core functionality loaded on all pages

import { initIcons } from './modules/icons.js';
import { initMobileMenu, initNavbarScroll } from './modules/navigation.js';

/**
 * Initialize core application functionality
 */
function init() {
    // Initialize Lucide icons
    initIcons();
    
    // Initialize navigation
    initMobileMenu();
    initNavbarScroll();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
