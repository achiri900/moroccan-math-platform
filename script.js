import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// ===========================
// AUTHENTICATION
// ===========================

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    console.log("Utilisateur connecté :", user.email);
  }
});

window.logout = async function () {
  await signOut(auth);
  window.location.href = "login.html";
};

// ===========================
// STATE MANAGEMENT
// ===========================

let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let currentDifficulty = 'medium';
let isSubmitting = false;

const lessons = {
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
  addCardHoverEffects();
  setupExercises();
  addAnimationStyles();
}

// ===========================
// EVENT LISTENERS
// ===========================

function setupEventListeners() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmitWithThrottle);
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
      const menu = document.getElementById('navMenu');
      if (menu?.classList.contains('active')) {
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
      navMenu?.classList.toggle('active');
    });
  }

  document.addEventListener('click', function(event) {
    const navbar = event.target.closest('.navbar');
    if (!navbar) {
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
  if (!lesson) {
    console.warn(`Lesson "${lessonName}" not found`);
    return;
  }

  const modal = document.getElementById('lessonModal');
  if (!modal) {
    console.error('Lesson modal not found');
    return;
  }

  const title = document.getElementById('modalTitle');
  const description = document.getElementById('modalDescription');
  
  if (title) title.textContent = lesson.title;
  if (description) description.textContent = lesson.description;
  
  modal.style.display = 'block';
}

function closeLessonModal() {
  const modal = document.getElementById('lessonModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function startLessonContent() {
  closeLessonModal();
  showNotification('تم بدء الدرس! سيتم توجيهك إلى محتوى الدرس.', 'success');
}

// ===========================
// EXERCISES FUNCTIONALITY
// ===========================

function setDifficulty(level, event) {
  currentDifficulty = level;
  currentQuestionIndex = 0;
  score = 0;
  correctAnswers = 0;

  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  if (event && event.target) {
    event.target.classList.add('active');
  }

  updateExerciseUI();
  updateScoreBoard();
}

function setupExercises() {
  // Initialize first question
  updateExerciseUI();
}

function updateExerciseUI() {
  const questionList = questions[currentDifficulty];
  
  if (!questionList || currentQuestionIndex >= questionList.length) {
    return;
  }

  const question = questionList[currentQuestionIndex];
  const questionNumEl = document.getElementById('questionNum');
  const questionTextEl = document.getElementById('questionText');
  const optionsContainer = document.querySelector('.answer-options');

  if (questionNumEl) questionNumEl.textContent = currentQuestionIndex + 1;
  if (questionTextEl) questionTextEl.textContent = question.question;

  if (!optionsContainer) {
    console.error('Options container not found');
    return;
  }

  optionsContainer.innerHTML = '';

  question.answers.forEach((answer, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = answer;
    btn.dataset.index = index;
    btn.onclick = function(e) {
      e.preventDefault();
      checkAnswer(index, question.correct);
    };
    optionsContainer.appendChild(btn);
  });
}

function checkAnswer(selectedIndex, correctIndex) {
  // Disable all buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
  });

  const allButtons = document.querySelectorAll('.option-btn');
  const selectedBtn = allButtons[selectedIndex];
  const correctBtn = allButtons[correctIndex];
  const isCorrect = selectedIndex === correctIndex;

  if (isCorrect) {
    selectedBtn?.classList.add('correct');
    score += 10;
    correctAnswers++;
    showNotification('✓ إجابة صحيحة!', 'success');
  } else {
    selectedBtn?.classList.add('incorrect');
    correctBtn?.classList.add('correct');
    showNotification(`✗ إجابة خاطئة. الإجابة الصحيحة: ${questions[currentDifficulty][currentQuestionIndex].answers[correctIndex]}`, 'error');
  }

  updateScoreBoard();
}

function nextQuestion() {
  const maxQuestions = questions[currentDifficulty].length;
  
  if (currentQuestionIndex < maxQuestions - 1) {
    currentQuestionIndex++;
    updateExerciseUI();
  } else {
    showNotification('لقد أكملت جميع الأسئلة!', 'success');
  }
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    updateExerciseUI();
  }
}

function updateScoreBoard() {
  const scoreEl = document.getElementById('score');
  const correctEl = document.getElementById('correct');
  const successRateEl = document.getElementById('successRate');

  if (scoreEl) scoreEl.textContent = score;
  if (correctEl) correctEl.textContent = correctAnswers;
  
  if (successRateEl) {
    const totalAnswered = currentQuestionIndex + 1;
    const successRate = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
    successRateEl.textContent = successRate + '%';
  }
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
    const form = e.target;
    if (form && typeof form.reset === 'function') {
      form.reset();
    }
  } else {
    showNotification('يرجى ملء جميع الحقول.', 'error');
  }
}

function handleContactSubmitWithThrottle(e) {
  if (isSubmitting) return;
  isSubmitting = true;
  
  handleContactSubmit(e);
  
  setTimeout(() => {
    isSubmitting = false;
  }, 1000);
}

// ===========================
// NOTIFICATIONS
// ===========================

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  const bgColors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6'
  };

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${bgColors[type] || bgColors.info};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    font-weight: 600;
    animation: slideInRight 0.3s ease-out;
    max-width: 400px;
  `;
  
  document.body.appendChild(notification);
  
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

  const observer = new IntersectionObserver((entries) => {
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

function addCardHoverEffects() {
  document.querySelectorAll('.lesson-card, .dashboard-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// ===========================
// ANIMATION STYLES
// ===========================

function addAnimationStyles() {
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

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .notification {
      word-wrap: break-word;
      word-break: break-word;
    }

    .option-btn {
      transition: all 0.3s ease;
    }

    .option-btn.correct {
      background-color: #10b981 !important;
      color: white !important;
    }

    .option-btn.incorrect {
      background-color: #ef4444 !important;
      color: white !important;
    }
  `;
  document.head.appendChild(style);
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

// ===========================
// MODAL MANAGEMENT
// ===========================

window.addEventListener('click', function(event) {
  const modal = document.getElementById('lessonModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modal = document.getElementById('lessonModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
});

// ===========================
// LAZY LOADING
// ===========================

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===========================
// DEBUG & LOGGING
// ===========================

console.log('Moroccan Math Platform Loaded Successfully! 🎓');
console.log('Version: 1.0.0');
console.log('Language: العربية (Arabic) | التصميم المغربي (Moroccan Design)');