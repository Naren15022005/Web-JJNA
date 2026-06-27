/**
 * WhatsApp contact buttons: open a pre-filled chat and (optionally) report the
 * click to an analytics provider if `gtag` is present.
 */

const DEFAULT_PHONE = '573011737645';
const DEFAULT_MESSAGE = '¡Hola! Vi que aquí pueden hacer mi idea mediante software. Me gustaría obtener más información sobre sus servicios.';

function trackWhatsAppClick(source) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            event_category: 'contact',
            event_label: source,
            value: 1
        });
    }
}

export function initWhatsApp() {
    const buttons = document.querySelectorAll('.whatsapp-btn, .whatsapp-float-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            const phoneNumber = this.getAttribute('data-phone') || DEFAULT_PHONE;
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
            window.open(url, '_blank');

            trackWhatsAppClick(
                this.classList.contains('whatsapp-float-btn') ? 'floating_button' : 'section_button'
            );
        });
    });
}
