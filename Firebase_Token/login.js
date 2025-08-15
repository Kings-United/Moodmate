import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB0-000000000000000000000000000000",
  authDomain: "YOUR_FIREBASE_PROJECT.firebaseapp.com",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function login() {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      "testuser@example.com", // Email from step 1
      "123456" // Password from step 1
    );

    const token = await userCredential.user.getIdToken();
    console.log("Firebase ID Token:", token);
  } catch (error) {
    console.error("Error logging in:", error);
  }
}

login();
