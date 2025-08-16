import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Monitor auth state changes
    useEffect(() => {
        console.log('🔐 Setting up Firebase auth state listener...');
        
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                console.log('🔄 Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
                
                if (firebaseUser) {
                    console.log('👤 Firebase user details:', {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        emailVerified: firebaseUser.emailVerified
                    });
                    
                    // Register/login with backend
                    console.log('🔄 Attempting to login with backend...');
                    await authAPI.login();
                    console.log('✅ Backend login successful');
                    
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL
                    });
                } else {
                    console.log('👋 User logged out');
                    setUser(null);
                }
            } catch (error) {
                console.error('❌ Auth state change error:', {
                    code: error.code,
                    message: error.message,
                    stack: error.stack
                });
                setError(error.message);
            } finally {
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        try {
            console.log('🔐 Attempting login for:', email);
            setError(null);
            setLoading(true);
            
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log('✅ Firebase login successful:', {
                uid: result.user.uid,
                email: result.user.email
            });
            
            return result.user;
        } catch (error) {
            console.error('❌ Firebase login error:', {
                code: error.code,
                message: error.message,
                email: email
            });
            
            // Provide user-friendly error messages
            let userMessage = 'Login failed. Please try again.';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    userMessage = 'No account found with this email address.';
                    break;
                case 'auth/wrong-password':
                    userMessage = 'Incorrect password. Please try again.';
                    break;
                case 'auth/invalid-email':
                    userMessage = 'Please enter a valid email address.';
                    break;
                case 'auth/too-many-requests':
                    userMessage = 'Too many failed attempts. Please try again later.';
                    break;
                case 'auth/network-request-failed':
                    userMessage = 'Network error. Please check your connection.';
                    break;
                case 'auth/internal-error':
                    userMessage = 'Firebase service error. Please try again.';
                    break;
                default:
                    userMessage = error.message;
            }
            
            setError(userMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password, displayName) => {
        try {
            console.log('📝 Attempting registration for:', email);
            setError(null);
            setLoading(true);

            // Create Firebase user
            console.log('🔄 Creating Firebase user...');
            const result = await createUserWithEmailAndPassword(auth, email, password);
            console.log('✅ Firebase user created:', result.user.uid);

            // Update display name
            console.log('🔄 Updating display name...');
            await updateProfile(result.user, { displayName });
            console.log('✅ Display name updated');

            // Register with backend
            console.log('🔄 Registering with backend...');
            await authAPI.register({
                uid: result.user.uid,
                email: result.user.email,
                name: displayName
            });
            console.log('✅ Backend registration successful');

            return result.user;
        } catch (error) {
            console.error('❌ Registration error:', {
                code: error.code,
                message: error.message,
                email: email
            });
            
            // Provide user-friendly error messages
            let userMessage = 'Registration failed. Please try again.';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    userMessage = 'An account with this email already exists.';
                    break;
                case 'auth/invalid-email':
                    userMessage = 'Please enter a valid email address.';
                    break;
                case 'auth/weak-password':
                    userMessage = 'Password should be at least 6 characters long.';
                    break;
                case 'auth/network-request-failed':
                    userMessage = 'Network error. Please check your connection.';
                    break;
                default:
                    userMessage = error.message;
            }
            
            setError(userMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            console.log('🚪 Attempting logout...');
            setError(null);
            await signOut(auth);
            console.log('✅ Logout successful');
        } catch (error) {
            console.error('❌ Logout error:', error);
            setError(error.message);
            throw error;
        }
    };

    const updateUserProfile = async (profileData) => {
        try {
            console.log('🔄 Updating user profile...');
            setError(null);

            // Update Firebase profile
            if (profileData.displayName) {
                console.log('🔄 Updating Firebase display name...');
                await updateProfile(auth.currentUser, {
                    displayName: profileData.displayName
                });
                console.log('✅ Firebase profile updated');
            }

            // Update backend profile
            console.log('🔄 Updating backend profile...');
            await authAPI.updateProfile(profileData);
            console.log('✅ Backend profile updated');

            // Update local state
            setUser(prev => ({
                ...prev,
                displayName: profileData.displayName || prev.displayName
            }));

        } catch (error) {
            console.error('❌ Profile update error:', error);
            setError(error.message);
            throw error;
        }
    };

    const clearError = () => setError(null);

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUserProfile,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;