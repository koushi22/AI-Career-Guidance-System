const express = require('express');
const { protect } = require('../middleware/auth');
const { analyzeATS, getRecommendation, mentorChat } = require('../controllers/aiController');

const router = express.Router();

router.post('/ats', protect, analyzeATS);
router.get('/recommendation', protect, getRecommendation);
router.post('/chat', protect, mentorChat);

module.exports = router;
