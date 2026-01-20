// Theme Switcher Logic - Shared across all pages
(function() {
    // Wait for DOM to be ready
    const init = () => {
        const themeBtn = document.getElementById('theme-btn');
        const themeBtnMobile = document.getElementById('theme-btn-mobile');
        const themeNameDisplay = document.getElementById('theme-name');
        const themeNameDisplayMobile = document.getElementById('theme-name-mobile');
        
        const themes = ['default', 'iris', 'blue', 'ocean', 'forest', 'earth', 'alchemy'];
        const themeNames = {
            'default': 'School Lavender',
            'iris': 'Deep Iris',
            'blue': 'Scientific Blue',
            'ocean': 'Ocean Depth (Teal)',
            'forest': 'Deep Forest (Green)',
            'earth': 'Burnt Earth (Terracotta)',
            'alchemy': 'Alchemy (Magenta)'
        };
        let currentThemeIndex = 0;
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme-preference');
        if (savedTheme) {
            currentThemeIndex = themes.indexOf(savedTheme);
            if (currentThemeIndex === -1) currentThemeIndex = 0;
            applyTheme(themes[currentThemeIndex]);
        }
        
        function applyTheme(themeName) {
            document.body.classList.remove('theme-iris', 'theme-blue', 'theme-ocean', 'theme-forest', 'theme-earth', 'theme-alchemy');
            if (themeName !== 'default') {
                document.body.classList.add(`theme-${themeName}`);
            }
            localStorage.setItem('theme-preference', themeName);
        }
        
        function switchTheme() {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            const theme = themes[currentThemeIndex];
            applyTheme(theme);
            
            // Update desktop button and display
            if (themeBtn) {
                themeBtn.title = `Switch theme (Current: ${themeNames[theme]})`;
            }
            if (themeNameDisplay) {
                themeNameDisplay.textContent = themeNames[theme];
            }
            
            // Update mobile button and display
            if (themeBtnMobile) {
                themeBtnMobile.title = `Switch theme (Current: ${themeNames[theme]})`;
            }
            if (themeNameDisplayMobile) {
                themeNameDisplayMobile.textContent = themeNames[theme];
            }
            
            // Recreate icons if lucide is available
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }
        
        // Desktop theme button
        if (themeBtn) {
            themeBtn.addEventListener('click', switchTheme);
            themeBtn.title = `Switch theme (Current: ${themeNames[themes[currentThemeIndex]]})`;
            if (themeNameDisplay) {
                themeNameDisplay.textContent = themeNames[themes[currentThemeIndex]];
            }
        }
        
        // Mobile theme button
        if (themeBtnMobile) {
            themeBtnMobile.addEventListener('click', switchTheme);
            themeBtnMobile.title = `Switch theme (Current: ${themeNames[themes[currentThemeIndex]]})`;
            if (themeNameDisplayMobile) {
                themeNameDisplayMobile.textContent = themeNames[themes[currentThemeIndex]];
            }
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
