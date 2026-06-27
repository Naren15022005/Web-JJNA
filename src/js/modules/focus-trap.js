/**
 * Focus trap utility: keeps keyboard focus inside a given container while active.
 * Returns an object with `trap()` and `release()` methods.
 */
export function createFocusTrap(container) {
    let focusable = [];
    let firstEl = null;
    let lastEl = null;
    let prevActive = null;
    let hadTabindex = false;

    function updateFocusable() {
        focusable = Array.from(container.querySelectorAll('a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]'))
            .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length);
        firstEl = focusable[0] || null;
        lastEl = focusable[focusable.length - 1] || null;
    }

    function handleKey(e) {
        if (e.key === 'Tab') {
            updateFocusable();
            if (focusable.length === 0) {
                e.preventDefault();
                return;
            }
            if (e.shiftKey) {
                if (document.activeElement === firstEl || !container.contains(document.activeElement)) {
                    e.preventDefault();
                    lastEl.focus();
                }
            } else {
                if (document.activeElement === lastEl || !container.contains(document.activeElement)) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }
        }
    }

    return {
        trap() {
            prevActive = document.activeElement;
            updateFocusable();
            if (!firstEl && !container.hasAttribute('tabindex')) {
                container.setAttribute('tabindex', '-1');
                hadTabindex = false;
            } else {
                hadTabindex = container.hasAttribute('tabindex');
            }
            document.addEventListener('keydown', handleKey);
            // focus first focusable or the container itself
            if (firstEl) firstEl.focus(); else container.focus();
        },
        release() {
            document.removeEventListener('keydown', handleKey);
            if (!hadTabindex && container.getAttribute('tabindex') === '-1') container.removeAttribute('tabindex');
            if (prevActive && typeof prevActive.focus === 'function') prevActive.focus();
        }
    };
}
