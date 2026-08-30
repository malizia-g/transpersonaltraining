// Navigation module - Mobile menu and navbar scroll effects

/**
 * Initialize mobile menu toggle functionality
 */
export function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.getElementById('navbar');

    if (!mobileMenuBtn || !mobileMenu) return;

    const isOpen = () => !mobileMenu.classList.contains('hidden');

    // The menu is anchored under a fixed navbar, so cap it to the space that
    // actually remains on screen. The navbar compresses on scroll, so measure
    // it each time rather than hardcoding a height.
    const fitToViewport = () => {
        const navHeight = navbar ? navbar.offsetHeight : 0;
        mobileMenu.style.maxHeight = `${window.innerHeight - navHeight}px`;
    };

    const setOpen = (open) => {
        mobileMenu.classList.toggle('hidden', !open);
        mobileMenu.classList.toggle('flex', open);
        document.body.classList.toggle('mobile-menu-open', open);
        if (open) fitToViewport();
    };

    mobileMenuBtn.addEventListener('click', () => setOpen(!isOpen()));

    // Navigating to an in-page anchor doesn't reload, so close explicitly or
    // the body stays scroll-locked.
    mobileMenu.addEventListener('click', (e) => {
        if (e.target.closest('a')) setOpen(false);
    });

    window.addEventListener('resize', () => {
        if (!isOpen()) return;
        // Crossing into the desktop breakpoint hides the menu via CSS; drop the
        // body lock so the page stays scrollable.
        if (window.innerWidth >= 768) setOpen(false);
        else fitToViewport();
    });
}

/**
 * Initialize navbar scroll effect
 * Transparent and roomy at the top; solid and compressed on scroll, in
 * whichever dark the active palette has set
 */
export function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    // Initialize navbar state on page load
    const updateNavbarStyle = () => {
        const scrollClasses = ['shadow-lg'];

        if (window.scrollY > 50) {
            // On scroll - solid background, backdrop blur, compressed padding
            navbar.classList.remove('bg-transparent', 'py-6');
            navbar.style.backgroundColor = 'var(--c-deep-95)';
            navbar.classList.add('backdrop-blur-sm', 'py-1.5', ...scrollClasses);
        } else {
            // At top - transparent and roomy
            navbar.classList.add('bg-transparent', 'py-6');
            navbar.style.backgroundColor = 'transparent';
            navbar.classList.remove('backdrop-blur-sm', 'py-1.5', ...scrollClasses);
        }
    };
    
    // Run on page load
    updateNavbarStyle();
    
    // Run on scroll
    window.addEventListener('scroll', updateNavbarStyle);
}
