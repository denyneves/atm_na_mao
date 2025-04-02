/* ==========================================================================
   CORE FUNCTIONS (Menu, Scroll, Theme, FAQ, Animations, etc.)
   ========================================================================== */

/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

/*===== MENU SHOW =====*/
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
        navToggle.setAttribute('aria-expanded', 'true');
    });
}

/*===== MENU HIDDEN =====*/
if (navClose && navMenu) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link');

function linkAction() {
    if (navMenu) navMenu.classList.remove('show-menu');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
}
navLink.forEach(n => n.addEventListener('click', linkAction));


/*=============== CHANGE BACKGROUND HEADER ===============*/
const header = document.getElementById('header');
function scrollHeader() {
    if (!header) return;
    window.scrollY >= 50 ? header.classList.add('scroll-header') : header.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader);


/*=============== ACTIVE LINK ON SCROLL ===============*/
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;
    const headerHeight = header ? header.offsetHeight : 58;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - headerHeight - 10;
        const sectionId = current.getAttribute('id');
        const currentLink = document.querySelector(`.nav__menu a[href*="#${sectionId}"]`); // Template literal

        if (currentLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                currentLink.classList.add('active-link');
            } else {
                currentLink.classList.remove('active-link');
            }
        }
    });
}
window.addEventListener('scroll', scrollActive);

/*=============== SLICK CAROUSEL ===============*/
if (typeof jQuery !== 'undefined') {
    $(document).ready(function () {
        const slickElement = $('.slick-carousel');
        if (slickElement.length > 0) {
            try {
                slickElement.slick({
                    dots: true, infinite: true, speed: 600, fade: true, cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
                    autoplay: true, autoplaySpeed: 5500, arrows: true, pauseOnHover: true,
                    responsive: [{ breakpoint: 768, settings: { arrows: false, fade: false, speed: 400 } }]
                });
            } catch (e) { console.error("Error initializing Slick Carousel:", e); }
        }
    });
} else { console.warn("jQuery not loaded. Slick Carousel unavailable."); }

/*=============== FAQ ACCORDION ===============*/
const faqItems = document.querySelectorAll('.faq__item');

const toggleItem = (itemToToggle) => {
    const content = itemToToggle.querySelector('.faq__content');
    const header = itemToToggle.querySelector('.faq__header');
    const icon = itemToToggle.querySelector('.faq__icon');
    const isOpen = itemToToggle.classList.contains('open');

    if (!content || !header) return;

    faqItems.forEach(item => {
        if (item !== itemToToggle && item.classList.contains('open')) {
            const otherContent = item.querySelector('.faq__content');
            const otherHeader = item.querySelector('.faq__header');
            const otherIcon = item.querySelector('.faq__icon');
            if (otherContent) otherContent.style.maxHeight = null;
            item.classList.remove('open');
            if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
            if (otherIcon) otherIcon.classList.replace('ri-subtract-line', 'ri-add-line');
        }
    });

    if (isOpen) {
        content.style.maxHeight = null;
        itemToToggle.classList.remove('open');
        header.setAttribute('aria-expanded', 'false');
        if (icon) icon.classList.replace('ri-subtract-line', 'ri-add-line');
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        itemToToggle.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
        if (icon) icon.classList.replace('ri-add-line', 'ri-subtract-line');
    }
};

faqItems.forEach((item) => {
    const faqHeader = item.querySelector('.faq__header');
    if (faqHeader) {
        faqHeader.addEventListener('click', () => toggleItem(item));
        faqHeader.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleItem(item); } });
        faqHeader.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false'); // Initial state
    }
});


/*=============== SHOW SCROLL UP ===============*/
const scrollUpBtn = document.getElementById('scroll-up');

function handleScrollUpVisibility() {
    if (!scrollUpBtn) return;
    window.scrollY >= 400 ? scrollUpBtn.classList.add('show-scroll') : scrollUpBtn.classList.remove('show-scroll');
}
handleScrollUpVisibility(); // Initial check
window.addEventListener('scroll', handleScrollUpVisibility);


/*=============== ANIMATIONS ON SCROLL ===============*/
const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const animationType = target.dataset.animation || 'fade-in';
                target.classList.add(`animate-${animationType}`);
                let delay = parseInt(target.dataset.delay) || 0;
                const staggerParent = target.closest('[data-stagger]');
                if (staggerParent) {
                    const siblingsToAnimate = Array.from(staggerParent.querySelectorAll(':scope > .animate-on-scroll'));
                    const elementIndex = siblingsToAnimate.indexOf(target);
                    if (elementIndex !== -1) {
                        const staggerValue = parseFloat(staggerParent.dataset.stagger) || 150;
                        delay += elementIndex * staggerValue;
                    }
                }
                target.style.transitionDelay = `${delay}ms`;
                target.classList.add('is-visible');
                observerInstance.unobserve(target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    elementsToAnimate.forEach(el => observer.observe(el));
} else {
    console.warn("IntersectionObserver not supported. Scroll animations disabled.");
    elementsToAnimate.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; el.classList.add('is-visible'); });
}

/*=============== PRELOADER (Optional) ===============*/
const bodyElement = document.body;
const preloaderElement = document.querySelector('.preloader');

window.addEventListener('load', () => {
    if (preloaderElement) {
        preloaderElement.classList.add('loaded');
        preloaderElement.addEventListener('transitionend', () => {
            if (preloaderElement.parentNode) preloaderElement.parentNode.removeChild(preloaderElement);
            bodyElement.classList.remove('preload');
        }, { once: true });
    } else { bodyElement.classList.remove('preload'); }
});

/*=============== SMOOTH SCROLLING FOR ANCHOR LINKS ===============*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const hrefAttribute = this.getAttribute('href');
        if (hrefAttribute && hrefAttribute.startsWith('#') && hrefAttribute.length > 1) {
            try {
                const targetElement = document.querySelector(hrefAttribute);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = header ? header.offsetHeight : 60;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = window.pageYOffset + elementPosition - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                    if (navMenu && navMenu.classList.contains('show-menu')) linkAction();
                } else { console.warn(`Smooth scroll target not found: ${hrefAttribute}`); }
            } catch (error) { console.error(`Error during smooth scroll for "${hrefAttribute}":`, error); }
        }
    });
});

/*=============== UPDATE COPYRIGHT YEAR ===============*/
const currentYearSpan = document.getElementById('current-year');
if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

/*=============== DARK/LIGHT THEME ===============*/
const themeButton = document.getElementById('theme-button');
const darkThemeClass = 'dark-theme';
const lightIconClass = 'ri-sun-line';
const darkIconClass = 'ri-moon-line';
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

const getCurrentTheme = () => localStorage.getItem('selected-theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
const getCurrentIcon = (theme) => theme === 'dark' ? lightIconClass : darkIconClass;

const applyTheme = (theme) => {
    document.body.classList.remove(darkThemeClass, 'light-theme'); // Ensure clean state
    document.body.classList.add(theme + '-theme'); // Add 'dark-theme' or 'light-theme'
    if (themeButton) {
        const iconElement = themeButton.querySelector('i');
        if(iconElement){ // Check if icon exists
            iconElement.classList.remove(lightIconClass, darkIconClass);
            iconElement.classList.add(getCurrentIcon(theme));
        }
        themeButton.setAttribute('aria-label', `Ativar modo ${theme === 'dark' ? 'claro' : 'escuro'}`);
    }
    localStorage.setItem('selected-theme', theme);
};

applyTheme(getCurrentTheme()); // Apply initial theme

if (themeButton) {
    themeButton.addEventListener('click', () => applyTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark'));
}

// Optional: Listen for system preference changes
// prefersDarkScheme.addEventListener('change', (e) => { if (!localStorage.getItem('selected-theme')) applyTheme(e.matches ? 'dark' : 'light'); });


/* ==========================================================================
   MODAL LOGIC (Setup and Interaction)
   ========================================================================== */

// --- Helper Functions ---
function showFeedback(elementId, message, type = 'info', duration = 3000) {
    const feedbackEl = document.getElementById(elementId);
    if (!feedbackEl) { console.warn(`Feedback element not found: #${elementId}`); return; }
    let iconClass = 'ri-information-line';
    if (type === 'success') iconClass = 'ri-check-line'; else if (type === 'error') iconClass = 'ri-error-warning-line'; else if (type === 'warning') iconClass = 'ri-alert-line';
    feedbackEl.innerHTML = `<i class="${iconClass}"></i> ${message}`;
    feedbackEl.className = `action-feedback feedback-${type} show`;
    if (feedbackEl.timeoutId) clearTimeout(feedbackEl.timeoutId);
    feedbackEl.timeoutId = setTimeout(() => feedbackEl.classList.remove('show'), duration);
}

function setLoading(buttonElement, isLoading) {
    if (!buttonElement) return;
    if (isLoading) { buttonElement.classList.add('loading'); buttonElement.disabled = true; }
    else { buttonElement.classList.remove('loading'); buttonElement.disabled = false; }
}

// --- Specific Modal Interaction Logic ---
/* MODAL: FILTROS AVANÇADOS */
const filtersModal = document.getElementById('modal-filtros');
if (filtersModal) {
    const checkBoxes = filtersModal.querySelectorAll('.filter-options input[type="checkbox"]');
    checkBoxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const filterLabel = cb.closest('label')?.textContent?.trim() || 'Unknown Filter';
            console.log(`Filter changed: ${filterLabel}, Checked: ${cb.checked}`);
            // Add logic here if needed (e.g., update count, enable apply button)
             showFeedback('filter-apply-feedback', `Filtro '${filterLabel}' ${cb.checked ? 'ativado' : 'desativado'}.`, 'info', 2000);
        });
    });
}

/* MODAL: REDE COLABORATIVA */
const collabModal = document.getElementById('modal-colaborativa');
if (collabModal) {
    const collabReportButtons = collabModal.querySelectorAll('.collaboration-action button');
    collabReportButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isSuccessReport = button.querySelector('.ri-thumb-up-line');
            const reportType = isSuccessReport ? 'Success' : 'Failure';
            setLoading(button, true);
            collabReportButtons.forEach(btn => btn.disabled = true); // Disable both
            showFeedback('collab-feedback', 'Enviando seu reporte...', 'info', 1500);
            setTimeout(() => {
                 // setLoading(button, false); // Keep disabled after report? Or re-enable:
                 collabReportButtons.forEach(btn => { setLoading(btn, false); btn.disabled = false; });
                 const message = reportType === 'Success' ? 'Reporte "Com Dinheiro" enviado! Obrigado!' : 'Reporte "Sem Dinheiro" enviado. Agradecemos!';
                 showFeedback('collab-feedback', message, 'success', 3000);
            }, 1500);
        });
    });
}

// --- Global Modal Functions ---
const modals = document.querySelectorAll('.modal');
const modalCloses = document.querySelectorAll('[data-modal-close]');
let previouslyFocusedElement = null;

function openModal(modal) {
    if (!modal) return;
    previouslyFocusedElement = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', escapeKeyListener);
    try {
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements.length > 0 ? focusableElements[0] : modal.querySelector('.modal__container');
        if (firstFocusable) setTimeout(() => firstFocusable.focus(), 100);
    } catch (e) { console.warn("Could not set focus in modal:", modal.id, e); }
}

function closeModal(modal) {
    if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', escapeKeyListener);
    setTimeout(() => { if (!document.querySelector('.modal:not([aria-hidden="true"])')) document.body.style.overflow = ''; }, 300); // Match CSS transition
    if (previouslyFocusedElement) { previouslyFocusedElement.focus(); previouslyFocusedElement = null; }
}

const escapeKeyListener = (event) => { if (event.key === 'Escape') { const openModalElement = document.querySelector('.modal:not([aria-hidden="true"])'); if (openModalElement) closeModal(openModalElement); } };

modalCloses.forEach(closeElement => { closeElement.addEventListener('click', () => { const targetModal = closeElement.closest('.modal'); if (targetModal) closeModal(targetModal); }); });


/* ==========================================================================
   INITIALIZATION LOGIC (DOM Ready)
   ========================================================================== */
function runWhenDOMLoaded(fn) { (document.readyState === 'loading') ? document.addEventListener('DOMContentLoaded', fn) : fn(); }

runWhenDOMLoaded(() => {
    /* --- 1. MODIFY FEATURE CARDS & VANTAGEM ITEMS (Make them triggers) --- */
    // Select BOTH feature cards AND vantagem items
    const potentialTriggers = document.querySelectorAll('.features__container .feature__card, .vantagens__data .vantagem__item');

    potentialTriggers.forEach((element, index) => {
        let targetModalId = null;
        const isFeatureCard = element.classList.contains('feature__card');
        const isVantagemItem = element.classList.contains('vantagem__item');

        if(isFeatureCard) {
            // Feature card logic (Needs to find its own target based on order within its container)
            const featureCards = Array.from(document.querySelectorAll('.features__container .feature__card'));
            const featureIndex = featureCards.indexOf(element);
            const featureModalIds = ['#modal-mapa', '#modal-status', '#modal-rotas', '#modal-filtros', '#modal-economia', '#modal-colaborativa'];
            targetModalId = featureModalIds[featureIndex] || null;

            // Remove original content if it exists
            const detailsElement = element.querySelector('.feature__details');
            if (detailsElement) detailsElement.remove();
            const toggleIconElement = element.querySelector('.feature__toggle-icon');
            if (toggleIconElement) toggleIconElement.remove();

        } else if (isVantagemItem) {
             // Vantagem item logic (Already has data-modal-target in the updated HTML)
             targetModalId = element.getAttribute('data-modal-target'); // Get pre-defined target
             // No need to remove elements here if HTML is correct
        }

        // Common setup if a target is identified
        if (targetModalId) {
            element.setAttribute('data-modal-target', targetModalId); // Ensure attribute exists or overwrite
            element.style.cursor = 'pointer';
            element.removeAttribute('aria-expanded'); // Remove old accordion attribute if present
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
        } else {
             // Warn only if it was expected to be a trigger but wasn't identified correctly
             if(isFeatureCard) console.warn(`No matching modal ID for feature card at its index ${index}.`);
             // No warning needed for Vantagem if the attribute was missing in HTML
        }
    });
    console.log("ATM na Mão: Potential Triggers adapted.");

    /* --- 2. ATTACH LISTENERS TO ALL MODAL TRIGGERS --- */
    const modalTriggers = document.querySelectorAll('[data-modal-target]'); // Now select ALL elements with the attribute
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            if (event.target.closest('a:not(.button--link), button')) { return; } // Ignore clicks on links/buttons inside
            const modalId = trigger.getAttribute('data-modal-target');
            try {
                const targetModal = document.querySelector(modalId);
                if (targetModal) openModal(targetModal); else console.error(`Modal target element not found: ${modalId}`);
            } catch (e) { console.error(`Invalid selector for modal target "${modalId}":`, e); }
        });
        trigger.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger.click(); } });
    });
    console.log(`ATM na Mão: ${modalTriggers.length} Modal Triggers Initialized.`);

    /* --- 3. FINAL INITIALIZATION MESSAGE --- */
    console.log("ATM na Mão: All Scripts Initialized.");
}); // End of runWhenDOMLoaded
// Dentro da função runWhenDOMLoaded(() => { ... });

    /* --- 4. INITIALIZE VANTAGENS IMAGE SLIDER --- */
    const vantagensSlider = $('.vantagens__image-slider'); // Seleciona o novo slider

    if (typeof jQuery !== 'undefined' && vantagensSlider.length > 0) {
        try {
            vantagensSlider.slick({
                dots: true,          // Mostrar pontos de navegação
                arrows: false,         // Esconder setas (opcional, acho que fica mais limpo)
                infinite: true,      // Navegação infinita (loop)
                speed: 900,          // Velocidade da transição (ms) - mais lenta para suavidade
                fade: true,          // Efeito de fade entre slides
                cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)', // Easing suave
                autoplay: true,      // Autoplay habilitado
                autoplaySpeed: 4000, // Tempo entre cada slide (ms)
                pauseOnHover: true,    // Pausar ao passar o mouse sobre
                draggable: true,       // Permitir arrastar com o mouse
                swipe: true,           // Permitir deslizar em touch screens
                adaptiveHeight: false  // Mantenha a altura fixa (definida pelo aspect-ratio/min-height no CSS)
            });
            console.log("ATM na Mão: Vantagens Image Slider Initialized.");
        } catch(e) {
            console.error("Error initializing Vantagens Image Slider:", e);
        }
    } else if (typeof jQuery === 'undefined') {
         console.warn("jQuery not loaded. Vantagens Image Slider cannot be initialized.");
    }
    // ... O resto do código dentro de runWhenDOMLoaded (listeners, mensagem final) continua aqui ...

// Fim de runWhenDOMLoaded
// Dentro da função runWhenDOMLoaded(() => { ... });

    /* --- 5. INITIALIZE TECH ACCORDION --- */
    const techAccordionItems = document.querySelectorAll('.tech-accordion__item');

    const toggleTechItem = (itemToToggle) => {
        const content = itemToToggle.querySelector('.tech-accordion__content');
        const header = itemToToggle.querySelector('.tech-accordion__header');
        const iconToggle = itemToToggle.querySelector('.tech-accordion__icon-toggle');
        const isOpen = itemToToggle.classList.contains('open');

        if (!content || !header) {
            console.warn("Tech Accordion item missing header or content:", itemToToggle);
            return;
        }

        // Permite que múltiplos itens fiquem abertos - remova o loop 'forEach' abaixo se quiser fechar os outros
        /*
        techAccordionItems.forEach(item => {
            if (item !== itemToToggle && item.classList.contains('open')) {
                // ... (código para fechar outros itens, similar ao FAQ)
            }
        });
        */

        if (isOpen) {
            content.style.maxHeight = null; // Recolhe
            content.style.opacity = '0';
            content.style.paddingTop = '0';
            content.style.paddingBottom = '0';
            itemToToggle.classList.remove('open');
            header.setAttribute('aria-expanded', 'false');
            if (iconToggle) iconToggle.classList.replace('ri-subtract-line', 'ri-add-line'); // Reset icon
        } else {
            content.style.maxHeight = content.scrollHeight + 'px'; // Expande
            content.style.opacity = '1';
            content.style.paddingTop = '0.5rem'; // Restaura padding
            content.style.paddingBottom = '1.5rem';
            itemToToggle.classList.add('open');
            header.setAttribute('aria-expanded', 'true');
            if (iconToggle) iconToggle.classList.replace('ri-add-line', 'ri-subtract-line'); // Change icon
        }
    };

    techAccordionItems.forEach((item) => {
        const techHeader = item.querySelector('.tech-accordion__header');
        if (techHeader) {
            techHeader.addEventListener('click', () => toggleTechItem(item));
            techHeader.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleTechItem(item);
                }
            });
            // Set initial ARIA state
            techHeader.setAttribute('aria-expanded', 'false'); // Começa fechado
        }
    });
    console.log("ATM na Mão: Tech Accordion Initialized.");

    // ... O resto do código dentro de runWhenDOMLoaded (mensagem final) continua aqui ...

// Fim de runWhenDOMLoaded
// Dentro da função runWhenDOMLoaded(() => { ... });

    /* --- 6. INITIALIZE HOW IT WORKS SLIDER (REVITALIZED) --- */
    const howItWorksSlider = $('.how-it-works-slider'); // Seleciona o novo slider

    if (typeof jQuery !== 'undefined' && howItWorksSlider.length > 0) {
        try {
            howItWorksSlider.slick({
                dots: true,            // Mostrar pontos de navegação
                arrows: true,          // Mostrar setas (estilizadas no CSS)
                infinite: true,        // Loop infinito
                speed: 600,            // Velocidade da transição (ms)
                slidesToShow: 1,       // Mostrar 1 slide principal
                slidesToScroll: 1,
                autoplay: true,        // Autoplay
                autoplaySpeed: 5500,   // Tempo entre slides
                pauseOnHover: true,
                pauseOnFocus: true,
                pauseOnDotsHover: true,
                centerMode: true,      // ATIVA O CENTER MODE
                centerPadding: '15%',  // Espaço para ver slides adjacentes (ajuste %)
                                       // Valores menores como '60px' podem funcionar bem também
                cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)', // Easing suave
                draggable: true,
                swipe: true,
                responsive: [
                    {
                        breakpoint: 992, // Telas médias
                        settings: {
                            centerPadding: '10%', // Menos padding
                            arrows: false // Esconder setas em telas menores (opcional)
                        }
                    },
                    {
                        breakpoint: 576, // Telas pequenas
                        settings: {
                            centerMode: false, // Desativar center mode em telas muito pequenas
                            centerPadding: '0',
                            arrows: false
                        }
                    }
                ]
            });
            console.log("ATM na Mão: How It Works Slider Initialized.");
        } catch(e) {
            console.error("Error initializing How It Works Slider:", e);
        }
    } else if (typeof jQuery === 'undefined') {
         console.warn("jQuery not loaded. How It Works Slider cannot be initialized.");
    }

    // ... O resto do código dentro de runWhenDOMLoaded continua aqui ...

// Fim de runWhenDOMLoaded
$(document).ready(function(){ // Garante que o DOM está pronto

    // ... (seu código existente, como menu, theme toggle, etc.)

    // Inicialização do Slick Carousel para o Hero
    $('.hero-slider').slick({
        dots: true,           // Mostrar pontos de navegação
        arrows: true,         // Mostrar setas de navegação (prev/next)
        infinite: true,       // Loop infinito
        speed: 500,           // Velocidade da transição em ms
        fade: true,           // Usar efeito de fade em vez de slide
        cssEase: 'linear',    // Tipo de easing para o fade
        autoplay: true,       // Iniciar autoplay
        autoplaySpeed: 4000, // Tempo entre slides em ms (4 segundos)
        pauseOnHover: true,   // Pausar autoplay ao passar o mouse
        adaptiveHeight: false // Mantém a altura consistente (ajuste se necessário)
        // Adicione mais opções conforme documentação do Slick: https://kenwheeler.github.io/slick/
    });
    

    // Inicialização do Slick Carousel para "How It Works" (SEU CÓDIGO EXISTENTE)
    $('.slick-carousel').slick({ // Verifique se este seletor está correto para a seção "How It Works"
      dots: true,
      infinite: false, // Geralmente não queremos loop infinito para passos
      speed: 300,
      slidesToShow: 1,
      adaptiveHeight: true, // Bom para conteúdo de texto variável
      arrows: true
      // Adicione/ajuste outras opções aqui
    });

    // ... (seu código existente para modals, scroll animations, etc.)

}); // Fim do $(document).ready()
function setupSlickSliders() {
    if (typeof jQuery === 'undefined') {
        console.warn("jQuery not loaded. Slick Carousels cannot be initialized.");
        return;
    }

    // Slider de Screenshots (Página de Download)
    const screenshotSliderFuturistic = $('.screenshot-slider-futuristic');
    if (screenshotSliderFuturistic.length > 0) {
        try {
            screenshotSliderFuturistic.slick({
                dots: true, arrows: false, infinite: true, speed: 500,
                slidesToShow: 3, slidesToScroll: 1, autoplay: true,
                autoplaySpeed: 4000, centerMode: true, centerPadding: '40px',
                responsive: [
                     { breakpoint: 992, settings: { slidesToShow: 2, centerPadding: '30px'} },
                     { breakpoint: 576, settings: { slidesToShow: 1, centerMode: false, centerPadding: '0px'} }
                ]
            });
            console.log("ATM na Mão: Screenshot Slider Futuristic Initialized.");
        } catch (e) { console.error("Error initializing Screenshot Slider Futuristic:", e); }
    }

    // ADICIONE AQUI inicializações de outros sliders QUE EXISTAM EM AMBAS AS PÁGINAS
    // OU use condicionais para verificar a página atual se necessário.

    // REMOVA ou COMENTE inicializações de sliders que SÓ existem em index.html
    /*
    const futuristicSlider = $('.testimonial-slider-futuristic');
    if (futuristicSlider.length > 0) { ... } // Comentado se só existe na index
    */

}
// Exemplo DENTRO de document.addEventListener('DOMContentLoaded', ...)

// Inicializa o header específico da página de download (se a função existir)
if (typeof setupScrollHeaderDownloadPage === 'function' && document.body.classList.contains('download-page-active')) {
     setupScrollHeaderDownloadPage();
} else if (typeof setupScrollHeader === 'function' && !document.body.classList.contains('download-page-active')) {
    // Inicializa o header normal da index.html (se a função existir)
    setupScrollHeader();
}

// Inicializa o slider de showcase SOMENTE se ele existir
if (typeof setupSlickSliders === 'function') {
    setupSlickSliders(); // A função setupSlickSliders JÁ DEVE conter os if($(...).length > 0) para cada slider
}

// Inicializa animações SOMENTE se a função existir
if (typeof setupScrollAnimations === 'function') {
    setupScrollAnimations();
}

// Inicializa tema SOMENTE se a função existir
if (typeof setupThemeToggle === 'function') {
    setupThemeToggle();
}

// Inicializa scroll up SOMENTE se a função existir
if (typeof setupScrollUpButton === 'function') {
    setupScrollUpButton();
}

 // Inicializa copyright SOMENTE se a função existir
if (typeof updateCopyrightYear === 'function') {
    updateCopyrightYear();
}

// NÃO inicialize funções de modais, acordeões, sliders específicos da index.html
// if (typeof setupModalTriggers === 'function') { setupModalTriggers(); } // Comentado
// if (typeof setupFaqAccordion === 'function') { setupFaqAccordion(); } // Comentado
