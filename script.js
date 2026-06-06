/* ===================================================================
   NIBHYAM INTERIORS — PREMIUM JAVASCRIPT v2
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. LOADER (Removed)

    // 2. NAVBAR SCROLL & MOBILE MENU
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 3. HERO SLIDER
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }, 6000);
    }

    // 4. SCROLL ANIMATIONS (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.anim').forEach(el => observer.observe(el));

    // 5. NUMBER COUNTER ANIMATION
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseFloat(target.getAttribute('data-target'));
                const isDecimal = finalValue % 1 !== 0;
                const duration = 2000;
                const steps = 60;
                const stepTime = Math.abs(Math.floor(duration / steps));
                const increment = finalValue / steps;
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= finalValue) {
                        target.innerText = finalValue;
                        clearInterval(timer);
                    } else {
                        target.innerText = isDecimal ? current.toFixed(1) : Math.floor(current);
                    }
                }, stepTime);
                
                obs.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.trust-number').forEach(el => counterObserver.observe(el));

    // 6. CAROUSELS (Generic Logic for Multiple Carousels)
    const setupCarousel = (wrapSelector, trackSelector, prevSelector, nextSelector) => {
        const wrap = document.querySelector(wrapSelector);
        if (!wrap) return;
        
        const track = wrap.querySelector(trackSelector);
        const prev = wrap.querySelector(prevSelector);
        const next = wrap.querySelector(nextSelector);
        
        if (!track || !prev || !next) return;

        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;

        const getCardWidth = () => {
            const card = track.querySelector('.carousel-card');
            if (!card) return 300;
            const style = window.getComputedStyle(card);
            return card.offsetWidth + parseFloat(style.marginRight || 24);
        };

        const getMaxTranslate = () => {
            return Math.max(0, track.scrollWidth - wrap.offsetWidth);
        };

        const setPosition = () => {
            currentTranslate = Math.max(-getMaxTranslate(), Math.min(0, currentTranslate));
            track.style.transform = `translateX(${currentTranslate}px)`;
            prevTranslate = currentTranslate;
        };

        next.addEventListener('click', () => {
            currentTranslate -= getCardWidth();
            setPosition();
        });

        prev.addEventListener('click', () => {
            currentTranslate += getCardWidth();
            setPosition();
        });

        // Touch / Mouse Drag
        const startDrag = (e) => {
            isDragging = true;
            startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            track.style.transition = 'none';
        };

        const drag = (e) => {
            if (!isDragging) return;
            const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            currentTranslate = prevTranslate + currentPosition - startPos;
            track.style.transform = `translateX(${currentTranslate}px)`;
        };

        const endDrag = () => {
            isDragging = false;
            track.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            setPosition();
        };

        track.addEventListener('mousedown', startDrag);
        track.addEventListener('touchstart', startDrag, { passive: true });
        window.addEventListener('mousemove', drag);
        window.addEventListener('touchmove', drag, { passive: true });
        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);
        window.addEventListener('mouseleave', () => {
            if (isDragging) endDrag();
        });
    };

    setupCarousel('#designs .carousel-wrap', '#designsTrack', '.carousel-prev', '.carousel-next');
    setupCarousel('.designs-section .carousel-wrap', '#livingTrack', '.carousel-prev', '.carousel-next');
    setupCarousel('.designs-section.alt-bg .carousel-wrap', '#wardrobeTrack', '.carousel-prev', '.carousel-next');

    // 7. PROJECTS FILTER
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // 8. BEFORE & AFTER SLIDER (Tabs & Drag)
    const baTabs = document.querySelectorAll('.ba-tab');
    const baSliders = document.querySelectorAll('.ba-slider');

    if (baTabs.length > 0) {
        baTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                baTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const index = tab.getAttribute('data-ba');
                baSliders.forEach(slider => {
                    slider.classList.remove('active');
                    if (slider.getAttribute('data-index') === index) {
                        slider.classList.add('active');
                    }
                });
            });
        });
    }

    baSliders.forEach(slider => {
        const handle = slider.querySelector('.ba-handle');
        const afterImg = slider.querySelector('.ba-after');
        let isSliding = false;

        const updateSlider = (e) => {
            if (!isSliding) return;
            const rect = slider.getBoundingClientRect();
            let x = (e.type.includes('mouse') ? e.pageX : e.touches[0].clientX) - rect.left - window.scrollX;
            x = Math.max(0, Math.min(x, rect.width));
            const percentage = (x / rect.width) * 100;
            
            handle.style.left = `${percentage}%`;
            afterImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        };

        handle.addEventListener('mousedown', () => isSliding = true);
        handle.addEventListener('touchstart', () => isSliding = true, { passive: true });
        
        window.addEventListener('mousemove', updateSlider);
        window.addEventListener('touchmove', updateSlider, { passive: true });
        
        window.addEventListener('mouseup', () => isSliding = false);
        window.addEventListener('touchend', () => isSliding = false);
    });



    // 10. PACKAGE SELECTION LOGIC
    const packageCards = document.querySelectorAll('.package-card');
    if (packageCards.length > 0) {
        packageCards.forEach(card => {
            card.addEventListener('click', () => {
                packageCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });
    }

    // 11. FAQ ACCORDION
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const btn = item.querySelector('.faq-question');
            btn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all
                faqItems.forEach(i => i.classList.remove('active'));
                
                // Open clicked if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // 12. POPUP FORM LOGIC (Removed)

    // 13. FORM SUBMISSIONS
    const setupForm = (formId, btnText) => {
        const form = document.getElementById(formId);
        if (!form) return;
        
          };

    setupForm('bhkForm');
    setupForm('consultationForm');


    // 14. SCROLL TO TOP BUTTON
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
