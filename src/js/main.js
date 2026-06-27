/**
 * ARIS Systems — application entry point.
 *
 * Bundled by Vite. Each concern lives in its own ES module under
 * `./modules/` and is wired up here once the DOM is ready.
 */

import { initTheme } from './modules/theme.js';
import { initNavigation } from './modules/navigation.js';
import { initWhatsApp } from './modules/whatsapp.js';
import { initAnimations } from './modules/animations.js';
import { initModals } from './modules/modals.js';
import { initPortfolioCarousel } from './modules/carousel.js';

function init() {
    initTheme();
    initNavigation();
    initAnimations();
    initWhatsApp();
    initModals();
    initPortfolioCarousel();
}

// Module scripts are deferred, but guard against the rare case where the
// document is still loading.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
    init();
}

// Mark the page as fully loaded (used by CSS / future hooks).
window.addEventListener('load', () => document.body.classList.add('loaded'));
