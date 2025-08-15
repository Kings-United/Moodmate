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
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    // Register/login with backend
                    await authAPI.login();
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL
                    });
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth state change error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            setLoading(true);
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password, displayName) => {
        try {
            setError(null);
            setLoading(true);

            // Create Firebase user
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name
            await updateProfile(result.user, { displayName });

            // Register with backend
            await authAPI.register({
                uid: result.user.uid,
                email: result.user.email,
                name: displayName
            });

            return result.user;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const updateUserProfile = async (profileData) => {
        try {
            setError(null);

            // Update Firebase profile
            if (profileData.displayName) {
                await updateProfile(auth.currentUser, {
                    displayName: profileData.displayName
                });
            }

            // Update backend profile
            await authAPI.updateProfile(profileData);

            // Update local state
            setUser(prev => ({
                ...prev,
                displayName: profileData.displayName || prev.displayName
            }));

        } catch (error) {
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