/**
 * Navigation: mobile menu, smooth anchor scrolling, sticky-header state on
 * scroll and active-link highlighting.
 */

const HEADER_OFFSET = 20;

function getHeaderHeight() {
    return document.querySelector('header')?.offsetHeight ?? 0;
}

/** Smoothly scroll to a section, compensating for the fixed header. */
function scrollToSection(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;
    const targetPosition = target.offsetTop - getHeaderHeight() - HEADER_OFFSET;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
}

/** Highlight the nav link matching the section currently in view. */
function highlightActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const scrollPosition = window.scrollY + getHeaderHeight() + 100;

    let current = '';
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

export function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;
    if (!hamburger || !navLinks || !mobileOverlay) return;

    function handleEscapeKey(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    }

    function toggleMenu() {
        const isActive = navLinks.classList.contains('active');

        navLinks.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        body.style.overflow = isActive ? 'auto' : 'hidden';

        const icon = hamburger.querySelector('i');
        if (icon) icon.className = isActive ? 'fas fa-bars' : 'fas fa-times';

        if (!isActive) {
            document.addEventListener('keydown', handleEscapeKey);
        } else {
            document.removeEventListener('keydown', handleEscapeKey);
        }
    }

    hamburger.addEventListener('click', toggleMenu);
    mobileOverlay.addEventListener('click', toggleMenu);

    // Close the mobile menu when a link is tapped (and navigate after it closes).
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (!navLinks.classList.contains('active')) return;
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                toggleMenu();
                setTimeout(() => scrollToSection(href), 300);
            } else {
                toggleMenu();
            }
        });
    });

    // Close the open mobile menu when resizing up to desktop.
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                toggleMenu();
            }
        }, 250);
    });

    // Sticky-header state + active link highlighting on scroll (throttled).
    const header = document.querySelector('header');
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 100);
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(highlightActiveNav, 10);
    });

    // Smooth scrolling for every in-page anchor link.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            if (document.querySelector(targetId)) {
                e.preventDefault();
                scrollToSection(targetId);
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });

    highlightActiveNav();
}
