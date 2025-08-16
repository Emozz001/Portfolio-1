// Navigation functionality
export function initializeNavigation() {
    return new Promise((resolve) => {
        const navigation = new NavigationManager();
        navigation.init();
        resolve();
    });
}

class NavigationManager {
    constructor() {
        this.mobileToggle = document.getElementById('mobileToggle');
        this.headerNav = document.querySelector('.header__nav');
        this.header = document.querySelector('.header');
        this.overlay = null;
        this.isMenuOpen = false;
        this.scrollThreshold = 50;
        this.lastScrollY = 0;
    }

    init() {
        this.createMobileOverlay();
        this.bindEvents();
        this.updateNavigation();
        this.initializeScrollEffects();
        this.highlightActiveSection();
    }

    createMobileOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'mobile-overlay';
        document.body.appendChild(this.overlay);
    }

    bindEvents() {
        // Mobile toggle
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeMobileMenu());
        }

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavClick(e, link);
            });
        });

        // Window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateNavigation();
                if (this.isMenuOpen && this.getDeviceType() !== 'mobile') {
                    this.closeMobileMenu();
                }
            }, 100);
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Touch gestures for mobile
        this.initializeTouchGestures();
    }

    initializeTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleGesture();
        });

        const handleGesture = () => {
            if (this.getDeviceType() !== 'mobile') return;

            const swipeThreshold = 100;
            const swipeDistance = touchEndX - touchStartX;

            // Swipe right to left (close menu)
            if (swipeDistance < -swipeThreshold && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        };

        this.handleGesture = handleGesture;
    }

    toggleMobileMenu() {
        if (this.getDeviceType() !== 'mobile') return;

        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        if (this.getDeviceType() !== 'mobile') return;

        this.headerNav?.classList.add('active');
        this.overlay?.classList.add('active');
        this.mobileToggle?.classList.add('active');
        
        if (this.mobileToggle) {
            this.mobileToggle.innerHTML = '<i class="fas fa-times"></i>';
        }

        document.body.style.overflow = 'hidden';
        this.isMenuOpen = true;

        // Animate nav items
        const navLinks = this.headerNav?.querySelectorAll('.nav-link');
        navLinks?.forEach((link, index) => {
            link.style.transitionDelay = `${index * 0.1}s`;
            link.style.transform = 'translateX(0)';
            link.style.opacity = '1';
        });
    }

    closeMobileMenu() {
        this.headerNav?.classList.remove('active');
        this.overlay?.classList.remove('active');
        this.mobileToggle?.classList.remove('active');
        
        if (this.mobileToggle) {
            this.mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }

        document.body.style.overflow = '';
        this.isMenuOpen = false;

        // Reset nav item animations
        const navLinks = this.headerNav?.querySelectorAll('.nav-link');
        navLinks?.forEach(link => {
            link.style.transitionDelay = '0s';
        });
    }

    handleNavClick(e, link) {
        const href = link.getAttribute('href');
        
        // Handle anchor links (same page)
        if (href?.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                this.smoothScrollTo(target);
                this.updateActiveLink(link);
            }
        }

        // Close mobile menu after navigation
        if (this.getDeviceType() === 'mobile') {
            setTimeout(() => this.closeMobileMenu(), 300);
        }
    }

    smoothScrollTo(target) {
        const headerHeight = this.header?.offsetHeight || 80;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    updateActiveLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    getDeviceType() {
        const width = window.innerWidth;
        if (width >= 1025) return 'desktop';
        if (width >= 769) return 'tablet';
        return 'mobile';
    }

    updateNavigation() {
        const device = this.getDeviceType();

        switch(device) {
            case 'desktop':
            case 'tablet':
                this.headerNav?.classList.remove('active');
                this.overlay?.classList.remove('active');
                document.body.style.overflow = '';
                if (this.mobileToggle) {
                    this.mobileToggle.style.display = 'none';
                }
                this.isMenuOpen = false;
                break;

            case 'mobile':
                if (this.mobileToggle) {
                    this.mobileToggle.style.display = 'flex';
                }
                break;
        }
    }

    initializeScrollEffects() {
        let ticking = false;

        const updateHeader = () => {
            const scrollY = window.scrollY;

            // Header background effect
            if (scrollY > this.scrollThreshold) {
                this.header?.classList.add('scrolled');
            } else {
                this.header?.classList.remove('scrolled');
            }

            // Hide/show header on scroll (optional)
            if (scrollY > this.lastScrollY && scrollY > 200) {
                this.header?.classList.add('hidden');
            } else {
                this.header?.classList.remove('hidden');
            }

            this.lastScrollY = scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        if (sections.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    
                    if (activeLink) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        activeLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        });

        sections.forEach(section => observer.observe(section));
    }
}