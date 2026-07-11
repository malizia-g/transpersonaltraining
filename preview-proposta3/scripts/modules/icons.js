// Lucide Icons initialization module

/**
 * Initialize Lucide icons in the document
 */
export function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}
