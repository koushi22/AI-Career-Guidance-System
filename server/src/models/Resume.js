const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    fileData: {
      type: Buffer,
      required: true
    },
    text: {
      type: String,
      default: ''
    },
    extractedSkills: {
      type: [String],
      default: []
    },
    atsScore: {
      type: Number,
      default: 0
    },
    suggestions: {
      type: [String],
      default: []
    },
    targetRole: {
      type: String,
      default: 'full stack developer'
    },
    jobDescription: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Resume', resumeSchema);
