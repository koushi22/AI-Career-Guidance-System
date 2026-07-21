const SavedJob = require('../models/SavedJob');
const asyncHandler = require('../utils/asyncHandler');
const { searchJobs } = require('../services/jobService');

const getJobs = asyncHandler(async (req, res) => {
  const { query = 'developer', location = '', remoteOnly = 'false' } = req.query;
  try {
    const { jobs, fallback } = await searchJobs({
      query,
      location,
      remoteOnly: remoteOnly === 'true'
    });

    res.json({ jobs, fallback: Boolean(fallback) });
  } catch (error) {
    const statusCode = error.statusCode || 502;
    res.status(statusCode).json({ message: error.message || 'Unable to fetch live jobs' });
  }
});

const saveJob = asyncHandler(async (req, res) => {
  const {
    externalJobId,
    title,
    company,
    location = '',
    remote = false,
    applyLink,
    source = 'JSearch',
    salary = 'Not specified',
    description = '',
    postedAt = ''
  } = req.body;

  if (!externalJobId || !title || !company || !applyLink) {
    return res.status(400).json({ message: 'Job details are required' });
  }

  const savedJob = await SavedJob.findOneAndUpdate(
    { user: req.user._id, externalJobId },
    {
      user: req.user._id,
      externalJobId,
      title,
      company,
      location,
      remote,
      applyLink,
      source,
      salary,
      description,
      postedAt
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  );

  res.status(201).json({ message: 'Job saved successfully', savedJob });
});

const getSavedJobs = asyncHandler(async (req, res) => {
  const jobs = await SavedJob.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ jobs });
});

const deleteSavedJob = asyncHandler(async (req, res) => {
  const deletedJob = await SavedJob.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!deletedJob) {
    return res.status(404).json({ message: 'Saved job not found' });
  }

  res.json({ message: 'Saved job removed successfully' });
});

module.exports = {
  getJobs,
  saveJob,
  getSavedJobs,
  deleteSavedJob
};
