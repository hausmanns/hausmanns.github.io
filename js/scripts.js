// JavaScript for interactive elements

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('.header');
const navItems = document.querySelectorAll('.nav-links a');

// Sample data for projects and blog posts
const projects = [
    {
        title: 'VR Mouse Behavior Platform',
        description: 'As part of my PhD, I spearheaded the development of a virtual reality system for studying adaptive visuomotor behavior in mice using <a href="https://unity.com/" target="_blank">Unity3D</a> game engine. Features markerless behavioral tracking using <a href="https://github.com/DeepLabCut/DeepLabCut" target="_blank">DeepLabCut</a> and integration with optogenetics and neural recording systems such as neuropixels 2.0 or a mesoscope.',
        image: 'assets/rig6.png',
        links: {
            demo: null,
            github: null,
            paper: null
        }
    },
    {
        title: 'Digital Biomarkers Data Analysis Pipeline',
        description: 'As part of my PhD, I developed a python-based (<a href="https://www.datajoint.com/" target="_blank">DataJoint</a>: Python wrapper for SQL) pipeline for processing and analyzing large-scale behavioral and neural data. Automatation of experimental data processing and facilitating the supervision of individual experimental sessions on a daily basis, using advanced signal processing and machine learning techniques.',
        image: 'https://via.placeholder.com/400x300?text=Neural+Analysis',
        links: {
            demo: null,
            github: null,
            paper: null
        }
    },
    {
        title: 'Optogenetics Control System',
        description: 'Arduino-based system for precise control of optogenetic stimulation during behavioral experiments. Features programmable stimulation patterns.',
        image: 'https://via.placeholder.com/400x300?text=Optogenetics',
        links: {
            demo: null,
            github: null,
            paper: null
        }
    },
    {
        title: 'Allen Brain Atlas Connectivity Map',
        description: "As a side project, I developed a simple GUI based on <a href='https://wiki.python.org/moin/PyQt' target='_blank'> PyQt</a> to explore connectivity map based on various projection signals. Features responsive design, animations, and integration with <a href='https://allensdk.readthedocs.io/en/latest/' target='_blank'> Allen Brain Atlas' API allensdk</a>.",
        image: "assets/DalleBrainConnect.webp",
        links: {
            demo: 'https://github.com/AdaptiveMotorControlLab/AllenBrainConnectivityGraph?tab=readme-ov-file#main-window',
            github: 'https://github.com/AdaptiveMotorControlLab/AllenBrainConnectivityGraph',
            paper: null
        }
    },
    {
        title: 'Virtual Reality surrogate system for Argus® II Patients',
        description: 'As part of a software engineer research internship at Second Sight Medical Product, I worked on a virtual reality system for Argus II patients to help them navigate in a virtual environment. Enhancing their rehabilitation procedure. The system was developed using Unity and C#, bypassing their camera Unit. I also developed a VR simulation of what a patient sees using the Argus II system.',
        image: "assets/VRScanning.png",
        links: {
            demo: null,
            github: null,
            paper: null
        }
    },
    {   
        title: "Is effort related to social dominance?",
        description: "As part of my Master's thesis, I investigated the relationship between effort and social dominance in hierarchical groups of mice. This work was part of a larger project on the neural mechanisms of social dominance (specifically, the connections from mPFC to LH) and was conducted in laboratory of <a href='https://tyelab.org/' target='_blank'>Prof. Kay M. Tye</a> at the <a href='https://www.salk.edu/' target='_blank'>Salk Institute</a> in San Diego.",
        image: "assets/effortTmaze.png",
        links: {
            demo: null,
            github: null,
            paper: "https://www.nature.com/articles/s41586-022-04507-5"
        }
    },
    {
        title: 'Does subjective feeling of re-experiencing past events relate to memory performance?',
        description: `At the <a href="https://www.campusbiotech.ch/en/node/339" target="_blank"> Laboratory of Cognitive Neuroscience (LNCO)</a> in Prof. Olaf Blanke's lab, together with Dr. Brechet, I investigated the relationship between the subjective feeling of re-experiencing past events and memory performance. In this prroject we worked with healthy human subjects and used virtual reality to manipulate the feeling of re-experiencing past events.`,
        image: "assets/vrimmersion.png",
        links: {
            demo: null,
            github: null,
            paper: "https://onlinelibrary.wiley.com/doi/full/10.1002/brb3.1571"
        }
    }
];

const blogPosts = [
    {
        title: 'Measuring and modeling the motor system with machine learning',
        date: '2021-10-01',
        excerpt: 'A comprehensive review we wrote, exploring novel machine learning methods for understanding the motor systemn. Drawing parallels with artificial neural networks.',
        link: 'https://www.sciencedirect.com/science/article/pii/S0959438821000519',
        readMoreLink: null
    },
];

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        navLinks.classList.remove('active');
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Link Highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Render Projects
function renderProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card">
            <img src="${project.image}" alt="${project.title}">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p class="project-description">${project.description}</p>
                ${project.links && Object.keys(project.links).length > 0 ? `
                    <div class="project-links">
                        ${project.links.demo ? `<a href="${project.links.demo}" target="_blank">Live Demo</a>` : ''}
                        ${project.links.github ? `<a href="${project.links.github}" target="_blank">👾 GitHub</a>` : ''}
                        ${project.links.paper ? `<a href="${project.links.paper}" target="_blank">🔖 Paper</a>` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Render Blog Posts
function renderBlogPosts() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;
    blogGrid.innerHTML = blogPosts.map(post => `
        <div class="blog-card">
            <div class="blog-content">
                <h3>${post.title}</h3>
                <div class="post-date">${post.date}</div>
                <p>${post.excerpt}</p>
                <div class="blog-links">
                    ${post.readMoreLink ? `<a href="${post.readMoreLink}" class="read-more">Read More</a>` : ''}
                    ${post.link ? `<a href="${post.link}" class="read-paper" target="_blank">Paper</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Form Validation and Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                alert('Message sent successfully!');
                contactForm.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            alert('Sorry, there was an error sending your message. Please try again.');
        } finally {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// GSAP Initialization
gsap.registerPlugin(ScrollTrigger);

// Animation Setup
function initAnimations() {
    // Bio Section Animation with smoother transitions
    gsap.from('.profile-image', {
        scrollTrigger: {
            trigger: '.bio-section',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
    });

    gsap.from('.bio-content', {
        scrollTrigger: {
            trigger: '.bio-section',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
    });

    // Projects Section with staggered animations
    const projectCards = gsap.utils.toArray('.project-card');
    projectCards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 15%',
                scrub: 1,
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: "power1.out"
        });
    });

    // Contact Form Animation with smooth fade
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 75%',
            end: 'top 25%',
            scrub: 1,
            toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut"
    });

    // Section headers animation
    gsap.utils.toArray('section h2').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                end: 'top 20%',
                scrub: 1,
                toggleActions: 'play none none reverse'
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.2)"
        });
    });

    // Blog Cards Animation
    gsap.from('.blog-card', {
        scrollTrigger: {
            trigger: '.blog-section',
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power1.out"
    });
}

// Event Listeners
window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', () => {
    renderProjects();
    renderBlogPosts();
    updateActiveNavLink();
    initAnimations(); // Initialize GSAP animations
});
