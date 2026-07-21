const Resume = require('../models/Resume');
const SavedJob = require('../models/SavedJob');
const asyncHandler = require('../utils/asyncHandler');
const { generateCareerRecommendation, generateSkillGapAnalysis } = require('../services/geminiService');

const getDashboardSummary = asyncHandler(async (req, res) => {
  const latestResume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  const savedJobs = await SavedJob.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(6);
  const skillGap = await generateSkillGapAnalysis({
    profile: req.user,
    resumeText: latestResume?.text || '',
    targetRole: req.user.targetRole || 'full stack developer',
    userSkills: req.user.skills || [],
    extractedSkills: latestResume?.extractedSkills || []
  });

  const recommendation = await generateCareerRecommendation({
    profile: req.user,
    resumeText: latestResume?.text || '',
    targetRole: req.user.targetRole || 'full stack developer'
  });

  res.json({
    user: req.user,
    latestResume: latestResume
      ? {
          _id: latestResume._id,
          originalName: latestResume.originalName,
          atsScore: latestResume.atsScore,
          extractedSkills: latestResume.extractedSkills,
          suggestions: latestResume.suggestions,
          targetRole: latestResume.targetRole,
          createdAt: latestResume.createdAt
        }
      : null,
    savedJobs,
    skillGap,
    recommendation
  });
});

module.exports = {
  getDashboardSummary
};
