// Mobile Menu Functionality - Mejorado
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const mobileOverlay = document.querySelector('.mobile-menu-overlay');
const body = document.body;

function toggleMenu() {
    const isActive = navLinks.classList.contains('active');
    
    navLinks.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    body.style.overflow = isActive ? 'auto' : 'hidden';
    
    // Change hamburger icon
    const icon = hamburger.querySelector('i');
    icon.className = isActive ? 'fas fa-bars' : 'fas fa-times';
    
    // Add/remove event listener for escape key
    if (!isActive) {
        document.addEventListener('keydown', handleEscapeKey);
    } else {
        document.removeEventListener('keydown', handleEscapeKey);
    }
}

function handleEscapeKey(e) {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        toggleMenu();
    }
}

hamburger.addEventListener('click', toggleMenu);
mobileOverlay.addEventListener('click', toggleMenu);

// Close menu when clicking on links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active')) {
            // Solo prevenir el comportamiento por defecto si es un enlace de ancla
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                toggleMenu();
                
                // Navegar después de cerrar el menú
                setTimeout(() => {
                    const target = document.querySelector(targetId);
                    if (target) {
                        const headerHeight = document.querySelector('header').offsetHeight;
                        const targetPosition = target.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }, 300);
            } else {
                toggleMenu();
            }
        }
    });
});

// Handle resize events - Mejorado
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    }, 250);
});

// Header background on scroll - Mejorado
// Cambia el estado mediante la clase `.scrolled` en lugar de estilos inline
let scrollTimeout;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrollY = window.scrollY;
    
    clearTimeout(scrollTimeout);
    
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Throttle the scroll handler
    scrollTimeout = setTimeout(() => {
        highlightActiveNav();
    }, 10);
});

// Smooth scrolling for anchor links - Mejorado
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without jumping
            if (history.pushState) {
                history.pushState(null, null, targetId);
            } else {
                location.hash = targetId;
            }
        }
    });
});

// Active navigation link highlighting - Mejorado
function highlightActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const headerHeight = document.querySelector('header').offsetHeight;
    
    let current = '';
    const scrollPosition = window.scrollY + headerHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// WhatsApp Functionality - Implementación Completa
function initWhatsApp() {
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn, .whatsapp-float-btn');
    const defaultMessage = '¡Hola! Vi que aquí pueden hacer mi idea mediante software. Me gustaría obtener más información sobre sus servicios.';
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const phoneNumber = this.getAttribute('data-phone') || '573011737645';
            const encodedMessage = encodeURIComponent(defaultMessage);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            
            // Abrir WhatsApp en nueva pestaña
            window.open(whatsappUrl, '_blank');
            
            // Tracking para analytics (opcional)
            trackWhatsAppClick(this.classList.contains('whatsapp-float-btn') ? 'floating_button' : 'section_button');
        });
    });
}

// WhatsApp Message Customization basado en la sección actual
function getCustomWhatsAppMessage() {
    const currentSection = getCurrentSection();
    let customMessage = '¡Hola! Vi que aquí pueden hacer mi idea mediante software. Me gustaría obtener más información sobre sus servicios.';
    
    switch(currentSection) {
        case 'services':
            customMessage = '¡Hola! Estoy interesado/a en sus servicios de desarrollo. ¿Podrían proporcionarme más información?';
            break;
        case 'portfolio':
            customMessage = '¡Hola! Me encantaron sus proyectos. Me gustaría discutir una idea similar para mi negocio.';
            break;
        case 'orders':
            customMessage = '¡Hola! Quiero solicitar un presupuesto para desarrollar mi proyecto de software.';
            break;
        case 'team':
            customMessage = '¡Hola! Me gustaría contactar con su equipo para un proyecto de desarrollo.';
            break;
    }
    
    return customMessage;
}

function getCurrentSection() {
    const sections = document.querySelectorAll('section');
    const headerHeight = document.querySelector('header').offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 100;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    return currentSection;
}

// WhatsApp Analytics (Opcional)
function trackWhatsAppClick(source) {
    // Aquí puedes integrar con Google Analytics o otro sistema de tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            'event_category': 'contact',
            'event_label': source,
            'value': 1
        });
    }
    
    console.log(`WhatsApp click tracked from: ${source}`);
}

// Add loading animation to elements when they come into view - Mejorado
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
    });
}, observerOptions);

// Observe elements for animation - Mejorado
function initializeAnimations() {
    const animateElements = document.querySelectorAll(
        '.service-card, .portfolio-item, .team-member, .feature, .contact-item, .stat, .step, .tech-item'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}

// Touch device optimizations
function optimizeForTouch() {
    // Increase tap targets for mobile
    if ('ontouchstart' in window) {
        document.querySelectorAll('.btn, .member-social a, .social-links a, .whatsapp-float-btn').forEach(element => {
            element.style.minHeight = '44px';
            element.style.minWidth = '44px';
        });
        
        // Add touch feedback
        document.querySelectorAll('.service-card, .portfolio-item, .team-member, .feature, .tech-item').forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transition = 'transform 0.1s ease';
                this.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transition = 'transform 0.3s ease';
                this.style.transform = 'scale(1)';
            });
        });
    }
}

// Performance optimizations for mobile
function optimizePerformance() {
    // Lazy load images (si se agregaran en el futuro)
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            // Only set src if a data-src is provided to avoid setting 'undefined'
            if (img.dataset && img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }
    
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
        document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
    }
}

/* Focus trap utility: keeps keyboard focus inside a given container while active */
function createFocusTrap(container) {
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
            // focus first focusable or the container
            if (firstEl) firstEl.focus(); else container.focus();
        },
        release() {
            document.removeEventListener('keydown', handleKey);
            if (!hadTabindex && container.getAttribute('tabindex') === '-1') container.removeAttribute('tabindex');
            if (prevActive && typeof prevActive.focus === 'function') prevActive.focus();
        }
    };
}

// Enhanced initialization function
function initializeEnhancedFeatures() {
    initializeAnimations();
    optimizeForTouch();
    optimizePerformance();
    highlightActiveNav();
    initWhatsApp();
    initServiceModals();
    initPortfolioModals();
    initPortfolioCarousel();
    
    console.log('JJNACode website with enhanced features initialized');
}

// Update DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    initializeEnhancedFeatures();
});

// Handle page load and visibility changes
window.addEventListener('load', () => {
    // Ensure all resources are loaded
    document.body.classList.add('loaded');
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause non-essential animations
    } else {
        // Resume animations
    }
});

/* Service modals: open modal showing .service-details from each card */
function initServiceModals() {
    const modal = document.getElementById('service-modal');
    if (!modal) return;
    console.debug('initServiceModals initialized');
    const overlay = modal.querySelector('.service-modal-overlay');
    const panel = modal.querySelector('.service-modal-panel');
    const closeBtn = modal.querySelector('.service-modal-close');
    const content = modal.querySelector('.service-modal-content');
    let modalFocusTrap = null;

    function buildModalFromService(card) {
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

    function openModalFromService(card) {
        console.debug('openModalFromService called for', card);
        content.innerHTML = buildModalFromService(card);
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => { const btn = modal.querySelector('.service-modal-close'); if (btn) btn.focus(); }, 120);
        try { if (modalFocusTrap && modalFocusTrap.release) modalFocusTrap.release(); } catch(e){}
        modalFocusTrap = createFocusTrap(panel);
        modalFocusTrap.trap();
        document.addEventListener('keydown', modalKeyHandler);
    }

    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        content.innerHTML = '';
        try { if (modalFocusTrap && modalFocusTrap.release) modalFocusTrap.release(); } catch(e){}
        modalFocusTrap = null;
        document.removeEventListener('keydown', modalKeyHandler);
    }

    function modalKeyHandler(e) { if (e.key === 'Escape') closeModal(); }

    // Attach click handlers to service cards (use structured modal)
    const serviceCards = document.querySelectorAll('.service-card');
    console.debug('serviceCards found:', serviceCards.length);
    serviceCards.forEach(card => {
        card.addEventListener('click', (e) => {
            console.debug('service card click', card, e.target);
            if (e.target.closest('a')) return; // ignore clicks on links
            openModalFromService(card);
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModalFromService(card);
            }
        });
    });

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
}

/* Portfolio modals: open modal showing .case-details from each project card */
function initPortfolioModals() {
    const modal = document.getElementById('service-modal');
    if (!modal) return;
    console.debug('initPortfolioModals initialized');
    const overlay = modal.querySelector('.service-modal-overlay');
    const closeBtn = modal.querySelector('.service-modal-close');
    const content = modal.querySelector('.service-modal-content');
    let modalFocusTrap = null;

    function openModal(html) {
        content.innerHTML = html;
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', modalKeyHandler);
    }

    function buildModalFromCard(card) {
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

    function openModalFromCard(card) {
        console.debug('openModalFromCard called for', card);
        content.innerHTML = buildModalFromCard(card);
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => { const btn = modal.querySelector('.service-modal-close'); if (btn) btn.focus(); }, 120);
        try { if (modalFocusTrap && modalFocusTrap.release) modalFocusTrap.release(); } catch(e){}
        modalFocusTrap = createFocusTrap(modal.querySelector('.service-modal-panel'));
        modalFocusTrap.trap();
        document.addEventListener('keydown', modalKeyHandler);
    }

    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        content.innerHTML = '';
        try { if (modalFocusTrap && modalFocusTrap.release) modalFocusTrap.release(); } catch(e){}
        modalFocusTrap = null;
        document.removeEventListener('keydown', modalKeyHandler);
    }

    function modalKeyHandler(e) {
        if (e.key === 'Escape') closeModal();
    }

    const portfolioCards = document.querySelectorAll('.portfolio-item');
    console.debug('portfolioCards found:', portfolioCards.length);
    portfolioCards.forEach(card => {
        card.addEventListener('click', (e) => {
            console.debug('portfolio card click', card, e.target);
            if (e.target.closest('a')) return; // ignore clicks on links
            openModalFromCard(card);
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModalFromCard(card);
            }
        });
    });

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
}

/* Simple carousel behavior for .portfolio-track */
function initPortfolioCarousel() {
    const track = document.querySelector('.portfolio-track');
    const prev = document.querySelector('.carousel-prev');
    const next = document.querySelector('.carousel-next');
    if (!track) return;

    let card = track.querySelector('.portfolio-item');
    let scrollAmount = (card && card.offsetWidth) ? Math.round(card.offsetWidth + parseInt(getComputedStyle(track).gap || 16)) : 600;

    function updateScrollAmount() {
        const c = track.querySelector('.portfolio-item');
        if (c) scrollAmount = Math.round(c.offsetWidth + parseInt(getComputedStyle(track).gap || 16));
    }

    function scrollNext() {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    function scrollPrev() {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }

    if (next) next.addEventListener('click', scrollNext);
    if (prev) prev.addEventListener('click', scrollPrev);

    // Keyboard support when focus inside track
    // Autoplay setup
    const AUTOPLAY_INTERVAL = 4500; // ms
    let autoplayTimer = null;
    track.tabIndex = 0;
    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') scrollNext();
        if (e.key === 'ArrowLeft') scrollPrev();
    });

    // pause/resume autoplay helpers
    function pauseAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function resumeAutoplay() {
        if (!autoplayTimer) {
            autoplayTimer = setInterval(() => {
                // If near end, scroll back to start
                if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
                    track.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollNext();
                }
            }, AUTOPLAY_INTERVAL);
        }
    }

    // Pause on manual navigation
    if (next) next.addEventListener('click', () => { pauseAutoplay(); setTimeout(resumeAutoplay, AUTOPLAY_INTERVAL); });
    if (prev) prev.addEventListener('click', () => { pauseAutoplay(); setTimeout(resumeAutoplay, AUTOPLAY_INTERVAL); });
    // Update on resize
    window.addEventListener('resize', () => {
        updateScrollAmount();
    });

    // Autoplay: pause on interaction, resume after
    track.addEventListener('mouseenter', pauseAutoplay);
    track.addEventListener('mouseleave', resumeAutoplay);
    track.addEventListener('touchstart', pauseAutoplay, { passive: true });
    track.addEventListener('touchend', () => setTimeout(resumeAutoplay, 800));

    // Pause when page hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) pauseAutoplay(); else resumeAutoplay();
    });

    // Start autoplay
    resumeAutoplay();
    // Touch: enable swipe by checking pointer events (native scrolling handles it)
}
