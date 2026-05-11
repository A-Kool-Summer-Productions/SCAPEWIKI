class TemplateLoader {
    static statusEffectsData = null;

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

        const statusEffects = await this.getStatusEffectsData();

        // Hydrate status effect tooltips from a single data source.
        this.initStatusEffectTooltips(statusEffects);

        // Render the Status Effects page table from the same shared source of truth.
        this.initStatusEffectsPage(statusEffects);
    }

    static async getStatusEffectsData() {
        if (this.statusEffectsData) {
            return this.statusEffectsData;
        }

        try {
            const response = await fetch('assets/data/status-effects.json');
            if (!response.ok) throw new Error(`Failed to load status effects JSON (${response.status})`);

            const json = await response.json();
            this.statusEffectsData = json.statusEffects || {};
            return this.statusEffectsData;
        } catch (error) {
            console.error('Error loading status effect data:', error);
            this.statusEffectsData = {};
            return this.statusEffectsData;
        }
    }

    static initStatusEffectTooltips(statusEffects) {
        const tooltips = document.querySelectorAll('.tooltip');
        if (!tooltips.length) return;

        tooltips.forEach((tooltip) => {
            this.hydrateStatusTooltip(tooltip, statusEffects);
        });
    }

    static hydrateStatusTooltip(tooltip, statusEffects) {
        const tooltipText = tooltip.querySelector('.tooltiptext');
        if (!tooltipText) return;

        const statusName = this.getTooltipStatusName(tooltip, tooltipText);
        if (!statusName) return;

        const statusKey = this.normalizeStatusKey(statusName);
        const entry = statusEffects[statusKey];
        if (!entry) return;

        this.ensureTooltipTriggerLink(tooltip, entry, statusKey);

        let icon = tooltipText.querySelector('.status-icon');
        if (!icon) {
            icon = document.createElement('img');
            icon.className = 'status-icon';
            tooltipText.insertBefore(icon, tooltipText.firstChild);
        }
        icon.src = entry.icon;
        icon.alt = `${entry.name} icon`;

        const title = tooltipText.querySelector('strong');
        if (title) {
            title.textContent = entry.name;
        }

        let description = tooltipText.querySelector('.tooltiptext-description');
        if (!description) {
            description = document.createElement('span');
            description.className = 'tooltiptext-description';
            if (title) {
                title.insertAdjacentElement('afterend', description);
            } else {
                tooltipText.appendChild(description);
            }
        }
        description.textContent = entry.description;
    }

    static ensureTooltipTriggerLink(tooltip, entry, statusKey) {
        const anchorTarget = `Status_Effects.html#${statusKey}`;

        const directAnchor = Array.from(tooltip.children).find(
            (child) => child.tagName === 'A'
        );

        if (directAnchor) {
            directAnchor.href = anchorTarget;
            return;
        }

        const textNode = Array.from(tooltip.childNodes).find(
            (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
        );

        if (!textNode) return;

        const label = textNode.textContent.trim() || entry.name;
        const anchor = document.createElement('a');
        anchor.href = anchorTarget;
        anchor.textContent = label;

        textNode.textContent = textNode.textContent.replace(label, '');
        tooltip.insertBefore(anchor, tooltip.firstChild);
    }

    static initStatusEffectsPage(statusEffects) {
        const buffsBody = document.getElementById('buffs-table-body');
        const enemyDebuffsBody = document.getElementById('enemy-debuffs-table-body');
        const playerDebuffsBody = document.getElementById('player-debuffs-table-body');

        if (!buffsBody && !enemyDebuffsBody && !playerDebuffsBody) return;

        const allEffects = Object.entries(statusEffects).map(([key, value]) => ({
            key,
            ...value
        }));

        const buffs = allEffects.filter((effect) => effect.category === 'buff');
        const enemyDebuffs = allEffects.filter((effect) => effect.category === 'enemyDebuff');
        const playerDebuffs = allEffects.filter((effect) => effect.category === 'playerDebuff');

        if (buffsBody) {
            this.renderStatusRows(buffsBody, buffs, true);
        }

        if (enemyDebuffsBody) {
            this.renderStatusRows(enemyDebuffsBody, enemyDebuffs, true);
        }

        if (playerDebuffsBody) {
            this.renderStatusRows(playerDebuffsBody, playerDebuffs, false);
        }
    }

    static renderStatusRows(tableBody, effects, includeStackable) {
        tableBody.innerHTML = '';

        effects.forEach((effect) => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.id = effect.key;
            nameCell.textContent = effect.name;
            row.appendChild(nameCell);

            const descriptionCell = document.createElement('td');
            if (effect.descriptionHtml) {
                descriptionCell.innerHTML = effect.descriptionHtml;
            } else {
                descriptionCell.textContent = effect.description || '';
            }
            row.appendChild(descriptionCell);

            if (includeStackable) {
                const stackableCell = document.createElement('td');
                if (effect.stackable === true) {
                    stackableCell.textContent = 'Yes';
                } else if (effect.stackable === false) {
                    stackableCell.textContent = 'No';
                } else {
                    stackableCell.textContent = '';
                }
                row.appendChild(stackableCell);
            }

            tableBody.appendChild(row);
        });
    }

    static getTooltipStatusName(tooltip, tooltipText) {
        if (tooltip.dataset.status) return tooltip.dataset.status;

        const tooltipTitle = tooltipText.querySelector('strong');
        if (tooltipTitle && tooltipTitle.textContent) {
            return tooltipTitle.textContent.trim();
        }

        const anchor = tooltip.querySelector('a');
        if (anchor && anchor.textContent) {
            return anchor.textContent.trim();
        }

        const textNode = Array.from(tooltip.childNodes).find(
            (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0
        );
        return textNode ? textNode.textContent.trim() : '';
    }

    static normalizeStatusKey(value) {
        return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
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
