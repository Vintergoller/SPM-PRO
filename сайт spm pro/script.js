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
