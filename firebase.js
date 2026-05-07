import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
  getAnalytics
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";


const firebaseConfig = {
  apiKey: "AIzaSyDC9eCyn9qZHRRFZHqGISCk9qPxkCyRgcs",
  authDomain: "moroccan-math-platform.firebaseapp.com",
  projectId: "moroccan-math-platform",
  storageBucket: "moroccan-math-platform.firebasestorage.app",
  messagingSenderId: "517058083028",
  appId: "1:517058083028:web:a11a159f25976c9a9ba341",
  measurementId: "G-GQNWMBK418"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const analytics = getAnalytics(app);


export { app, auth };