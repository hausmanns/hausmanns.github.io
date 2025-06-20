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
            
            // Apply translations after loading
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
        // Update document title and meta
        document.title = this.t('meta.title');
        
        // Update navigation
        this.updateNavigation();
        
        // Update header
        this.updateHeader();
        
        // Update all content
        this.updateContent();
        
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

    updateHeader() {
        // Update main title
        const title = document.querySelector('.blog-post-header h1');
        if (title) title.innerHTML = this.t('header.title');
        
        // Update date
        const date = document.querySelector('.blog-post-meta span:first-child');
        if (date) {
            const icon = date.querySelector('i');
            date.innerHTML = `${icon.outerHTML} ${this.t('header.date')}`;
        }
        
        // Update tags
        const tags = document.querySelector('.blog-post-meta span:last-child');
        if (tags) {
            const icon = tags.querySelector('i');
            tags.innerHTML = `• ${icon.outerHTML} ${this.t('meta.tags')}`;
        }
    }

    updateContent() {
        if (this.blogName === 'isoundport') {
            this.updateISoundPortContent();
        } else if (this.blogName === 'pdf-app') {
            this.updatePDFAppContent();
        }
    }

    updateISoundPortContent() {
        // Update intro paragraph
        const firstP = document.querySelector('.blog-post-content p:first-child');
        if (firstP) firstP.innerHTML = this.t('content.intro');
        
        // Update figcaptions
        const figcaptions = document.querySelectorAll('figcaption');
        if (figcaptions[0]) figcaptions[0].textContent = this.t('content.figcaption1');
        if (figcaptions[1]) figcaptions[1].textContent = this.t('content.figcaption2');
        
        // Update all h2 and h3 elements with content
        this.updateSectionHeaders();
        this.updateSectionContent();
    }

    updateSectionHeaders() {
        const sections = this.t('content.sections');
        
        // Get all h2 elements and update them
        const h2Elements = document.querySelectorAll('.blog-post-content h2');
        h2Elements.forEach(h2 => {
            const text = h2.textContent.toLowerCase();
            if (text.includes('problem') || text.includes('problème')) {
                h2.textContent = sections.problem.title;
            } else if (text.includes('technical') || text.includes('architecture')) {
                h2.textContent = sections.architecture.title;
            } else if (text.includes('challenge') || text.includes('défi')) {
                h2.textContent = sections.challenges.title;
            } else if (text.includes('lesson') || text.includes('leçon')) {
                h2.textContent = sections.lessons.title;
            } else if (text.includes('future') || text.includes('amélioration')) {
                h2.textContent = sections.future.title;
            } else if (text.includes('conclusion')) {
                h2.textContent = sections.conclusion.title;
            }
        });

        // Update h3 elements
        const h3Elements = document.querySelectorAll('.blog-post-content h3');
        h3Elements.forEach(h3 => {
            const text = h3.textContent.toLowerCase();
            if (text.includes('flask')) {
                h3.textContent = sections.architecture.flask.title;
            } else if (text.includes('firebase') && text.includes('auth')) {
                h3.textContent = sections.architecture.firebase.title;
            } else if (text.includes('database') || text.includes('realtime')) {
                h3.textContent = sections.architecture.database.title;
            } else if (text.includes('stripe') || text.includes('payment')) {
                h3.textContent = sections.architecture.stripe.title;
            } else if (text.includes('spotify') || text.includes('api')) {
                h3.textContent = sections.architecture.spotify.title;
            } else if (text.includes('docker') || text.includes('deploy')) {
                h3.textContent = sections.architecture.deployment.title;
            } else if (text.includes('matching') || text.includes('accuracy')) {
                h3.textContent = sections.challenges.matching.title;
            } else if (text.includes('rate') || text.includes('limit')) {
                h3.textContent = sections.challenges.rateLimit.title;
            } else if (text.includes('authentication') || text.includes('complex')) {
                h3.textContent = sections.lessons.auth.title;
            } else if (text.includes('full-stack') || text.includes('integration')) {
                h3.textContent = sections.lessons.fullstack.title;
            } else if (text.includes('production') || text.includes('deployment')) {
                h3.textContent = sections.lessons.deployment.title;
            }
        });
    }

    updateSectionContent() {
        const sections = this.t('content.sections');
        
        // Update paragraphs based on their position relative to headers
        const content = document.querySelector('.blog-post-content');
        const allElements = content.children;
        
        for (let i = 0; i < allElements.length; i++) {
            const element = allElements[i];
            
            if (element.tagName === 'H2') {
                const text = element.textContent.toLowerCase();
                
                // Update the paragraph after this h2
                if (i + 1 < allElements.length && allElements[i + 1].tagName === 'P') {
                    const nextP = allElements[i + 1];
                    
                    if (text.includes('problem') || text.includes('problème')) {
                        nextP.textContent = sections.problem.content;
                    } else if (text.includes('technical') || text.includes('architecture')) {
                        nextP.textContent = sections.architecture.intro;
                    } else if (text.includes('future') || text.includes('amélioration')) {
                        nextP.textContent = sections.future.content;
                    }
                }
            } else if (element.tagName === 'H3') {
                const text = element.textContent.toLowerCase();
                
                // Update content after h3 elements
                if (i + 1 < allElements.length && allElements[i + 1].tagName === 'P') {
                    const nextP = allElements[i + 1];
                    
                    if (text.includes('flask')) {
                        nextP.textContent = sections.architecture.flask.content;
                    } else if (text.includes('firebase') && text.includes('auth')) {
                        nextP.textContent = sections.architecture.firebase.content;
                    } else if (text.includes('database')) {
                        nextP.textContent = sections.architecture.database.content;
                    } else if (text.includes('stripe')) {
                        nextP.textContent = sections.architecture.stripe.content;
                    } else if (text.includes('spotify')) {
                        nextP.textContent = sections.architecture.spotify.content;
                    } else if (text.includes('docker')) {
                        nextP.textContent = sections.architecture.deployment.content;
                    } else if (text.includes('matching')) {
                        nextP.textContent = sections.challenges.matching.content;
                    } else if (text.includes('rate')) {
                        nextP.textContent = sections.challenges.rateLimit.content;
                    } else if (text.includes('authentication')) {
                        nextP.textContent = sections.lessons.auth.content;
                    } else if (text.includes('full-stack')) {
                        nextP.textContent = sections.lessons.fullstack.content;
                    } else if (text.includes('production')) {
                        nextP.textContent = sections.lessons.deployment.content;
                    }
                }
                
                // Update lists after h3 elements
                if (i + 2 < allElements.length && allElements[i + 2].tagName === 'UL') {
                    const nextUl = allElements[i + 2];
                    const lis = nextUl.querySelectorAll('li');
                    
                    if (text.includes('firebase') && text.includes('auth')) {
                        sections.architecture.firebase.features.forEach((feature, index) => {
                            if (lis[index]) lis[index].textContent = feature;
                        });
                    } else if (text.includes('database')) {
                        sections.architecture.database.features.forEach((feature, index) => {
                            if (lis[index]) lis[index].textContent = feature;
                        });
                    } else if (text.includes('stripe')) {
                        sections.architecture.stripe.features.forEach((feature, index) => {
                            if (lis[index]) lis[index].textContent = feature;
                        });
                    } else if (text.includes('spotify')) {
                        sections.architecture.spotify.features.forEach((feature, index) => {
                            if (lis[index]) lis[index].textContent = feature;
                        });
                    } else if (text.includes('docker')) {
                        sections.architecture.deployment.features.forEach((feature, index) => {
                            if (lis[index]) lis[index].textContent = feature;
                        });
                    }
                }
                
                // Update ordered lists (for challenges section)
                if (i + 2 < allElements.length && allElements[i + 2].tagName === 'OL') {
                    const nextOl = allElements[i + 2];
                    const lis = nextOl.querySelectorAll('li');
                    
                    if (text.includes('matching')) {
                        sections.challenges.matching.steps.forEach((step, index) => {
                            if (lis[index]) lis[index].textContent = step;
                        });
                    }
                }
            }
        }
        
        // Update conclusion paragraphs
        this.updateConclusionParagraphs();
        
        // Update future enhancements list
        this.updateFutureList();
    }

    updateConclusionParagraphs() {
        const sections = this.t('content.sections');
        const conclusionH2 = Array.from(document.querySelectorAll('h2')).find(h2 => 
            h2.textContent.toLowerCase().includes('conclusion')
        );
        
        if (conclusionH2) {
            let current = conclusionH2.nextElementSibling;
            let paragraphIndex = 0;
            
            while (current && current.tagName !== 'H2' && paragraphIndex < sections.conclusion.paragraphs.length) {
                if (current.tagName === 'P') {
                    current.innerHTML = sections.conclusion.paragraphs[paragraphIndex];
                    paragraphIndex++;
                }
                current = current.nextElementSibling;
            }
        }
    }

    updateFutureList() {
        const sections = this.t('content.sections');
        const futureH2 = Array.from(document.querySelectorAll('h2')).find(h2 => 
            h2.textContent.toLowerCase().includes('future') || 
            h2.textContent.toLowerCase().includes('amélioration')
        );
        
        if (futureH2) {
            let current = futureH2.nextElementSibling;
            
            while (current && current.tagName !== 'H2') {
                if (current.tagName === 'UL') {
                    const lis = current.querySelectorAll('li');
                    sections.future.features.forEach((feature, index) => {
                        if (lis[index]) lis[index].textContent = feature;
                    });
                    break;
                }
                current = current.nextElementSibling;
            }
        }
    }

    updatePDFAppContent() {
        // For PDF app, just update basic elements for now
        const title = document.querySelector('.blog-post-header h1');
        if (title) title.innerHTML = this.t('header.title');
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