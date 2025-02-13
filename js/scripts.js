// JavaScript for interactive elements

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('.header');
const navItems = document.querySelectorAll('.nav-links a');

// Sample data for projects and blog posts
const projects = [
    {
        title: 'Project 1',
        description: 'Description of project 1',
        image: 'assets/project1.jpg',
        demoLink: 'https://demo.project1.com',
        githubLink: 'https://github.com/username/project1'
    },
    {
        title: 'Project 2',
        description: 'Description of project 2',
        image: 'assets/project2.jpg',
        demoLink: 'https://demo.project2.com',
        githubLink: 'https://github.com/username/project2'
    }
];

const blogPosts = [
    {
        title: 'Blog Post 1',
        date: '2024-01-15',
        excerpt: 'This is a short excerpt from blog post 1...',
        link: '/blog/post1'
    },
    {
        title: 'Blog Post 2',
        date: '2024-01-10',
        excerpt: 'This is a short excerpt from blog post 2...',
        link: '/blog/post2'
    }
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
                <p>${project.description}</p>
                <div class="project-links">
                    <a href="${project.demoLink}" target="_blank">Live Demo</a>
                    <a href="${project.githubLink}" target="_blank">GitHub</a>
                </div>
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
                <a href="${post.link}" class="read-more">Read More</a>
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

// Event Listeners
window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', () => {
    renderProjects();
    renderBlogPosts();
    updateActiveNavLink();
});
