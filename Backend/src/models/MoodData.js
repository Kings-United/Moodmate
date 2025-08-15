const { db } = require('../config/firebase');

class MoodData {
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.mood = data.mood;
        this.emotions = data.emotions || {};
        this.triggers = data.triggers || [];
        this.activities = data.activities || [];
        this.notes = data.notes || '';
        this.date = data.date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        this.timestamp = data.timestamp || new Date();
    }

    static async create(moodData) {
        try {
            const docRef = db.collection('moodData').doc();
            const mood = new MoodData({
                id: docRef.id,
                ...moodData,
                timestamp: new Date()
            });

            await docRef.set({ ...mood });
            return mood;
        } catch (error) {
            throw new Error(`Failed to create mood data: ${error.message}`);
        }
    }

    static async findByUserId(userId, startDate, endDate, limit = 100) {
        try {
            let query = db.collection('moodData')
                .where('userId', '==', userId)
                .orderBy('timestamp', 'desc')
                .limit(limit);

            if (startDate) {
                query = query.where('timestamp', '>=', new Date(startDate));
            }
            if (endDate) {
                query = query.where('timestamp', '<=', new Date(endDate));
            }

            const snapshot = await query.get();
            return snapshot.docs.map(doc =>
                new MoodData({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Failed to find mood data: ${error.message}`);
        }
    }

    static async getWeeklyAverage(userId) {
        try {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const snapshot = await db.collection('moodData')
                .where('userId', '==', userId)
                .where('timestamp', '>=', oneWeekAgo)
                .get();

            if (snapshot.empty) return 0;

            const moods = snapshot.docs.map(doc => doc.data().mood);
            return moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
        } catch (error) {
            throw new Error(`Failed to calculate weekly average: ${error.message}`);
        }
    }
}

module.exports = MoodData;