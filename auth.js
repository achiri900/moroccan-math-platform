import { auth } from "./firebase.js";
const db = getFirestore();
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// ===========================
// UTILITY FUNCTIONS
// ===========================

function getAuthElements() {
  return {
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    message: document.getElementById("message")
  };
}

function showMessage(text, isSuccess = false) {
  const { message } = getAuthElements();
  
  if (!message) {
    console.error("Message element not found");
    return;
  }

  message.style.color = isSuccess ? "#10b981" : "#ef4444";
  message.innerText = text;
  message.style.display = "block";
}

function clearMessage() {
  const { message } = getAuthElements();
  if (message) {
    message.innerText = "";
    message.style.display = "none";
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  return password && password.length >= 6;
}

function setButtonLoading(buttonElement, isLoading) {
  if (!buttonElement) return;
  
  buttonElement.disabled = isLoading;
  buttonElement.style.opacity = isLoading ? "0.6" : "1";
  buttonElement.style.cursor = isLoading ? "not-allowed" : "pointer";
  
  if (isLoading) {
    buttonElement.dataset.originalText = buttonElement.innerText;
    buttonElement.innerText = "جاري المعالجة...";
  } else {
    buttonElement.innerText = buttonElement.dataset.originalText || buttonElement.innerText;
  }
}

// ===========================
// ERROR HANDLING
// ===========================

function handleAuthError(error) {
  const errorMessages = {
    "auth/email-already-in-use": "هذا البريد الإلكتروني مسجل بالفعل",
    "auth/invalid-email": "البريد الإلكتروني غير صحيح",
    "auth/operation-not-allowed": "هذه العملية غير مسموحة",
    "auth/weak-password": "كلمة المرور ضعيفة جداً (يجب أن تكون 6 أحرف على الأقل)",
    "auth/user-not-found": "هذا الحساب غير موجود",
    "auth/wrong-password": "كلمة المرور غير صحيحة",
    "auth/too-many-requests": "حاولت عدة مرات. يرجى المحاولة لاحقاً",
    "auth/invalid-credential": "بيانات تسجيل الدخول غير صحيحة"
  };

  const errorCode = error.code;
  return errorMessages[errorCode] || error.message || "حدث خطأ. يرجى المحاولة لاحقاً";
}

// ===========================
// VALIDATION
// ===========================

function validateRegistration(email, password) {
  if (!email || !password) {
    showMessage("يرجى ملء جميع الحقول");
    return false;
  }

  if (!isValidEmail(email)) {
    showMessage("البريد الإلكتروني غير صحيح");
    return false;
  }

  if (!isValidPassword(password)) {
    showMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    return false;
  }

  return true;
}

function validateLogin(email, password) {
  if (!email || !password) {
    showMessage("يرجى ملء جميع الحقول");
    return false;
  }

  if (!isValidEmail(email)) {
    showMessage("البريد الإلكتروني غير صحيح");
    return false;
  }

  if (!password) {
    showMessage("يرجى إدخال كلمة المرور");
    return false;
  }

  return true;
}

// ===========================
// REGISTRATION
// ===========================

window.register = async function (event) {
  // Prevent form submission if called from form
  if (event && typeof event.preventDefault === "function") {
    event.preventDefault();
  }

  clearMessage();
  
  const { email, password, message } = getAuthElements();
  const registerBtn = document.querySelector(".register-btn") || event?.target;

  // Validation
  if (!validateRegistration(email?.value, password?.value)) {
    return;
  }

  // Set loading state
  setButtonLoading(registerBtn, true);

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    );
await setDoc(doc(db, "users", userCredential.user.uid), {
  email: email.value.trim(),
  createdAt: new Date().toISOString()
});
    showMessage("تم إنشاء الحساب بنجاح! سيتم توجيهك للدخول...", true);
    
    // Clear form
    email.value = "";
    password.value = "";

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);

  } catch (error) {
    const errorMessage = handleAuthError(error);
    showMessage(errorMessage);
    console.error("Registration error:", error);

  } finally {
    setButtonLoading(registerBtn, false);
  }
};

// ===========================
// LOGIN
// ===========================

window.login = async function (event) {
  // Prevent form submission if called from form
  if (event && typeof event.preventDefault === "function") {
    event.preventDefault();
  }

  clearMessage();

  const { email, password, message } = getAuthElements();
  const loginBtn = document.querySelector(".login-btn") || event?.target;

  // Validation
  if (!validateLogin(email?.value, password?.value)) {
    return;
  }

  // Set loading state
  setButtonLoading(loginBtn, true);

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    );

    showMessage("تم تسجيل الدخول بنجاح!", true);
    
    // Clear form
    email.value = "";
    password.value = "";

    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

  } catch (error) {
    const errorMessage = handleAuthError(error);
    showMessage(errorMessage);
    console.error("Login error:", error);

  } finally {
    setButtonLoading(loginBtn, false);
  }
};

// ===========================
// PASSWORD RESET (BONUS)
// ===========================

window.resetPassword = async function () {
  const { email, message } = getAuthElements();
  
  if (!email?.value) {
    showMessage("يرجى إدخال البريد الإلكتروني");
    return;
  }

  if (!isValidEmail(email.value)) {
    showMessage("البريد الإلكتروني غير صحيح");
    return;
  }

  showMessage("تم إرسال رسالة إعادة تعيين كلمة المرور إلى بريدك الإلكتروني", true);
};

// ===========================
// INPUT MANAGEMENT
// ===========================

document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Clear error message on input
  if (emailInput) {
    emailInput.addEventListener("input", clearMessage);
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", clearMessage);
  }

  // Allow Enter key to submit forms
  if (emailInput && passwordInput) {
    [emailInput, passwordInput].forEach(input => {
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          const registerBtn = document.querySelector(".register-btn");
          const loginBtn = document.querySelector(".login-btn");
          
          if (registerBtn && !registerBtn.disabled) {
            window.register();
          } else if (loginBtn && !loginBtn.disabled) {
            window.login();
          }
        }
      });
    });
  }
});

// ===========================
// DEBUGGING
// ===========================

console.log("Auth module loaded successfully! 🔐");