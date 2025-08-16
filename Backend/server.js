const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

console.log('Starting MoodMate Backend Server...');
console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 3001,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
});

const authRoutes = require('./src/routes/auth.js');
const journalRoutes = require('./src/routes/journal.js');
const aiRoutes = require('./src/routes/ai.js');
const insightsRoutes = require('./src/routes/insights.js');

const errorHandler = require('./src/middleware/errorHandler.js');
const rateLimiter = require('./src/middleware/rateLimiter.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimiter);

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/insights', insightsRoutes);

// Health check
app.get('/health', (req, res) => {
    console.log('Health check requested');
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'MoodMate Backend is running'
    });
});

// API root endpoint
app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'MoodMate API is running',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            journal: '/api/journal',
            ai: '/api/ai',
            insights: '/api/insights'
        }
    });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    console.log(`404 - Route not found: ${req.originalUrl}`);
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`✅ MoodMate Backend running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API root: http://localhost:${PORT}/api`);
    console.log(`🎯 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;