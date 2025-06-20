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
        
        // Update theme toggle aria-label
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', this.t('common.toggleDarkMode') || 'Toggle dark mode');
        }
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
        
        // Update alt attributes for both blog types
        this.updateAltAttributes();
    }

    updateAltAttributes() {
        const altTexts = this.t('content.altText');
        if (!altTexts) return;
        
        // Update images based on their current alt text or class
        const images = document.querySelectorAll('img[alt]');
        images.forEach(img => {
            const currentAlt = img.alt.toLowerCase();
            
            if (this.blogName === 'isoundport') {
                if (currentAlt.includes('isoundport app preview') || currentAlt.includes('aperçu')) {
                    img.alt = altTexts.appPreview;
                } else if (currentAlt.includes('isoundport interface') || currentAlt.includes('interface')) {
                    img.alt = altTexts.interface;
                } else if (currentAlt.includes('isoundport architecture') || currentAlt.includes('architecture')) {
                    img.alt = altTexts.architecture;
                } else if (currentAlt.includes('enlarged view') || currentAlt.includes('vue agrandie')) {
                    img.alt = altTexts.enlargedView;
                }
            } else if (this.blogName === 'pdf-app') {
                if (currentAlt.includes('wizpdf app preview') || currentAlt.includes('aperçu')) {
                    img.alt = altTexts.appPreview;
                } else if (currentAlt.includes('wizpdf home screen') || currentAlt.includes('écran d\'accueil')) {
                    img.alt = altTexts.homeScreen;
                } else if (currentAlt.includes('pdf merger interface') || currentAlt.includes('interface de fusion')) {
                    img.alt = altTexts.mergerInterface;
                } else if (currentAlt.includes('page manipulator interface') || currentAlt.includes('interface de manipulation')) {
                    img.alt = altTexts.manipulatorInterface;
                } else if (currentAlt.includes('pdf summary interface') || currentAlt.includes('interface de résumé')) {
                    img.alt = altTexts.summaryInterface;
                } else if (currentAlt.includes('wizpdf architecture') || currentAlt.includes('architecture')) {
                    img.alt = altTexts.architecture;
                }
            }
        });
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
        // Update intro paragraph
        const firstP = document.querySelector('.blog-post-content p:first-child');
        if (firstP) firstP.innerHTML = this.t('content.intro');
        
        // Update figcaptions
        const figcaptions = document.querySelectorAll('figcaption');
        if (figcaptions[0]) figcaptions[0].innerHTML = this.t('content.figcaption1');
        
        // Update all h2 and h3 elements with content
        this.updatePDFSectionHeaders();
        this.updatePDFSectionContent();
        
        // Update app links
        this.updateAppLinks();
    }

    updatePDFSectionHeaders() {
        const sections = this.t('content.sections');
        
        // Get all h2 elements and update them
        const h2Elements = document.querySelectorAll('.blog-post-content h2');
        h2Elements.forEach(h2 => {
            const text = h2.textContent.toLowerCase();
            if (text.includes('why') || text.includes('pourquoi')) {
                h2.textContent = sections.why.title;
            } else if (text.includes('core features') || text.includes('fonctionnalités principales')) {
                h2.textContent = sections.features.title;
            } else if (text.includes('technical') || text.includes('implémentation')) {
                h2.textContent = sections.technical.title;
            } else if (text.includes('ui/ux') || text.includes('conception')) {
                h2.textContent = sections.design.title;
            } else if (text.includes('challenges') || text.includes('défis')) {
                h2.textContent = sections.challenges.title;
            } else if (text.includes('conclusion')) {
                h2.textContent = sections.conclusion.title;
            }
        });

        // Update h3 elements
        const h3Elements = document.querySelectorAll('.blog-post-content h3');
        h3Elements.forEach(h3 => {
            const text = h3.textContent.toLowerCase();
            if (text.includes('react native') || text.includes('expo')) {
                h3.textContent = sections.technical.reactNative.title;
            } else if (text.includes('pdf processing') || text.includes('moteur')) {
                h3.textContent = sections.technical.pdfEngine.title;
            } else if (text.includes('cloud functions') || text.includes('fonctions cloud')) {
                h3.textContent = sections.technical.cloudFunctions.title;
            } else if (text.includes('monetization') || text.includes('monétisation')) {
                h3.textContent = sections.technical.monetization.title;
            } else if (text.includes('beautiful ui') || text.includes('belle interface')) {
                h3.textContent = sections.design.ui.title;
            } else if (text.includes('haptic') || text.includes('haptique')) {
                h3.textContent = sections.design.haptic.title;
            } else if (text.includes('performance') || text.includes('optimisation')) {
                h3.textContent = sections.challenges.performance.title;
            } else if (text.includes('file handling') || text.includes('gestion de fichiers')) {
                h3.textContent = sections.challenges.fileHandling.title;
            } else if (text.includes('app store') || text.includes('processus')) {
                h3.textContent = sections.challenges.appStore.title;
            }
        });

        // Update h4 elements in feature cards
        const h4Elements = document.querySelectorAll('.feature-card h4');
        h4Elements.forEach(h4 => {
            const text = h4.textContent.toLowerCase();
            if (text.includes('merging') || text.includes('fusion')) {
                h4.innerHTML = `<i class="fas fa-object-group"></i> ${sections.features.merge.title}`;
            } else if (text.includes('manipulation') || text.includes('manipulation')) {
                h4.innerHTML = `<i class="fas fa-cut"></i> ${sections.features.manipulate.title}`;
            } else if (text.includes('summarization') || text.includes('résumé')) {
                h4.innerHTML = `<i class="fas fa-file-alt"></i> ${sections.features.summarize.title}`;
            }
        });
    }

    updatePDFSectionContent() {
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
                    
                    if (text.includes('why') || text.includes('pourquoi')) {
                        nextP.textContent = sections.why.intro;
                    }
                }
            } else if (element.tagName === 'H3') {
                const text = element.textContent.toLowerCase();
                
                // Update content after h3 elements
                if (i + 1 < allElements.length && allElements[i + 1].tagName === 'P') {
                    const nextP = allElements[i + 1];
                    
                    if (text.includes('react native')) {
                        nextP.textContent = sections.technical.reactNative.content;
                    } else if (text.includes('pdf processing') || text.includes('moteur')) {
                        nextP.textContent = sections.technical.pdfEngine.content;
                    } else if (text.includes('cloud functions') || text.includes('fonctions cloud')) {
                        nextP.textContent = sections.technical.cloudFunctions.content;
                    } else if (text.includes('monetization') || text.includes('monétisation')) {
                        nextP.textContent = sections.technical.monetization.content;
                    } else if (text.includes('beautiful ui') || text.includes('belle interface')) {
                        nextP.textContent = sections.design.ui.content;
                    } else if (text.includes('haptic') || text.includes('haptique')) {
                        nextP.textContent = sections.design.haptic.content;
                    } else if (text.includes('performance') || text.includes('optimisation')) {
                        nextP.textContent = sections.challenges.performance.content;
                    } else if (text.includes('file handling') || text.includes('gestion de fichiers')) {
                        nextP.textContent = sections.challenges.fileHandling.content;
                    } else if (text.includes('app store') || text.includes('processus')) {
                        nextP.textContent = sections.challenges.appStore.content;
                    }
                }
                
                // Update lists after h3 elements
                if (i + 2 < allElements.length && allElements[i + 2].tagName === 'UL') {
                    const nextUl = allElements[i + 2];
                    const lis = nextUl.querySelectorAll('li');
                    
                    if (text.includes('performance') || text.includes('optimisation')) {
                        sections.challenges.performance.points.forEach((point, index) => {
                            if (lis[index]) lis[index].textContent = point;
                        });
                    }
                }
            }
        }
        
        // Update specific sections
        this.updatePDFWhySection();
        this.updatePDFFeatureCards();
        this.updatePDFConclusionParagraphs();
    }

    updatePDFWhySection() {
        const sections = this.t('content.sections');
        
        // Find the "Why We Built This App" section
        const whyH2 = Array.from(document.querySelectorAll('h2')).find(h2 => 
            h2.textContent.toLowerCase().includes('why') || 
            h2.textContent.toLowerCase().includes('pourquoi')
        );
        
        if (whyH2) {
            let current = whyH2.nextElementSibling;
            
            while (current && current.tagName !== 'H2') {
                if (current.tagName === 'UL') {
                    // Update the pain points list
                    const lis = current.querySelectorAll('li');
                    sections.why.painPoints.forEach((point, index) => {
                        if (lis[index]) lis[index].textContent = point;
                    });
                } else if (current.tagName === 'P' && current.nextElementSibling && current.nextElementSibling.tagName === 'H2') {
                    // This is the conclusion paragraph
                    current.innerHTML = sections.why.conclusion;
                }
                current = current.nextElementSibling;
            }
        }
    }

    updatePDFFeatureCards() {
        const sections = this.t('content.sections');
        
        // Update feature card content
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            const h4 = card.querySelector('h4');
            const p = card.querySelector('p');
            const figcaption = card.querySelector('figcaption');
            
            if (h4) {
                const text = h4.textContent.toLowerCase();
                if (text.includes('merging') || text.includes('fusion')) {
                    if (p) p.textContent = sections.features.merge.content;
                    if (figcaption) figcaption.textContent = sections.features.merge.figcaption;
                } else if (text.includes('manipulation')) {
                    if (p) p.textContent = sections.features.manipulate.content;
                    if (figcaption) figcaption.textContent = sections.features.manipulate.figcaption;
                } else if (text.includes('summarization') || text.includes('résumé')) {
                    if (p) p.textContent = sections.features.summarize.content;
                    if (figcaption) figcaption.textContent = sections.features.summarize.figcaption;
                }
            }
        });
    }

    updatePDFConclusionParagraphs() {
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

    updateAppLinks() {
        const appLinks = this.t('content.appLinks');
        
        // Update app store link alt text
        const appStoreImg = document.querySelector('.app-store-link img');
        if (appStoreImg) {
            appStoreImg.alt = appLinks.appStore;
        }
        
        // Update "Android version coming soon" text
        const playStoreSpan = document.querySelector('.play-store-link span');
        if (playStoreSpan) {
            playStoreSpan.textContent = appLinks.androidComingSoon;
        }
    }

    updateFooter() {
        const backLink = document.querySelector('.back-link');
        if (backLink) {
            const icon = backLink.querySelector('i');
            backLink.innerHTML = `${icon.outerHTML} ${this.t('footer.backLink')}`;
        }
        
        const footer = document.querySelector('.footer p');
        if (footer) footer.innerHTML = this.t('footer.copyright');
        
        // Update back to top button
        const backToTop = document.getElementById('back-to-top');
        if (backToTop) {
            backToTop.setAttribute('aria-label', this.t('common.backToTop'));
        }
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