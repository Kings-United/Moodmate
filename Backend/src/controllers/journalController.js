const JournalEntry = require('../models/JournalEntry');
const aiService = require('../services/sentimentService');
const responseService = require('../services/responseService');
const logger = require('../utils/logger');

const createEntry = async (req, res) => {
    try {
        const { content, mood, emotions, tags, isPrivate } = req.body;
        const userId = req.user.uid;

        if (!content || !mood) {
            return res.status(400).json({ error: 'Content and mood are required' });
        }

        if (mood < 1 || mood > 10) {
            return res.status(400).json({ error: 'Mood must be between 1 and 10' });
        }

        // Analyze sentiment and generate AI response
        const analysis = await aiService.analyzeSentiment(content);
        const aiResponse = responseService.generateAIResponse(mood, content, analysis.score, analysis.features);

        const entry = await JournalEntry.create({
            userId,
            content,
            mood,
            emotions: emotions || [],
            tags: tags || [],
            sentiment: analysis.score,
            aiResponse,
            isPrivate: isPrivate || false
        });

        logger.info('Journal entry created', { userId, entryId: entry.id, mood });

        res.status(201).json({
            message: 'Journal entry created successfully',
            entry: {
                id: entry.id,
                content: entry.content,
                mood: entry.mood,
                emotions: entry.emotions,
                tags: entry.tags,
                sentiment: entry.sentiment,
                aiResponse: entry.aiResponse,
                createdAt: entry.createdAt
            }
        });
    } catch (error) {
        logger.error('Create entry error:', error);
        res.status(500).json({ error: 'Failed to create journal entry' });
    }
};

const getEntries = async (req, res) => {
    try {
        const userId = req.user.uid;
        const limit = parseInt(req.query.limit) || 50;

        const entries = await JournalEntry.findByUserId(userId, limit);

        res.json({
            entries: entries.map(entry => ({
                id: entry.id,
                content: entry.content,
                mood: entry.mood,
                emotions: entry.emotions,
                tags: entry.tags,
                sentiment: entry.sentiment,
                aiResponse: entry.aiResponse,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt
            }))
        });
    } catch (error) {
        logger.error('Get entries error:', error);
        res.status(500).json({ error: 'Failed to get journal entries' });
    }
};

const getEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const entry = await JournalEntry.findById(id, userId);
        if (!entry) {
            return res.status(404).json({ error: 'Journal entry not found' });
        }

        res.json({
            entry: {
                id: entry.id,
                content: entry.content,
                mood: entry.mood,
                emotions: entry.emotions,
                tags: entry.tags,
                sentiment: entry.sentiment,
                aiResponse: entry.aiResponse,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt
            }
        });
    } catch (error) {
        logger.error('Get entry error:', error);
        res.status(500).json({ error: 'Failed to get journal entry' });
    }
};

const updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;
        const { content, mood, emotions, tags } = req.body;

        const entry = await JournalEntry.findById(id, userId);
        if (!entry) {
            return res.status(404).json({ error: 'Journal entry not found' });
        }

        if (content) entry.content = content;
        if (mood) {
            if (mood < 1 || mood > 10) {
                return res.status(400).json({ error: 'Mood must be between 1 and 10' });
            }
            entry.mood = mood;
        }
        if (emotions) entry.emotions = emotions;
        if (tags) entry.tags = tags;

        // Re-analyze sentiment if content changed
        if (content) {
            const analysis = await aiService.analyzeSentiment(content);
            entry.sentiment = analysis.score;
            entry.aiResponse = responseService.generateAIResponse(entry.mood, content, analysis.score, analysis.features);
        }

        await entry.save();

        res.json({
            message: 'Journal entry updated successfully',
            entry: {
                id: entry.id,
                content: entry.content,
                mood: entry.mood,
                emotions: entry.emotions,
                tags: entry.tags,
                sentiment: entry.sentiment,
                aiResponse: entry.aiResponse,
                updatedAt: entry.updatedAt
            }
        });
    } catch (error) {
        logger.error('Update entry error:', error);
        res.status(500).json({ error: 'Failed to update journal entry' });
    }
};

const deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.uid;

        const entry = await JournalEntry.findById(id, userId);
        if (!entry) {
            return res.status(404).json({ error: 'Journal entry not found' });
        }

        await entry.delete();
        logger.info('Journal entry deleted', { userId, entryId: id });

        res.json({ message: 'Journal entry deleted successfully' });
    } catch (error) {
        logger.error('Delete entry error:', error);
        res.status(500).json({ error: 'Failed to delete journal entry' });
    }
};

module.exports = {
    createEntry,
    getEntries,
    getEntry,
    updateEntry,
    deleteEntry
};