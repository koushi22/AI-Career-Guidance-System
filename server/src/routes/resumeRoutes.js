const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { uploadResume, getLatestResume, getResumeById, downloadResume } = require('../controllers/resumeController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 12 * 1024 * 1024 } });

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/latest', protect, getLatestResume);
router.get('/:id', protect, getResumeById);
router.get('/:id/download', protect, downloadResume);

module.exports = router;
