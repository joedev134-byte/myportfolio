const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

function createKeyframeAnimation(name, from, to) {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ${name} {
            from { ${from} }
            to { ${to} }
        }
    `;
    document.head.appendChild(style);
}

createKeyframeAnimation('fadeInUp', 'opacity: 0; transform: translateY(30px);', 'opacity: 1; transform: translateY(0);');
createKeyframeAnimation('fadeInUpFast', 'opacity: 0; transform: translateY(20px);', 'opacity: 1; transform: translateY(0);');
createKeyframeAnimation('pulseGlow', 'box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7);', 'box-shadow: 0 0 0 15px rgba(255, 107, 53, 0);');

function animateOnScroll(selector, duration = 0.5) {
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) return;
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        
        const delay = index * 0.05;
        el.style.transitionDelay = `${delay}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    elements.forEach(el => observer.observe(el));
}

function animateStaggeredList(containerSelector, itemSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const items = container.querySelectorAll(itemSelector);
    if (items.length === 0) return;
    
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        item.style.transitionDelay = `${index * 0.06}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                items.forEach(item => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observer.observe(container);
}

function animateButton() {
    const button = document.querySelector('.btn-primary');
    if (button) {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        button.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
            setTimeout(() => {
                button.classList.add('pulse');
            }, 300);
        }, 500);
    }
}

function activeNavLink() {
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');
    
    let ticking = false;
    
    function updateActiveLink() {
        let current = '';
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                link.classList.remove('active');
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            }
        });
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateActiveLink);
            ticking = true;
        }
    });
}

function addSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const targetPosition = targetSection.offsetTop - 70;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

function initLoadingState() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (!loadingOverlay) return;
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 800);
    });
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
    
    window.addEventListener('scroll', toggleBackToTop);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav__list');
    
    if (!toggleBtn || !navList) return;
    
    toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        toggleBtn.setAttribute('aria-expanded', !isExpanded);
        navList.classList.toggle('open');
    });
    
    navList.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.setAttribute('aria-expanded', 'false');
            navList.classList.remove('open');
        });
    });
}

function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    const statusEl = form.querySelector('#formStatus');
    
    const nameError = form.querySelector('#name-error');
    const emailError = form.querySelector('#email-error');
    const messageError = form.querySelector('#message-error');
    
    function validateName() {
        const value = nameInput.value.trim();
        if (value.length < 2) {
            nameInput.classList.add('invalid');
            nameError.textContent = 'Please enter at least 2 characters';
            return false;
        }
        nameInput.classList.remove('invalid');
        nameError.textContent = '';
        return true;
    }
    
    function validateEmail() {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            emailInput.classList.add('invalid');
            emailError.textContent = 'Please enter a valid email address';
            return false;
        }
        emailInput.classList.remove('invalid');
        emailError.textContent = '';
        return true;
    }
    
    function validateMessage() {
        const value = messageInput.value.trim();
        if (value.length < 10) {
            messageInput.classList.add('invalid');
            messageError.textContent = 'Please enter at least 10 characters';
            return false;
        }
        messageInput.classList.remove('invalid');
        messageError.textContent = '';
        return true;
    }
    
    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    messageInput.addEventListener('input', validateMessage);
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const isValid = validateName() && validateEmail() && validateMessage();
        
        if (!isValid) {
            statusEl.textContent = 'Please fix the errors in the form.';
            statusEl.className = 'form-status error';
            return;
        }
        
        statusEl.textContent = 'Sending your message...';
        statusEl.className = 'form-status';
        
        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                form.reset();
                statusEl.textContent = 'Message sent successfully! Thank you for reaching out.';
                statusEl.className = 'form-status success';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Submission failed');
            }
        } catch (error) {
            statusEl.textContent = 'Sorry, there was an error sending your message. Please try again.';
            statusEl.className = 'form-status error';
        }
    });
}

function initSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;
    
    skipLink.addEventListener('click', (e) => {
        const mainContent = document.getElementById('main-content');
        mainContent.focus();
    });
}

function initFocusManagement() {
    document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                el.classList.add('keyboard-focus');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll('.section__title');
    animateOnScroll('.home__title, .home__subtitle, .btn-primary', 0.6);
    animateOnScroll('.about__text p', 0.4);
    animateStaggeredList('.about__stats', '.stat');
    animateOnScroll('.skill-card', 0.4);
    animateOnScroll('.project-card', 0.4);
    animateOnScroll('.contact-item', 0.4);
    animateButton();
    activeNavLink();
    addSmoothScroll();
    initLoadingState();
    initBackToTop();
    initMobileMenu();
    initFormValidation();
    initSkipLink();
    initFocusManagement();
});

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    document.body.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
});