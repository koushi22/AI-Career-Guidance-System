const { GoogleGenerativeAI } = require('@google/generative-ai');
const { analyzeResumeScore, analyzeSkillGap, buildLearningRoadmap } = require('../utils/analysis');

const hasGeminiKey = () => Boolean(process.env.GEMINI_API_KEY);

// Prefer the newer Gemini 3.5 Flash model for all AI features.
const getPreferredModelCandidates = () => {
  const configuredModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  return [configuredModel, 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']
    .filter((value, index, array) => value && array.indexOf(value) === index);
};

const getModel = async () => {
  if (!hasGeminiKey()) return null;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const preferredModelCandidates = getPreferredModelCandidates();

  // Try the preferred Gemini 3.5 Flash model first.
  for (const candidate of preferredModelCandidates) {
    try {
      const model = await genAI.getGenerativeModel({ model: candidate });
      console.log(`Using Gemini model (preferred): ${candidate}`);
      return model;
    } catch (err) {
      console.warn(`Preferred model ${candidate} not available: ${err.message || err}`);
    }
  }

  // Fall back to discovery so the service can still use an available model.
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY }
    });
    if (res.ok) {
      const json = await res.json();
      const models = Array.isArray(json.models) ? json.models : [];
      for (const m of models) {
        if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
          try {
            const model = await genAI.getGenerativeModel({ model: m.name.replace(/^models\//, '') });
            console.log(`Using Gemini model (from discovery): ${m.name}`);
            return model;
          } catch (err) {
            console.warn(`Discovered model ${m.name} failed to initialize: ${err.message || err}`);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Model discovery failed:', err.message || err);
  }

  console.warn('No supported Gemini models available for this key');
  return null;
};

const extractJsonFromText = (text = '') => {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```json\s*([\s\S]*?)\s*```/i);
  const candidate = fenced ? fenced[1] : trimmed.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '');
  return JSON.parse(candidate);
};

const askGemini = async (prompt) => {
  if (!hasGeminiKey()) {
    return null;
  }

  try {
    const model = await getModel();
    if (!model) return null;

    // The SDK expects a `GenerateContentRequest` shape with a `contents` array.
    const request = {
      contents: [
        {
          role: 'user',
          parts: [{ text: typeof prompt === 'string' ? prompt : String(prompt) }]
        }
      ]
    };

    const result = await model.generateContent(request);
    if (!result) return null;

    // result may expose helpers via `response` (stream) or provide text helpers
    if (result.response && typeof result.response.text === 'function') {
      return result.response.text();
    }
    // older shapes
    if (result.text && typeof result.text === 'string') return result.text;
    if (typeof result === 'string') return result;

    // As a last resort, try to aggregate text from candidates.
    try {
      if (result.candidates && result.candidates.length) {
        const parts = [];
        for (const c of result.candidates) {
          if (c.content && c.content.parts) {
            for (const p of c.content.parts) {
              if (p.text) parts.push(p.text);
            }
          }
        }
        if (parts.length) return parts.join('\n');
      }
    } catch (e) {
      // ignore
    }

    return null;
  } catch (error) {
    console.warn('askGemini failed:', error.message || error);
    return null;
  }
};

const askGeminiJson = async (prompt, fallback) => {
  try {
    const responseText = await askGemini(prompt);
    if (!responseText) {
      return fallback;
    }

    return extractJsonFromText(responseText);
  } catch (error) {
    return fallback;
  }
};

const generateCareerRecommendation = async ({ profile, resumeText, targetRole }) => {
  const fallbackAnalysis = analyzeResumeScore({ text: resumeText, userSkills: profile.skills || [], targetRole, jobDescription: '' });
  const fallbackGap = analyzeSkillGap({ userSkills: profile.skills || [], roleName: targetRole });

  const fallback = {
    title: `A strong fit for ${fallbackAnalysis.role}`,
    summary: `Focus on ${fallbackAnalysis.missingSkills.slice(0, 3).join(', ') || 'project-building and interviewing'} to become job-ready.`,
    recommendedRoles: [fallbackAnalysis.role, fallbackGap.role, 'Internship-ready Full Stack Developer'],
    strengths: fallbackAnalysis.matchedSkills.slice(0, 5),
    weaknesses: fallbackAnalysis.missingSkills.slice(0, 5),
    nextSteps: fallbackGap.roadmap.stages.intermediate.slice(0, 4),
    portfolioIdeas: [
      'Build a full-stack dashboard with authentication',
      'Create a resume analyzer with PDF upload',
      'Ship a job search tool with filters and save functionality'
    ]
  };

  const prompt = `
You are a career mentor for an engineering student.
Return ONLY valid JSON with keys: title, summary, recommendedRoles, strengths, weaknesses, nextSteps, portfolioIdeas.
Make the response practical and concise.

Profile:
${JSON.stringify(profile, null, 2)}

Target role: ${targetRole}
Resume text:
${resumeText?.slice(0, 7000) || 'No resume text available'}
`;

  return askGeminiJson(prompt, fallback);
};

const generateSkillGapAnalysis = async ({ profile, resumeText = '', targetRole, userSkills = [], extractedSkills = [] }) => {
  const fallbackAnalysis = analyzeSkillGap({ userSkills: userSkills.length ? userSkills : profile.skills || [], roleName: targetRole });
  const fallback = {
    role: fallbackAnalysis.role,
    summary: fallbackAnalysis.summary || `You are missing ${fallbackAnalysis.missingSkills.slice(0, 3).join(', ') || 'key role-specific skills'} for ${targetRole}.`,
    matchedSkills: fallbackAnalysis.matchedSkills,
    missingSkills: fallbackAnalysis.missingSkills,
    matchPercent: fallbackAnalysis.matchPercent,
    roadmap: fallbackAnalysis.roadmap
  };

  const prompt = `
You are helping a student understand how ready they are for a target role.
Return ONLY valid JSON with keys: role, summary, matchedSkills, missingSkills, matchPercent, roadmap.
The roadmap value must be an object with a "stages" property containing beginner, intermediate, and advanced arrays.
Make the analysis specific to the supplied role, current skills, and extracted skills from the resume.

Target role: ${targetRole}

Current skills:
${JSON.stringify(userSkills.length ? userSkills : profile.skills || [], null, 2)}

Extracted skills from resume:
${JSON.stringify(extractedSkills, null, 2)}

Resume text excerpt:
${(resumeText || '').slice(0, 7000)}
`;

  const response = await askGeminiJson(prompt, fallback);

  if (!response || typeof response !== 'object') {
    return fallback;
  }

  const roadmap = response.roadmap || {};
  const stages = roadmap.stages || {
    beginner: Array.isArray(roadmap.beginner) ? roadmap.beginner : [],
    intermediate: Array.isArray(roadmap.intermediate) ? roadmap.intermediate : [],
    advanced: Array.isArray(roadmap.advanced) ? roadmap.advanced : []
  };

  return {
    role: response.role || fallback.role,
    summary: response.summary || fallback.summary,
    matchedSkills: Array.isArray(response.matchedSkills) ? response.matchedSkills : fallback.matchedSkills,
    missingSkills: Array.isArray(response.missingSkills) ? response.missingSkills : fallback.missingSkills,
    matchPercent: typeof response.matchPercent === 'number' ? response.matchPercent : fallback.matchPercent,
    roadmap: {
      role: roadmap.role || response.role || fallback.role,
      stages
    }
  };
};

const generateMentorReply = async ({ message, history = [], profile, recommendedRoles = [] }) => {
  const fallbackReply = `Based on your profile, focus on ${profile.skills?.slice(0, 3).join(', ') || 'core fundamentals'} and build one project that proves each skill. If you want, ask me for a role-specific roadmap or interview preparation plan.`;

  const prompt = `
You are a friendly AI career mentor for a final-year engineering student.
Keep the answer concise, practical, and encouraging.
Do not mention being an AI model.

User profile:
${JSON.stringify(profile, null, 2)}

Suggested roles:
${JSON.stringify(recommendedRoles, null, 2)}

Recent conversation:
${JSON.stringify(history.slice(-8), null, 2)}

User message:
${message}
`;

  const text = await askGemini(prompt);
  return text || fallbackReply;
};

const generateAnalysisSummary = async ({ profile, resumeText, targetRole }) => {
  const fallbackScore = analyzeResumeScore({ text: resumeText, userSkills: profile.skills || [], targetRole });
  const fallbackRoadmap = buildLearningRoadmap({ roleName: targetRole, missingSkills: fallbackScore.missingSkills });

  const prompt = `
You are helping analyze a resume for ATS and career fit.
Return ONLY valid JSON with keys: atsScore, strengths, improvements, roadmap.
The roadmap must contain beginner, intermediate, and advanced arrays.

Profile:
${JSON.stringify(profile, null, 2)}

Target role: ${targetRole}
Resume text:
${resumeText?.slice(0, 7000) || 'No resume text available'}
`;

  const fallback = {
    atsScore: fallbackScore.score,
    strengths: fallbackScore.matchedSkills,
    improvements: fallbackScore.suggestions,
    roadmap: fallbackRoadmap.stages
  };

  return askGeminiJson(prompt, fallback);
};

module.exports = {
  askGemini,
  askGeminiJson,
  generateCareerRecommendation,
  generateSkillGapAnalysis,
  generateMentorReply,
  generateAnalysisSummary
};
