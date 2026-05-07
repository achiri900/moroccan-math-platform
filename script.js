/* ===========================
   MOROCCAN MATH PLATFORM - JAVASCRIPT
   =========================== */

// ===========================
// GLOBAL VARIABLES
// ===========================

let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let currentDifficulty = 'medium';
let lessons = {
    algebra: { title: 'الجبر', description: 'تعلم المعادلات والمتغيرات' },
    geometry: { title: 'الهندسة', description: 'استكشف الأشكال والزوايا' },
    trigonometry: { title: 'حساب المثلثات', description: 'الدوال المثلثية والموجات' },
    calculus: { title: 'حساب التفاضل والتكامل', description: 'الحدود والمشتقات' },
    statistics: { title: 'الإحصائيات', description: 'تحليل البيانات والاحتمالات' },
    linearalgebra: { title: 'الجبر الخطي', description: 'المصفوفات والمتجهات' }
};

const questions = {
    easy: [
        { question: 'احسب: 5 + 3 = ?', answers: [8, 7, 9, 6], correct: 0 },
        { question: 'احسب: 10 - 4 = ?', answers: [6, 7, 5, 8], correct: 0 },
        { question: 'احسب: 3 × 2 = ?', answers: [6, 5, 7, 4], correct: 0 },
        { question: 'احسب: 12 ÷ 3 = ?', answers: [4, 3, 5, 6], correct: 0 },
        { question: 'احسب: 2 × 5 = ?', answers: [10, 9, 11, 8], correct: 0 }
    ],
    medium: [
        { question: 'احسب: 25 + 37 = ?', answers: [62, 61, 63, 60], correct: 0 },
        { question: 'احسب: 100 - 45 = ?', answers: [55, 54, 56, 57], correct: 0 },
        { question: 'احسب: 12 × 5 = ?', answers: [60, 59, 61, 58], correct: 0 },
        { question: 'احسب: 144 ÷ 12 = ?', answers: [12, 11, 13, 10], correct: 0 },
        { question: 'احسب: 8² = ?', answers: [64, 63, 65, 62], correct: 0 },
        { question: 'احسب: √36 = ?', answers: [6, 5, 7, 8], correct: 0 },
        { question: 'احسب: 15% من 100 = ?', answers: [15, 14, 16, 20], correct: 0 },
        { question: 'احسب: 2³ = ?', answers: [8, 7, 9, 6], correct: 0 },
        { question: 'احسب: 50 × 2 = ?', answers: [100, 99, 101, 98], correct: 0 },
        { question: 'احسب: 99 + 1 = ?', answers: [100, 99, 101, 98], correct: 0 }
    ],
    hard: [
        { question: 'احسب: 256 ÷ 16 = ?', answers: [16, 15, 17, 14], correct: 0 },
        { question: 'احسب: √144 = ?', answers: [12, 11, 13, 10], correct: 0 },
        { question: 'احسب: 5³ = ?', answers: [125, 124, 126, 123], correct: 0 },
        { question: 'احسب: 45% من 200 = ?', answers: [90, 89, 91, 88], correct: 0 },
        { question: 'احسب: (10 + 5) × 2 = ?', answers: [30, 29, 31, 28], correct: 0 },
        { question: 'احسب: 3⁴ = ?', answers: [81, 80, 82, 79], correct: 0 },
        { question: 'احسب: 20% من 150 = ?', answers: [30, 29, 31, 28], correct: 0 },
        { question: 'احسب: (8 × 3) - 4 = ?', answers: [20, 19, 21, 18], correct: 0 },
        { question: 'احسب: √625 = ?', answers: [25, 24, 26, 23], correct: 0 },
        { question: 'احسب: 7² + 5² = ?', answers: [74, 73, 75, 72], correct: 0 }
    ]
};

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupMobileMenu();
    addScrollAnimations();
}

// ===========================
// EVENT LISTENERS
// ===========================

function setupEventListeners() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Smooth scroll for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const menu = document.getElementById('navMenu');
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        });
    });
}

// ===========================
// MOBILE MENU
// ===========================

function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    });
}

// ===========================
// LESSONS FUNCTIONALITY
// ===========================

function startLesson(lessonName) {
    const lesson = lessons[lessonName];
    if (lesson) {
        const modal = document.getElementById('lessonModal');
        document.getElementById('modalTitle').textContent = lesson.title;
        document.getElementById('modalDescription').textContent = lesson.description;
        modal.style.display = 'block';
    }
}

function closeLessonModal() {
    document.getElementById('lessonModal').style.display = 'none';
}

function startLessonContent() {
    closeLessonModal();
    showNotification('تم بدء الدرس! سيتم توجيهك إلى محتوى الدرس.');
}

// ===========================
// EXERCISES FUNCTIONALITY
// ===========================

function setDifficulty(level) {
    currentDifficulty = level;
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    updateExerciseUI();
    updateScoreBoard();

    // Update active button
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function updateExerciseUI() {
    const questionList = questions[currentDifficulty];
    if (questionList && currentQuestionIndex < questionList.length) {
        const question = questionList[currentQuestionIndex];
        document.getElementById('questionNum').textContent = currentQuestionIndex + 1;
        document.getElementById('questionText').textContent = question.question;

        const optionsContainer = document.querySelector('.answer-options');
        optionsContainer.innerHTML = '';

        question.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = answer;
            btn.onclick = function(e) {
                checkAnswer(e.target, question.answers[question.correct]);
            };
            optionsContainer.appendChild(btn);
        });

        // Reset button states
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('correct', 'incorrect');
        });
    }
}

function checkAnswer(element, correctAnswer) {
    const questionList = questions[currentDifficulty];
    const question = questionList[currentQuestionIndex];
    const selectedAnswer = parseInt(element.textContent);
    const isCorrect = selectedAnswer === correctAnswer;

    // Disable all buttons after answering
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
    });

    if (isCorrect) {
        element.classList.add('correct');
        score += 10;
        correctAnswers++;
        showNotification('✓ إجابة صحيحة!', 'success');
    } else {
        element.classList.add('incorrect');
        // Highlight correct answer
        document.querySelectorAll('.option-btn').forEach(btn => {
            if (parseInt(btn.textContent) === correctAnswer) {
                btn.classList.add('correct');
            }
        });
        showNotification('✗ إجابة خاطئة. الإجابة الصحيحة: ' + correctAnswer, 'error');
    }

    updateScoreBoard();
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions[currentDifficulty].length) {
        currentQuestionIndex = questions[currentDifficulty].length - 1;
        showNotification('لقد أكملت جميع الأسئلة!', 'success');
    } else {
        updateExerciseUI();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        updateExerciseUI();
    }
}

function updateScoreBoard() {
    document.getElementById('score').textContent = score;
    document.getElementById('correct').textContent = correctAnswers;
    
    const totalAnswered = currentQuestionIndex + 1;
    const successRate = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
    document.getElementById('successRate').textContent = successRate + '%';
}

// ===========================
// CONTACT FORM
// ===========================

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    const isValid = Array.from(formInputs).every(input => input.value.trim() !== '');
    
    if (isValid) {
        showNotification('تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا.', 'success');
        e.target.reset();
    } else {
        showNotification('يرجى ملء جميع الحقول.', 'error');
    }
}

// ===========================
// NOTIFICATIONS
// ===========================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===========================
// SCROLL ANIMATIONS
// ===========================

function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.lesson-card, .dashboard-card').forEach(element => {
        observer.observe(element);
    });
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function smoothScroll(targetId) {
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('lessonModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Add keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.getElementById('lessonModal').style.display = 'none';
    }
});

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }

    .notification {
        word-wrap: break-word;
        word-break: break-word;
    }
`;
document.head.appendChild(style);

// ===========================
// INTERACTIVE FEATURES
// ===========================

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.lesson-card, .dashboard-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Initialize first question
    updateExerciseUI();
});

// Prevent multiple rapid submissions
let isSubmitting = false;

function handleContactSubmitWithThrottle(e) {
    if (isSubmitting) return;
    isSubmitting = true;
    
    handleContactSubmit(e);
    
    setTimeout(() => {
        isSubmitting = false;
    }, 1000);
}

// ===========================
// PERFORMANCE OPTIMIZATION
// ===========================

// Lazy load images if needed
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// Add console log for debugging
console.log('Moroccan Math Platform Loaded Successfully! 🎓');
console.log('Version: 1.0.0');
console.log('Language: العربية (Arabic) | التصميم المغربي (Moroccan Design)');
