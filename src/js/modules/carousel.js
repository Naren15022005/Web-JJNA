/**
 * Portfolio carousel: horizontal scroll-snap track with arrow buttons, dot
 * indicators and autoplay that pauses on interaction or when the tab is hidden.
 */

const AUTOPLAY_INTERVAL = 4500; // ms

export function initPortfolioCarousel() {
    const track = document.querySelector('.portfolio-track');
    if (!track) return;

    const prev = document.querySelector('.carousel-prev');
    const next = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const cards = Array.from(track.querySelectorAll('.portfolio-item'));

    let scrollAmount = measureStep();
    let autoplayTimer = null;
    const dots = [];

    function measureStep() {
        const card = track.querySelector('.portfolio-item');
        const gap = parseInt(getComputedStyle(track).gap) || 16;
        return card?.offsetWidth ? Math.round(card.offsetWidth + gap) : 600;
    }

    function currentIndex() {
        scrollAmount = measureStep();
        return Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / scrollAmount)));
    }

    function setActiveDot(index) {
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    function scrollToIndex(index, smooth = true) {
        track.scrollTo({ left: index * scrollAmount, behavior: smooth ? 'smooth' : 'auto' });
    }

    function scrollNext() {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    function scrollPrev() {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }

    function pauseAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }

    function resumeAutoplay() {
        if (autoplayTimer) return;
        autoplayTimer = setInterval(() => {
            if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                scrollNext();
            }
        }, AUTOPLAY_INTERVAL);
    }

    // Restart autoplay after a manual interaction.
    function nudge(action) {
        pauseAutoplay();
        action();
        setTimeout(resumeAutoplay, AUTOPLAY_INTERVAL);
    }

    // --- Arrow buttons ---
    next?.addEventListener('click', () => nudge(scrollNext));
    prev?.addEventListener('click', () => nudge(scrollPrev));

    // --- Dot indicators ---
    if (dotsContainer && cards.length) {
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Ir al proyecto ${i + 1}`);
            dot.addEventListener('click', () => nudge(() => {
                scrollToIndex(i);
                setActiveDot(i);
            }));
            dotsContainer.appendChild(dot);
            dots.push(dot);
        });

        // Keep the active dot in sync while scrolling (rAF-throttled).
        let scrollRaf = null;
        track.addEventListener('scroll', () => {
            if (scrollRaf) return;
            scrollRaf = requestAnimationFrame(() => {
                setActiveDot(currentIndex());
                scrollRaf = null;
            });
        }, { passive: true });
    }

    // --- Keyboard support when the track has focus ---
    track.tabIndex = 0;
    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nudge(scrollNext);
        if (e.key === 'ArrowLeft') nudge(scrollPrev);
    });

    // --- Pause autoplay on interaction / when hidden ---
    track.addEventListener('mouseenter', pauseAutoplay);
    track.addEventListener('mouseleave', resumeAutoplay);
    track.addEventListener('touchstart', pauseAutoplay, { passive: true });
    track.addEventListener('touchend', () => setTimeout(resumeAutoplay, 800));
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) pauseAutoplay(); else resumeAutoplay();
    });

    window.addEventListener('resize', () => { scrollAmount = measureStep(); });

    resumeAutoplay();
}
