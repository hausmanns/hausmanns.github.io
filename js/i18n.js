class I18n {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.translations = {};
        this.loadTranslations();
    }

    async loadTranslations() {
        try {
            // Load both language files
            const [enResponse, frResponse] = await Promise.all([
                fetch('./en.json'),
                fetch('./fr.json')
            ]);
            
            this.translations.en = await enResponse.json();
            this.translations.fr = await frResponse.json();
            
            // Apply translations after loading
            this.applyTranslations();
            this.updateLanguageSelector();
        } catch (error) {
            console.error('Error loading translations:', error);
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
                return key; // Return key if translation not found
            }
        }
        
        return value || key;
    }

    applyTranslations() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email')) {
                element.placeholder = translation;
            } else if (element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.innerHTML = translation;
            }
        });

        // Update dynamic content
        this.updateDynamicContent();
    }

    updateDynamicContent() {
        // Update navigation
        this.updateNavigation();
        
        // Update bio section
        this.updateBioSection();
        
        // Update projects section
        this.updateProjectsSection();
        
        // Update blog section
        this.updateBlogSection();
        
        // Update contact section
        this.updateContactSection();
        
        // Update footer
        this.updateFooter();
        
        // Update common elements
        this.updateCommonElements();
    }

    updateNavigation() {
        const navLinks = document.querySelectorAll('.nav-links a');
        const navKeys = ['home', 'projects', 'publications', 'blog', 'contact'];
        
        navLinks.forEach((link, index) => {
            if (index < navKeys.length) {
                link.textContent = this.t(`nav.${navKeys[index]}`);
            }
        });
    }

    updateBioSection() {
        // Update bio content
        const title = document.querySelector('.bio-content h1');
        if (title) title.textContent = this.t('bio.title');
        
        const subtitle = document.querySelector('.bio-content h2');
        if (subtitle) subtitle.textContent = this.t('bio.subtitle');
        
        // Update bio text
        const bioText = document.querySelector('.bio-text');
        if (bioText) {
            bioText.innerHTML = `
                ${this.t('bio.welcome')}
                <br><br>
                ${this.t('bio.workInvolves')}
                <br>
                - ${this.t('bio.programming')}
                <br>
                - ${this.t('bio.neuroscience')}
                <br>
                - ${this.t('bio.vr')}
                <br>
                - ${this.t('bio.dataAnalysis')}
            `;
        }

        // Update education section
        const educationHeader = document.querySelector('.education-header h3');
        if (educationHeader) educationHeader.textContent = this.t('bio.education');
        
        const educationList = document.querySelector('.education-list');
        if (educationList) {
            educationList.innerHTML = this.t('bio.educationItems')
                .map(item => `<li>${item}</li>`)
                .join('');
        }

        // Update languages section
        const languageHeader = document.querySelector('.language-header h3');
        if (languageHeader) languageHeader.textContent = this.t('bio.languages');
        
        const languageList = document.querySelector('.language-list');
        if (languageList) {
            languageList.innerHTML = this.t('bio.languageItems')
                .map(item => `<li><span class="language-name">${item.name}</span> <span class="language-level">${item.level}</span></li>`)
                .join('');
        }

        // Update skills section
        const skillsHeader = document.querySelector('.skills-header h3');
        if (skillsHeader) skillsHeader.textContent = this.t('bio.technicalSkills');
        
        this.updateSkillCategories();
    }

    updateSkillCategories() {
        const categories = ['programming', 'dataScience', 'design'];
        
        categories.forEach((category, index) => {
            const categoryElement = document.querySelectorAll('.skill-category')[index];
            if (categoryElement) {
                const header = categoryElement.querySelector('h4');
                if (header) {
                    const icon = header.querySelector('i');
                    header.innerHTML = `${icon.outerHTML} ${this.t(`bio.skillCategories.${category}.title`)}`;
                }
                
                const skillsGrid = categoryElement.querySelector('.skills-grid');
                if (skillsGrid) {
                    const skills = this.t(`bio.skillCategories.${category}.skills`);
                    skillsGrid.innerHTML = skills.map(skill => `
                        <div class="skill-item">
                            <i class="${this.getSkillIcon(skill.name)} skill-icon"></i>
                            <span class="skill-name">${skill.name}</span>
                            <div class="skill-details">${skill.details}</div>
                        </div>
                    `).join('');
                }
            }
        });
    }

    getSkillIcon(skillName) {
        const iconMap = {
            'Python': 'fab fa-python',
            'C# / C++': 'fab fa-cuttlefish',
            'SQL': 'fas fa-database',
            'Web Dev': 'fab fa-js',
            'Dév Web': 'fab fa-js',
            'Data Analysis': 'fas fa-chart-line',
            'Analyse de Données': 'fas fa-chart-line',
            'Lab Techniques': 'fas fa-microscope',
            'Techniques de Laboratoire': 'fas fa-microscope',
            'Optogenetics': 'fas fa-dna',
            'Optogénétique': 'fas fa-dna',
            'Behavioral Analysis': 'fas fa-project-diagram',
            'Analyse Comportementale': 'fas fa-project-diagram',
            '3D & UI Design': 'fas fa-cube',
            'Design 3D et UI': 'fas fa-cube',
            'VR Development': 'fas fa-vr-cardboard',
            'Développement VR': 'fas fa-vr-cardboard',
            'Mentorship': 'fas fa-chalkboard-teacher',
            'Mentorat': 'fas fa-chalkboard-teacher',
            'Project Mgmt': 'fas fa-tasks',
            'Gestion de Projets': 'fas fa-tasks'
        };
        return iconMap[skillName] || 'fas fa-code';
    }

    updateProjectsSection() {
        const projectsTitle = document.querySelector('#projects h2');
        if (projectsTitle) projectsTitle.textContent = this.t('projects.title');
        
        const projectCards = document.querySelectorAll('.project-card');
        const projects = this.t('projects.items');
        
        projectCards.forEach((card, index) => {
            if (projects[index]) {
                const title = card.querySelector('h3');
                const description = card.querySelector('.project-description');
                
                if (title) title.textContent = projects[index].title;
                if (description) description.innerHTML = projects[index].description;
                
                // Update tags
                const tags = card.querySelector('.project-tags');
                if (tags) {
                    tags.innerHTML = projects[index].tags
                        .map(tag => `<span class="project-tag">${tag}</span>`)
                        .join('');
                }
                
                // Update links if they exist
                const links = card.querySelector('.project-links');
                if (links) {
                    const demoLink = links.querySelector('a[href*="Demo"]');
                    const githubLink = links.querySelector('a[href*="github"]');
                    const paperLink = links.querySelector('a[href*="nature"]') || links.querySelector('a[href*="wiley"]');
                    
                    if (demoLink) demoLink.textContent = this.t('common.demo');
                    if (githubLink) githubLink.textContent = this.t('common.github');
                    if (paperLink) paperLink.textContent = this.t('common.paper');
                }
            }
        });
    }

    updateBlogSection() {
        const blogTitle = document.querySelector('#blog h2');
        if (blogTitle) blogTitle.textContent = this.t('blog.title');
        
        const blogCards = document.querySelectorAll('.blog-card');
        const blogItems = this.t('blog.items');
        
        blogCards.forEach((card, index) => {
            if (blogItems[index]) {
                const title = card.querySelector('h3');
                const description = card.querySelector('p');
                const readBlog = card.querySelector('.read-blog');
                const visitWebsite = card.querySelector('.visit-website');
                const readPaper = card.querySelector('.read-paper');
                
                if (title) title.textContent = blogItems[index].title;
                if (description) description.textContent = blogItems[index].description;
                if (readBlog) readBlog.textContent = blogItems[index].readBlog;
                if (visitWebsite) visitWebsite.textContent = blogItems[index].visitWebsite;
                if (readPaper) readPaper.textContent = blogItems[index].readPaper;
            }
        });
    }

    updateContactSection() {
        const contactTitle = document.querySelector('#contact h2');
        if (contactTitle) contactTitle.textContent = this.t('contact.title');
        
        const nameLabel = document.querySelector('label[for="name"]');
        const emailLabel = document.querySelector('label[for="email"]');
        const messageLabel = document.querySelector('label[for="message"]');
        const submitBtn = document.querySelector('.submit-btn');
        
        if (nameLabel) nameLabel.textContent = this.t('contact.name');
        if (emailLabel) emailLabel.textContent = this.t('contact.email');
        if (messageLabel) messageLabel.textContent = this.t('contact.message');
        if (submitBtn) submitBtn.textContent = this.t('contact.sendMessage');
    }

    updateFooter() {
        const footer = document.querySelector('.footer p');
        if (footer) footer.innerHTML = this.t('footer.copyright');
    }

    updateCommonElements() {
        const backToTop = document.querySelector('#back-to-top');
        if (backToTop) backToTop.setAttribute('aria-label', this.t('common.backToTop'));
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

// Initialize i18n when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new I18n();
}); 