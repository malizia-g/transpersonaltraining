// Navigation module - Mobile menu and navbar scroll effects

/**
 * Initialize mobile menu toggle functionality
 */
export function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
    });
}

/**
 * Initialize navbar scroll effect
 * Makes navbar transparent at top, solid on scroll
 */
export function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    // Initialize navbar state on page load
    const updateNavbarStyle = () => {
        const scrollClasses = ['shadow-lg'];
        
        if (window.scrollY > 50) {
            // On scroll - show solid background with backdrop blur
            navbar.classList.remove('bg-transparent');
            navbar.style.backgroundColor = 'rgba(15, 37, 64, 0.95)';
            navbar.classList.add('backdrop-blur-sm', ...scrollClasses);
        } else {
            // At top - make transparent
            navbar.classList.add('bg-transparent');
            navbar.style.backgroundColor = 'transparent';
            navbar.classList.remove('backdrop-blur-sm', ...scrollClasses);
        }
    };
    
    // Run on page load
    updateNavbarStyle();
    
    // Run on scroll
    window.addEventListener('scroll', updateNavbarStyle);
}
