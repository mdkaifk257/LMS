const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/subject/:subjectId', sectionController.getSectionsBySubject);

router.post('/', authMiddleware, adminMiddleware, sectionController.createSection);
router.put('/:id', authMiddleware, adminMiddleware, sectionController.updateSection);
router.delete('/:id', authMiddleware, adminMiddleware, sectionController.deleteSection);
router.put('/reorder/batch', authMiddleware, adminMiddleware, sectionController.reorderSections);

module.exports = router;
