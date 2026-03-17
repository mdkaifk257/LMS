const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, enrollmentController.enrollSubject);
router.get('/my-enrollments', authMiddleware, enrollmentController.getUserEnrollments);
router.get('/all', authMiddleware, adminMiddleware, enrollmentController.getAllEnrollments);

module.exports = router;
