// Animation functionality
export function initializeAnimations() {
    return new Promise((resolve) => {
        const animations = new AnimationManager();
        animations.init();
        resolve();
    });
}

class AnimationManager {
    constructor() {
        this.observers = [];
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    init() {
        if (this.isReducedMotion) {
            document.body.classList.add('reduced-motion');
            resolve();
            return;
        }

        this.initializeScrollAnimations();
        this.initializeHoverEffects();
        this.initializeLoadingAnimations();
        this.initializeParallaxEffects();
    }

    initializeScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll([
            '.project-card',
            '.skill-item',
            '.skill-category',
            '.contact-card',
            '.hero__text',
            '.hero__image',
            '.about__content'
        ].join(','));

        animatedElements.forEach((el, index) => {
            el.style.setProperty('--animation-delay', `${index * 0.1}s`);
            observer.observe(el);
        });

        this.observers.push(observer);
    }

    initializeHoverEffects() {
        // Enhanced hover effects for interactive elements
        const interactiveElements = document.querySelectorAll([
            '.project-card',
            '.skill-item',
            '.button',
            '.nav-link',
            '.media-icon',
            '.tech-tag'
        ].join(','));

        interactiveElements.forEach(element => {
            this.addHoverEffect(element);
        });
    }

    addHoverEffect(element) {
        let hoverTimeout;

        element.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            element.classList.add('hover-active');
            
            // Add ripple effect for buttons
            if (element.classList.contains('button')) {
                this.createRippleEffect(element);
            }
        });

        element.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                element.classList.remove('hover-active');
            }, 150);
        });

        // Touch support for mobile
        element.addEventListener('touchstart', () => {
            element.classList.add('touch-active');
        });

        element.addEventListener('touchend', () => {
            setTimeout(() => {
                element.classList.remove('touch-active');
            }, 150);
        });
    }

    createRippleEffect(element) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    initializeLoadingAnimations() {
        // Stagger animations for elements that load together
        const staggerGroups = {
            '.projects__grid .project-card': 100,
            '.skills__list .skill-item': 150,
            '.contact-section .contact-card': 200
        };

        Object.entries(staggerGroups).forEach(([selector, delay]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                element.style.animationDelay = `${index * delay}ms`;
            });
        });
    }

    initializeParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        if (parallaxElements.length === 0) return;

        let ticking = false;

        const updateParallax = () => {
            const scrollY = window.scrollY;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // Utility methods
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    }

    slideIn(element, direction = 'left', duration = 300) {
        const transforms = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            up: 'translateY(-100%)',
            down: 'translateY(100%)'
        };

        element.style.transform = transforms[direction];
        element.style.opacity = '0';
        element.style.display = 'block';

        const start = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);

            element.style.opacity = progress;
            
            if (direction === 'left' || direction === 'right') {
                const translateX = direction === 'left' ? -100 + (100 * easeOut) : 100 - (100 * easeOut);
                element.style.transform = `translateX(${translateX}%)`;
            } else {
                const translateY = direction === 'up' ? -100 + (100 * easeOut) : 100 - (100 * easeOut);
                element.style.transform = `translateY(${translateY}%)`;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.transform = 'translate(0, 0)';
            }
        };

        requestAnimationFrame(animate);
    }

    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}