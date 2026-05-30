/* ============================================
   NeoPixel.ai — Scripts
   ============================================ */

(function () {
    'use strict';

    /* ---------- Year ---------- */
    document.getElementById('year').textContent = new Date().getFullYear();

    /* ---------- Header scroll ---------- */
    const header = document.getElementById('header');
    const onScroll = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Burger / Mobile menu ---------- */
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    burger.addEventListener('click', () => {
        burger.classList.toggle('is-open');
        nav.classList.toggle('is-open');
    });
    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('is-open');
            nav.classList.remove('is-open');
        });
    });

    /* ---------- Reveal on scroll ---------- */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        reveals.forEach(el => io.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('is-visible'));
    }

    /* ---------- Gallery filters ---------- */
    const filters = document.querySelectorAll('.filter');
    const galleryItems = document.querySelectorAll('.gallery__item');
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('is-active'));
            filter.classList.add('is-active');
            const category = filter.dataset.filter;
            galleryItems.forEach(item => {
                const match = category === 'all' || item.dataset.category === category;
                item.classList.toggle('is-hidden', !match);
            });
        });
    });

    /* ---------- Before / After slider ---------- */
    const ba = document.getElementById('ba');
    const baBefore = document.getElementById('baBefore');
    const baHandle = document.getElementById('baHandle');

    if (ba && baBefore && baHandle) {
        let isDragging = false;

        const setPos = (clientX) => {
            const rect = ba.getBoundingClientRect();
            let pct = ((clientX - rect.left) / rect.width) * 100;
            pct = Math.max(0, Math.min(100, pct));
            baBefore.style.width = pct + '%';
            baHandle.style.left = pct + '%';
        };

        const startDrag = (e) => {
            isDragging = true;
            ba.style.cursor = 'grabbing';
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            setPos(x);
        };

        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            setPos(x);
        };

        const endDrag = () => {
            isDragging = false;
            ba.style.cursor = 'ew-resize';
        };

        ba.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', endDrag);

        ba.addEventListener('touchstart', startDrag, { passive: true });
        window.addEventListener('touchmove', drag, { passive: false });
        window.addEventListener('touchend', endDrag);

        // Demo auto-animation on first reveal
        const baAnimIo = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    let pct = 50;
                    let dir = 1;
                    let steps = 0;
                    const interval = setInterval(() => {
                        pct += dir * 1.2;
                        if (pct > 72) dir = -1;
                        if (pct < 28) dir = 1;
                        baBefore.style.width = pct + '%';
                        baHandle.style.left = pct + '%';
                        steps++;
                        if (steps > 80) {
                            clearInterval(interval);
                            baBefore.style.width = '50%';
                            baHandle.style.left = '50%';
                        }
                    }, 25);
                    baAnimIo.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        baAnimIo.observe(ba);
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.faq__item').forEach(item => {
        const btn = item.querySelector('.faq__q');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');
            document.querySelectorAll('.faq__item.is-open').forEach(other => {
                if (other !== item) other.classList.remove('is-open');
            });
            item.classList.toggle('is-open', !isOpen);
        });
    });

    /* ---------- Form submit → Google Sheets ---------- */
    const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzfSxuL3RMwVHwMvOW5b4qj0XJ_SDEGMDDJlqyNLVYQQSzTGH4Bp4fg7aMPrAjVYLsl/exec';

    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    if (form && formSuccess) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const data = new FormData(form);
            const payload = Object.fromEntries(data.entries());
            const submitBtn = form.querySelector('button[type="submit"]');

            // disable button while sending
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
                submitBtn.style.cursor = 'wait';
            }

            // text/plain avoids CORS preflight; Apps Script reads e.postData.contents
            fetch(GOOGLE_SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            })
            .catch(err => console.error('Form submission error:', err))
            .finally(() => {
                formSuccess.classList.add('is-active');
                form.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '';
                    submitBtn.style.cursor = '';
                }
                setTimeout(() => {
                    formSuccess.classList.remove('is-active');
                }, 4500);
            });
        });
    }

    /* ---------- Language switching ---------- */
    const translations = {
        kk: {
            meta_description: 'NeoPixel AI — жасанды интеллект арқылы кәсіби фото мен видео. AI портреттер, тауар фотолары, жарнамалық видеолар.',
            nav_services: 'Қызметтер',
            nav_works: 'Жұмыстар',
            nav_cases: 'Кейстер',
            nav_pricing: 'Бағалар',
            nav_faq: 'FAQ',
            nav_contact: 'Байланыс',
            cta_order: 'Тапсырыс беру',
            cta_works: 'Жұмыстарды көру',

            hero_title: 'Жасанды интеллект арқылы <span class="text-gradient">кәсіби фото мен видео</span> — бірнеше минутта',
            hero_subtitle: 'Аватар, портрет, тауар фотосы немесе жарнамалық видео — қымбат фотосессиясыз, тез әрі сапалы.',
            stat_projects: 'жоба жасалды',
            stat_satisfaction: 'клиент көңілінен шықты',
            stat_time: 'орташа дайындау мерзімі',

            services_pill: 'Қызметтер',
            services_title: 'Сізге не керек — <span class="text-gradient">бәрін жасаймыз</span>',
            services_subtitle: 'Үш бағыт. Бір студия. Шексіз идея.',
            srv1_title: 'AI Портреттер мен аватарлар',
            srv1_text: 'Бір селфиден ондаған кәсіби портрет. Әлеуметтік желіге, резюмеге немесе жай эстетика үшін.',
            srv1_li1: '30+ стильдегі портреттер',
            srv1_li2: 'LinkedIn және CV форматтары',
            srv1_li3: 'Жоғары рұқсаттылық (4K)',
            srv2_title: 'Тауар фотолары',
            srv2_text: 'Тауарыңызды студиялық деңгейде көрсетіңіз. Дүкенге, маркетплейске және жарнамаға дайын суреттер.',
            srv2_li1: 'Kaspi, Wildberries форматтары',
            srv2_li2: 'Фон ауыстыру және ретуш',
            srv2_li3: 'Lifestyle композициялар',
            srv3_title: 'AI Видео және жарнама',
            srv3_text: 'Брендіңізге арналған динамикалық видео-роликтер. Reels, TikTok және жарнама үшін.',
            srv3_li1: 'Reels және Shorts (9:16)',
            srv3_li2: 'Жарнамалық роликтер',
            srv3_li3: 'Музыка және титрлер',
            more: 'Толығырақ',
            popular: 'Танымал',

            portfolio_pill: 'Жұмыстар',
            portfolio_title: 'Сөзден гөрі — <span class="text-gradient">нәтижеге қарасаңыз</span>',
            portfolio_subtitle: 'Соңғы клиенттердің жұмыстарынан таңдау.',
            cases_pill: 'Кейстер',
            cases_title: 'Нақты <span class="text-gradient">нәтижелер</span>',
            cases_subtitle: 'Біз жұмыс істеген брендтер мен олардың аудиториясы.',
            cases_followers: 'жазылушы',
            cases_reels: 'AI ролик',
            case1_desc: 'Құрт · ірімшік · май бренді',
            case2_desc: 'Балаларға арналған витаминдер',
            case3_desc: 'Жеке бренд · фотосессия',
            case4_name: 'AI видеолар',
            case4_desc: 'Жарнамалық қысқа роликтер',
            filter_all: 'Барлығы',
            filter_portrait: 'Портреттер',
            filter_product: 'Тауарлар',
            filter_video: 'Видео',
            cat_portrait: 'Портрет',
            cat_product: 'Тауар',
            cat_video: 'Видео',
            ba_title: 'Before / After — қалай өзгеретінін көріңіз',
            ba_subtitle: 'Слайдерді солға-оңға жылжытыңыз',
            before: 'BEFORE',
            after: 'AFTER',

            how_pill: 'Қалай жұмыс істейді',
            how_title: '<span class="text-gradient">4 қарапайым</span> қадам',
            step1_title: 'Тапсырыс қалдырасыз',
            step1_text: 'Қандай қызмет керегін жазасыз — мысалы аватар, тауар фотосы немесе видео.',
            step2_title: 'Материал бересіз',
            step2_text: 'Фото/тауар жіберіп, қалауыңыз бен референстерді айтасыз.',
            step3_title: 'Біз жасаймыз',
            step3_text: 'AI + кәсіби өңдеу. Сапаны қолмен тексереміз.',
            step4_title: 'Дайын нәтиже',
            step4_text: 'Қысқа мерзімде қолыңызда. Қаласаңыз — түзетулер жасаймыз.',

            why_pill: 'Артықшылықтар',
            why_title: 'Неге <span class="text-gradient">NeoPixel.ai?</span>',
            f1_title: 'Жылдам',
            f1_text: 'Нәтиже бірнеше сағат немесе күн ішінде. Күтуге уақыт жоқ.',
            f2_title: 'Қолжетімді',
            f2_text: 'Қымбат студиядан 5-10 есе арзан. Сапасы — кем емес.',
            f3_title: 'Әрі жеке, әрі бизнеске',
            f3_text: 'Бір аватардан бастап, толық бренд-контентке дейін.',
            f4_title: 'Тегін түзетулер',
            f4_text: 'Нәтижеге көңіліңіз толмаса — қайта жасаймыз.',
            f5_title: 'Құпиялылық',
            f5_text: 'Сіздің фотоларыңыз сізде ғана қалады. Үшінші тұлғаларға бермейміз.',
            f6_title: 'Шексіз стиль',
            f6_text: 'Кез келген стиль, кез келген фон. Тек қиялыңыздың шегі.',

            pricing_pill: 'Бағалар',
            pricing_title: 'Әр бюджетке — <span class="text-gradient">өз тарифі</span>',
            pricing_subtitle: 'Барлық тарифтерде — жоғары сапа және тегін кеңес.',
            plan1_name: 'Бастапқы',
            plan1_desc: 'Жеке тұлғаларға қарапайым старт',
            plan1_f1: '10 AI портрет',
            plan1_f2: '3 стиль',
            plan1_f3: 'HD сапасы',
            plan1_f4: '1 түзету',
            plan1_f5: '2-3 күн ішінде',
            plan_popular: '⭐ Танымал',
            plan2_name: 'Стандарт',
            plan2_desc: 'Көп контент керек болғанда',
            plan2_f1: '30 AI портрет немесе 15 тауар фотосы',
            plan2_f2: '10 стиль / фон',
            plan2_f3: '4K сапасы',
            plan2_f4: '3 түзету',
            plan2_f5: '1-2 күн ішінде',
            plan2_f6: 'Жедел қолдау',
            plan3_name: 'Бизнес',
            plan3_price: 'Жеке',
            plan3_desc: 'Брендтер мен компанияларға',
            plan3_f1: 'Шектеусіз контент',
            plan3_f2: 'AI видео + фото пакеті',
            plan3_f3: 'Бренд-стиль әзірлеу',
            plan3_f4: 'Шектеусіз түзетулер',
            plan3_f5: 'Жеке менеджер',
            plan3_f6: 'Айлық серіктестік',
            plan_choose: 'Таңдау',
            plan_request: 'Бағаны сұрау',

            rev_pill: 'Пікірлер',
            rev_title: 'Клиенттер <span class="text-gradient">не дейді</span>',
            rev1_text: '«Аватарларым керемет шықты! Фотосессияға бармай-ақ LinkedIn-ге салатын 20-дан астам сурет алдым. Бағасы да өте тиімді.»',
            rev1_name: 'Айгерім Қ.',
            rev1_role: 'Маркетолог · Алматы',
            rev2_text: '«Kaspi-ге арналған тауар фотолары студиялық деңгейде. Конверсия 2 есе өсті. Жыл бойы серіктестік ұстаймыз.»',
            rev2_name: 'Дәурен М.',
            rev2_role: 'Дүкен иесі · Астана',
            rev3_text: '«Reels үшін жасаған видеоларыңыз TikTok-та виралге шықты. Жұмысыңыз жылдам, сапасы керемет. Рахмет!»',
            rev3_name: 'Динара Б.',
            rev3_role: 'Контент-криэйтор',

            faq_pill: 'Жиі қойылатын сұрақтар',
            faq_title: 'Барлық сұрағыңызға — <span class="text-gradient">жауап</span>',
            faq1_q: 'AI фото мен видео нақты қалай жасалады?',
            faq1_a: 'Біз ең жаңа AI-модельдерді (Midjourney, Stable Diffusion, Runway, Sora т.б.) қолдана отырып, сіздің материалыңызды кәсіби өңдеуден өткіземіз. Соңында әр сурет/видео сапасын маман қолмен тексереді — нәтиже студиялық деңгейде болады.',
            faq2_q: 'Қанша уақыт ішінде дайын болады?',
            faq2_a: 'Тапсырыс түріне байланысты: AI портреттер — 1-3 күн, тауар фотолары — 1-2 күн, AI видео — 3-7 күн. Жедел тапсырыс (қосымша ақыға) — 24 сағат ішінде.',
            faq3_q: 'Маған не жіберу керек?',
            faq3_a: 'Портреттерге — 10-20 жақсы сапалы селфи (әртүрлі ракурс, жарық). Тауар фотосына — тауардың 3-5 суреті немесе өзін. Видеоға — идея/сценарий мен референс. Жоқ болса — біз ұсыныс беруге дайынбыз!',
            faq4_q: 'Нәтиже көңіліме толмаса не болады?',
            faq4_a: 'Барлық тарифте тегін түзетулер бар. Егер нәтиже мүлдем сай келмесе — қайта жасап береміз немесе ақшаңызды қайтарамыз. Бұл біздің сапа кепілдігіміз.',
            faq5_q: 'Қалай төлеуге болады?',
            faq5_a: 'Kaspi Pay, Halyk, банк аударымы немесе қолма-қол. Бизнес клиенттерге — шот-фактура. Бастапқыда — 50% алдын ала, қалғаны нәтиже бойынша.',
            faq6_q: 'Менің фотоларым қауіпсіз бе?',
            faq6_a: 'Иә, толықтай. Сіздің материалдарыңыз ешқашан үшінші тұлғаларға берілмейді, реклама үшін қолданылмайды. Тапсырыс аяқталған соң — қаласаңыз, файлдарды серверден өшіреміз.',

            contact_pill: 'Байланыс',
            contact_title: 'Идеяңызды <span class="text-gradient">шындыққа</span> айналдырайық',
            contact_text: 'Сұрағыңыз бар ма? Жазыңыз — 10 минут ішінде жауап береміз.',
            form_title: 'Тегін кеңес алу',
            form_name: 'Атыңыз',
            form_name_ph: 'Сіздің атыңыз',
            form_phone: 'Телефон / WhatsApp',
            form_service: 'Қандай қызмет керек?',
            form_choose: 'Таңдаңыз...',
            form_opt1: 'AI портрет / аватар',
            form_opt2: 'Тауар фотолары',
            form_opt3: 'AI видео / жарнама',
            form_opt4: 'Басқа',
            form_message: 'Хабарлама',
            form_message_ph: 'Қысқаша жазыңыз...',
            form_submit: 'Жіберу',
            form_note: '📞 10 минут ішінде жауап береміз',
            form_success: 'Сұранысыңыз қабылданды! Жақын арада хабарласамыз.',

            footer_desc: 'Жасанды интеллект арқылы кәсіби фото мен видео. Сіздің брендіңізге арналған студия.',
            footer_menu: 'Меню',
            footer_contact: 'Байланыс',
            footer_rights: 'Барлық құқықтар қорғалған',
            footer_made: 'Made with ⚡ in Kazakhstan',
        },
        ru: {
            meta_description: 'NeoPixel AI — профессиональные фото и видео с помощью ИИ. AI-портреты, товарные фото, рекламные ролики.',
            nav_services: 'Услуги',
            nav_works: 'Работы',
            nav_cases: 'Кейсы',
            nav_pricing: 'Цены',
            nav_faq: 'FAQ',
            nav_contact: 'Контакты',
            cta_order: 'Заказать',
            cta_works: 'Смотреть работы',

            hero_title: 'Профессиональные <span class="text-gradient">фото и видео с ИИ</span> — за несколько минут',
            hero_subtitle: 'Аватар, портрет, фото товара или рекламный ролик — без дорогой фотосессии, быстро и качественно.',
            stat_projects: 'проектов сделано',
            stat_satisfaction: 'довольных клиентов',
            stat_time: 'средний срок',

            services_pill: 'Услуги',
            services_title: 'Что нужно — <span class="text-gradient">всё сделаем</span>',
            services_subtitle: 'Три направления. Одна студия. Бесконечные идеи.',
            srv1_title: 'AI-портреты и аватары',
            srv1_text: 'Из одного селфи — десятки профессиональных портретов. Для соцсетей, резюме или просто эстетики.',
            srv1_li1: 'Портреты в 30+ стилях',
            srv1_li2: 'Форматы LinkedIn и CV',
            srv1_li3: 'Высокое разрешение (4K)',
            srv2_title: 'Фото товаров',
            srv2_text: 'Покажите товар на студийном уровне. Готовые фото для магазинов, маркетплейсов и рекламы.',
            srv2_li1: 'Форматы Kaspi, Wildberries',
            srv2_li2: 'Замена фона и ретушь',
            srv2_li3: 'Lifestyle-композиции',
            srv3_title: 'AI-видео и реклама',
            srv3_text: 'Динамичные видеоролики для вашего бренда. Для Reels, TikTok и рекламы.',
            srv3_li1: 'Reels и Shorts (9:16)',
            srv3_li2: 'Рекламные ролики',
            srv3_li3: 'Музыка и титры',
            more: 'Подробнее',
            popular: 'Популярно',

            portfolio_pill: 'Работы',
            portfolio_title: 'Лучше слов — <span class="text-gradient">смотрите результат</span>',
            portfolio_subtitle: 'Подборка из работ последних клиентов.',
            cases_pill: 'Кейсы',
            cases_title: 'Реальные <span class="text-gradient">результаты</span>',
            cases_subtitle: 'Бренды, с которыми мы работали, и их аудитория.',
            cases_followers: 'подписчиков',
            cases_reels: 'AI ролик',
            case1_desc: 'Бренд курта · сыра · масла',
            case2_desc: 'Детские витамины',
            case3_desc: 'Личный бренд · фотосессия',
            case4_name: 'AI видео',
            case4_desc: 'Рекламные короткие ролики',
            filter_all: 'Все',
            filter_portrait: 'Портреты',
            filter_product: 'Товары',
            filter_video: 'Видео',
            cat_portrait: 'Портрет',
            cat_product: 'Товар',
            cat_video: 'Видео',
            ba_title: 'Before / After — посмотрите как меняется',
            ba_subtitle: 'Двигайте слайдер влево-вправо',
            before: 'BEFORE',
            after: 'AFTER',

            how_pill: 'Как это работает',
            how_title: '<span class="text-gradient">4 простых</span> шага',
            step1_title: 'Оставляете заявку',
            step1_text: 'Пишете какая услуга нужна — аватар, фото товара или видео.',
            step2_title: 'Даёте материал',
            step2_text: 'Присылаете фото/товар и говорите ваши пожелания и референсы.',
            step3_title: 'Мы делаем',
            step3_text: 'AI + профессиональная обработка. Контролируем качество вручную.',
            step4_title: 'Готовый результат',
            step4_text: 'В короткие сроки у вас на руках. По желанию — правки.',

            why_pill: 'Преимущества',
            why_title: 'Почему <span class="text-gradient">NeoPixel.ai?</span>',
            f1_title: 'Быстро',
            f1_text: 'Результат за несколько часов или дней. Времени ждать нет.',
            f2_title: 'Доступно',
            f2_text: 'В 5-10 раз дешевле дорогой студии. Качество — не хуже.',
            f3_title: 'И для себя, и для бизнеса',
            f3_text: 'От одного аватара до полноценного бренд-контента.',
            f4_title: 'Бесплатные правки',
            f4_text: 'Не понравился результат — переделаем.',
            f5_title: 'Конфиденциальность',
            f5_text: 'Ваши фото остаются только у вас. Третьим лицам не передаём.',
            f6_title: 'Любой стиль',
            f6_text: 'Любой стиль, любой фон. Ограничено только фантазией.',

            pricing_pill: 'Цены',
            pricing_title: 'Под каждый бюджет — <span class="text-gradient">свой тариф</span>',
            pricing_subtitle: 'Во всех тарифах — высокое качество и бесплатная консультация.',
            plan1_name: 'Старт',
            plan1_desc: 'Простой старт для частных лиц',
            plan1_f1: '10 AI-портретов',
            plan1_f2: '3 стиля',
            plan1_f3: 'HD качество',
            plan1_f4: '1 правка',
            plan1_f5: 'За 2-3 дня',
            plan_popular: '⭐ Популярно',
            plan2_name: 'Стандарт',
            plan2_desc: 'Когда нужно много контента',
            plan2_f1: '30 AI-портретов или 15 фото товаров',
            plan2_f2: '10 стилей / фонов',
            plan2_f3: '4K качество',
            plan2_f4: '3 правки',
            plan2_f5: 'За 1-2 дня',
            plan2_f6: 'Срочная поддержка',
            plan3_name: 'Бизнес',
            plan3_price: 'Инд.',
            plan3_desc: 'Для брендов и компаний',
            plan3_f1: 'Без лимита контента',
            plan3_f2: 'AI видео + фото пакет',
            plan3_f3: 'Разработка бренд-стиля',
            plan3_f4: 'Безлимитные правки',
            plan3_f5: 'Личный менеджер',
            plan3_f6: 'Ежемесячное сотрудничество',
            plan_choose: 'Выбрать',
            plan_request: 'Узнать цену',

            rev_pill: 'Отзывы',
            rev_title: 'Что говорят <span class="text-gradient">клиенты</span>',
            rev1_text: '«Аватары получились шикарные! Без фотосессии получила больше 20 фото для LinkedIn. Цена очень выгодная.»',
            rev1_name: 'Айгерим К.',
            rev1_role: 'Маркетолог · Алматы',
            rev2_text: '«Фото товаров для Kaspi на студийном уровне. Конверсия выросла в 2 раза. Сотрудничаем уже год.»',
            rev2_name: 'Даурен М.',
            rev2_role: 'Владелец магазина · Астана',
            rev3_text: '«Видео для Reels стали виральными в TikTok. Работаете быстро, качество отличное. Спасибо!»',
            rev3_name: 'Динара Б.',
            rev3_role: 'Контент-креатор',

            faq_pill: 'Частые вопросы',
            faq_title: 'Ответы на все ваши <span class="text-gradient">вопросы</span>',
            faq1_q: 'Как именно делаются AI фото и видео?',
            faq1_a: 'Мы используем самые новые AI-модели (Midjourney, Stable Diffusion, Runway, Sora и др.) и пропускаем ваш материал через профессиональную обработку. В конце каждое фото/видео проверяется специалистом вручную — результат на студийном уровне.',
            faq2_q: 'За какое время будет готово?',
            faq2_a: 'Зависит от типа заказа: AI-портреты — 1-3 дня, фото товаров — 1-2 дня, AI-видео — 3-7 дней. Срочный заказ (с доплатой) — за 24 часа.',
            faq3_q: 'Что мне нужно прислать?',
            faq3_a: 'Для портретов — 10-20 качественных селфи (разные ракурсы, освещение). Для фото товара — 3-5 фото товара или сам товар. Для видео — идею/сценарий и референс. Если нет — мы готовы предложить!',
            faq4_q: 'А если результат мне не понравится?',
            faq4_a: 'Во всех тарифах есть бесплатные правки. Если результат совсем не подойдёт — переделаем или вернём деньги. Это наша гарантия качества.',
            faq5_q: 'Как можно оплатить?',
            faq5_a: 'Kaspi Pay, Halyk, банковский перевод или наличные. Для бизнес-клиентов — счёт-фактура. Изначально — 50% предоплата, остальное по результату.',
            faq6_q: 'Безопасны ли мои фото?',
            faq6_a: 'Да, полностью. Ваши материалы никогда не передаются третьим лицам, не используются для рекламы. По завершении заказа — по желанию удалим файлы с сервера.',

            contact_pill: 'Контакты',
            contact_title: 'Превратим вашу идею <span class="text-gradient">в реальность</span>',
            contact_text: 'Есть вопрос? Напишите — ответим в течение 10 минут.',
            form_title: 'Бесплатная консультация',
            form_name: 'Имя',
            form_name_ph: 'Ваше имя',
            form_phone: 'Телефон / WhatsApp',
            form_service: 'Какая услуга нужна?',
            form_choose: 'Выберите...',
            form_opt1: 'AI-портрет / аватар',
            form_opt2: 'Фото товаров',
            form_opt3: 'AI-видео / реклама',
            form_opt4: 'Другое',
            form_message: 'Сообщение',
            form_message_ph: 'Кратко опишите...',
            form_submit: 'Отправить',
            form_note: '📞 Ответим в течение 10 минут',
            form_success: 'Заявка принята! Скоро с вами свяжемся.',

            footer_desc: 'Профессиональные фото и видео с ИИ. Студия для вашего бренда.',
            footer_menu: 'Меню',
            footer_contact: 'Контакты',
            footer_rights: 'Все права защищены',
            footer_made: 'Made with ⚡ in Kazakhstan',
        }
    };

    const applyLang = (lang) => {
        const dict = translations[lang];
        if (!dict) return;

        document.documentElement.lang = lang === 'kk' ? 'kk' : 'ru';

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (dict[key] !== undefined) {
                el.innerHTML = dict[key];
            }
        });

        // attribute-based translations (e.g., placeholders)
        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            const parts = el.dataset.i18nAttr.split('|');
            const attr = parts[0];
            const key = parts[1];
            if (dict[key] !== undefined) {
                el.setAttribute(attr, dict[key]);
            }
        });

        // Meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && dict.meta_description) {
            metaDesc.setAttribute('content', dict.meta_description);
        }

        // Update lang switch buttons
        document.querySelectorAll('.lang-switch__btn').forEach(btn => {
            btn.classList.toggle('is-active', btn.dataset.lang === lang);
        });

        try { localStorage.setItem('np_lang', lang); } catch (e) {}
    };

    document.querySelectorAll('.lang-switch__btn').forEach(btn => {
        btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });

    // Restore previous language
    try {
        const saved = localStorage.getItem('np_lang');
        if (saved && translations[saved]) applyLang(saved);
    } catch (e) {}

    /* ---------- Smooth anchor offset (small) ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offset = 72;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

})();
