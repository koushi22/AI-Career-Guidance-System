const { allSkills, roleCatalog, defaultRole } = require('../config/roles');

const normalizeText = (value = '') => value.toLowerCase();

const uniqueValues = (values = []) => [...new Set(values.filter(Boolean))];

const extractSkillsFromText = (text = '') => {
  const lowered = normalizeText(text);
  return allSkills.filter((skill) => lowered.includes(skill));
};

const getRoleKey = (roleName = defaultRole) => {
  const lowered = normalizeText(roleName).trim();
  return Object.keys(roleCatalog).find((key) => lowered.includes(key)) || defaultRole;
};

const analyzeResumeScore = ({ text = '', userSkills = [], targetRole = defaultRole, jobDescription = '' }) => {
  const roleKey = getRoleKey(targetRole);
  const role = roleCatalog[roleKey];
  const resumeSkills = extractSkillsFromText(text);
  const profileSkills = userSkills.map((skill) => normalizeText(skill).trim()).filter(Boolean);
  const jobSkills = extractSkillsFromText(jobDescription);
  const targetSkills = uniqueValues([...(role?.requiredSkills || []), ...jobSkills]);

  const matchedSkills = targetSkills.filter((skill) => {
    const joinedResume = normalizeText(`${text} ${profileSkills.join(' ')} ${resumeSkills.join(' ')}`);
    return joinedResume.includes(skill);
  });

  const missingSkills = targetSkills.filter((skill) => !matchedSkills.includes(skill));

  let score = Math.round((matchedSkills.length / Math.max(targetSkills.length, 1)) * 100);
  if (resumeSkills.length > 0) {
    score = Math.min(100, score + Math.min(10, resumeSkills.length));
  }

  const suggestions = [];
  if (missingSkills.length > 0) {
    suggestions.push(`Add these keywords to your resume: ${missingSkills.slice(0, 5).join(', ')}`);
  }
  if (!text.toLowerCase().includes('project')) {
    suggestions.push('Add a projects section with measurable outcomes.');
  }
  if (!text.toLowerCase().includes('experience')) {
    suggestions.push('Highlight internships, freelance work, or practical work samples.');
  }
  suggestions.push(`Tailor your headline and summary for ${role.label}.`);

  return {
    roleKey,
    role: role?.label || targetRole,
    score,
    matchedSkills: uniqueValues(matchedSkills),
    missingSkills: uniqueValues(missingSkills),
    suggestions: uniqueValues(suggestions),
    extractedSkills: uniqueValues(resumeSkills)
  };
};

const buildLearningRoadmap = ({ roleName = defaultRole, missingSkills = [] }) => {
  const roleKey = getRoleKey(roleName);
  const role = roleCatalog[roleKey];
  const beginner = uniqueValues([...(role?.roadmap?.beginner || []), ...missingSkills.slice(0, 2).map((skill) => `Learn the basics of ${skill}`)]);
  const intermediate = uniqueValues(role?.roadmap?.intermediate || []);
  const advanced = uniqueValues(role?.roadmap?.advanced || []);

  return {
    role: role?.label || roleName,
    stages: {
      beginner,
      intermediate,
      advanced
    }
  };
};

const analyzeSkillGap = ({ userSkills = [], roleName = defaultRole }) => {
  const roleKey = getRoleKey(roleName);
  const role = roleCatalog[roleKey];
  const normalizedUserSkills = userSkills.map((skill) => normalizeText(skill).trim()).filter(Boolean);
  const matchedSkills = role.requiredSkills.filter((skill) => normalizedUserSkills.some((userSkill) => userSkill.includes(skill) || skill.includes(userSkill)));
  const missingSkills = role.requiredSkills.filter((skill) => !matchedSkills.includes(skill));

  return {
    roleKey,
    role: role.label,
    summary: role.summary,
    matchedSkills,
    missingSkills,
    matchPercent: Math.round((matchedSkills.length / role.requiredSkills.length) * 100),
    roadmap: buildLearningRoadmap({ roleName, missingSkills })
  };
};

module.exports = {
  normalizeText,
  uniqueValues,
  extractSkillsFromText,
  analyzeResumeScore,
  analyzeSkillGap,
  buildLearningRoadmap,
  getRoleKey
};
