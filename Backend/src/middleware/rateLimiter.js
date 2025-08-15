const rateLimit = require('express-rate-limit');
const config = require('../config/ai');

const rateLimiter = rateLimit({
    windowMs: config.rateLimits.window,
    max: config.rateLimits.max,
    message: {
        error: 'Too many requests, please try again later.',
        retryAfter: Math.ceil(config.rateLimits.window / 1000 / 60) + ' minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const aiRateLimiter = rateLimit({
    windowMs: 60000, // 1 minute
    max: 5, // More restrictive for AI endpoints
    message: {
        error: 'Too many AI requests, please try again in a minute.',
    }
});

module.exports = rateLimiter;
module.exports.aiRateLimiter = aiRateLimiter;