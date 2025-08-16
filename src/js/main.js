// Main JavaScript functionality
import { initializeAnimations } from './animations.js';
import { initializeNavigation } from './navigation.js';
import { initializeTheme } from './theme.js';
import { initializeUtils } from './utils.js';

class PortfolioApp {
    constructor() {
        this.isLoaded = false;
        this.init();
    }

    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }
        } catch (error) {
            console.error('Failed to initialize portfolio:', error);
        }
    }

    async start() {
        try {
            // Initialize core modules
            await Promise.all([
                initializeTheme(),
                initializeNavigation(),
                initializeAnimations(),
                initializeUtils()
            ]);

            // Mark as loaded
            this.isLoaded = true;
            document.body.classList.add('loaded');

            // Initialize page-specific functionality
            this.initializePageSpecific();

            console.log('Portfolio initialized successfully');
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    initializePageSpecific() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'home':
                this.initializeHomePage();
                break;
            case 'projects':
                this.initializeProjectsPage();
                break;
            case 'skills':
                this.initializeSkillsPage();
                break;
            case 'contact':
                this.initializeContactPage();
                break;
            case 'intro':
                this.initializeIntroPage();
                break;
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('Home') || path === '/') return 'home';
        if (path.includes('Projects')) return 'projects';
        if (path.includes('About-me')) return 'skills';
        if (path.includes('contact-me')) return 'contact';
        if (path.includes('index.html') && !path.includes('pages')) return 'intro';
        return 'home';
    }

    initializeHomePage() {
        // Typing animation for hero text
        if (typeof Typed !== 'undefined') {
            const roleElement = document.getElementById('role-text');
            if (roleElement) {
                new Typed('#role-text', {
                    strings: [
                        'Creative Developer',
                        'UI/UX Designer', 
                        'Frontend Engineer',
                        'Embedded Systems Expert'
                    ],
                    typeSpeed: 80,
                    backSpeed: 50,
                    backDelay: 2000,
                    loop: true,
                    showCursor: true,
                    cursorChar: '|'
                });
            }
        }

        // Smooth scroll for anchor links
        this.initializeSmoothScroll();
        
        // Status indicator
        this.updateStatusIndicator();
        
        // Analytics tracking
        this.trackPageView('home');
    }

    initializeProjectsPage() {
        this.loadProjects();
        this.trackPageView('projects');
    }

    initializeSkillsPage() {
        this.animateSkillCards();
        this.trackPageView('skills');
    }

    initializeContactPage() {
        this.initializeContactForm();
        this.trackPageView('contact');
    }

    initializeIntroPage() {
        this.initializeVideoControls();
        this.trackPageView('intro');
    }

    initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    updateStatusIndicator() {
        const statusElement = document.getElementById('availability-status');
        const statusDot = document.querySelector('.status-dot');
        
        if (statusElement && statusDot) {
            const status = localStorage.getItem('portfolioStatus') || 'available';
            
            if (status === 'available') {
                statusElement.textContent = 'Available for projects';
                statusDot.className = 'status-dot dot-available';
            } else {
                statusElement.textContent = 'Currently busy';
                statusDot.className = 'status-dot dot-busy';
            }
        }
    }

    loadProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        const defaultProjects = [
            {
                title: "ChartNodes",
                description: "Minecraft servers hosting solution with real-time analytics and management dashboard.",
                technologies: ["HTML", "SCSS", "Python", "Flask"],
                isLive: true,
                isFeatured: true,
                status: "published",
                link: "https://github.com/Emozz001",
                github: "https://github.com/Emozz001",
                category: "web",
                image: null
            },
            {
                title: "PROTECTX Bot",
                description: "Discord anti-crash bot with advanced protection features and custom commands.",
                technologies: ["React", "Express", "Discord.js", "Node.js"],
                isLive: false,
                isFeatured: true,
                status: "published",
                link: "https://github.com/Emozz001",
                github: "https://github.com/Emozz001",
                category: "bot",
                image: null
            },
            {
                title: "Kahoot Answers",
                description: "Get answers to your kahoot quiz in real-time with this powerful educational tool.",
                technologies: ["CSS", "Express", "Node.js"],
                isLive: true,
                isFeatured: false,
                status: "published",
                link: "https://github.com/Emozz001",
                github: "https://github.com/Emozz001",
                category: "tool",
                image: null
            }
        ];

        // Load from localStorage or use defaults
        const projects = JSON.parse(localStorage.getItem('portfolioProjects')) || defaultProjects;
        const publishedProjects = projects.filter(project => project.status === 'published');

        this.renderProjects(publishedProjects, projectsGrid);
    }

    renderProjects(projects, container) {
        container.innerHTML = '';

        if (projects.length === 0) {
            container.innerHTML = `
                <div class="no-projects">
                    <i class="fas fa-folder-open"></i>
                    <p>No published projects found.</p>
                </div>
            `;
            return;
        }

        projects.forEach((project, index) => {
            const projectCard = this.createProjectCard(project, index);
            container.appendChild(projectCard);
        });
    }

    createProjectCard(project, index) {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const techTags = project.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        const statusBadges = this.createStatusBadges(project);

        card.innerHTML = `
            <div class="project-image">
                ${project.image ? 
                    `<img src="${project.image}" alt="${project.title}" loading="lazy">` : 
                    `<div class="project-placeholder">
                        <i class="fas fa-${this.getProjectIcon(project.category)}"></i>
                    </div>`
                }
                ${project.isFeatured ? '<div class="featured-badge"><i class="fas fa-star"></i></div>' : ''}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">${techTags}</div>
                <div class="project-actions">
                    <div class="status-badges">${statusBadges}</div>
                    <div class="project-links">
                        ${project.link ? `<a href="${project.link}" class="project-link primary" target="_blank" rel="noopener">
                            <i class="fas fa-external-link-alt"></i>
                            <span>View Live</span>
                        </a>` : ''}
                        ${project.github ? `<a href="${project.github}" class="project-link secondary" target="_blank" rel="noopener">
                            <i class="fab fa-github"></i>
                            <span>Code</span>
                        </a>` : ''}
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    createStatusBadges(project) {
        let badges = '';
        
        if (project.isLive) {
            badges += `<span class="status-badge live"><i class="fas fa-circle"></i> Live</span>`;
        }
        
        if (project.github) {
            badges += `<span class="status-badge github"><i class="fab fa-github"></i> Open Source</span>`;
        }
        
        return badges;
    }

    getProjectIcon(category) {
        const icons = {
            web: 'globe',
            bot: 'robot',
            tool: 'tools',
            mobile: 'mobile-alt',
            desktop: 'desktop',
            default: 'code'
        };
        return icons[category] || icons.default;
    }

    animateSkillCards() {
        const skillCards = document.querySelectorAll('.skill-category');
        
        skillCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200 * index);
        });
    }

    initializeContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(form);
                const contactData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    subject: formData.get('subject'),
                    message: formData.get('message'),
                    timestamp: new Date().toISOString(),
                    id: Date.now().toString()
                };

                // Save to localStorage
                const contacts = JSON.parse(localStorage.getItem('portfolio_contacts')) || [];
                contacts.unshift(contactData);
                localStorage.setItem('portfolio_contacts', JSON.stringify(contacts.slice(0, 50)));

                // Show success message
                this.showFormMessage('success', 'Message sent successfully! I\'ll get back to you soon.');
                form.reset();

                // Track contact submission
                this.trackEvent('contact_form_submit', { subject: contactData.subject });

            } catch (error) {
                console.error('Error submitting form:', error);
                this.showFormMessage('error', 'Failed to send message. Please try again.');
            } finally {
                // Reset button
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 1000);
            }
        });
    }

    showFormMessage(type, message) {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();

        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        const form = document.getElementById('contactForm');
        form.appendChild(messageDiv);

        setTimeout(() => messageDiv.remove(), 5000);
    }

    initializeVideoControls() {
        const video = document.getElementById('introVideo');
        const playPauseBtn = document.getElementById('playPauseBtn');
        const muteBtn = document.getElementById('muteBtn');

        if (!video) return;

        // Auto-redirect after video ends
        video.addEventListener('ended', () => {
            window.location.href = '/pages/Home/index.html';
        });

        // Play/Pause functionality
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    video.pause();
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
        }

        // Mute/Unmute functionality
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                video.muted = !video.muted;
                muteBtn.innerHTML = video.muted ? 
                    '<i class="fas fa-volume-mute"></i>' : 
                    '<i class="fas fa-volume-up"></i>';
            });
        }

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    playPauseBtn?.click();
                    break;
                case 'KeyM':
                    muteBtn?.click();
                    break;
                case 'Escape':
                    window.location.href = '/pages/Home/index.html';
                    break;
            }
        });

        // Handle video loading errors
        video.addEventListener('error', () => {
            console.warn('Video failed to load, redirecting to home page');
            setTimeout(() => {
                window.location.href = '/pages/Home/index.html';
            }, 2000);
        });
    }

    trackPageView(page) {
        try {
            let pageViews = parseInt(localStorage.getItem('portfolio_page_views')) || 0;
            pageViews++;
            localStorage.setItem('portfolio_page_views', pageViews);

            // Track specific page
            const pageKey = `portfolio_${page}_views`;
            let specificViews = parseInt(localStorage.getItem(pageKey)) || 0;
            specificViews++;
            localStorage.setItem(pageKey, specificViews);

            // Track visitor data
            this.trackVisitor(page);
        } catch (error) {
            console.error('Error tracking page view:', error);
        }
    }

    trackVisitor(page) {
        try {
            let visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
            const visitorId = localStorage.getItem('visitorId') || 'visitor_' + Date.now();
            
            const visitData = {
                id: visitorId,
                page: page,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                referrer: document.referrer || 'direct'
            };
            
            visitors.push(visitData);
            localStorage.setItem('visitors', JSON.stringify(visitors.slice(-100)));
            localStorage.setItem('visitorId', visitorId);
        } catch (error) {
            console.error('Error tracking visitor:', error);
        }
    }

    trackEvent(eventName, data = {}) {
        try {
            const events = JSON.parse(localStorage.getItem('portfolio_events') || '[]');
            const eventData = {
                name: eventName,
                data: data,
                timestamp: new Date().toISOString(),
                page: this.getCurrentPage()
            };
            
            events.push(eventData);
            localStorage.setItem('portfolio_events', JSON.stringify(events.slice(-50)));
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }
}

// Initialize the application
window.portfolioApp = new PortfolioApp();

// Export for use in other modules
export default PortfolioApp;