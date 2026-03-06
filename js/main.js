// NEAR TAXI SERVICE - MAIN INTERACTION SCRIPT

document.addEventListener('DOMContentLoaded', () => {
    console.log('Near Taxi Service Loaded');
    // Preloader Logic with Fallback
    const preloader = document.getElementById('preloader');
    let isLoaded = false;

    const removeLoader = () => {
        if (!isLoaded && preloader) {
            isLoaded = true;
            preloader.classList.add('preloader-hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }
    };

    // Remove Premium Preloader when everything is fully loaded
    window.addEventListener('load', removeLoader);

    // Fallback: If network is extremely slow or broken assets hang the load event,
    // force hide the loader after 7 seconds so the user isn't stuck forever.
    setTimeout(removeLoader, 7000);

    // Check device type for logging/analytics
    const isMobile = window.innerWidth < 1024;
    console.log(`Mode: ${isMobile ? 'Mobile App' : 'Desktop Experience'}`);

    // --- Lamborghini Lottie Animation ---
    const initLottie = () => {
        const lottieLib = window.lottie || window.bodymovin;

        if (!lottieLib) {
            console.error('Lottie library not found! Please check the CDN link.');
            return;
        }

        const lottiePath = 'assets/lottie/Lamborghini.json';
        const isCurrentlyMobile = window.innerWidth < 1024;

        // Shared observer to trigger animations on viewport entry
        const lottieObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const container = entry.target;
                    try {
                        const animConfig = {
                            container: container,
                            renderer: 'svg',
                            loop: true,
                            autoplay: true
                        };

                        // Use pre-loaded data if available (fixes file:// protocol issues)
                        if (typeof lamborghiniAnimationData !== 'undefined') {
                            animConfig.animationData = lamborghiniAnimationData;
                        } else {
                            animConfig.path = lottiePath;
                        }

                        const anim = lottieLib.loadAnimation(animConfig);

                        // Force play if needed
                        anim.play();

                        console.log(`${container.id} Lottie lazy-initialized`);
                        lottieObserver.unobserve(container);
                    } catch (err) {
                        console.error(`${container.id} Lottie Error:`, err);
                    }
                }
            });
        }, { threshold: 0.1 });

        // Initialize Mobile Target
        const lottieMobile = document.getElementById('lottie-lamborghini');
        if (lottieMobile && isCurrentlyMobile) {
            lottieObserver.observe(lottieMobile);
        }

        // Initialize Desktop Target
        const lottieDesktop = document.getElementById('lottie-lamborghini-desktop');
        if (lottieDesktop && !isCurrentlyMobile) {
            lottieObserver.observe(lottieDesktop);
        }
    };

    initLottie();



    // --- Desktop Navbar Scroll Effect ---
    const desktopNav = document.querySelector('.desktop-nav');
    if (desktopNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                desktopNav.classList.add('scrolled');
            } else {
                desktopNav.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Bottom Nav Logic ---
    const navItems = document.querySelectorAll('.mobile-bottom-nav .nav-item:not(.central-action)');

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            // Only handle active state changes if it's an anchor link (hash)
            // If it's a real page link like services.html, let the browser handle it
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                // Remove active class from all
                navItems.forEach(nav => nav.classList.remove('active'));

                // Add to clicked
                this.classList.add('active');
            }
        });
    });

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#mobile-menu') return;

            e.preventDefault();

            // Handle multiple targets with same ID (mobile vs desktop)
            const id = targetId.substring(1);
            const targets = document.querySelectorAll(`[id="${id}"]`);
            let targetElement = null;

            targets.forEach(el => {
                // Pick the visible one
                if (window.getComputedStyle(el).display !== 'none') {
                    targetElement = el;
                }
            });

            // Fallback to first one found if none specifically "visible"
            if (!targetElement) targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- AOS Refresh ---
    // Recalculate AOS positions on load/resize just in case
    window.addEventListener('load', () => {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    });
    // --- Active Nav Handling ---
    const handleActiveNav = () => {
        const path = window.location.pathname;
        const page = path.split("/").pop() || 'index.html';
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === page || (page === 'index.html' && (href === '#' || href === 'index.html'))) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };

    handleActiveNav();
    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = document.querySelectorAll('.menu-links a');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop scrolling
        });
    }

    const closeMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    };

    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }

    // Close menu when a link is clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu if clicking outside the content
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMenu();
            }
        });
    }
});
