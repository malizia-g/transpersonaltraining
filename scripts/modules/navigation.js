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
 * Transparent and roomy at the top. The dark bar fades in with the first
 * pixels of scroll (fully solid by FADE_PX), in whichever dark the active
 * palette has set; the padding compresses once past 50px.
 */
export function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const FADE_PX = 120;
    // The background follows the scroll directly, so it must not lag behind
    // the 0.3s transition the padding uses
    navbar.style.transitionProperty = 'padding, box-shadow';

    let ticking = false;
    const updateNavbarStyle = () => {
        ticking = false;
        const y = window.scrollY;
        const t = Math.min(Math.max(y / FADE_PX, 0), 1);

        navbar.style.backgroundColor = t === 0
            ? 'transparent'
            : `color-mix(in srgb, var(--c-deep-95) ${(t * 100).toFixed(1)}%, transparent)`;
        navbar.classList.toggle('bg-transparent', t === 0);
        navbar.classList.toggle('backdrop-blur-sm', t > 0.5);

        const compact = y > 50;
        navbar.classList.toggle('py-6', !compact);
        navbar.classList.toggle('py-1.5', compact);
        navbar.classList.toggle('shadow-lg', t === 1);
    };

    // Run on page load
    updateNavbarStyle();

    // Run on scroll, at most once per frame
    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateNavbarStyle);
        }
    }, { passive: true });
}
