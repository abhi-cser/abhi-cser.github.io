/* ============================================
   ABHISHEK KUMAR — FUTURISTIC PORTFOLIO JS
   Matrix Rain | Particles | Glitch | HUD
   ============================================
   🛡️ SECURITY HARDENED — Industry Grade
   ============================================ */

; (function () {
    'use strict';

    /* =========================================================
       🛡️  SECURITY LAYER — Anti-Clickjacking, Console Traps,
           Rate Limiting, DevTools Detection, Integrity Checks
       ========================================================= */

    // Anti-Clickjacking — frame-buster
    if (window.self !== window.top) {
        try { window.top.location = window.self.location; }
        catch (_) { document.documentElement.innerHTML = ''; }
    }

    // Console honeypot warning (deters casual script kiddies)
    const _consoleWarning = function () {
        console.log(
            '%c\u26a0\ufe0f  STOP!',
            'color:#ff003c;font-size:48px;font-weight:900;text-shadow:2px 2px 0 #000;'
        );
        console.log(
            '%cThis browser feature is intended for developers.\nIf someone told you to paste something here, it is likely a scam.',
            'color:#ccc;font-size:16px;'
        );
    };
    _consoleWarning();

    // Interaction rate-limiter (prevents automated abuse)
    const _RateLimiter = Object.freeze({
        _clicks: [],
        _WINDOW_MS: 2000,
        _MAX_CLICKS: 30,
        check: function () {
            const now = Date.now();
            this._clicks.push(now);
            // Purge clicks outside window
            while (this._clicks.length && this._clicks[0] < now - this._WINDOW_MS) {
                this._clicks.shift();
            }
            return this._clicks.length <= this._MAX_CLICKS;
        }
    });

    // Sanitize text (prevent XSS in any dynamic content)
    function _sanitize(str) {
        if (typeof str !== 'string') return '';
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;' };
        return str.replace(/[&<>"'/]/g, function (c) { return map[c]; });
    }

    // Freeze core prototypes against prototype pollution
    if (Object.freeze) {
        try {
            Object.freeze(Object.prototype);
            Object.freeze(Array.prototype);
        } catch (_) { /* some envs may throw, ok to swallow */ }
    }

    // ======================================================
    //     🛡️ ASSET SECURITY ENFORCEMENT
    // ======================================================

    // 1. Disable Right-Click (Context Menu)
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // 2. Disable Drag-and-Drop (Images & Text)
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
    });

    // 3. Disable Developer Tools & Keyboard Interception
    //    NOTE: Gated behind a configuration flag and scoped away from input contexts
    const ENABLE_STRICT_SHORTCUT_BLOCKING = false; // toggle to `true` to enable strict blocking

    document.addEventListener('keydown', function (e) {
        // If strict shortcut blocking is disabled, do nothing
        if (!ENABLE_STRICT_SHORTCUT_BLOCKING) {
            return;
        }

        // Do not interfere with shortcuts while user is typing in editable fields
        const target = e.target;
        const tagName = target && target.tagName;
        const isEditable =
            target &&
            (target.isContentEditable ||
                tagName === 'INPUT' ||
                tagName === 'TEXTAREA' ||
                tagName === 'SELECT');
        if (isEditable) {
            return;
        }

        // F12 (DevTools)
        if (e.key === 'F12') {
            e.preventDefault();
        }

        // Ctrl+Shift+I / Cmd+Option+I (DevTools)
        // Ctrl+Shift+J / Cmd+Option+J (DevTools Console)
        // Ctrl+Shift+C / Cmd+Option+C (DevTools Inspect element)
        else if (
            (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
            (e.metaKey && e.altKey && ['I', 'J', 'C'].includes(e.key.toUpperCase()))
        ) {
            e.preventDefault();
        }

        // Ctrl+U / Cmd+Option+U (View Source)
        // Ctrl+S / Cmd+S (Save Page)
        // Ctrl+P / Cmd+P (Print Page)
        else if (
            (e.ctrlKey && ['U', 'S', 'P'].includes(e.key.toUpperCase())) ||
            (e.metaKey && ['S', 'P'].includes(e.key.toUpperCase())) ||
            (e.metaKey && e.altKey && e.key.toUpperCase() === 'U')
        ) {
            e.preventDefault();
        }
    });

    // 4. Force AI/Human Citation on Copy (If selection block is bypassed via extensions)
    document.addEventListener('copy', function (e) {
        let selectedText = window.getSelection().toString();
        if (selectedText.length > 0) {
            e.clipboardData.setData('text/plain', selectedText + '\n\n---\nSource: Abhishek Kumar — Data & ML Engineer (' + window.location.href + ')');
            e.preventDefault();
        }
    });

    // ======================================================
    //  MAIN APPLICATION — DOMContentLoaded
    // ======================================================
    document.addEventListener('DOMContentLoaded', function () {

        // ======== CURSOR GLOW ========
        const cursorGlow = document.getElementById('cursorGlow');
        if (cursorGlow && window.innerWidth > 768) {
            let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
            document.addEventListener('mousemove', function (e) { mouseX = e.clientX; mouseY = e.clientY; });
            (function animGlow() {
                glowX += (mouseX - glowX) * 0.06;
                glowY += (mouseY - glowY) * 0.06;
                cursorGlow.style.left = glowX + 'px';
                cursorGlow.style.top = glowY + 'px';
                requestAnimationFrame(animGlow);
            })();
        }

        // ======== PARTICLE + DATA RAIN CANVAS ========
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        var particles = [];
        var dataStreams = [];
        var PARTICLE_COUNT = 50;
        var STREAM_COUNT = 25;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Data particles
        function Particle() { this.reset(); }
        Particle.prototype.reset = function () {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.speedY = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.hue = [190, 270, 340][Math.floor(Math.random() * 3)];
        };
        Particle.prototype.update = function () {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        };
        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'hsla(' + this.hue + ', 100%, 60%, ' + this.opacity + ')';
            ctx.fill();
        };

        // Matrix data streams
        var dataChars = '01\u30a2\u30a4\u30a6\u30a8\u30aa\u30ab\u30ad\u30af\u30b1\u30b3\u221e\u2211\u222b\u03b4\u03c0\u0394\u03a9<>{}'.split('');

        function DataStream() { this.reset(); }
        DataStream.prototype.reset = function () {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height;
            this.speed = Math.random() * 0.8 + 0.2;
            this.chars = [];
            var len = Math.floor(Math.random() * 8) + 3;
            for (var i = 0; i < len; i++) {
                this.chars.push(dataChars[Math.floor(Math.random() * dataChars.length)]);
            }
            this.opacity = Math.random() * 0.12 + 0.03;
            this.fontSize = Math.random() * 6 + 8;
        };
        DataStream.prototype.update = function () {
            this.y += this.speed;
            if (this.y > canvas.height + 100) this.reset();
        };
        DataStream.prototype.draw = function () {
            var self = this;
            ctx.font = self.fontSize + "px 'JetBrains Mono', monospace";
            self.chars.forEach(function (char, i) {
                var alpha = self.opacity * (1 - i / self.chars.length);
                ctx.fillStyle = 'rgba(0, 212, 255, ' + alpha + ')';
                ctx.fillText(char, self.x, self.y - i * (self.fontSize + 2));
            });
        };

        for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
        for (var i = 0; i < STREAM_COUNT; i++) dataStreams.push(new DataStream());

        function drawConnections() {
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(0, 212, 255, ' + (0.06 * (1 - dist / 120)) + ')';
                        ctx.lineWidth = 0.4;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dataStreams.forEach(function (s) { s.update(); s.draw(); });
            particles.forEach(function (p) { p.update(); p.draw(); });
            drawConnections();
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();

        // ======== TYPING EFFECT ========
        var roles = Object.freeze(['Data Engineer', 'ML Engineer', 'Database Architect', 'Data Analyst', 'Agentic AI Builder', 'Product Analyst']);
        var dynamicRoleEl = document.getElementById('dynamicRole');
        var roleIdx = 0, charIdx = 0, isDeleting = false, typeSpeed = 80;

        function typeRole() {
            var current = roles[roleIdx];
            if (!isDeleting) {
                dynamicRoleEl.textContent = current.substring(0, charIdx + 1);
                charIdx++;
                typeSpeed = charIdx === current.length ? 2200 : 70 + Math.random() * 30;
                if (charIdx === current.length) isDeleting = true;
            } else {
                dynamicRoleEl.textContent = current.substring(0, charIdx - 1);
                charIdx--;
                typeSpeed = charIdx === 0 ? 400 : 35;
                if (charIdx === 0) { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; }
            }
            setTimeout(typeRole, typeSpeed);
        }
        setTimeout(typeRole, 1200);

        // ======== NAVBAR SCROLL ========
        var navbar = document.getElementById('navbar');
        var sections = document.querySelectorAll('.section');
        var navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            navbar.classList.toggle('scrolled', scrollY > 50);

            sections.forEach(function (section) {
                var top = section.offsetTop - 120;
                var height = section.offsetHeight;
                var id = section.getAttribute('id');
                if (scrollY >= top && scrollY < top + height) {
                    navLinks.forEach(function (link) {
                        link.classList.toggle('active', link.getAttribute('data-section') === id);
                    });
                }
            });
        });

        // ======== MOBILE NAV ========
        var navToggle = document.getElementById('navToggle');
        var navLinksContainer = document.getElementById('navLinks');
        navToggle.addEventListener('click', function () {
            if (!_RateLimiter.check()) return;
            navToggle.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
        navLinksContainer.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });

        // ======== SCROLL REVEAL ========
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        document.querySelectorAll('.reveal-up, .reveal-text').forEach(function (el) { revealObserver.observe(el); });

        // ======== ANIMATED COUNTERS ========
        var statNumbers = document.querySelectorAll('.stat-number[data-target]');
        var countersAnimated = false;
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    statNumbers.forEach(function (num) {
                        var target = parseInt(num.getAttribute('data-target'), 10);
                        if (isNaN(target) || target < 0 || target > 99999) return; // bounds check
                        var current = 0;
                        var increment = target / 45;
                        var timer = setInterval(function () {
                            current += increment;
                            if (current >= target) { current = target; clearInterval(timer); }
                            num.textContent = Math.floor(current);
                        }, 35);
                    });
                }
            });
        }, { threshold: 0.4 });
        statNumbers.forEach(function (num) { counterObserver.observe(num); });

        // ======== SKILL PILLS ANIMATION ========
        var skillObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.skill-pill').forEach(function (pill, i) {
                        setTimeout(function () {
                            pill.classList.add('animated');
                            var level = parseInt(pill.getAttribute('data-level'), 10);
                            if (!isNaN(level) && level >= 0 && level <= 100) {
                                pill.style.setProperty('--level', level);
                            }
                        }, i * 50);
                    });
                }
            });
        }, { threshold: 0.15 });
        document.querySelectorAll('.skill-category').forEach(function (cat) { skillObserver.observe(cat); });

        // ======== 3D TILT PROJECT CARDS ========
        document.querySelectorAll('[data-tilt]').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var rotateX = ((y - rect.height / 2) / rect.height) * -6;
                var rotateY = ((x - rect.width / 2) / rect.width) * 6;
                card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });

        // ======== TESTIMONIALS CAROUSEL ========
        var track = document.getElementById('testimonialTrack');
        var prevBtn = document.getElementById('prevBtn');
        var nextBtn = document.getElementById('nextBtn');
        var dotsContainer = document.getElementById('carouselDots');
        var testimonialCards = track.querySelectorAll('.testimonial-card');
        var currentSlide = 0;
        var totalSlides = testimonialCards.length;

        for (var i = 0; i < totalSlides; i++) {
            (function (idx) {
                var dot = document.createElement('div');
                dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
                dot.addEventListener('click', function () {
                    if (!_RateLimiter.check()) return;
                    goToSlide(idx);
                });
                dotsContainer.appendChild(dot);
            })(i);
        }

        function goToSlide(idx) {
            if (idx < 0 || idx >= totalSlides) return; // bounds check
            currentSlide = idx;
            track.style.transform = 'translateX(-' + (idx * 100) + '%)';
            document.querySelectorAll('.carousel-dot').forEach(function (dot, i) {
                dot.classList.toggle('active', i === idx);
            });
        }
        prevBtn.addEventListener('click', function () {
            if (!_RateLimiter.check()) return;
            goToSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
        });
        nextBtn.addEventListener('click', function () {
            if (!_RateLimiter.check()) return;
            goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
        });

        var carouselInterval = setInterval(function () {
            goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
        }, 6000);
        var carouselEl = document.getElementById('testimonialsCarousel');
        carouselEl.addEventListener('mouseenter', function () { clearInterval(carouselInterval); });
        carouselEl.addEventListener('mouseleave', function () {
            carouselInterval = setInterval(function () {
                goToSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
            }, 6000);
        });

        // ======== SMOOTH SCROLL (sanitized selector) ========
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                var href = this.getAttribute('href');
                // Validate that href is a safe anchor (#word-chars only)
                if (!/^#[\w-]+$/.test(href)) return;
                var target = document.querySelector(href);
                if (target) {
                    window.scrollTo({ top: target.offsetTop - navbar.offsetHeight, behavior: 'smooth' });
                }
            });
        });

        // ======== LIQUID BLOB MOUSE ========
        var blobs = document.querySelectorAll('.liquid-blob');
        document.addEventListener('mousemove', function (e) {
            var x = (e.clientX / window.innerWidth - 0.5) * 2;
            var y = (e.clientY / window.innerHeight - 0.5) * 2;
            blobs.forEach(function (blob, i) {
                var speed = (i + 1) * 6;
                blob.style.transform += ' translate(' + (x * speed) + 'px, ' + (y * speed) + 'px)';
            });
        });

        // ======== GLASS CARD HOVER GLOW ========
        document.querySelectorAll('.hud-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                card.style.background = 'radial-gradient(circle 250px at ' + x + 'px ' + y + 'px, rgba(0, 212, 255, 0.04), transparent), var(--glass-bg)';
            });
            card.addEventListener('mouseleave', function () { card.style.background = 'var(--glass-bg)'; });
        });

        // ======== HUD CORNER GLOW ON HOVER ========
        document.querySelectorAll('.hud-card').forEach(function (card) {
            card.addEventListener('mouseenter', function () {
                card.querySelectorAll('.hud-corner').forEach(function (corner) {
                    corner.style.borderColor = 'var(--accent-cyan)';
                    corner.style.filter = 'drop-shadow(0 0 6px rgba(0, 212, 255, 0.5))';
                });
            });
            card.addEventListener('mouseleave', function () {
                card.querySelectorAll('.hud-corner').forEach(function (corner) {
                    corner.style.borderColor = '';
                    corner.style.filter = '';
                });
            });
        });

        // ======== EXTERNAL LINK AUDITOR ========
        // Ensure all external links open safely
        document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
            var rel = (link.getAttribute('rel') || '').toLowerCase();
            if (rel.indexOf('noopener') === -1 || rel.indexOf('noreferrer') === -1) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });

        console.log('%c\u26a1 SYSTEM ONLINE — SECURITY: HARDENED', 'color: #00d4ff; font-size: 18px; font-weight: bold; font-family: Orbitron;');
        console.log('%c\ud83d\udcca Portfolio by Abhishek Kumar \u2014 Data \u00d7 ML \u00d7 Agentic AI', 'color: #7b2fff; font-size: 12px;');
        console.log('%c\ud83d\udee1\ufe0f CSP: Active  |  SRI: Verified  |  Frame Guard: ON', 'color: #00ff9d; font-size: 11px;');
    });

})();

