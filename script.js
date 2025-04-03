/**
 * Função Utilitária: Executa código após o DOM estar totalmente carregado.
 */
function runWhenDOMLoaded(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn(); // DOM já está pronto
    }
}

/**
 * Função Utilitária: Mostra feedback visual temporário.
 */
function showFeedback(elementId, message, type = 'info', duration = 3000) {
    const feedbackEl = document.getElementById(elementId);
    if (!feedbackEl) { console.warn(`Feedback element not found: #${elementId}`); return; }
    let iconClass = 'ri-information-line';
    if (type === 'success') iconClass = 'ri-check-double-line';
    else if (type === 'error') iconClass = 'ri-error-warning-line';
    else if (type === 'warning') iconClass = 'ri-alert-line';
    feedbackEl.innerHTML = `<i class="${iconClass}"></i> ${message}`;
    feedbackEl.className = `action-feedback feedback-${type} show`;
    if (feedbackEl.timeoutId) clearTimeout(feedbackEl.timeoutId);
    feedbackEl.timeoutId = setTimeout(() => feedbackEl.classList.remove('show'), duration);
}

/**
 * Função Utilitária: Controla o estado de loading de um botão.
 */
function setLoading(buttonElement, isLoading) {
    if (!buttonElement) return;
    buttonElement.classList.toggle('loading', isLoading);
    buttonElement.disabled = isLoading;
}

runWhenDOMLoaded(() => {
    console.log("ATM na Mão: Initializing Core Scripts...");

    const header = document.getElementById('header');

    /*=============== 1. MENU MOBILE ===============*/
    const initMobileMenu = () => {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        const navClose = document.getElementById('nav-close');
        const navLinks = document.querySelectorAll('.nav__link');
        if (navToggle && navMenu) { navToggle.addEventListener('click', () => { navMenu.classList.add('show-menu'); navToggle.setAttribute('aria-expanded', 'true'); }); }
        if (navClose && navMenu) { navClose.addEventListener('click', () => { navMenu.classList.remove('show-menu'); if (navToggle) navToggle.setAttribute('aria-expanded', 'false'); }); }
        navLinks.forEach(link => { link.addEventListener('click', () => { if (navMenu?.classList.contains('show-menu')) { navMenu.classList.remove('show-menu'); if (navToggle) navToggle.setAttribute('aria-expanded', 'false'); } }); });
        console.log("ATM na Mão: Mobile Menu Initialized.");
    };
    initMobileMenu();

    /*=============== 2. HEADER SCROLL EFFECT ===============*/
    const initHeaderScroll = () => {
        if (!header) return;
        const scrollHeaderHandler = () => header.classList.toggle('scrolled', window.scrollY >= 50);
        window.addEventListener('scroll', scrollHeaderHandler);
        scrollHeaderHandler();
        console.log("ATM na Mão: Header Scroll Effect Initialized.");
    };
    initHeaderScroll();

    /*=============== 3. ACTIVE LINK ON SCROLL ===============*/
    const initActiveLinkScroll = () => {
        const sections = document.querySelectorAll('section[id]');
        const navMenuList = document.querySelector('.nav__menu .nav__list');
        if (sections.length === 0 || !navMenuList) return;
        const scrollActiveHandler = () => {
            const scrollY = window.pageYOffset;
            const headerHeight = header ? header.offsetHeight + 20 : 80;
            let currentSectionId = null;
            sections.forEach(current => { if (scrollY > current.offsetTop - headerHeight && scrollY <= current.offsetTop + current.offsetHeight - headerHeight) { currentSectionId = current.getAttribute('id'); } });
            const links = navMenuList.querySelectorAll('a.nav__link');
            let foundActive = false;
            links.forEach(link => { link.classList.remove('active-link'); if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) { link.classList.add('active-link'); foundActive = true; } });
            if (!foundActive) { const homeLink = navMenuList.querySelector('a.nav__link[href="#hero"], a.nav__link[href="#"]'); homeLink?.classList.add('active-link'); }
        };
        window.addEventListener('scroll', scrollActiveHandler);
        scrollActiveHandler();
        console.log("ATM na Mão: Active Link Scroll Initialized.");
    };
    initActiveLinkScroll();

    /*=============== 4. THEME DARK/LIGHT TOGGLE ===============*/
    const initThemeSwitcher = () => {
        const themeButton = document.getElementById('theme-button');
        if (!themeButton) return;
        const body = document.body;
        const lightTheme = 'light', darkTheme = 'dark';
        const darkIcon = 'ri-sun-line', lightIcon = 'ri-moon-line';
        const themeAttribute = 'data-theme';
        const getCurrentStoredTheme = () => localStorage.getItem('selected-theme');
        const getSystemPreference = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? darkTheme : lightTheme;
        const applyTheme = (theme) => { const iconElement = themeButton.querySelector('i'); if (theme === darkTheme) { body.setAttribute(themeAttribute, darkTheme); if (iconElement) { iconElement.className = `ri ${darkIcon} nav__theme-icon`; } themeButton.setAttribute('aria-label', 'Ativar modo claro'); } else { body.removeAttribute(themeAttribute); if (iconElement) { iconElement.className = `ri ${lightIcon} nav__theme-icon`; } themeButton.setAttribute('aria-label', 'Ativar modo escuro'); } localStorage.setItem('selected-theme', theme); console.log(`Theme set to ${theme}`); };
        const initialTheme = getCurrentStoredTheme() || getSystemPreference();
        applyTheme(initialTheme);
        themeButton.addEventListener('click', () => { applyTheme(body.getAttribute(themeAttribute) === darkTheme ? lightTheme : darkTheme); });
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => { if (!getCurrentStoredTheme()) applyTheme(e.matches ? darkTheme : lightTheme); });
        console.log("ATM na Mão: Theme Switcher Initialized.");
    };
    initThemeSwitcher();

    /*=============== 5. FAQ ACCORDION ===============*/
    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq__item');
        if (faqItems.length === 0) return;
        const toggleFaqItem = (itemToToggle) => { const content = itemToToggle.querySelector('.faq__content'), header = itemToToggle.querySelector('.faq__header'), icon = itemToToggle.querySelector('.faq__icon'); if (!content || !header) return; const isOpen = itemToToggle.classList.contains('open'); faqItems.forEach(item => { if (item !== itemToToggle && item.classList.contains('open')) { item.classList.remove('open'); item.querySelector('.faq__header')?.setAttribute('aria-expanded', 'false'); item.querySelector('.faq__content')?.style.setProperty('max-height', null); item.querySelector('.faq__icon')?.classList.replace('ri-subtract-line', 'ri-add-line'); } }); itemToToggle.classList.toggle('open'); header.setAttribute('aria-expanded', String(!isOpen)); content.style.maxHeight = isOpen ? null : content.scrollHeight + "px"; if (icon) icon.classList.toggle('ri-add-line', isOpen); if (icon) icon.classList.toggle('ri-subtract-line', !isOpen); };
        faqItems.forEach((item) => { const faqHeader = item.querySelector('.faq__header'); if (faqHeader) { faqHeader.addEventListener('click', () => toggleFaqItem(item)); faqHeader.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFaqItem(item); } }); faqHeader.setAttribute('aria-expanded', 'false'); } item.querySelector('.faq__content')?.style.setProperty('max-height', null); });
        console.log("ATM na Mão: FAQ Accordion Initialized.");
    };
    initFaqAccordion();

    /*=============== 6. TECH ACCORDION ===============*/
    const initTechAccordion = () => {
        const techItems = document.querySelectorAll('.tech-accordion__item');
        if (techItems.length === 0) return;
        const toggleTechItem = (itemToToggle) => { const content = itemToToggle.querySelector('.tech-accordion__content'), header = itemToToggle.querySelector('.tech-accordion__header'), icon = itemToToggle.querySelector('.tech-accordion__icon-toggle'); if (!content || !header) return; const isOpen = itemToToggle.classList.contains('open'); itemToToggle.classList.toggle('open'); header.setAttribute('aria-expanded', String(!isOpen)); content.style.maxHeight = isOpen ? null : content.scrollHeight + "px"; if (icon) icon.classList.toggle('ri-add-line', isOpen); if (icon) icon.classList.toggle('ri-subtract-line', !isOpen); };
        techItems.forEach((item) => { const headerEl = item.querySelector('.tech-accordion__header'); if (headerEl) { headerEl.addEventListener('click', () => toggleTechItem(item)); headerEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTechItem(item); } }); headerEl.setAttribute('aria-expanded', 'false'); } item.querySelector('.tech-accordion__content')?.style.setProperty('max-height', null); });
        console.log("ATM na Mão: Tech Accordion Initialized.");
    };
    initTechAccordion();

    /*=============== 7. SHOW SCROLL UP BUTTON ===============*/
    const initScrollUp = () => {
        const btn = document.getElementById('scroll-up');
        if (!btn) return;
        const handler = () => btn.classList.toggle('show-scroll', window.scrollY >= 400);
        window.addEventListener('scroll', handler); handler();
        console.log("ATM na Mão: Scroll Up Button Initialized.");
    };
    initScrollUp();

    /*=============== 8. ANIMATIONS ON SCROLL (Intersection Observer) ===============*/
    const initScrollAnimations = () => {
        const elements = document.querySelectorAll('[data-animation]');
        if (elements.length === 0 || !('IntersectionObserver' in window)) { if (elements.length > 0) { console.warn("IO not supported. Animating all."); elements.forEach(el => el.classList.add('is-visible')); } return; }
        const observer = new IntersectionObserver((entries, instance) => {
            entries.forEach((entry) => { if (entry.isIntersecting) { const target = entry.target; let delay = parseInt(target.dataset.delay) || 0; const staggerParent = target.closest('[data-stagger]'); if (staggerParent) { const siblings = Array.from(staggerParent.querySelectorAll(':scope > [data-animation], :scope [data-animation]')); const idx = siblings.indexOf(target); if (idx !== -1) { const stagger = parseFloat(staggerParent.dataset.stagger) || 100; delay += idx * stagger; } } target.style.transitionDelay = `${delay}ms`; target.classList.add('is-visible'); instance.unobserve(target); } });
        }, { root: null, rootMargin: '0px 0px -5% 0px', threshold: 0.1 });
        elements.forEach(el => observer.observe(el));
        console.log("ATM na Mão: Scroll Animations Initialized.");
    };
    setTimeout(initScrollAnimations, 100);

    /*=============== 9. SLICK CAROUSELS (jQuery Dependent) ===============*/
    const initSlickSliders = () => {
        if (typeof jQuery === 'undefined' || typeof jQuery.fn.slick === 'undefined') { console.warn("jQuery/Slick not loaded."); return; }
        const init = (selector, options, name) => { const el = $(selector); if (el.length > 0 && !el.hasClass('slick-initialized')) { try { el.slick(options); console.log(`Slider Initialized: ${name}`); } catch (e) { console.error(`Error Init ${name}:`, e); } } };
        init('.vantagens__image-slider', { dots: true, arrows: false, infinite: true, speed: 900, fade: true, cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)', autoplay: true, autoplaySpeed: 4000, pauseOnHover: true, draggable: true, swipe: true, adaptiveHeight: false }, 'Vantagens Slider');
        init('.how-it-works-slider', { dots: true, arrows: true, infinite: false, speed: 600, slidesToShow: 1, slidesToScroll: 1, autoplay: false, centerMode: true, centerPadding: '15%', cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)', draggable: true, swipe: true, adaptiveHeight: true, responsive: [ { breakpoint: 992, settings: { centerPadding: '10%', arrows: false } }, { breakpoint: 576, settings: { centerMode: false, centerPadding: '0', arrows: false } } ] }, 'How It Works Slider');
        init('.dl-showcase-slider', { dots: true, infinite: true, speed: 600, autoplay: true, autoplaySpeed: 4500, slidesToShow: 3, slidesToScroll: 1, centerMode: true, centerPadding: '60px', arrows: true, prevArrow: '<button type="button" class="slick-prev"><i class="ri-arrow-left-s-line"></i></button>', nextArrow: '<button type="button" class="slick-next"><i class="ri-arrow-right-s-line"></i></button>', responsive: [ { breakpoint: 1200, settings: { slidesToShow: 3, centerPadding: '40px' } }, { breakpoint: 992, settings: { slidesToShow: 2, centerPadding: '40px', arrows: false } }, { breakpoint: 768, settings: { slidesToShow: 1, centerPadding: '40px', arrows: false } }, { breakpoint: 576, settings: { slidesToShow: 1, centerPadding: '20px', arrows: false, dots: false } } ] }, 'Download Showcase Slider');
    };
    initSlickSliders();

    /*=============== 10. MODAL SETUP & TRIGGERS ===============*/
    const initModals = () => {
        const modals = document.querySelectorAll('.modal');
        const modalCloses = document.querySelectorAll('[data-modal-close]');
        let previouslyFocusedElement = null;

        const openModal = (modal) => { if (!modal || modal.getAttribute('aria-hidden') === 'false') return; previouslyFocusedElement = document.activeElement; modal.setAttribute('aria-hidden', 'false'); modal.classList.add('is-open'); document.body.classList.add('modal-open-scroll-locked'); document.addEventListener('keydown', escapeKeyListener); try { const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'); const firstFocusable = focusable[0] || modal.querySelector('.modal__close') || modal.querySelector('.modal__container'); if (firstFocusable) setTimeout(() => firstFocusable.focus(), 50); } catch (e) { console.warn("Focus error:", modal.id, e); } console.log(`Modal opened: #${modal.id}`); };
        const closeModal = (modal) => { if (!modal || modal.getAttribute('aria-hidden') === 'true') return; modal.setAttribute('aria-hidden', 'true'); modal.classList.remove('is-open'); document.removeEventListener('keydown', escapeKeyListener); setTimeout(() => { if (!document.querySelector('.modal.is-open')) document.body.classList.remove('modal-open-scroll-locked'); }, 300); if (previouslyFocusedElement) { previouslyFocusedElement.focus(); previouslyFocusedElement = null; } console.log(`Modal closed: #${modal.id}`); };
        const escapeKeyListener = (e) => { if (e.key === 'Escape') { const openModalElement = document.querySelector('.modal.is-open'); if (openModalElement) closeModal(openModalElement); } };
        modalCloses.forEach(el => el.addEventListener('click', () => { const m = el.closest('.modal'); if (m) closeModal(m); }));

        const potentialTriggers = document.querySelectorAll('.features__container .feature__card, .vantagens__data .vantagem__item');
        const featureModalIds = ['#modal-mapa', '#modal-status', '#modal-rotas', '#modal-filtros', '#modal-economia', '#modal-colaborativa'];
        const featureCards = Array.from(document.querySelectorAll('.features__container .feature__card'));
        potentialTriggers.forEach((el) => { let targetId = null; const isFeature = el.classList.contains('feature__card'); if (isFeature) { const idx = featureCards.indexOf(el); targetId = featureModalIds[idx] || null; el.querySelector('.feature__details')?.remove(); el.querySelector('.feature__toggle-icon')?.remove(); } else { targetId = el.getAttribute('data-modal-target'); } if (targetId) { el.setAttribute('data-modal-target', targetId); el.style.cursor = 'pointer'; el.removeAttribute('aria-expanded'); el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0'); } else if (isFeature) { console.warn(`No modal ID for feature:`, el); } });

        const modalTriggers = document.querySelectorAll('[data-modal-target]');
        modalTriggers.forEach(trigger => { const handler = (e) => { if (e.target.closest('a:not([href="#"]):not(.button--link), button:not([data-modal-close])')) return; e.preventDefault(); const id = trigger.getAttribute('data-modal-target'); try { const target = document.querySelector(id); if (target) openModal(target); else { console.error(`Modal target not found: ${id}`); /* showFeedback('general-feedback', `Erro: Modal ${id} não encontrado.`, 'error'); */ } } catch (err) { console.error(`Invalid selector "${id}":`, err); /* showFeedback('general-feedback', `Erro ao tentar abrir modal.`, 'error'); */ } }; trigger.addEventListener('click', handler); trigger.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(e); } }); });
        console.log(`Modals Initialized. ${modalTriggers.length} triggers found.`);

        // --- Lógica Específica Interna dos Modais Aprimorados ---

        /* MODAL: MAPA INTELIGENTE (Aprimorado) */
        const modalMapa = document.getElementById('modal-mapa');
        if (modalMapa) {
            const btnFindMe = modalMapa.querySelector('#btn-find-me');
            const simulatedPins = modalMapa.querySelectorAll('.simulated-pin:not(.pin-user)');
            const atmDetailsContainer = modalMapa.querySelector('#atm-details');
            const mapFeedback = modalMapa.querySelector('#map-feedback');
            const hiddenRouteTrigger = document.getElementById('modal-rotas-trigger-placeholder'); // Trigger global

            // Simula "Onde Estou?"
            if (btnFindMe) { btnFindMe.addEventListener('click', () => { setLoading(btnFindMe, true); showFeedback('map-feedback', 'Simulando busca de localização...', 'info', 2000); setTimeout(() => { setLoading(btnFindMe, false); showFeedback('map-feedback', 'Localização simulada encontrada!', 'success', 3000); /* Adicionar marcador visual no mapa simulado */ document.querySelector('.pin-user')?.classList.add('pulse-marker'); setTimeout(()=> document.querySelector('.pin-user')?.classList.remove('pulse-marker'), 2500); }, 1500); }); }

            // Simula clique nos pins
            simulatedPins.forEach(pin => {
                pin.addEventListener('click', () => {
                    const atmId = pin.dataset.atmId;
                    // Remove seleção de outros pins
                    simulatedPins.forEach(p => p.classList.remove('selected-pin'));
                    pin.classList.add('selected-pin'); // Adiciona classe para destacar

                    showFeedback('map-feedback', `Carregando detalhes para ${pin.getAttribute('aria-label')}...`, 'info', 1500);

                    // Simula carregamento e exibe detalhes
                    setTimeout(() => {
                        // Dados simulados baseados no ID
                        let details = { title: "ATM Desconhecido", address: "Endereço não disponível", status: "Indisponível", statusClass: "unavailable", lastReport: "N/A", distance: "-", services: [], isFavorite: false };
                        if (atmId === 'atm1') details = { title: "ATM BAI - Alvalade", address: "Rua Comandante Gika", status: "Com Dinheiro", statusClass: "available", lastReport: "Comunidade, 5 min", distance: "300m", services: ["Levant.", "Consultas"], isFavorite: false };
                        else if (atmId === 'atm2') details = { title: "ATM BFA - Sagrada Família", address: "Largo da Sagrada Família", status: "Sem Dinheiro", statusClass: "unavailable", lastReport: "Comunidade, 1h", distance: "1.2km", services: ["Levant.", "Pagamentos"], isFavorite: true };
                        else if (atmId === 'atm3') details = { title: "ATM BIC - Vila Alice", address: "Av. Hoji Ya Henda", status: "Provável", statusClass: "likely", lastReport: "Predição, 30 min", distance: "850m", services: ["Levant.", "Depósitos", "Consultas"], isFavorite: false };

                        atmDetailsContainer.innerHTML = `
                            <div class="atm-detail-header">
                                <h4>${details.title}</h4>
                                <div class="atm-detail-actions">
                                    <button class="btn-favorite ${details.isFavorite ? 'favorited' : ''}" aria-label="${details.isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}" data-atm-id="${atmId}">
                                        <i class="ri-${details.isFavorite ? 'heart-fill' : 'heart-line'}"></i>
                                    </button>
                                    <button class="btn-report-issue" aria-label="Reportar Problema neste ATM" data-atm-id="${atmId}"><i class="ri-flag-line"></i></button>
                                </div>
                            </div>
                            <ul class="atm-info-list">
                                <li><i class="ri-map-pin-line"></i> ${details.address}</li>
                                <li><i class="ri-check-double-line status-icon ${details.statusClass}"></i> Status: <strong>${details.status}</strong> <small>(${details.lastReport})</small></li>
                                <li><i class="ri-pin-distance-line"></i> Distância: ${details.distance} (Simulado)</li>
                            </ul>
                            <div class="atm-services-list">
                                ${details.services.map(s => `<span>${s}</span>`).join('')}
                            </div>
                            <div class="atm-detail-footer">
                                <button class="button button--secondary button--small button--flex" id="show-route-btn-${atmId}">
                                    Ver Rota <i class="ri-route-line"></i>
                                </button>
                                <span class="last-report-time">Último reporte: ${details.lastReport}</span>
                            </div>
                        `;
                        atmDetailsContainer.className = 'atm-details-dynamic loaded'; // Remove placeholder class

                        // Adiciona listener ao botão de rota recém-criado
                        const showRouteBtn = atmDetailsContainer.querySelector(`#show-route-btn-${atmId}`);
                        if (showRouteBtn && hiddenRouteTrigger) { showRouteBtn.addEventListener('click', () => { closeModal(modalMapa); setTimeout(() => hiddenRouteTrigger.click(), 50); }); }

                        // Adiciona listener ao botão favorito
                        const favBtn = atmDetailsContainer.querySelector('.btn-favorite');
                        if(favBtn) { favBtn.addEventListener('click', function() { this.classList.toggle('favorited'); const icon = this.querySelector('i'); icon.className = `ri-${this.classList.contains('favorited') ? 'heart-fill' : 'heart-line'}`; showFeedback('map-feedback', `ATM ${this.classList.contains('favorited') ? 'adicionado aos' : 'removido dos'} favoritos!`, 'success', 2000); }); }

                        // Adiciona listener ao botão reportar problema (pode abrir outro modal ou apenas dar feedback)
                         const reportBtn = atmDetailsContainer.querySelector('.btn-report-issue');
                         if(reportBtn) { reportBtn.addEventListener('click', () => { showFeedback('map-feedback', 'Funcionalidade "Reportar Problema" (Em breve)', 'info', 3000); }); }

                    }, 500); // Simula delay da API
                });
            });
        }

        /* MODAL: STATUS DINÂMICO (Aprimorado) */
        const modalStatus = document.getElementById('modal-status');
        if (modalStatus) {
            const btnRefresh = modalStatus.querySelector('#btn-refresh-status');
            const statusTime = modalStatus.querySelector('#status-time');
            const statusInterpret = modalStatus.querySelector('#status-interpretation');
            const sources = {
                community: modalStatus.querySelector('[data-source="community"]'),
                prediction: modalStatus.querySelector('[data-source="prediction"]'),
                verification: modalStatus.querySelector('[data-source="verification"]')
            };
            const consolidatedBadge = modalStatus.querySelector('#consolidated-badge');
            const overallConfidenceValue = modalStatus.querySelector('#overall-confidence-value');
            const overallConfidenceBar = modalStatus.querySelector('#overall-confidence-bar');
            const historyList = modalStatus.querySelector('#status-history-list');

            const updateStatusDisplay = (data) => {
                statusTime.textContent = new Date().toLocaleTimeString();
                consolidatedBadge.textContent = data.consolidated.status;
                consolidatedBadge.className = `status-badge status--${data.consolidated.statusClass}`;
                statusInterpret.textContent = data.consolidated.interpretation;
                overallConfidenceValue.textContent = `${data.consolidated.confidence}%`;
                overallConfidenceBar.style.width = `${data.consolidated.confidence}%`;

                Object.keys(sources).forEach(key => {
                    if (sources[key] && data.sources[key]) {
                        sources[key].querySelector('.status-source-detail').textContent = data.sources[key].detail;
                        sources[key].querySelector('.confidence-fill').style.width = `${data.sources[key].confidence}%`;
                    }
                });

                // Atualiza histórico (simplesmente adiciona o novo status no topo)
                if (historyList) {
                    const newItem = document.createElement('li');
                    newItem.innerHTML = `<i class="ri-${data.consolidated.statusClass === 'available' ? 'check-line success' : (data.consolidated.statusClass === 'unavailable' ? 'close-line error' : 'question-line warning')}"></i> Status mudou para ${data.consolidated.status} - Agora`;
                    historyList.prepend(newItem);
                    // Limita histórico a 3-4 itens
                    while (historyList.children.length > 4) {
                        historyList.removeChild(historyList.lastChild);
                    }
                }
                 showFeedback('status-feedback', 'Status e Confiança Atualizados!', 'success', 2500);
            };

            if (btnRefresh) {
                btnRefresh.addEventListener('click', () => {
                    setLoading(btnRefresh, true);
                    showFeedback('status-feedback', 'Verificando fontes de dados...', 'info', 1500);
                    setTimeout(() => {
                        setLoading(btnRefresh, false);
                        // Simula novos dados
                        const rand = Math.random();
                        let simulatedData;
                        if (rand < 0.5) simulatedData = { sources: { community: { detail: "Reporte: 2 min", confidence: 95 }, prediction: { detail: "Hist: Positivo", confidence: 70 }, verification: { detail: "N/D", confidence: 0 } }, consolidated: { status: "Disponível", statusClass:"available", interpretation: "Confirmado pela comunidade muito recentemente.", confidence: 90 } };
                        else if (rand < 0.8) simulatedData = { sources: { community: { detail: "Reporte: 45 min", confidence: 50 }, prediction: { detail: "Hist: Neutro", confidence: 65 }, verification: { detail: "N/D", confidence: 0 } }, consolidated: { status: "Provável", statusClass:"likely", interpretation: "Baseado na predição; reporte comunitário antigo.", confidence: 60 } };
                        else simulatedData = { sources: { community: { detail: "Reporte: 10 min", confidence: 90 }, prediction: { detail: "Hist: Negativo", confidence: 30 }, verification: { detail: "N/D", confidence: 0 } }, consolidated: { status: "Indisponível", statusClass:"unavailable", interpretation: "Comunidade reportou sem dinheiro recentemente.", confidence: 85 } };
                        updateStatusDisplay(simulatedData);
                    }, 1200);
                });
            }
            // Simula um estado inicial ao abrir o modal (ou no carregamento da página)
            // updateStatusDisplay({ sources: { community: { detail: "Reporte: 15 min", confidence: 85 }, prediction: { detail: "Hist: Positivo", confidence: 60 }, verification: { detail: "N/D", confidence: 0 } }, consolidated: { status: "Provável", statusClass:"likely", interpretation: "Baseado na predição e reporte comunitário não tão recente.", confidence: 70 } });
        }

        /* MODAL: ROTAS OTIMIZADAS (Aprimorado) */
        const modalRotas = document.getElementById('modal-rotas');
        if (modalRotas) {
            const routeOptions = modalRotas.querySelectorAll('.route-option-card');
            const routePreviewImg = modalRotas.querySelector('#map-route-visual img');
            const routeDetails = {
                distance: modalRotas.querySelector('#route-distance'),
                time: modalRotas.querySelector('#route-time'),
                cost: modalRotas.querySelector('#route-cost'),
                safety: modalRotas.querySelector('#route-safety'),
                safetyIndicator: modalRotas.querySelector('#route-safety + .safety-indicator'),
                traffic: modalRotas.querySelector('#route-traffic')
            };
            const btnAltRoute = modalRotas.querySelector('#btn-alt-route');
            const btnStartNav = modalRotas.querySelector('#btn-start-navigation');
            const shareButtons = modalRotas.querySelectorAll('#share-buttons button');

            // Atualiza detalhes e imagem ao selecionar transporte
            routeOptions.forEach(option => {
                option.addEventListener('click', () => {
                    routeOptions.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    const type = option.dataset.routeType;
                    // Atualiza Detalhes
                    if(routeDetails.distance) routeDetails.distance.textContent = option.dataset.distance || '-';
                    if(routeDetails.time) routeDetails.time.textContent = option.dataset.time || '-';
                    if(routeDetails.cost) routeDetails.cost.textContent = (option.dataset.cost === "0" ? "Grátis" : `~${option.dataset.cost || '?'} Kz`);
                    if(routeDetails.safety) routeDetails.safety.textContent = option.dataset.safety || 'N/D';
                    if(routeDetails.safetyIndicator) routeDetails.safetyIndicator.className = `safety-indicator ${option.dataset.safety?.toLowerCase() || 'unknown'}`; // Adiciona classe p/ cor
                    // Simula mudança de trânsito (opcional)
                    if(routeDetails.traffic) routeDetails.traffic.textContent = type === 'car' ? 'Moderado' : 'Leve';
                    // Atualiza Imagem (simulado)
                    if (routePreviewImg) routePreviewImg.src = `img/route-${type}-placeholder.png`; // Precisa ter imagens: route-walk-placeholder.png, route-car-placeholder.png, etc.
                     // Habilita/desabilita botão TVDE
                    btnStartNav.textContent = type === 'taxi' ? 'Abrir App TVDE' : 'Iniciar Navegação';
                    btnStartNav.querySelector('i').className = `ri-${type === 'taxi' ? 'taxi-wifi' : 'navigation'}-fill button__icon`;

                     showFeedback('route-preview-feedback', `Prévia da rota ${option.querySelector('span').textContent} carregada.`, 'info', 2000);
                });
            });

            // Simula rota alternativa
            if (btnAltRoute) { btnAltRoute.addEventListener('click', () => { setLoading(btnAltRoute, true); setTimeout(() => { setLoading(btnAltRoute, false); showFeedback('route-preview-feedback', 'Rota alternativa (via B) calculada!', 'success', 3000); /* Poderia mudar a imagem/detalhes */ }, 1000); }); }

            // Simula iniciar navegação
             if (btnStartNav) { btnStartNav.addEventListener('click', () => { const selectedOption = modalRotas.querySelector('.route-option-card.selected'); const type = selectedOption?.dataset.routeType; setLoading(btnStartNav, true); setTimeout(() => { setLoading(btnStartNav, false); if (type === 'taxi') { showFeedback('share-feedback', 'Abrindo app TVDE... (Simulação)', 'success', 3000); } else { showFeedback('share-feedback', 'Iniciando navegação no app de mapas... (Simulação)', 'success', 3000); } /* closeModal(modalRotas); */ }, 1500); }); }

            // Botões de compartilhar (melhorados)
            if (shareButtons.length > 0) {
                shareButtons.forEach(button => {
                    button.addEventListener('click', async () => {
                        const shareType = button.dataset.share;
                        const atmTitle = "ATM BAI - Alvalade"; // Exemplo
                        const shareData = { title: `Direções para ${atmTitle} (ATM na Mão)`, text: `Aqui está a rota para o ${atmTitle} que encontrei no ATM na Mão: `, url: window.location.href + `#mapa?atm=atm1&route=${document.querySelector('.route-option-card.selected')?.dataset.routeType || 'walk'}` }; // URL mais específica
                        setLoading(button, true);
                        try {
                             if (shareType === 'copy') { await navigator.clipboard.writeText(shareData.url); showFeedback('share-feedback', 'Link da rota copiado!', 'success', 2500); }
                             else if (shareType === 'native' && navigator.share) { await navigator.share(shareData); showFeedback('share-feedback', 'Compartilhado com sucesso!', 'success', 2500); }
                             else if (shareType === 'whatsapp') { const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.text + shareData.url)}`; window.open(url, '_blank'); showFeedback('share-feedback', 'Abrindo WhatsApp...', 'info', 2000); }
                             // Adicionar outros (messenger, telegram, etc.) se necessário com URLs específicas
                             else { throw new Error('Share type not supported or native share unavailable.'); }
                         } catch (err) { console.error('Share error:', err); showFeedback('share-feedback', 'Não foi possível compartilhar.', 'error', 3000); }
                         finally { setLoading(button, false); }
                    });
                });
            }
        }

        /* MODAL: FILTROS AVANÇADOS (Aprimorado) */
        const modalFiltros = document.getElementById('modal-filtros');
        if (modalFiltros) {
            const filterCheckboxes = modalFiltros.querySelectorAll('.filter-options input[type="checkbox"]');
            const radiusSlider = modalFiltros.querySelector('#filter-radius');
            const radiusValueSpan = modalFiltros.querySelector('#radius-value');
            const btnClearFilters = modalFiltros.querySelector('#btn-clear-filters');
            const btnApplyFilters = modalFiltros.querySelector('#btn-apply-filters');
            const btnSaveFilters = modalFiltros.querySelector('#btn-save-filters');
            const filterCountEl = modalFiltros.querySelector('#filter-count');
            const filterFeedback = modalFiltros.querySelector('#filter-apply-feedback');
            let filtersChanged = false;
            const baseAtmCount = 85; // Contagem inicial

            const calculateSimulatedCount = () => {
                let count = baseAtmCount;
                const activeBankFilters = Array.from(filterCheckboxes).filter(cb => cb.name === 'bank' && cb.checked).length;
                const activeServiceFilters = Array.from(filterCheckboxes).filter(cb => cb.name === 'service' && cb.checked && cb.value !== 'levantamentos').length; // Penaliza mais por outros serviços
                const activeNoteFilters = Array.from(filterCheckboxes).filter(cb => cb.name === 'note' && cb.checked).length;
                const activeAccessFilters = Array.from(filterCheckboxes).filter(cb => cb.name === 'access' && cb.checked).length;
                const radiusKm = parseInt(radiusSlider.value) / 1000;

                if (activeBankFilters > 0 && activeBankFilters < 5) count -= activeBankFilters * 8; // Reduz mais se poucos bancos
                else if (activeBankFilters >= 5) count -= 20; // Redução menor se muitos bancos
                count -= activeServiceFilters * 15;
                count -= activeNoteFilters * 10;
                count -= activeAccessFilters * 5;

                // Ajuste pelo raio (não linear)
                if (radiusKm < 1) count *= 0.4;
                else if (radiusKm < 2) count *= 0.7;
                else if (radiusKm < 4) count *= 0.9;

                return Math.max(0, Math.round(count + (Math.random() - 0.5) * 5)); // Garante >= 0 e adiciona pequena variação
            };

            const updateFilterState = () => {
                filtersChanged = true;
                btnApplyFilters.disabled = false;
                const isDefault = Array.from(filterCheckboxes).every(cb => cb.id === 'filter-service-levantamentos' ? cb.checked : !cb.checked) && radiusSlider.value === '1500';
                btnClearFilters.disabled = isDefault;
                const simulatedCount = calculateSimulatedCount();
                if (filterCountEl) filterCountEl.textContent = simulatedCount;
                 // Atualiza visualização do raio no slider
                if (radiusSlider && radiusValueSpan) {
                    const value = radiusSlider.value;
                    const km = (value / 1000).toFixed(1);
                    radiusValueSpan.textContent = `${km} km`;
                     // Atualiza fundo do range (opcional, mas bom UX)
                     const percent = ((value - radiusSlider.min) / (radiusSlider.max - radiusSlider.min)) * 100;
                     radiusSlider.style.setProperty('--value-percent', `${percent}%`);
                }
            };

             // Inicializa valor do raio
            if (radiusSlider) updateFilterState();

            filterCheckboxes.forEach(cb => cb.addEventListener('change', updateFilterState));
            if (radiusSlider) radiusSlider.addEventListener('input', updateFilterState); // 'input' para atualização contínua

            if (btnClearFilters) { btnClearFilters.addEventListener('click', () => { filterCheckboxes.forEach(cb => cb.checked = (cb.id === 'filter-service-levantamentos')); if(radiusSlider) radiusSlider.value = 1500; updateFilterState(); btnClearFilters.disabled = true; btnApplyFilters.disabled = true; filtersChanged = false; showFeedback('filter-apply-feedback', 'Filtros redefinidos para padrão.', 'info', 2000); }); }
            if (btnApplyFilters) { btnApplyFilters.addEventListener('click', () => { if (!filtersChanged) return; setLoading(btnApplyFilters, true); showFeedback('filter-apply-feedback', 'Aplicando filtros...', 'info', 1500); setTimeout(() => { setLoading(btnApplyFilters, false); showFeedback('filter-apply-feedback', 'Filtros aplicados ao mapa!', 'success', 2500); filtersChanged = false; btnApplyFilters.disabled = true; closeModal(modalFiltros); }, 1200); }); }
            if (btnSaveFilters) { btnSaveFilters.addEventListener('click', () => { setLoading(btnSaveFilters, true); setTimeout(() => { setLoading(btnSaveFilters, false); showFeedback('filter-apply-feedback', 'Combinação de filtros salva! (Simulado)', 'success', 3000); }, 1000); }); }
        }

        /* MODAL: ECONOMIA GARANTIDA (Aprimorado) */
        const modalEconomia = document.getElementById('modal-economia');
        if (modalEconomia) {
            const amountInput = modalEconomia.querySelector('#withdrawal-amount');
            const feeSlider = modalEconomia.querySelector('#informal-fee-percent');
            const feeValueSpan = modalEconomia.querySelector('#informal-fee-value');
            const informalCostSpan = modalEconomia.querySelector('#informal-total-cost');
            const informalFeeAmountSpan = modalEconomia.querySelector('#informal-fee-amount');
            const officialCostSpan = modalEconomia.querySelector('#official-total-cost');
            const savingsSpan = modalEconomia.querySelector('#instant-savings');
            const monthlySavingsSpan = modalEconomia.querySelector('#monthly-savings'); // Simulado
             const savingsProgressBar = modalEconomia.querySelector('#monthly-savings + .progress-bar .progress-fill'); // Simulado

            const formatCurrency = (value) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 0 }).format(value).replace('AOA', '').trim() + ' Kz'; // Formato Kz

            const updateEconomySimulation = () => {
                const amount = parseFloat(amountInput.value) || 0;
                const feePercent = parseFloat(feeSlider.value) || 0;
                const informalFee = amount * (feePercent / 100);
                const informalTotal = amount + informalFee;
                const savings = informalFee;

                if (feeValueSpan) feeValueSpan.textContent = `${feePercent}%`;
                if (informalCostSpan) informalCostSpan.textContent = formatCurrency(informalTotal);
                if (informalFeeAmountSpan) informalFeeAmountSpan.textContent = formatCurrency(informalFee);
                if (officialCostSpan) officialCostSpan.textContent = formatCurrency(amount);
                if (savingsSpan) savingsSpan.textContent = formatCurrency(savings);

                // Atualiza cor do slider de taxa (opcional)
                 const percent = ((feePercent - feeSlider.min) / (feeSlider.max - feeSlider.min)) * 100;
                 // Cor gradiente (vermelho -> amarelo -> pouco verde)
                 const hue = 120 - (percent * 1.2); // 120 (verde) a 0 (vermelho)
                 feeSlider.style.background = `linear-gradient(to right, hsl(${hue}, 80%, 85%), hsl(${hue}, 90%, 60%))`;

                // Simula atualização da economia mensal (exemplo bobo)
                if (monthlySavingsSpan) {
                    const simulatedMonthly = Math.max(10000, savings * 5 + Math.random() * 20000); // Baseado na economia atual * 5 + random
                    monthlySavingsSpan.textContent = formatCurrency(simulatedMonthly);
                    if (savingsProgressBar) {
                        const progressPercent = Math.min(100, (simulatedMonthly / 100000) * 100); // Ex: Meta 100k Kz
                         savingsProgressBar.style.width = `${progressPercent}%`;
                    }
                }
            };

            if (amountInput) amountInput.addEventListener('input', updateEconomySimulation);
            if (feeSlider) {
                 feeSlider.addEventListener('input', updateEconomySimulation);
                 // Atualiza fundo do range no slider de taxa
                 feeSlider.style.setProperty('--value-percent', `${((feeSlider.value - feeSlider.min) / (feeSlider.max - feeSlider.min)) * 100}%`);
             }
            // Calcula inicialmente
            updateEconomySimulation();
        }

        /* MODAL: REDE COLABORATIVA (Aprimorado) */
        const modalColaborativa = document.getElementById('modal-colaborativa');
        if (modalColaborativa) {
            const reportButtons = modalColaborativa.querySelectorAll('.report-button');
            const otherIssueSection = modalColaborativa.querySelector('#other-issue-section');
            const issueDescription = modalColaborativa.querySelector('#issue-description');
            const btnSubmitIssue = modalColaborativa.querySelector('#btn-submit-issue');
            const collabScoreEl = modalColaborativa.querySelector('#collab-score');
            const badgeIconEl = modalColaborativa.querySelector('#collab-badge-icon');
            const badgeNameEl = modalColaborativa.querySelector('#collab-badge-name');
            const badgeProgressBar = modalColaborativa.querySelector('#badge-progress-bar');
            const activityList = modalColaborativa.querySelector('#user-activity-list');
            let currentScore = 125; // Pontuação inicial simulada
            const badges = [ { points: 0, name: "Iniciante", icon: "ri-seedling-line"}, { points: 100, name: "Bronze", icon: "ri-copper-coin-line"}, { points: 250, name: "Prata", icon: "ri-medal-line"}, { points: 500, name: "Ouro", icon: "ri-trophy-line"} ];

            const updateGamification = () => {
                if (collabScoreEl) collabScoreEl.textContent = currentScore;
                let currentBadge = badges[0];
                let nextBadge = badges[1];
                for(let i = badges.length - 1; i >= 0; i--) {
                    if (currentScore >= badges[i].points) {
                        currentBadge = badges[i];
                        nextBadge = badges[i+1]; // Pode ser undefined se for o último
                        break;
                    }
                }
                if(badgeIconEl) badgeIconEl.innerHTML = `<i class="${currentBadge.icon}"></i>`;
                if(badgeNameEl) badgeNameEl.textContent = currentBadge.name;
                if(badgeProgressBar && nextBadge) {
                     const pointsForNext = nextBadge.points - currentBadge.points;
                     const progress = Math.max(0, currentScore - currentBadge.points);
                     const percent = Math.min(100, (progress / pointsForNext) * 100);
                     badgeProgressBar.style.width = `${percent}%`;
                     badgeProgressBar.closest('.next-badge-progress').querySelector('small').textContent = `Próximo Nível: ${nextBadge.name} (${nextBadge.points} Pontos)`;
                } else if (badgeProgressBar) { // Último nível
                    badgeProgressBar.style.width = '100%';
                     badgeProgressBar.closest('.next-badge-progress').querySelector('small').textContent = `Nível Máximo Atingido!`;
                }
            };

            const addActivity = (iconClass, text, points) => {
                 if(!activityList) return;
                 const newItem = document.createElement('li');
                 newItem.innerHTML = `<i class="${iconClass}"></i> ${text} (+${points} pts)`;
                 activityList.prepend(newItem);
                 while (activityList.children.length > 5) activityList.removeChild(activityList.lastChild); // Limita a 5 itens
            };

             // Inicializa gamificação
             updateGamification();

            reportButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const feedbackType = button.dataset.feedback;
                    // Esconde seção "outro problema" se estava aberta
                    if(otherIssueSection) otherIssueSection.style.display = 'none';

                    if (feedbackType === 'issue') {
                        // Mostra a seção para descrever outro problema
                        if (otherIssueSection) otherIssueSection.style.display = 'flex';
                        showFeedback('report-feedback-collab', 'Por favor, descreva o problema encontrado.', 'info', 4000);
                        // Não desabilita botões aqui, espera submissão da descrição
                        return; // Interrompe aqui para este botão específico
                    }

                    // Para "Sim" ou "Não"
                    reportButtons.forEach(btn => setLoading(btn, true));
                    showFeedback('report-feedback-collab', 'Registrando sua contribuição...', 'info', 1500);
                    setTimeout(() => {
                        reportButtons.forEach(btn => setLoading(btn, false));
                        let pointsEarned = 0;
                        let activityText = '';
                        let activityIcon = '';
                        if (feedbackType === 'success') { showFeedback('report-feedback-collab', 'Obrigado! Reporte "Com Dinheiro" registrado.', 'success', 3000); pointsEarned = 5; activityText = 'Reportou "Com Dinheiro"'; activityIcon = 'ri-thumb-up-line success'; }
                        else { showFeedback('report-feedback-collab', 'Entendido. Reporte "Sem Dinheiro" registrado.', 'success', 3000); pointsEarned = 3; activityText = 'Reportou "Sem Dinheiro"'; activityIcon = 'ri-thumb-down-line error'; }
                        currentScore += pointsEarned;
                        updateGamification();
                        addActivity(activityIcon, activityText, pointsEarned);
                    }, 1200);
                });
            });

            // Botão para submeter descrição de "Outro Problema"
             if(btnSubmitIssue && issueDescription) {
                 btnSubmitIssue.addEventListener('click', () => {
                     const description = issueDescription.value.trim();
                     setLoading(btnSubmitIssue, true);
                     reportButtons.forEach(btn => btn.disabled = true); // Desabilita todos durante envio
                      showFeedback('report-feedback-collab', 'Enviando descrição do problema...', 'info', 1500);
                      setTimeout(() => {
                           setLoading(btnSubmitIssue, false);
                           reportButtons.forEach(btn => btn.disabled = false);
                           showFeedback('report-feedback-collab', 'Problema reportado com sucesso. Obrigado!', 'success', 3000);
                           const pointsEarned = description ? 2 : 1; // Mais pontos se descrever
                           currentScore += pointsEarned;
                           updateGamification();
                            addActivity('ri-alert-line warning', `Reportou "Outro Problema"${description ? ': ' + description.substring(0,20)+'...' : ''}`, pointsEarned);
                           if(otherIssueSection) otherIssueSection.style.display = 'none'; // Esconde seção
                           issueDescription.value = ''; // Limpa textarea
                      }, 1200);
                 });
             }
        }

    }; // Fim de initModals
    initModals();

    /*=============== 11. SMOOTH SCROLLING FOR ANCHOR LINKS ===============*/
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href && href.length > 1 && href.startsWith('#')) {
                    try {
                        const target = document.querySelector(href);
                        if (target) {
                            e.preventDefault();
                            const offset = (header?.offsetHeight || 70) + 10;
                            const pos = window.pageYOffset + target.getBoundingClientRect().top - offset;
                            window.scrollTo({ top: pos, behavior: "smooth" });
                            document.getElementById('nav-menu')?.classList.remove('show-menu');
                            document.getElementById('nav-toggle')?.setAttribute('aria-expanded', 'false');
                        }
                    } catch (err) { console.error("Smooth scroll error:", err); }
                }
            });
        });
        console.log("ATM na Mão: Smooth Scrolling Initialized.");
    };
    initSmoothScroll();

    /*=============== 12. UPDATE COPYRIGHT YEAR ===============*/
    const initFooterYear = () => { const el = document.getElementById('current-year'); if (el) { el.textContent = new Date().getFullYear(); console.log("ATM na Mão: Footer Year Updated."); } };
    initFooterYear();

    /*=============== 13. PRELOADER LOGIC ===============*/
    const initPreloader = () => {
        const body = document.body; const preloader = document.querySelector('.preloader');
        if (preloader && body.classList.contains('preload')) {
            window.addEventListener('load', () => {
                preloader.classList.add('loaded');
                const removeFn = () => { if(preloader.parentNode) preloader.remove(); body.classList.remove('preload'); console.log("Preloader Finished."); };
                preloader.addEventListener('transitionend', removeFn, { once: true }); setTimeout(() => { if (preloader.parentNode) removeFn(); }, 1000); // Fallback
            });
        } else { body.classList.remove('preload'); }
    };
    initPreloader();

    /*=============== FINAL MESSAGE ===============*/
    console.log("ATM na Mão: All Core Scripts Initialized Successfully.");

}); // End runWhenDOMLoaded
