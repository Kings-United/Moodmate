const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const aiController = require('../controllers/aiController');

const router = express.Router();

// All routes are protected and rate limited
router.use(authenticateToken);
router.use(aiRateLimiter);

router.post('/sentiment', aiController.analyzeSentiment);
router.post('/response', aiController.generateResponse);
router.get('/crisis-support', aiController.getCrisisSupport);

module.exports = router;