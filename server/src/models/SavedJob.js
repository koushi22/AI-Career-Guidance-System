const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    externalJobId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    location: {
      type: String,
      default: ''
    },
    remote: {
      type: Boolean,
      default: false
    },
    applyLink: {
      type: String,
      required: true
    },
    source: {
      type: String,
      default: 'JSearch'
    },
    salary: {
      type: String,
      default: 'Not specified'
    },
    description: {
      type: String,
      default: ''
    },
    postedAt: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

savedJobSchema.index({ user: 1, externalJobId: 1 }, { unique: true });

module.exports = mongoose.model('SavedJob', savedJobSchema);
