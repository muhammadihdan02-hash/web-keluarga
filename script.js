/* ============================================
   KELUARGA — INTERACTIVE SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Particle Canvas Background ----
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.opacitySpeed = (Math.random() - 0.5) * 0.005;
            this.gold = Math.random() > 0.5;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity += this.opacitySpeed;
            
            if (this.opacity <= 0.05 || this.opacity >= 0.6) {
                this.opacitySpeed *= -1;
            }
            
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            if (this.gold) {
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            } else {
                ctx.fillStyle = `rgba(240, 214, 138, ${this.opacity * 0.5})`;
            }
            ctx.fill();
        }
    }
    
    // Create particles
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(37, 107, 115, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();

    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    window.addEventListener('scroll', () => {
        // Navbar background
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active section
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === current) {
                link.classList.add('active');
            }
        });
    });

    // ---- Hamburger Menu ----
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // ---- Scroll Animations (Intersection Observer) ----
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ---- Counter Animation ----
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const startTime = Date.now();
            
            function updateCounter() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(target * eased);
                
                if (target >= 1000) {
                    counter.textContent = current.toLocaleString() + '+';
                } else {
                    counter.textContent = current;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }
            
            updateCounter();
        });
    }
    
    // Trigger counters when stats section is visible
    const statsSection = document.querySelector('.home-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // ---- Card Hover 3D Tilt Effect ----
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -3;
            const rotateY = (x - centerX) / centerX * 3;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ---- Keunikan Cards Stagger Animation ----
    const keunikanCards = document.querySelectorAll('.keunikan-card');
    keunikanCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // ---- Smooth Scroll for Navigation Links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ---- Parallax Effect on Photo Frame ----
    const photoFrame = document.querySelector('.photo-frame');
    if (photoFrame) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.3;
            photoFrame.style.transform = `translateY(${rate * 0.1}px)`;
        });
    }

    // ---- Typing Effect for Motto (on load) ----
    const mottoElement = document.querySelector('.motto');
    if (mottoElement) {
        const mottoText = mottoElement.textContent;
        mottoElement.textContent = '';
        mottoElement.style.borderRight = '2px solid var(--gold)';
        
        let charIndex = 0;
        function typeMotto() {
            if (charIndex < mottoText.length) {
                mottoElement.textContent += mottoText.charAt(charIndex);
                charIndex++;
                setTimeout(typeMotto, 50);
            } else {
                // Remove cursor after typing
                setTimeout(() => {
                    mottoElement.style.borderRight = 'none';
                }, 1000);
            }
        }
        
        // Start typing after a short delay
        setTimeout(typeMotto, 1500);
    }

    // ---- Gold Sparkle on Click ----
    document.addEventListener('click', (e) => {
        createSparkle(e.clientX, e.clientY);
    });

    function createSparkle(x, y) {
        const sparkleCount = 6;
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #D4AF37;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${x}px;
                top: ${y}px;
                box-shadow: 0 0 6px #D4AF37;
            `;
            document.body.appendChild(sparkle);
            
            const angle = (Math.PI * 2 / sparkleCount) * i;
            const velocity = 50 + Math.random() * 50;
            const targetX = Math.cos(angle) * velocity;
            const targetY = Math.sin(angle) * velocity;
            
            sparkle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${targetX}px, ${targetY}px) scale(0)`, opacity: 0 }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0, 0.5, 0.5, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => sparkle.remove(), 650);
        }
    }

    console.log('%c✨ Keluarga - Family CV ✨', 'color: #D4AF37; font-size: 20px; font-weight: bold; font-family: serif;');
    console.log('%cDibuat dengan ❤️', 'color: #B8960C; font-size: 12px;');
});
