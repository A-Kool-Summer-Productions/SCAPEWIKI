class TemplateLoader {
    static async loadComponent(selector, filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Failed to load ${filePath}`);
            const html = await response.text();
            const element = document.querySelector(selector);
            if (element) {
                element.outerHTML = html;
            }
        } catch (error) {
            console.error(`Error loading component from ${filePath}:`, error);
        }
    }

    static async init() {
        // Load all components
        await Promise.all([
            this.loadComponent('.sidebar-placeholder', 'includes/sidebar.html'),
            this.loadComponent('.footer-placeholder', 'includes/footer.html'),
            this.loadComponent('.navbox-placeholder', 'includes/navbox.html')
        ]);

        // Initialize theme toggle after sidebar loads
        this.initThemeToggle();
    }

    static initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;

        if (!themeToggle) return;

        // Initialize theme
        const savedTheme = localStorage.getItem('theme');
        const initialTheme = savedTheme || body.getAttribute('data-theme') || 'light';
        body.setAttribute('data-theme', initialTheme);
        if (!savedTheme) {
            localStorage.setItem('theme', initialTheme);
        }
        this.updateButtonText();

        // Toggle theme
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateButtonText();
        });
    }

    static updateButtonText() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        const theme = document.body.getAttribute('data-theme');
        themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
}

// Load templates when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TemplateLoader.init());
} else {
    TemplateLoader.init();
}
