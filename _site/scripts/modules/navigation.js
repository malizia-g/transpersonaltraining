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
    
    window.addEventListener('scroll', () => {
        const scrollClasses = ['bg-indigo-950/95', 'backdrop-blur-sm', 'shadow-lg'];
        
        if (window.scrollY > 50) {
            navbar.classList.remove('bg-transparent');
            navbar.classList.add(...scrollClasses);
        } else {
            navbar.classList.add('bg-transparent');
            navbar.classList.remove(...scrollClasses);
        }
    });
}
