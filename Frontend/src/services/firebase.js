import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Log Firebase configuration (without sensitive data)
console.log('Firebase Configuration Status:', {
    hasApiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
    hasAuthDomain: !!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    hasProjectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
    hasStorageBucket: !!process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    hasMessagingSenderId: !!process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    hasAppId: !!process.env.REACT_APP_FIREBASE_APP_ID,
    NODE_ENV: process.env.NODE_ENV
});

// Check if all required config values are present
const missingConfig = Object.entries(firebaseConfig).filter(([key, value]) => !value);
if (missingConfig.length > 0) {
    console.error('❌ Missing Firebase configuration:', missingConfig.map(([key]) => key));
    console.error('Please check your .env file in the Frontend directory');
} else {
    console.log('✅ Firebase configuration looks complete');
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Connect to auth emulator in development
if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Development mode detected');
    
    // Check if emulator should be used
    const useEmulator = process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true';
    
    if (useEmulator) {
        console.log('🚀 Attempting to connect to Firebase Auth Emulator...');
        try {
            connectAuthEmulator(auth, 'http://localhost:9099');
            console.log('✅ Connected to Firebase Auth Emulator');
        } catch (error) {
            console.warn('⚠️ Firebase Auth Emulator connection failed:', error.message);
            console.log('💡 Make sure Firebase emulator is running: firebase emulators:start');
        }
    } else {
        console.log('🌐 Using Firebase production auth');
    }
} else {
    console.log('🚀 Production mode - using Firebase production auth');
}

export default app;