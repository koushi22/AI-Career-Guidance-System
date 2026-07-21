const fs = require('fs');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { analyzeResumeScore, extractSkillsFromText } = require('../utils/analysis');

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a PDF resume' });
  }

  const parsed = await pdfParse(req.file.buffer);
  const resumeText = parsed.text || '';
  const targetRole = req.body.targetRole || req.user.targetRole || 'full stack developer';
  const jobDescription = req.body.jobDescription || '';
  const analysis = analyzeResumeScore({
    text: resumeText,
    userSkills: req.user.skills || [],
    targetRole,
    jobDescription
  });
  const extractedSkills = extractSkillsFromText(resumeText);
  const mergedSkills = Array.from(new Set([...(req.user.skills || []), ...extractedSkills]));

  const resume = await Resume.create({
    user: req.user._id,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    fileData: req.file.buffer,
    text: resumeText,
    extractedSkills,
    atsScore: analysis.score,
    suggestions: analysis.suggestions,
    targetRole,
    jobDescription
  });

  await User.findByIdAndUpdate(req.user._id, {
    latestResume: resume._id,
    skills: mergedSkills
  });

  res.status(201).json({
    message: 'Resume uploaded successfully',
    resume,
    analysis: {
      role: analysis.role,
      score: analysis.score,
      matchedSkills: analysis.matchedSkills,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
      extractedSkills
    }
  });
});

const getLatestResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });

  if (!resume) {
    return res.json({ resume: null });
  }

  res.json({ resume });
});

const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

  if (!resume) {
    return res.status(404).json({ message: 'Resume not found' });
  }

  res.json({ resume });
});

const downloadResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

  if (!resume) {
    return res.status(404).json({ message: 'Resume not found' });
  }

  res.setHeader('Content-Type', resume.mimetype);
  res.setHeader('Content-Disposition', `attachment; filename="${resume.originalName}"`);
  res.send(Buffer.from(resume.fileData));
});

module.exports = {
  uploadResume,
  getLatestResume,
  getResumeById,
  downloadResume
};
