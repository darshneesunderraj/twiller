import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdeS3cYusn_7KXrS8C44xfRA05SUFhNDo",
  authDomain: "twiller-eee34.firebaseapp.com",
  projectId: "twiller-eee34",
  storageBucket: "twiller-eee34.appspot.com",
  messagingSenderId: "274679633248",
  appId: "1:274679633248:web:6d5fb1feb1f6c7997eba05",
  measurementId: "G-ZZHBHTTRZJ"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Firebase authentication

export { auth };
