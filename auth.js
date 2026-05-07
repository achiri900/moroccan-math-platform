import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";


window.register = async function () {

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  const message = document.getElementById("message");

  try {

    await createUserWithEmailAndPassword(auth, email, password);

    message.style.color = "green";

    message.innerText = "تم إنشاء الحساب بنجاح";

  } catch (error) {

    message.innerText = error.message;

  }

};


window.login = async function () {

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  const message = document.getElementById("message");

  try {

    await signInWithEmailAndPassword(auth, email, password);

    message.style.color = "green";

    message.innerText = "تم تسجيل الدخول بنجاح";

    window.location.href = "index.html";

  } catch (error) {

    message.innerText = error.message;

  }

};