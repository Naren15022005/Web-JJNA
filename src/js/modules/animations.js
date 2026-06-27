/**
 * Entrance animations and device/performance optimizations:
 *  - reveal cards on scroll with an IntersectionObserver,
 *  - add touch feedback and larger tap targets on touch devices,
 *  - trim transitions / lazy-load on lower-end devices.
 */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const ANIMATED_SELECTOR =
    '.service-card, .portfolio-item, .team-member, .feature, .contact-item, .stat, .step, .tech-item';

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function revealOnScroll() {
    document.querySelectorAll(ANIMATED_SELECTOR).forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}

function optimizeForTouch() {
    if (!('ontouchstart' in window)) return;

    document.querySelectorAll('.btn, .member-social a, .social-links a, .whatsapp-float-btn').forEach(el => {
        el.style.minHeight = '44px';
        el.style.minWidth = '44px';
    });

    document.querySelectorAll('.service-card, .portfolio-item, .team-member, .feature, .tech-item').forEach(card => {
        card.addEventListener('touchstart', function () {
            this.style.transition = 'transform 0.1s ease';
            this.style.transform = 'scale(0.98)';
        }, { passive: true });

        card.addEventListener('touchend', function () {
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = 'scale(1)';
        });
    });
}

function optimizePerformance() {
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            if (img.dataset?.src) img.src = img.dataset.src;
        });
    }

    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
        document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
    }
}

export function initAnimations() {
    revealOnScroll();
    optimizeForTouch();
    optimizePerformance();
}
