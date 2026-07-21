const Resume = require('../models/Resume');
const asyncHandler = require('../utils/asyncHandler');
const { analyzeResumeScore } = require('../utils/analysis');
const { generateCareerRecommendation, generateSkillGapAnalysis, generateMentorReply, generateAnalysisSummary } = require('../services/geminiService');

const analyzeATS = asyncHandler(async (req, res) => {
  const { text, targetRole, jobDescription = '' } = req.body;
  const resumeText = text || (await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 }))?.text || '';

  if (!resumeText) {
    return res.status(400).json({ message: 'Resume text is required for analysis' });
  }

  const analysis = await generateAnalysisSummary({
    profile: req.user,
    resumeText,
    targetRole: targetRole || req.user.targetRole
  });

  const fallback = analyzeResumeScore({
    text: resumeText,
    userSkills: req.user.skills || [],
    targetRole: targetRole || req.user.targetRole,
    jobDescription
  });

  res.json({
    atsScore: analysis.atsScore ?? fallback.score,
    strengths: analysis.strengths || fallback.matchedSkills,
    improvements: analysis.improvements || fallback.suggestions,
    roadmap: analysis.roadmap || {
      beginner: [],
      intermediate: [],
      advanced: []
    },
    role: fallback.role
  });
});

const getRecommendation = asyncHandler(async (req, res) => {
  const latestResume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  const recommendation = await generateCareerRecommendation({
    profile: req.user,
    resumeText: latestResume?.text || '',
    targetRole: req.user.targetRole || 'full stack developer'
  });

  const skillGap = await generateSkillGapAnalysis({
    profile: req.user,
    resumeText: latestResume?.text || '',
    targetRole: req.user.targetRole || 'full stack developer',
    userSkills: req.user.skills || [],
    extractedSkills: latestResume?.extractedSkills || []
  });

  res.json({
    recommendation,
    skillGap
  });
});

const mentorChat = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  const latestResume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
  const reply = await generateMentorReply({
    message,
    history,
    profile: req.user,
    recommendedRoles: [req.user.targetRole, 'full stack developer', 'backend developer']
  });

  res.json({
    reply,
    context: {
      skills: req.user.skills || [],
      targetRole: req.user.targetRole,
      resumeLoaded: Boolean(latestResume)
    }
  });
});

module.exports = {
  analyzeATS,
  getRecommendation,
  mentorChat
};
