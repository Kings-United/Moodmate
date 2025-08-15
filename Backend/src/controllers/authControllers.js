const User = require('../models/User');
const logger = require('../utils/logger');
const { admin } = require('../config/firebase');
// const register = async (req, res) => {
//     try {
//         const { uid, email, name } = req.body;

//         if (!uid || !email) {
//             return res.status(400).json({ error: 'UID and email are required' });
//         }

//         // Check if user already exists
//         const existingUser = await User.findById(uid);
//         if (existingUser) {
//             return res.status(400).json({ error: 'User already exists' });
//         }

//         // Create new user
//         const user = await User.create({ uid, email, name });
//         logger.info('New user registered', { uid, email });

//         res.status(201).json({
//             message: 'User registered successfully',
//             user: {
//                 uid: user.uid,
//                 email: user.email,
//                 name: user.name,
//                 preferences: user.preferences
//             }
//         });
//     } catch (error) {
//         logger.error('Registration error:', error);
//         res.status(500).json({ error: 'Registration failed' });
//     }
// };

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user already exists in Firebase Auth
        try {
            const existingUserRecord = await admin.auth().getUserByEmail(email);
            
            // User exists in Firebase Auth, check if they exist in our DB
            const existingUser = await User.findById(existingUserRecord.uid);
            if (existingUser) {
                return res.status(400).json({ 
                    error: 'User already exists',
                    message: 'This email is already registered. Please sign in instead.'
                });
            }
            
            // User exists in Firebase Auth but not in our DB - create them in our DB
            const user = await User.create({
                uid: existingUserRecord.uid,
                email: existingUserRecord.email,
                name: existingUserRecord.displayName || name || email,
            });

            logger.info('User registered (existing Firebase user)', { uid: existingUserRecord.uid, email });

            return res.status(201).json({
                message: 'User registered successfully',
                user: {
                    uid: user.uid,
                    email: user.email,
                    name: user.name,
                    preferences: user.preferences
                }
            });
            
        } catch (firebaseError) {
            // User doesn't exist in Firebase Auth, create new user
            if (firebaseError.code === 'auth/user-not-found') {
                const userRecord = await admin.auth().createUser({
                    email,
                    password,
                    displayName: name || email,
                });

                const user = await User.create({
                    uid: userRecord.uid,
                    email: userRecord.email,
                    name: userRecord.displayName,
                });

                logger.info('New user registered', { uid: userRecord.uid, email: userRecord.email });

                return res.status(201).json({
                    message: 'User registered successfully',
                    user: {
                        uid: user.uid,
                        email: user.email,
                        name: user.name,
                        preferences: user.preferences
                    }
                });
            } else {
                // Re-throw other Firebase errors
                throw firebaseError;
            }
        }
    } catch (error) {
        logger.error('Registration error:', error);
        
        // Handle specific Firebase errors
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ 
                error: 'Email already exists',
                message: 'This email is already registered. Please sign in instead.'
            });
        }
        
        res.status(500).json({ error: error.message });
    }
};




// const login = async (req, res) => {
//     try {
//         const { uid } = req.user; // From auth middleware

//         let user = await User.findById(uid);
//         if (!user) {
//             // Create user if doesn't exist (first-time login)
//             user = await User.create({
//                 uid,
//                 email: req.user.email,
//                 name: req.user.name
//             });
//         } else {
//             await user.updateLastLogin();
//         }

//         logger.info('User logged in', { uid });

//         res.json({
//             message: 'Login successful',
//             user: {
//                 uid: user.uid,
//                 email: user.email,
//                 name: user.name,
//                 preferences: user.preferences,
//                 lastLoginAt: user.lastLoginAt
//             }
//         });
//     } catch (error) {
//         logger.error('Login error:', error);
//         res.status(500).json({ error: 'Login failed' });
//     }
// };



const login = async (req, res) => {
    try {
        const { uid, email, name } = req.user; // From Firebase token via middleware

        let user = await User.findById(uid);

        if (!user) {
            // First-time login after Firebase Auth signup
            user = await User.create({
                uid,
                email,
                name
            });
        }

        // Update last login timestamp
        await user.updateLastLogin();

        logger.info('User logged in', { uid });

        res.json({
            message: 'Login successful',
            user: {
                uid: user.uid,
                email: user.email,
                name: user.name,
                preferences: user.preferences,
                lastLoginAt: user.lastLoginAt
            }
        });

    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
};


const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.uid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                uid: user.uid,
                email: user.email,
                name: user.name,
                preferences: user.preferences,
                createdAt: user.createdAt,
                lastLoginAt: user.lastLoginAt
            }
        });
    } catch (error) {
        logger.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.uid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { name, preferences } = req.body;

        if (name) user.name = name;
        if (preferences) user.preferences = { ...user.preferences, ...preferences };

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                uid: user.uid,
                email: user.email,
                name: user.name,
                preferences: user.preferences
            }
        });
    } catch (error) {
        logger.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};