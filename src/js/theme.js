// Theme management functionality
export function initializeTheme() {
    return new Promise((resolve) => {
        const themeManager = new ThemeManager();
        themeManager.init();
        resolve();
    });
}

class ThemeManager {
    constructor() {
        this.themes = {
            default: {
                name: 'Default',
                primary: '#AFDF19',
                primaryDark: '#9BC516',
                secondary: '#74B9FF',
                accent: '#FDCB6E',
                background: '#0B1426',
                surface: '#1E2A3A',
                surfaceLight: '#2C3E50'
            },
            ocean: {
                name: 'Ocean',
                primary: '#00D4AA',
                primaryDark: '#00B894',
                secondary: '#74B9FF',
                accent: '#FDCB6E',
                background: '#0B1426',
                surface: '#1E2A3A',
                surfaceLight: '#2C3E50'
            },
            sunset: {
                name: 'Sunset',
                primary: '#FF6B6B',
                primaryDark: '#FF5252',
                secondary: '#4ECDC4',
                accent: '#FFD166',
                background: '#1A1A2E',
                surface: '#16213E',
                surfaceLight: '#0F3460'
            },
            forest: {
                name: 'Forest',
                primary: '#27AE60',
                primaryDark: '#229954',
                secondary: '#3498DB',
                accent: '#F39C12',
                background: '#0E1A0E',
                surface: '#1A2E1A',
                surfaceLight: '#2E4A2E'
            }
        };
        
        this.currentTheme = 'default';
        this.prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    init() {
        this.loadSavedTheme();
        this.applyTheme(this.currentTheme);
        this.setupThemeToggle();
        this.watchSystemTheme();
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('portfolio_theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        }
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        const root = document.documentElement;
        
        // Apply CSS custom properties
        Object.entries(theme).forEach(([key, value]) => {
            if (key !== 'name') {
                root.style.setProperty(`--${this.camelToKebab(key)}`, value);
            }
        });

        // Update theme class on body
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);

        // Update meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme.primary);
        }

        this.currentTheme = themeName;
        localStorage.setItem('portfolio_theme', themeName);

        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName, colors: theme }
        }));
    }

    setupThemeToggle() {
        // Create theme toggle button if it doesn't exist
        let themeToggle = document.getElementById('theme-toggle');
        
        if (!themeToggle) {
            themeToggle = document.createElement('button');
            themeToggle.id = 'theme-toggle';
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = '<i class="fas fa-palette"></i>';
            themeToggle.title = 'Change Theme';
            
            // Add to header
            const header = document.querySelector('.header .container');
            if (header) {
                header.appendChild(themeToggle);
            }
        }

        // Create theme selector dropdown
        this.createThemeSelector(themeToggle);
    }

    createThemeSelector(toggleButton) {
        const selector = document.createElement('div');
        selector.className = 'theme-selector';
        selector.innerHTML = `
            <div class="theme-options">
                ${Object.entries(this.themes).map(([key, theme]) => `
                    <button class="theme-option ${key === this.currentTheme ? 'active' : ''}" 
                            data-theme="${key}">
                        <div class="theme-preview" style="background: ${theme.primary}"></div>
                        <span>${theme.name}</span>
                    </button>
                `).join('')}
            </div>
        `;

        toggleButton.appendChild(selector);

        // Toggle dropdown
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            selector.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            selector.classList.remove('active');
        });

        // Handle theme selection
        selector.addEventListener('click', (e) => {
            const themeOption = e.target.closest('.theme-option');
            if (themeOption) {
                const themeName = themeOption.dataset.theme;
                this.applyTheme(themeName);
                
                // Update active state
                selector.querySelectorAll('.theme-option').forEach(option => {
                    option.classList.remove('active');
                });
                themeOption.classList.add('active');
                
                selector.classList.remove('active');
            }
        });
    }

    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            this.prefersDarkMode = e.matches;
            
            // Auto-switch theme based on system preference if user hasn't manually selected
            const hasManualTheme = localStorage.getItem('portfolio_theme');
            if (!hasManualTheme) {
                const autoTheme = e.matches ? 'default' : 'ocean';
                this.applyTheme(autoTheme);
            }
        });
    }

    // Utility methods
    camelToKebab(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    getThemeColors(themeName = this.currentTheme) {
        return this.themes[themeName] || this.themes.default;
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    // Animation for theme transitions
    animateThemeChange() {
        document.body.classList.add('theme-transitioning');
        
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }
}

// Export theme manager instance for global access
export const themeManager = new ThemeManager();