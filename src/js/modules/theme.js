/**
 * Light / dark theme toggle.
 *
 * The initial theme is applied by a tiny inline script in <head> (to avoid a
 * flash before paint); this module keeps the toggle button in sync, persists
 * the choice in localStorage and reacts to the OS preference when the user
 * hasn't chosen one explicitly.
 */

const STORAGE_KEY = 'aris-theme';

function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function applyTheme(theme, button) {
    document.documentElement.setAttribute('data-theme', theme);

    const icon = button?.querySelector('i');
    if (icon) {
        // Show the icon for the action the button performs.
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    button?.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'
    );
}

export function initTheme() {
    const button = document.querySelector('.theme-toggle');

    // Sync the button with whatever the inline script already applied.
    applyTheme(currentTheme(), button);

    button?.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next, button);
    });

    // Follow the OS preference only while the user hasn't picked a theme.
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (localStorage.getItem(STORAGE_KEY)) return;
        applyTheme(e.matches ? 'light' : 'dark', button);
    });
}
