// Main entry point - Core functionality loaded on all pages

import { initIcons } from './modules/icons.js';
import { initMobileMenu, initNavbarScroll } from './modules/navigation.js';
import { initThemeSwitcher } from './modules/theme-switcher.js';

/**
 * Initialize core application functionality
 */
function init() {
    // Initialize Lucide icons
    initIcons();
    
    // Initialize navigation
    initMobileMenu();
    initNavbarScroll();
    
    // Initialize theme switcher
    initThemeSwitcher();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
