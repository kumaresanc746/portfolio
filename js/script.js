// DOM Elements
const navbar = document.querySelector('.navbar');
const menuBtn = document.querySelector('.menu-btn');
const navLinksContainer = document.querySelector('.nav-links');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// Scroll Effect for Navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// 3D Background - Vanta.js NET Effect
let vantaEffect;
function init3DBackground() {
    vantaEffect = VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xf59e0b,       // Amber accent
        backgroundColor: 0x171717, // Deep dark slate background
        points: 18.00,
        maxDistance: 22.00,
        spacing: 18.00,
        showDots: true
    });
}

// 3D Tilt Effect
function initTilt() {
    const cards = document.querySelectorAll('.project-card, .cert-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

// Initialize everything
window.addEventListener('load', () => {
    init3DBackground();
    initTilt();
    reveal(); // Initial reveal
    initMobileMenu();
});

// Mobile Menu Toggle
function initMobileMenu() {
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
        // Toggle icon if using Font Awesome
        const icon = menuBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navLinksContainer.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !navLinksContainer.contains(e.target)) {
            menuBtn.classList.remove('active');
            navLinksContainer.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });
}

// Reveal Animations on Scroll
function reveal() {
    const reveals = document.querySelectorAll('.reveal, .fade-in');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');

            if (element.classList.contains('skill-item')) {
                const bar = element.querySelector('.skill-progress');
                if (bar) bar.style.opacity = "1";
            }
        }
    });
}

window.addEventListener('scroll', reveal);

// Form Validation and Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
    }

    showStatus('Sending message...', 'loading');

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    fetch(contactForm.action, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            showStatus('Thank you! Your message has been sent.', 'success');
            contactForm.reset();
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    showStatus(data["errors"].map(error => error["message"]).join(", "), 'error');
                } else {
                    showStatus("Oops! There was a problem submitting your form", 'error');
                }
            })
        }
    }).catch(error => {
        showStatus("Oops! There was a problem submitting your form", 'error');
    });
});

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.style.display = 'block';

    if (type === 'error') {
        formStatus.style.color = '#f87171';
    } else if (type === 'success') {
        formStatus.style.color = '#34d399';
    } else {
        formStatus.style.color = '#60a5fa';
    }
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});
