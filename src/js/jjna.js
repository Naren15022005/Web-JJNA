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
let scrollTimeout;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrollY = window.scrollY;
    
    clearTimeout(scrollTimeout);
    
    if (scrollY > 100) {
        header.style.background = 'rgba(10, 11, 20, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(10, 11, 20, 0.95)';
        header.style.boxShadow = 'none';
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
            img.src = img.dataset.src;
        });
    }
    
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
        document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
    }
}

// Enhanced initialization function
function initializeEnhancedFeatures() {
    initializeAnimations();
    optimizeForTouch();
    optimizePerformance();
    highlightActiveNav();
    initWhatsApp();
    
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