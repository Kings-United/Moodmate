const { auth } = require('../config/firebase');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.substring(7);
        
        let decodedToken;
        
        try {
            // First try: Firebase Admin SDK verification (for tokens from securetoken.google.com)
            decodedToken = await auth.verifyIdToken(token);
        } catch (adminError) {
            // If that fails, try to decode the Identity Toolkit token manually
            if (adminError.code === 'auth/argument-error' && adminError.message.includes('issuer')) {
                try {
                    // For Identity Toolkit tokens, we'll do basic JWT verification
                    const jwt = require('jsonwebtoken');
                    
                    // Decode without verification first to get the payload
                    const decoded = jwt.decode(token);
                    
                    if (!decoded) {
                        throw new Error('Invalid token format');
                    }
                    
                    // Basic validation for Identity Toolkit tokens
                    if (decoded.iss !== 'https://identitytoolkit.google.com/' || 
                        decoded.aud !== 'moodmate-backend-cc75b' ||
                        !decoded.user_id) {
                        throw new Error('Invalid token claims');
                    }
                    
                    // Check if token is expired
                    if (decoded.exp && decoded.exp < Date.now() / 1000) {
                        throw new Error('Token expired');
                    }
                    
                    decodedToken = {
                        uid: decoded.user_id,
                        email: decoded.email,
                        name: decoded.display_name || decoded.email
                    };
                } catch (jwtError) {
                    console.error('JWT verification failed:', jwtError);
                    return res.status(401).json({ error: 'Invalid token' });
                }
            } else {
                // Re-throw other Firebase Admin errors
                throw adminError;
            }
        }

        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name || decodedToken.email
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { authenticateToken };