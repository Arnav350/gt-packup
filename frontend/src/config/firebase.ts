import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDvkf-nG2jIniJU8ehvZcRuxABie1dmspg",
  authDomain: "gt-packup.firebaseapp.com",
  projectId: "gt-packup",
  storageBucket: "gt-packup.firebasestorage.app",
  messagingSenderId: "256059763825",
  appId: "1:256059763825:web:4b0691096fcd1a8ff8ffd0",
  measurementId: "G-Z5TXS2HNGH",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  size: "invisible",
});

export default app;
