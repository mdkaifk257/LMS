const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', subjectController.getAllSubjects);
router.get('/:id', subjectController.getSubjectById);

router.post('/', authMiddleware, adminMiddleware, subjectController.createSubject);
router.put('/:id', authMiddleware, adminMiddleware, subjectController.updateSubject);
router.delete('/:id', authMiddleware, adminMiddleware, subjectController.deleteSubject);

module.exports = router;
