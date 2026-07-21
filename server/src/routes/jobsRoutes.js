const express = require('express');
const { protect } = require('../middleware/auth');
const { getJobs, saveJob, getSavedJobs, deleteSavedJob } = require('../controllers/jobsController');

const router = express.Router();

// Allow unauthenticated access to job search so users can see sample results
// when not logged in; saving and accessing saved jobs remains protected.
router.get('/', getJobs);
router.post('/save', protect, saveJob);
router.get('/saved', protect, getSavedJobs);
router.delete('/saved/:id', protect, deleteSavedJob);

module.exports = router;
