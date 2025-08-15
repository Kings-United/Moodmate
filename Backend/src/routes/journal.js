const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const journalController = require('../controllers/journalController');

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

router.post('/', journalController.createEntry);
router.get('/', journalController.getEntries);
router.get('/:id', journalController.getEntry);
router.put('/:id', journalController.updateEntry);
router.delete('/:id', journalController.deleteEntry);

module.exports = router;