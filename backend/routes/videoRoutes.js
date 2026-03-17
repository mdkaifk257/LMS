const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/section/:sectionId', authMiddleware, videoController.getVideosBySection);
router.get('/:id', authMiddleware, videoController.getVideoById);

router.post('/', authMiddleware, adminMiddleware, videoController.createVideo);
router.put('/:id', authMiddleware, adminMiddleware, videoController.updateVideo);
router.delete('/:id', authMiddleware, adminMiddleware, videoController.deleteVideo);
router.put('/reorder/batch', authMiddleware, adminMiddleware, videoController.reorderVideos);

module.exports = router;
