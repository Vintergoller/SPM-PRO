document.addEventListener("DOMContentLoaded", () => {
    
    // 1. ПЛАВНЫЙ СЛЕДУЮЩИЙ ПРОЖЕКТОР (С ЭФФЕКТОМ ИНЕРЦИИ)
    const bgGlow = document.getElementById("bgGlow");
    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;
    const speed = 0.08; // Скорость догона (чем меньше, тем плавнее инерция)

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        if (window.innerWidth > 1024 && bgGlow) {
            // Расчет плавного догона точки курсора
            ballX += (mouseX - ballX) * speed;
            ballY += (mouseY - ballY) * speed;
            
            bgGlow.style.left = ballX + "px";
            bgGlow.style.top = ballY + "px";
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
    "Электромонтаж на заводах."
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
    form.addEventListener("submit", async function(event) {
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

const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const mouse = { x: null, y: null, radius: 120 }; // Радиус отталкивания точек

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initParticles();
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseX = x; // Точка, куда частица всегда возвращается
            this.baseY = y;
            this.size = 1.5; // Размер золотой точки
            this.density = (Math.random() * 30) + 15; // Скорость возвращения на место
        }
        draw() {
            ctx.fillStyle = 'rgba(212, 175, 55, 0.45)'; // Благородный золотой цвет частиц
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.hypot(dx, dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            
            // Расчет силы отталкивания от курсора
            if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Плавное возвращение домой, если мышь далеко
                if (this.x !== this.baseX) {
                    let dxBase = this.x - this.baseX;
                    this.x -= dxBase / 10;
                }
                if (this.y !== this.baseY) {
                    let dyBase = this.y - this.baseY;
                    this.y -= dyBase / 10;
                }
            }
        }
    }

    function initParticles() {
        particles = [];
        // Создаем аккуратную сетку шагом в 45 пикселей
        const gap = 45; 
        for (let y = 0; y < canvas.height; y += gap) {
            for (let x = 0; x < canvas.width; x += gap) {
                particles.push(new Particle(x, y));
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
            particles[i].update();
        }
        requestAnimationFrame(animateParticles);
    }

    // Слежение за мышью именно внутри секции Hero
    const heroSec = document.getElementById('heroSection');
    if (heroSec) {
        heroSec.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        heroSec.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();
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