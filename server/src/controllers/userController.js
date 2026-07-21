const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { formatUser } = require('./authController');

const parseSkills = (skills) => {
  if (Array.isArray(skills)) {
    return skills.map((skill) => String(skill).trim()).filter(Boolean);
  }

  return String(skills || '')
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
};

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'latestResume',
    'originalName atsScore extractedSkills suggestions targetRole createdAt'
  );
  res.json({ user: formatUser(user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, location, education, experience, targetRole, skills, avatar } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (location !== undefined) user.location = location;
  if (education !== undefined) user.education = education;
  if (experience !== undefined) user.experience = experience;
  if (targetRole !== undefined) user.targetRole = targetRole;
  if (avatar !== undefined) user.avatar = avatar;
  if (skills !== undefined) user.skills = parseSkills(skills);

  await user.save();

  res.json({
    message: 'Profile updated successfully',
    user: formatUser(user)
  });
});

module.exports = {
  getProfile,
  updateProfile
};
