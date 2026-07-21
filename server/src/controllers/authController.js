const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'dev_jwt_secret_key', {
    expiresIn: '7d'
  });

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  targetRole: user.targetRole,
  bio: user.bio,
  location: user.location,
  education: user.education,
  experience: user.experience,
  skills: user.skills,
  avatar: user.avatar,
  latestResume: user.latestResume
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, targetRole, skills } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const skillList = Array.isArray(skills)
    ? skills
    : String(skills || '')
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    targetRole: targetRole || 'full stack developer',
    skills: skillList
  });

  const token = signToken(user._id);

  res.status(201).json({
    token,
    user: formatUser(user)
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email || '').toLowerCase();

  console.log(`[auth] login attempt for email=${normalizedEmail || 'empty'}`);

  if (!normalizedEmail || !password) {
    console.error('[auth] login rejected: missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    console.error(`[auth] login failed: no user found for ${normalizedEmail}`);
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  let isPasswordValid = false;
  try {
    isPasswordValid = await user.comparePassword(password);
  } catch (error) {
    console.error(`[auth] password comparison error for ${normalizedEmail}:`, error);
  }

  if (!isPasswordValid) {
    const isLegacyPlainTextPassword = typeof user.password === 'string' && user.password === password;
    if (isLegacyPlainTextPassword) {
      console.warn(`[auth] legacy plain-text password detected for ${normalizedEmail}; rehashing now`);
      user.password = password;
      await user.save();
      isPasswordValid = true;
    }
  }

  if (!isPasswordValid) {
    console.error(`[auth] login failed: invalid password for ${normalizedEmail}`);
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken(user._id);
  console.log(`[auth] login success for ${normalizedEmail}`);

  res.json({
    token,
    user: formatUser(user)
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ user: formatUser(req.user) });
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  formatUser
};
