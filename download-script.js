'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /*=============== PRELOADER ===============*/
    const initPreloader = () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            window.addEventListener('load', () => {
                preloader.classList.add('loaded');
                // Optional: Remove from DOM after transition if you don't need it anymore
                // preloader.addEventListener('transitionend', () => preloader.remove());
            });
        }
    };

    /*=============== SHOW/HIDE MOBILE MENU ===============*/
    const initMobileMenu = () => {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        const navClose = document.getElementById('nav-close');
        const navLinks = document.querySelectorAll('.nav__link');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.add('show-menu');
            });
        }

        if (navClose && navMenu) {
            navClose.addEventListener('click', () => {
                navMenu.classList.remove('show-menu');
            });
        }

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu) navMenu.classList.remove('show-menu');
            });
        });
    };

    /*=============== CHANGE HEADER BACKGROUND ON SCROLL ===============*/
    const initHeaderScroll = () => {
        const header = document.getElementById('header');
        if (header) {
            const scrollHeader = () => {
                if (window.scrollY >= 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            };
            window.addEventListener('scroll', scrollHeader);
            // Initial check in case the page loads already scrolled
            scrollHeader();
        }
    };

    /*=============== THEME LIGHT/DARK TOGGLE ===============*/
    const initThemeSwitcher = () => {
        const themeButton = document.getElementById('theme-button');
        const body = document.body;
        const lightTheme = 'light'; // Default theme (no attribute)
        const darkTheme = 'dark';
        const darkIcon = 'ri-sun-line'; // Icon when dark theme is active (shows sun)
        const lightIcon = 'ri-moon-line'; // Icon when light theme is active (shows moon)

        // Get current theme preference
        const getCurrentTheme = () => body.dataset.theme === darkTheme ? darkTheme : lightTheme;
        const getCurrentIcon = () => body.dataset.theme === darkTheme ? darkIcon : lightIcon;

        // Apply saved theme on load
        const savedTheme = localStorage.getItem('selected-theme');
        const savedIcon = localStorage.getItem('selected-icon'); // This might not be strictly necessary if logic is sound

        if (savedTheme) {
            body.dataset.theme = savedTheme;
            if (themeButton) {
                const themeIcon = themeButton.querySelector('i');
                if (themeIcon) {
                    themeIcon.classList.remove(lightIcon, darkIcon);
                    themeIcon.classList.add(savedTheme === darkTheme ? darkIcon : lightIcon);
                }
            }
        } else {
             // Default is light, ensure moon icon is shown
             if (themeButton) {
                 const themeIcon = themeButton.querySelector('i');
                 if(themeIcon && !themeIcon.classList.contains(lightIcon)) {
                    themeIcon.classList.remove(darkIcon);
                    themeIcon.classList.add(lightIcon);
                 }
             }
        }

        // Theme toggle button event listener
        if (themeButton) {
            themeButton.addEventListener('click', () => {
                const currentTheme = getCurrentTheme();
                const newTheme = currentTheme === lightTheme ? darkTheme : lightTheme;
                const newIcon = newTheme === lightTheme ? lightIcon : darkIcon;

                body.dataset.theme = newTheme; // Apply new theme attribute

                const themeIcon = themeButton.querySelector('i');
                if (themeIcon) {
                    themeIcon.classList.remove(lightIcon, darkIcon);
                    themeIcon.classList.add(newIcon);
                }

                // Save preference
                localStorage.setItem('selected-theme', newTheme);
                // localStorage.setItem('selected-icon', newIcon); // Saving icon state might be redundant
            });
        }
    };


    /*=============== SCROLL REVEAL ANIMATION (Intersection Observer) ===============*/
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('[data-animation]');

        if ('IntersectionObserver' in window && animatedElements.length > 0) {
            const animationObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const delay = parseInt(element.dataset.delay) || 0;
                        const staggerContainer = element.closest('[data-stagger]');

                        // Apply animation class after delay
                        setTimeout(() => {
                            element.classList.add('is-visible');
                        }, delay);

                        // Unobserve after animation fires once, unless it needs to re-animate
                        // For most cases, unobserving is fine.
                         observer.unobserve(element);
                    }
                });
            }, {
                threshold: 0.1 // Adjust threshold as needed (0.1 means 10% visible)
                // rootMargin: '0px 0px -50px 0px' // Optional: trigger earlier/later
            });

            // Observe elements, potentially applying stagger delays
            const staggerContainers = document.querySelectorAll('[data-stagger]');
            staggerContainers.forEach(container => {
                const staggerAmount = parseInt(container.dataset.stagger) || 100;
                const childrenToAnimate = container.querySelectorAll('[data-animation]');
                childrenToAnimate.forEach((child, index) => {
                     // Add stagger delay to any existing delay
                     const existingDelay = parseInt(child.dataset.delay) || 0;
                     child.dataset.delay = existingDelay + (index * staggerAmount);
                });
            });

             // Now observe all elements (staggered delays are set)
             animatedElements.forEach(el => {
                animationObserver.observe(el);
            });

        } else {
             // Fallback for browsers without IntersectionObserver (or if no elements to animate)
             // Simply make elements visible immediately (less impressive)
             animatedElements.forEach(el => el.classList.add('is-visible'));
        }
    };

    /*=============== SLICK SLIDER INITIALIZATION ===============*/
    const initSlickSlider = () => {
        // Use jQuery's ready function for Slick compatibility
        $(document).ready(function(){
            const sliderElement = $('.dl-showcase-slider');
            if (sliderElement.length > 0) {
                sliderElement.slick({
                    dots: true,
                    infinite: true,
                    speed: 600, // Smoother speed
                    autoplay: true,
                    autoplaySpeed: 4500,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    centerMode: true,
                    centerPadding: '60px', // Adjust padding for center effect
                    arrows: true,
                    prevArrow: '<button type="button" class="slick-prev"><i class="ri-arrow-left-s-line"></i></button>',
                    nextArrow: '<button type="button" class="slick-next"><i class="ri-arrow-right-s-line"></i></button>',
                    responsive: [
                        { breakpoint: 1200, settings: { slidesToShow: 3, centerPadding: '40px' } },
                        { breakpoint: 992, settings: { slidesToShow: 2, centerPadding: '40px', arrows: false } }, // Hide arrows tablet
                        { breakpoint: 768, settings: { slidesToShow: 1, centerPadding: '40px', arrows: false } },
                        { breakpoint: 576, settings: { slidesToShow: 1, centerPadding: '20px', arrows: false, dots: false } } // Less padding, no dots mobile
                    ]
                });
            }
        });
    };

    /*=============== SHOW SCROLL UP ===============*/
    const initScrollUp = () => {
        const scrollUp = document.getElementById('scroll-up');
        if (scrollUp) {
            const scrollUpFunc = () => {
                if (window.scrollY >= 400) {
                    scrollUp.classList.add('show-scroll');
                } else {
                    scrollUp.classList.remove('show-scroll');
                }
            };
            window.addEventListener('scroll', scrollUpFunc);
             // Initial check
            scrollUpFunc();
        }
    };

    /*=============== UPDATE FOOTER YEAR ===============*/
    const updateFooterYear = () => {
        const currentYearSpan = document.getElementById('current-year');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
    };

    // --- Initialize all functions ---
    initPreloader();
    initMobileMenu();
    initHeaderScroll();
    initThemeSwitcher();
    initScrollAnimations(); // Initialize after other UI elements if needed
    initSlickSlider();
    initScrollUp();
    updateFooterYear();

}); // End DOMContentLoaded
