const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
 


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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/insights', insightsRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});


// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`MoodMate Backend running on port ${PORT}`);
});

module.exports = app;