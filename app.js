// DOM Content Loaded - Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    initNavigation();
    initSmoothScrolling();
    initContactForm();
    initScrollAnimations();
    initParallaxEffect();
    initProjectInteractions();
    initSkillInteractions();
    initSocialTracking();
    initPageLoading();
    addDynamicStyles();
    setTimeout(initTypingAnimation, 500);
});

// Enhanced smooth scrolling functionality
function initSmoothScrolling() {
    console.log('Setting up smooth scrolling...');
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const heroButtons = document.querySelectorAll('.hero-actions a[href^="#"]');
    
    // Combine all scroll links
    const allScrollLinks = [...navLinks, ...heroButtons];
    
    console.log('Found scroll links:', allScrollLinks.length);
    
    allScrollLinks.forEach((link, index) => {
        console.log(`Setting up link ${index}:`, link.getAttribute('href'));
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const href = this.getAttribute('href');
            console.log('Clicked link with href:', href);
            
            if (href && href !== '#') {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                console.log('Target element:', targetElement);
                
                if (targetElement) {
                    const headerHeight = 80; // Account for fixed header
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    console.log('Scrolling to position:', targetPosition);
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    const navToggle = document.querySelector('.nav-toggle');
                    if (navMenu && navToggle) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                    }
                } else {
                    console.error('Target element not found:', targetId);
                }
            }
        });
    });
}

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Update navigation on scroll
    window.addEventListener('scroll', throttle(function() {
        updateActiveNavLink();
        updateNavBackground();
    }, 16));

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    function updateNavBackground() {
        const nav = document.querySelector('.nav');
        if (nav) {
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.backdropFilter = 'saturate(180%) blur(20px)';
                nav.style.webkitBackdropFilter = 'saturate(180%) blur(20px)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.8)';
                nav.style.backdropFilter = 'saturate(180%) blur(20px)';
                nav.style.webkitBackdropFilter = 'saturate(180%) blur(20px)';
            }
        }
    }
}

// Enhanced contact form functionality
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        console.log('Setting up contact form...');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    } else {
        console.error('Contact form not found');
    }
}

async function handleFormSubmission(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    console.log('Processing form submission...');
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';
    
    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            showFormFeedback('success', '✅ Thank you! Your message has been sent successfully.');
            form.reset();
        } else {
            // Log the error for debugging
            const errorData = await response.json();
            console.error('Form submission failed:', errorData);
            showFormFeedback('error', '⚠️ Oops! There was an error. Please try again.');
        }
        
    } catch (error) {
        console.error('Form submission failed:', error);
        showFormFeedback('error', '⚠️ An unexpected error occurred. Please try again later.');
    } finally {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
    }
}

function showFormFeedback(type, message) {
    console.log('Creating feedback message:', type, message);
    
    // Remove existing feedback
    const existingFeedback = document.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `form-feedback status status--${type}`;
    feedback.innerHTML = message;
    
    // Style the feedback
    feedback.style.marginTop = '16px';
    feedback.style.padding = '12px 16px';
    feedback.style.borderRadius = '8px';
    feedback.style.fontSize = '14px';
    feedback.style.fontWeight = '500';
    feedback.style.opacity = '0';
    feedback.style.transform = 'translateY(-10px)';
    feedback.style.transition = 'all 0.3s ease';
    
    if (type === 'success') {
        feedback.style.backgroundColor = 'rgba(33, 128, 141, 0.15)';
        feedback.style.color = 'var(--color-success)';
        feedback.style.border = '1px solid rgba(33, 128, 141, 0.25)';
    } else if (type === 'error') {
        feedback.style.backgroundColor = 'rgba(192, 21, 47, 0.15)';
        feedback.style.color = 'var(--color-error)';
        feedback.style.border = '1px solid rgba(192, 21, 47, 0.25)';
    }
    
    // Insert feedback after the form
    const contactForm = document.querySelector('.contact-form');
    contactForm.appendChild(feedback);
    
    console.log('Feedback element added to DOM');
    
    // Animate in
    setTimeout(() => {
        feedback.style.opacity = '1';
        feedback.style.transform = 'translateY(0)';
        console.log('Feedback animation triggered');
    }, 100);
    
    // Remove after 6 seconds
    setTimeout(() => {
        if (feedback && feedback.parentNode) {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.remove();
                    console.log('Feedback removed');
                }
            }, 300);
        }
    }, 6000);
}

// Scroll animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Animate elements as they come into view
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .stat, .about-description, .section-header');
    
    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
        window.addEventListener('scroll', throttle(function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${rate}px)`;
            }
        }, 16));
    }
}

// Project card interactions
function initProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.project-title')?.textContent || 'Project';
            console.log(`Clicked on project: ${title}`);
            
            // Visual feedback
            this.style.transform = 'translateY(-8px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px) scale(1)';
            }, 150);
        });
    });
}

// Skill interactions
function initSkillInteractions() {
    const skillTags = document.querySelectorAll('.skill-tag, .tech-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const skill = this.textContent.trim();
            console.log(`Skill clicked: ${skill}`);
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Typing animation for hero title
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.textContent) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        
        let index = 0;
        const typingSpeed = 80;
        
        function typeWriter() {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, typingSpeed);
            }
        }
        
        typeWriter();
    }
}

// Social link tracking
function initSocialTracking() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.textContent.trim();
            console.log(`Social link clicked: ${platform}`);
        });
    });
}

// Page loading animation
function initPageLoading() {
    const body = document.body;
    body.classList.add('loading');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            body.classList.remove('loading');
            body.classList.add('loaded');
        }, 300);
    });
}

// Add dynamic styles
function addDynamicStyles() {
    const styles = `
        body.loading {
            overflow: hidden;
        }

        body.loading .hero-content {
            opacity: 0;
            transform: translateY(30px);
        }

        body.loaded .hero-content {
            opacity: 1;
            transform: translateY(0);
            transition: all 0.8s ease-out 0.3s;
        }

        .nav-link.active {
            color: var(--color-primary) !important;
        }

        .nav-link.active::after {
            width: 100% !important;
        }

        .fade-in {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }

        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .project-card {
            cursor: pointer;
        }

        .skill-tag, .tech-tag {
            cursor: pointer;
        }

        @media (max-width: 768px) {
            .nav-menu {
                display: none;
            }
            
            .nav-menu.active {
                display: flex;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// Performance optimization: Throttle function
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
