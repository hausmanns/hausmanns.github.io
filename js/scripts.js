// JavaScript for interactive elements

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('.header');
const navItems = document.querySelectorAll('.nav-links a');
const themeToggle = document.getElementById('theme-toggle');
const backToTop = document.getElementById('back-to-top');
const preloader = document.querySelector('.preloader');

// Sample data for projects and blog posts
const projects = [
    {
        title: 'VR Mouse Behavior Platform',
        description: 'As part of my PhD, I spearheaded the development of a virtual reality system for studying adaptive visuomotor behavior in mice using <a href="https://unity.com/" target="_blank">Unity3D</a> game engine. Features markerless behavioral tracking using <a href="https://github.com/DeepLabCut/DeepLabCut" target="_blank">DeepLabCut</a> and integration with optogenetics and neural recording systems such as neuropixels 2.0 or a mesoscope.',
        image: 'assets/images/rig6.png',
        tags: ['Unity3D', 'C#', 'VR', 'Neuroscience'],
        links: {
            demo: null,
            github: null,
            paper: null
        }
    },
    {
        title: 'Digital Biomarkers Data Analysis Pipeline',
        description: 'As part of my PhD, I developed a python-based (<a href="https://www.datajoint.com/" target="_blank">DataJoint</a>: Python wrapper for SQL) pipeline for processing and analyzing large-scale behavioral and neural data. Automatation of experimental data processing and facilitating the supervision of individual experimental sessions on a daily basis, using advanced signal processing and machine learning techniques.',
        image: 'assets/images/automationDJ.webp',
        tags: ['Python', 'SQL', 'Data Analysis', 'Machine Learning'],
        links: {
            demo: null,
            github: null,
            paper: null
        }
    },
    {
        title: 'Optogenetics Control System',
        description: 'Arduino-based system for precise control of optogenetic stimulation during behavioral experiments. Features programmable stimulation patterns.',
        image: 'assets/images/optomodule.gif',
        tags: ['Arduino', 'C++', 'Optogenetics', 'Hardware'],
        links: {
            demo: null,
            github: null,
            paper: null
        }
    },
    {
        title: 'Allen Brain Atlas Connectivity Map',
        description: "As a side project, I developed a simple GUI based on <a href='https://wiki.python.org/moin/PyQt' target='_blank'> PyQt</a> to explore connectivity map based on various projection signals. Features responsive design, animations, and integration with <a href='https://allensdk.readthedocs.io/en/latest/' target='_blank'> Allen Brain Atlas' API allensdk</a>.",
        image: "assets/images/DalleBrainConnect.webp",
        tags: ['Python', 'PyQt', 'Neuroscience', 'Data Visualization'],
        links: {
            demo: 'https://github.com/AdaptiveMotorControlLab/AllenBrainConnectivityGraph?tab=readme-ov-file#main-window',
            github: 'https://github.com/AdaptiveMotorControlLab/AllenBrainConnectivityGraph',
            paper: null
        }
    },
    {
        title: 'Virtual Reality surrogate system for Argus® II Patients',
        description: 'As part of a software engineer research internship at Second Sight Medical Product, I worked on a virtual reality system for Argus II patients to help them navigate in a virtual environment. Enhancing their rehabilitation procedure. The system was developed using Unity and C#, bypassing their camera Unit. I also developed a VR simulation of what a patient sees using the Argus II system.',
        image: "assets/images/VRScanning.png",
        tags: ['Unity3D', 'C#', 'VR', 'Medical Devices'],
        links: {
            demo: null,
            github: null,
            paper: null
        }
    },
    {   
        title: "Is effort related to social dominance?",
        description: "As part of my Master's thesis, I investigated the relationship between effort and social dominance in hierarchical groups of mice. This work was part of a larger project on the neural mechanisms of social dominance (specifically, the connections from mPFC to LH) and was conducted in laboratory of <a href='https://tyelab.org/' target='_blank'>Prof. Kay M. Tye</a> at the <a href='https://www.salk.edu/' target='_blank'>Salk Institute</a> in San Diego.",
        image: "assets/images/effortTmaze.png",
        tags: ['Neuroscience', 'Behavior', 'Research', 'Data Analysis'],
        links: {
            demo: null,
            github: null,
            paper: "https://www.nature.com/articles/s41586-022-04507-5"
        }
    },
    {
        title: 'Does subjective feeling of re-experiencing past events relate to memory performance?',
        description: `At the <a href="https://www.campusbiotech.ch/en/node/339" target="_blank"> Laboratory of Cognitive Neuroscience (LNCO)</a> in Prof. Olaf Blanke's lab, together with Dr. Brechet, I investigated the relationship between the subjective feeling of re-experiencing past events and memory performance. In this prroject we worked with healthy human subjects and used virtual reality to manipulate the feeling of re-experiencing past events.`,
        image: "assets/images/vrimmersion.png",
        tags: ['VR', 'Neuroscience', 'Memory', 'Research'],
        links: {
            demo: null,
            github: null,
            paper: "https://onlinelibrary.wiley.com/doi/full/10.1002/brb3.1571"
        }
    }
];

// Preloader
window.addEventListener('load', () => {
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 500);
    }
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    const icon = themeToggle.querySelector('i');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
}

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.hamburger')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - header.offsetHeight,
                behavior: 'smooth'
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Back to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + header.offsetHeight + 50;
    
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Scroll animations
function handleScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Render projects dynamically
function renderProjects() {
    console.log("Rendering projects...");
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (!projectsGrid) {
        console.error("Projects grid element not found!");
        return;
    }
    
    // Clear existing content including the fallback
    projectsGrid.innerHTML = '';
    
    console.log(`Found ${projects.length} projects to render`);
    
    // If no projects, show a message
    if (projects.length === 0) {
        projectsGrid.innerHTML = '<p class="no-projects">No projects to display.</p>';
        return;
    }
    
    // Render each project
    projects.forEach((project, index) => {
        console.log(`Rendering project ${index + 1}: ${project.title}`);
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card reveal';
        
        // Create tags HTML if tags exist
        let tagsHTML = '';
        if (project.tags && project.tags.length > 0) {
            tagsHTML = `
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
            `;
        }
        
        // Create links HTML
        let linksHTML = '';
        if (project.links.github) {
            linksHTML += `<a href="${project.links.github}" target="_blank">GitHub</a>`;
        }
        if (project.links.demo) {
            linksHTML += `<a href="${project.links.demo}" target="_blank">Demo</a>`;
        }
        if (project.links.paper) {
            linksHTML += `<a href="${project.links.paper}" target="_blank">Paper</a>`;
        }
        
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <div class="project-info">
                <h3>${project.title}</h3>
                ${tagsHTML}
                <p class="project-description">${project.description}</p>
                ${linksHTML ? `<div class="project-links">${linksHTML}</div>` : ''}
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
    
    // Initialize animations for the newly added elements
    initProjectAnimations();
}

// Initialize animations specifically for projects
function initProjectAnimations() {
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.fromTo(
            card,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%'
                }
            }
        );
    });
}

// Form validation
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;
        
        if (!isValidEmail(email) || name.trim() === '' || message.trim() === '') {
            e.preventDefault();
            alert('Please fill out all fields correctly.');
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Initialize animations and GSAP
function initAnimations() {
    // GSAP animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    gsap.utils.toArray('.section').forEach(section => {
        gsap.fromTo(
            section,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1
                }
            }
        );
    });
    
    // Animate project cards
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.fromTo(
            card,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%'
                }
            }
        );
    });
}

// Update the initializePortfolio function to check for page-specific elements
function initializePortfolio() {
    // Initialize animations
    initAnimations();
    
    // Only render projects if we're on the main page (check for projects grid)
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        renderProjects();
        initProjectAnimations();
    }
    
    // Initialize scroll animations
    handleScrollAnimations();
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializePortfolio);

// Initialize scroll-to-top functionality
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopButton = document.querySelector('.scroll-to-top');
    if (scrollToTopButton) {
        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
