// Theme Switcher Logic - Shared across all pages
(function() {
    // Wait for DOM to be ready
    const init = () => {
        const themeBtnFixed = document.getElementById('theme-btn-fixed');
        const themeLabel = document.getElementById('theme-label');
        
        const themes = ['default', 'iris', 'violet', 'blue', 'ocean', 'forest', 'earth', 'alchemy'];
        const themeNames = {
            'default': 'School Lavender',
            'iris': 'Deep Iris',
            'violet': 'Steel Silver',
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
            document.body.classList.remove('theme-iris', 'theme-violet', 'theme-blue', 'theme-ocean', 'theme-forest', 'theme-earth', 'theme-alchemy');
            if (themeName !== 'default') {
                document.body.classList.add(`theme-${themeName}`);
            }
            localStorage.setItem('theme-preference', themeName);
        }
        
        function switchTheme() {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            const theme = themes[currentThemeIndex];
            applyTheme(theme);
            
            // Update label
            if (themeLabel) {
                themeLabel.textContent = themeNames[theme];
            }
            
            // Recreate icons if lucide is available
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
        }
        
        // Fixed theme button
        if (themeBtnFixed) {
            themeBtnFixed.addEventListener('click', switchTheme);
            if (themeLabel) {
                themeLabel.textContent = themeNames[themes[currentThemeIndex]];
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
