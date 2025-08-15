const { db } = require('../config/firebase');

class JournalEntry {
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.content = data.content;
        this.mood = data.mood; // 1-10 scale
        this.emotions = data.emotions || [];
        this.tags = data.tags || [];
        this.sentiment = data.sentiment || 0;
        this.aiResponse = data.aiResponse || '';
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.isPrivate = data.isPrivate || false;
    }

    // Convert JournalEntry instance to plain object for Firestore
    toObject() {
        return {
            id: this.id,
            userId: this.userId,
            content: this.content,
            mood: this.mood,
            emotions: this.emotions,
            tags: this.tags,
            sentiment: this.sentiment,
            aiResponse: this.aiResponse,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            isPrivate: this.isPrivate
        };
    }

    static async create(entryData) {
        try {
            const docRef = db.collection('journalEntries').doc();
            const entry = new JournalEntry({
                id: docRef.id,
                ...entryData,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const entryObject = entry.toObject();
            await docRef.set(entryObject);
            return entry;
        } catch (error) {
            throw new Error(`Failed to create journal entry: ${error.message}`);
        }
    }

    static async findByUserId(userId, limit = 50) {
        try {
            // Try the optimized query with index
            const snapshot = await db.collection('journalEntries')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc =>
                new JournalEntry({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            // If index doesn't exist, fall back to simple query and sort in memory
            if (error.message.includes('FAILED_PRECONDITION') && error.message.includes('index')) {
                console.warn('Firestore index not found. Using fallback query. Create index for better performance.');
                
                const snapshot = await db.collection('journalEntries')
                    .where('userId', '==', userId)
                    .get();

                const entries = snapshot.docs.map(doc =>
                    new JournalEntry({ id: doc.id, ...doc.data() })
                );

                // Sort in memory by createdAt descending
                entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                // Apply limit
                return entries.slice(0, limit);
            }
            
            throw new Error(`Failed to find journal entries: ${error.message}`);
        }
    }

    static async findById(id, userId) {
        try {
            const doc = await db.collection('journalEntries').doc(id).get();
            if (!doc.exists) {
                return null;
            }

            const data = doc.data();
            if (data.userId !== userId) {
                throw new Error('Access denied');
            }

            return new JournalEntry({ id: doc.id, ...data });
        } catch (error) {
            throw new Error(`Failed to find journal entry: ${error.message}`);
        }
    }

    async save() {
        try {
            this.updatedAt = new Date();
            const entryObject = this.toObject();
            await db.collection('journalEntries').doc(this.id).set(entryObject, { merge: true });
            return this;
        } catch (error) {
            throw new Error(`Failed to save journal entry: ${error.message}`);
        }
    }

    async delete() {
        try {
            await db.collection('journalEntries').doc(this.id).delete();
            return true;
        } catch (error) {
            throw new Error(`Failed to delete journal entry: ${error.message}`);
        }
    }
}

module.exports = JournalEntry;