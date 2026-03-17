const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, progressController.updateProgress);
router.get('/subject/:subjectId', authMiddleware, progressController.getProgressBySubject);

module.exports = router;
