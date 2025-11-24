// Mobile Menu Functionality
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
        }

        hamburger.addEventListener('click', toggleMenu);
        mobileOverlay.addEventListener('click', toggleMenu);

        // Close menu when clicking on links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        // Handle resize events
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Header background on scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(10, 11, 20, 0.98)';
            } else {
                header.style.background = 'rgba(10, 11, 20, 0.95)';
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });