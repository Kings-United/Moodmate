const { db } = require('../config/firebase');

class User {
    constructor(data) {
        this.uid = data.uid;
        this.email = data.email;
        this.name = data.name || data.email;
        this.createdAt = data.createdAt || new Date();
        this.lastLoginAt = data.lastLoginAt;
        this.preferences = data.preferences || {
            notifications: true,
            aiResponseStyle: 'empathetic',
            privacyLevel: 'standard'
        };
    }

    // Convert User instance to plain object for Firestore
    toObject() {
        return {
            uid: this.uid,
            email: this.email,
            name: this.name,
            createdAt: this.createdAt,
            lastLoginAt: this.lastLoginAt,
            preferences: this.preferences
        };
    }

    static async create(userData) {
        try {
            const user = new User(userData);
            const userObject = user.toObject();
            userObject.createdAt = new Date();
            userObject.lastLoginAt = new Date();
            
            await db.collection('users').doc(user.uid).set(userObject);
            return user;
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    static async findById(uid) {
        try {
            const doc = await db.collection('users').doc(uid).get();
            if (!doc.exists) {
                return null;
            }
            return new User({ uid, ...doc.data() });
        } catch (error) {
            throw new Error(`Failed to find user: ${error.message}`);
        }
    }

    async save() {
        try {
            // Convert User instance to plain object before saving
            const userData = this.toObject();
            await db.collection('users').doc(this.uid).set(userData, { merge: true });
            return this;
        } catch (error) {
            throw new Error(`Failed to save user: ${error.message}`);
        }
    }

    async updateLastLogin() {
        try {
            this.lastLoginAt = new Date();
            await db.collection('users').doc(this.uid).update({ lastLoginAt: this.lastLoginAt });
        } catch (error) {
            throw new Error(`Failed to update last login: ${error.message}`);
        }
    }
}

module.exports = User;
