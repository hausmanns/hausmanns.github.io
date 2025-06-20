class BlogI18n {
    constructor(blogName) {
        this.blogName = blogName;
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {};
        this.loadTranslations();
    }

    async loadTranslations() {
        try {
            const [enResponse, frResponse] = await Promise.all([
                fetch(`./${this.blogName}-en.json`),
                fetch(`./${this.blogName}-fr.json`)
            ]);
            
            this.translations.en = await enResponse.json();
            this.translations.fr = await frResponse.json();
            
            this.applyTranslations();
            this.updateLanguageSelector();
        } catch (error) {
            console.error('Error loading blog translations:', error);
        }
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        this.applyTranslations();
        this.updateLanguageSelector();
    }

    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key;
            }
        }
        
        return value || key;
    }

    applyTranslations() {
        // Update document title
        document.title = this.t('meta.title');
        
        // Update navigation
        this.updateNavigation();
        
        // Update content based on blog type
        if (this.blogName === 'isoundport') {
            this.updateISoundPortContent();
        } else if (this.blogName === 'pdf-app') {
            this.updatePDFAppContent();
        }
        
        // Update footer
        this.updateFooter();
    }

    updateNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a');
        const navKeys = ['home', 'projects', 'blog', 'contact'];
        
        navLinks.forEach((link, index) => {
            if (index < navKeys.length) {
                link.textContent = this.t(`nav.${navKeys[index]}`);
            }
        });
    }

    updateISoundPortContent() {
        // Update header
        const title = document.querySelector('.blog-post-header h1');
        if (title) title.textContent = this.t('header.title');
        
        const date = document.querySelector('.blog-post-meta span:first-child');
        if (date) {
            const icon = date.querySelector('i');
            date.innerHTML = `${icon.outerHTML} ${this.t('header.date')}`;
        }
        
        const tags = document.querySelector('.blog-post-meta span:last-child');
        if (tags) {
            const icon = tags.querySelector('i');
            tags.innerHTML = `• ${icon.outerHTML} ${this.t('meta.tags')}`;
        }
        
        // Update content sections
        this.updateContentSections();
    }

    updatePDFAppContent() {
        // Similar to iSoundPort but for PDF app
        const title = document.querySelector('.blog-post-header h1');
        if (title) {
            title.innerHTML = this.t('header.title');
        }
        
        const date = document.querySelector('.blog-post-meta span:first-child');
        if (date) {
            const icon = date.querySelector('i');
            date.innerHTML = `${icon.outerHTML} ${this.t('header.date')}`;
        }
        
        const tags = document.querySelector('.blog-post-meta span:last-child');
        if (tags) {
            const icon = tags.querySelector('i');
            tags.innerHTML = `• ${icon.outerHTML} ${this.t('meta.tags')}`;
        }
    }

    updateContentSections() {
        // Update main content paragraphs and sections
        const contentSections = document.querySelectorAll('.blog-post-content h2, .blog-post-content h3, .blog-post-content p');
        
        // This is simplified - in a real implementation, you'd need to map each element to its translation key
        // For now, we'll update specific known sections
        
        // Update section titles
        const h2Elements = document.querySelectorAll('.blog-post-content h2');
        const sectionKeys = ['problem', 'architecture', 'challenges', 'lessons', 'future', 'conclusion'];
        
        h2Elements.forEach((h2, index) => {
            if (sectionKeys[index]) {
                h2.textContent = this.t(`content.${sectionKeys[index]}.title`);
            }
        });
    }

    updateFooter() {
        const backLink = document.querySelector('.back-link');
        if (backLink) {
            const icon = backLink.querySelector('i');
            backLink.innerHTML = `${icon.outerHTML} ${this.t('footer.backLink')}`;
        }
        
        const footer = document.querySelector('.footer p');
        if (footer) footer.innerHTML = this.t('footer.copyright');
    }

    updateLanguageSelector() {
        const languageSelector = document.querySelector('.language-selector');
        if (languageSelector) {
            const buttons = languageSelector.querySelectorAll('button');
            buttons.forEach(button => {
                button.classList.remove('active');
                if (button.getAttribute('data-lang') === this.currentLanguage) {
                    button.classList.add('active');
                }
            });
        }
    }
}

// Function to initialize blog i18n
function initBlogI18n(blogName) {
    document.addEventListener('DOMContentLoaded', () => {
        window.blogI18n = new BlogI18n(blogName);
    });
} 