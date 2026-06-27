/**
 * Modal dialogs for service cards and portfolio (case study) cards.
 * Both reuse the single `#service-modal` element and a shared focus trap.
 */

import { createFocusTrap } from './focus-trap.js';

const MODAL_ID = 'service-modal';

/** Shared open/close controller bound to the modal element. */
function createModalController() {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return null;

    const overlay = modal.querySelector('.service-modal-overlay');
    const panel = modal.querySelector('.service-modal-panel');
    const closeBtn = modal.querySelector('.service-modal-close');
    const content = modal.querySelector('.service-modal-content');
    let focusTrap = null;

    function onKeyDown(e) {
        if (e.key === 'Escape') close();
    }

    function open(html) {
        content.innerHTML = html;
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        setTimeout(() => closeBtn?.focus(), 120);
        focusTrap?.release();
        focusTrap = createFocusTrap(panel);
        focusTrap.trap();
        document.addEventListener('keydown', onKeyDown);
    }

    function close() {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        content.innerHTML = '';
        focusTrap?.release();
        focusTrap = null;
        document.removeEventListener('keydown', onKeyDown);
    }

    overlay?.addEventListener('click', close);
    closeBtn?.addEventListener('click', close);

    return { open };
}

/** Wire a set of cards so click / Enter / Space opens the modal with their content. */
function bindCards(cards, open, buildHtml) {
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return; // let links behave normally
            open(buildHtml(card));
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open(buildHtml(card));
            }
        });
    });
}

function buildServiceModal(card) {
    const title = card.querySelector('h3')?.innerText || '';
    const iconHtml = card.querySelector('.service-icon')?.innerHTML || '';
    const detailsHTML = card.querySelector('.service-details')?.innerHTML || '';

    return `
        <div class="modal-grid">
            <div class="modal-image">
                <div class="modal-icon">${iconHtml}</div>
            </div>
            <div class="modal-body">
                <h3>${title}</h3>
                <div class="modal-details">${detailsHTML}</div>
            </div>
        </div>
    `;
}

function buildPortfolioModal(card) {
    const title = card.querySelector('.portfolio-content h3')?.innerText || '';
    const imgEl = card.querySelector('.portfolio-img img');
    const imgSrc = imgEl ? imgEl.src : '';
    const detailsHTML = card.querySelector('.case-details')?.innerHTML || '';

    return `
        <div class="modal-grid">
            <div class="modal-image">
                ${imgSrc ? `<img src="${imgSrc}" alt="${title}">` : ''}
            </div>
            <div class="modal-body">
                <h3>${title}</h3>
                <div class="modal-details">${detailsHTML}</div>
            </div>
        </div>
    `;
}

/** Initialize both service and portfolio modals (they share one dialog element). */
export function initModals() {
    const controller = createModalController();
    if (!controller) return;

    bindCards(document.querySelectorAll('.service-card'), controller.open, buildServiceModal);
    bindCards(document.querySelectorAll('.portfolio-item'), controller.open, buildPortfolioModal);
}
