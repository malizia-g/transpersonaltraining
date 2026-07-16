// Main entry point - Core functionality loaded on all pages

import { initIcons } from './modules/icons.js';
import { initMobileMenu, initNavbarScroll } from './modules/navigation.js';
import { initFormCache } from './modules/form-cache.js';

/**
 * Initialize core application functionality
 */
function init() {
    // Initialize Lucide icons
    initIcons();
    
    // Initialize navigation
    initMobileMenu();
    initNavbarScroll();

    // Restore anything typed into a form before the page was closed
    initFormCache();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
