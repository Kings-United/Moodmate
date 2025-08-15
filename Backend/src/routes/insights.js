const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const insightsController = require('../controllers/insightsController');

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

router.get('/mood-trends', insightsController.getMoodTrends);
router.get('/emotions', insightsController.getEmotionAnalysis);
router.get('/summary', insightsController.getInsights);

module.exports = router;