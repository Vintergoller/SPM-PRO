document.addEventListener("DOMContentLoaded", () => {
    //Анимация свечения
    const bgGlow = document.getElementById("bgGlow");
    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;
    const speed = 0.07; // Коэффициент плавного догона мыши

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        if (window.innerWidth > 1024 && bgGlow) {
            ballX += (mouseX - ballX) * speed;
            ballY += (mouseY - ballY) * speed;

            // Вычитаем 400px (половину от нового размера 800px), чтобы курсор был строго в центре шара
            bgGlow.style.transform = `translate3d(${(ballX - 400)}px, ${(ballY - 400)}px, 0)`;
        }
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ
    const fadeElements = document.querySelectorAll(".fx-fade-up");
    const observerOptions = {
        threshold: 0.05, // Вылет начнется, как только покажется 5% карточки
        rootMargin: "0px 0px -20px 0px"
    };

    const appearanceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                appearanceObserver.unobserve(entry.target); // Чтобы анимация не дергалась повторно
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => appearanceObserver.observe(el));

    // Плавный скролл по ссылкам меню
    document.querySelectorAll('.nav-link, .btn').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});

// ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ ДЛЯ H1
const words = [
    "Монтаж кабельных лотков.",
    "Прокладка силового кабеля.",
    "Электромонтаж на заводах.",
    "Монтаж КИПиА, волоконно-оптической линии связи"
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById("typewriter");

function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        // Стирание букв
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Печать букв
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    // Определение скорости
    let typeSpeed = isDeleting ? 30 : 60; // Скорость стирания быстрее, чем печати

    // Если слово напечатано полностью
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Пауза в конце фразы, чтобы клиент успел прочитать (2 секунды)
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length; // Переход к следующему слову
        typeSpeed = 500; // Пауза перед началом печати нового слова
    }

    setTimeout(type, typeSpeed);
}

// Запуск эффекта после загрузки страницы
if (typewriterElement) {
    setTimeout(type, 1000);
}

// НАСТОЯЩАЯ ОТПРАВКА ФОРМЫ НА БЭКЕНД БЕЗ ПЕРЕЗАГРУЗКИ СТРАНИЦЫ
const form = document.getElementById("contactForm");

if (form) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Запрещаем стандартную перезагрузку страницы

        const button = form.querySelector("button[type='submit']");
        const originalButtonText = button.textContent;
        button.textContent = "Отправка ТЗ..."; // Меняем текст кнопки на время запроса
        button.disabled = true;

        const data = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Если бэкенд успешно принял письмо
                alert("✨ Проект успешно принят в работу! Наш главный инженер свяжется с вами в течение 30 минут для согласования сметы.");
                form.reset(); // Очищаем поля формы
            } else {
                alert("Ошибка сервера. Пожалуйста, свяжитесь с нами напрямую по email: info@spm-pro.ru");
            }
        } catch (error) {
            alert("Не удалось отправить заявку. Проверьте подключение к интернету.");
        } finally {
            // Возвращаем кнопку в исходное состояние
            button.textContent = originalButtonText;
            button.disabled = false;
        }
    });
}

// ЛОГИКА ОТКРЫТИЯ/ЗАКРЫТИЯ МОБИЛЬНОГО МЕНЮ
function toggleMenu() {
    // Работает только на экранах смартфонов и планшетов
    if (window.innerWidth <= 1024) {
        const burgerBtn = document.getElementById("burgerBtn");
        const navMenu = document.getElementById("navMenu");

        if (burgerBtn && navMenu) {
            burgerBtn.classList.toggle("active");
            navMenu.classList.toggle("active");

            // Блокируем прокрутку самого сайта на фоне, когда меню открыто
            if (navMenu.classList.contains("active")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "auto";
            }
        }
    }
}

//ЧАСТИЦЫ
// Ждем, пока браузер полностью построит HTML-дерево
document.addEventListener("DOMContentLoaded", () => {
    console.log("Скрипт интерактива SPM PRO запущен!");

    // 1. Интерактивное свечение за мышью
    document.addEventListener('mousemove', (e) => {
        // Глобальное свечение
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);

        // Свечение внутри блока Hero (ищем по классу, если ID отличается)
        const hero = document.getElementById('heroSection') || document.querySelector('.hero');
        if (hero) {
            const rect = hero.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            hero.style.setProperty('--hero-mouse-x', `${x}px`);
            hero.style.setProperty('--hero-mouse-y', `${y}px`);
        }
    });

    

        // АВТОМАТИЧЕСКОЕ ЗАЖИГАНИЕ ТОКЕНОВ ТАЙМЛАЙНА ПРИ СКРОЛЛЕ
    const missionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Добавляем класс, который подсветит точку ::after золотом
                entry.target.classList.add('activated');
            }
        });
    }, { 
        root: null,
        threshold: 0.25 // Точка загорится, когда четверть карточки покажется на экране
    });

    // Берем все ваши карточки миссии и подключаем слежение
    document.querySelectorAll('.mission-card').forEach(card => missionObserver.observe(card));


    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            // Вычисляем координаты мыши строго внутри кнопки
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            btn.style.setProperty('--btn-x', `${x}px`);
            btn.style.setProperty('--btn-y', `${y}px`);
        });
    });

    // 2. Система частиц на Canvas
    const canvas = document.getElementById('particleCanvas') || document.querySelector('canvas');
    const hero = document.getElementById('heroSection') || document.querySelector('.hero');

    if (canvas && hero) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        // Автоматически подгоняем холст под размеры родителя
        function resizeCanvas() {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Класс частицы
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height; // Случайное появление по всей высоте при старте
                this.size = Math.random() * 1.5 + 0.5;
                this.speedY = Math.random() * -0.6 - 0.2; // Движение вверх
                this.speedX = Math.random() * 0.4 - 0.2;
                this.opacity = Math.random() * 0.6 + 0.2;
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                // Если улетела за верхнюю границу — возрождаем снизу
                if (this.y < 0) {
                    this.y = canvas.height;
                    this.x = Math.random() * canvas.width;
                }
            }
            draw() {
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // Наш золотой цвет #d4af37
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Создаем 40 частиц
        for (let i = 0; i < 120; i++) {
            particles.push(new Particle());
        }

        // Цикл анимации
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    } else {
        console.warn("Внимание: Элементы #particleCanvas или .hero не найдены в HTML!");
    }
});

// 3D TILT ЭФФЕКТ ДЛЯ КАРТОЧЕК (Только для ПК-версии)
if (window.innerWidth > 1024) {
    // Собираем все типы карточек на сайте
    const cards = document.querySelectorAll('.stat-card, .service-card, .project-card, .comp-card, .sector-card, .mission-card');



    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();

            // Вычисляем координаты мыши внутри карточки (от 0 до ширины/высоты)
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Находим центр карточки
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Вычисляем угол наклона (максимум 10 градусов, чтобы наклон был элегантным)
            const rotateX = ((centerY - y) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * 10;

            // Применяем 3D-наклон
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Передаем координаты для глянцевого блика в CSS
            card.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
            card.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
        });

        // Когда мышка уходит с карточки — плавно возвращаем её в исходное состояние
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}
      // МЯГКОЕ ПРОЯВЛЕНИЕ ЗАГОЛОВКОВ ПРИ СКРОЛЛЕ
    const titleObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Срабатывает один раз для плавности
            }
        });
    }, { threshold: 0.1 }); // Срабатывает сразу, как только край заголовка показался

    document.querySelectorAll('.section-title').forEach(title => titleObserver.observe(title));
    // СЛЕЖЕНИЕ ЗА СЕТКАМИ КАРТОЧЕК
    const gridObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 }); // Срабатывает, как только показался верхний край сетки

    document.querySelectorAll('.competences-grid, .sectors-grid, .projects-grid').forEach(grid => gridObserver.observe(grid));

    // ОБНОВЛЕННАЯ ЛОГИКА С ПАСПОРТАМИ И МИНИ-ГАЛЕРЕЕЙ
function openProjectModal(element) {
    const modal = document.getElementById("projectModal");
    if (!modal) return;

    // Вытаскиваем b2b-данные из атрибутов карточки
    const title = element.getAttribute("data-title");
    const badge = element.getAttribute("data-badge");
    const volume = element.getAttribute("data-volume");
    const deadline = element.getAttribute("data-deadline");
    const security = element.getAttribute("data-security");
    const price = element.getAttribute("data-price");
    const address = element.getAttribute("data-address");
    const desc = element.getAttribute("data-desc");
    
    // Получаем массив картинок из строки через запятую
    const imagesAttr = element.getAttribute("data-images");
    const imagesArray = imagesAttr ? imagesAttr.split(",") : [];

    // Заполняем текстовые поля
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalBadge").textContent = badge;
    document.getElementById("modalSpecVolume").textContent = volume;
    document.getElementById("modalSpecDeadline").textContent = deadline;
    document.getElementById("modalSpecSecurity").textContent = security;
    document.getElementById("modalSpecPrice").textContent = price;
    document.getElementById("modalSpecAddress").textContent = address;
    document.getElementById("modalDesc").textContent = desc;

    // Настраиваем главную фотографию
    const mainImg = document.getElementById("modalImg");
    if (imagesArray.length > 0) {
        mainImg.setAttribute("src", imagesArray[0]);
    }

    // Очищаем и строим блок миниатюр (превью картинок)
    const thumbsContainer = document.getElementById("modalThumbs");
    thumbsContainer.innerHTML = "";

    imagesArray.forEach((src, index) => {
        const thumb = document.createElement("div");
        thumb.className = `thumb-item ${index === 0 ? "active" : ""}`;
        thumb.innerHTML = `<img src="${src}" alt="Превью ${index + 1}">`;
        
        // Клик по превью плавно меняет главное изображение
        thumb.addEventListener("click", () => {
            mainImg.setAttribute("src", src);
            // Меняем класс активности у превьюшек
            document.querySelectorAll(".thumb-item").forEach(t => t.classList.remove("active"));
            thumb.classList.add("active");
        });
        
        thumbsContainer.appendChild(thumb);
    });

    // Открываем окно
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeProjectModal() {
    const modal = document.getElementById("projectModal");
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
    }
}
