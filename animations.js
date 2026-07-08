const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

// Navigation fix - v2026-07-08-2

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

function animateNavLinks() {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(-10px)';
        link.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        link.style.transitionDelay = `${index * 0.05}s`;
    });

    window.addEventListener('load', () => {
        setTimeout(() => {
            navLinks.forEach((link, index) => {
                setTimeout(() => {
                    link.style.opacity = '1';
                    link.style.transform = 'translateY(0)';
                }, index * 40);
            });
        }, 200);
    });
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
        }, 500);
    }
}

function activeNavLink() {
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
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

document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll('.section__title');
    animateOnScroll('.home__title, .home__subtitle, .btn-primary', 0.6);
    animateOnScroll('.about__text p', 0.4);
    animateStaggeredList('.about__stats', '.stat');
    animateOnScroll('.skill-card', 0.4);
    animateOnScroll('.project-card', 0.4);
    animateOnScroll('.contact-item', 0.4);
    animateButton();
    animateNavLinks();
    activeNavLink();
    addSmoothScroll();
});

const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', (e) => {
        const email = form.querySelector('input[type="email"]').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            e.preventDefault();
            const button = form.querySelector('button');
            const originalText = button.textContent;
            button.textContent = 'INVALID EMAIL';
            button.style.background = '#dc3545';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }
    });
}

function sectionTransitionAnimations() {
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
                observer.unobserve(section);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

sectionTransitionAnimations();

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    document.body.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
});