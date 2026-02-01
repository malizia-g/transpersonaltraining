// script.js

// Initialize Lucide icons
lucide.createIcons();

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
    });
}

// Navbar scroll effect - Always start transparent for all pages
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.remove('bg-transparent');
            navbar.classList.add('bg-indigo-950/95', 'backdrop-blur-sm', 'shadow-lg');
        } else {
            navbar.classList.add('bg-transparent');
            navbar.classList.remove('bg-indigo-950/95', 'backdrop-blur-sm', 'shadow-lg');
        }
    });
}
