// script.js

// Inizializza le icone Lucide
// Attende che il DOM sia caricato per sicurezza
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Riferimenti agli elementi
    const navbar = document.getElementById('navbar');
    const navLogoText = document.getElementById('nav-logo-text');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Effetto Scroll sulla Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            // Quando si scorre verso il basso
            navbar.classList.remove('bg-transparent', 'py-6');
            navbar.classList.add('bg-indigo-950/95', 'backdrop-blur-sm', 'shadow-lg', 'py-4');
        } else {
            // Quando si è in cima alla pagina
            navbar.classList.add('bg-transparent', 'py-6');
            navbar.classList.remove('bg-indigo-950/95', 'backdrop-blur-sm', 'shadow-lg', 'py-4');
        }
    });

    // Toggle Menu Mobile
    mobileMenuBtn.addEventListener('click', () => {
        // Alterna la visibilità del menu (hidden vs flex)
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
    });
});
