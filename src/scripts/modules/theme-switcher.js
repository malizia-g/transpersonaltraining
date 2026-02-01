// Theme Switcher module - Manages color theme switching and persistence

import { initIcons } from './icons.js';

const THEMES = ['default', 'iris', 'blue', 'ocean', 'forest', 'earth', 'alchemy'];

const THEME_NAMES = {
    'default': 'School Lavender',
    'iris': 'Deep Iris',
    'blue': 'Scientific Blue',
    'ocean': 'Ocean Depth (Teal)',
    'forest': 'Deep Forest (Green)',
    'earth': 'Burnt Earth (Terracotta)',
    'alchemy': 'Alchemy (Magenta)'
};

let currentThemeIndex = 0;

/**
 * Apply a theme to the document body
 * @param {string} themeName - The theme to apply
 */
function applyTheme(themeName) {
    // Remove all theme classes
    const themeClasses = THEMES.filter(t => t !== 'default').map(t => `theme-${t}`);
    document.body.classList.remove(...themeClasses);
    
    // Add new theme class if not default
    if (themeName !== 'default') {
        document.body.classList.add(`theme-${themeName}`);
    }
    
    // Save to localStorage
    localStorage.setItem('theme-preference', themeName);
}

/**
 * Switch to the next theme in the cycle
 */
function switchTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
    const theme = THEMES[currentThemeIndex];
    applyTheme(theme);
    
    // Update label
    const themeLabel = document.getElementById('theme-label');
    if (themeLabel) {
        themeLabel.textContent = THEME_NAMES[theme];
    }
    
    // Recreate icons after theme change
    initIcons();
}

/**
 * Initialize theme switcher functionality
 */
export function initThemeSwitcher() {
    const themeBtnFixed = document.getElementById('theme-btn-fixed');
    const themeLabel = document.getElementById('theme-label');
    
    if (!themeBtnFixed) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme && THEMES.includes(savedTheme)) {
        currentThemeIndex = THEMES.indexOf(savedTheme);
        applyTheme(savedTheme);
    }
    
    // Update label to show current theme
    if (themeLabel) {
        themeLabel.textContent = THEME_NAMES[THEMES[currentThemeIndex]];
    }
    
    // Attach click handler
    themeBtnFixed.addEventListener('click', switchTheme);
}
