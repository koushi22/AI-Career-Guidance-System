const roleCatalog = {
  'frontend developer': {
    label: 'Frontend Developer',
    requiredSkills: ['html', 'css', 'javascript', 'react', 'git', 'responsive design', 'rest api'],
    summary: 'Builds user interfaces, reusable components, and polished web experiences.',
    roadmap: {
      beginner: ['Master HTML, CSS, and JavaScript basics', 'Build 3 responsive landing pages', 'Learn Git and GitHub workflow'],
      intermediate: ['Build React apps with routing and state management', 'Consume REST APIs in production-style projects', 'Practice performance and accessibility basics'],
      advanced: ['Learn component architecture and testing', 'Build polished dashboards with animations', 'Deploy projects and document them well']
    }
  },
  'backend developer': {
    label: 'Backend Developer',
    requiredSkills: ['node.js', 'express', 'mongodb', 'rest api', 'jwt', 'authentication', 'database design'],
    summary: 'Designs APIs, databases, and secure server-side logic.',
    roadmap: {
      beginner: ['Understand HTTP, REST, and Node.js basics', 'Build simple CRUD APIs', 'Learn MongoDB schema design'],
      intermediate: ['Add authentication and authorization', 'Implement validation and error handling', 'Practice file uploads and data processing'],
      advanced: ['Optimize APIs and indexes', 'Design scalable services', 'Add testing and deployment workflows']
    }
  },
  'full stack developer': {
    label: 'Full Stack Developer',
    requiredSkills: ['html', 'css', 'javascript', 'react', 'node.js', 'express', 'mongodb', 'rest api'],
    summary: 'Works across frontend and backend to ship complete products.',
    roadmap: {
      beginner: ['Learn frontend and backend fundamentals', 'Build a CRUD app end to end', 'Practice Git and deployment basics'],
      intermediate: ['Connect React apps with Express APIs', 'Add authentication and dashboard flows', 'Store and retrieve data from MongoDB'],
      advanced: ['Add file handling and third-party APIs', 'Improve UX, logging, and validation', 'Deploy a full stack project with monitoring basics']
    }
  },
  'data analyst': {
    label: 'Data Analyst',
    requiredSkills: ['excel', 'sql', 'python', 'data visualization', 'statistics', 'dashboarding', 'problem solving'],
    summary: 'Turns data into insights using analysis, dashboards, and reporting.',
    roadmap: {
      beginner: ['Learn Excel, SQL, and basic statistics', 'Practice cleaning datasets', 'Build simple charts and reports'],
      intermediate: ['Use Python for analysis and automation', 'Create dashboards with charts', 'Work on case studies and business metrics'],
      advanced: ['Tell a data story with insights', 'Build portfolio projects with public datasets', 'Learn experimentation and forecasting basics']
    }
  },
  'ui/ux designer': {
    label: 'UI/UX Designer',
    requiredSkills: ['figma', 'wireframing', 'prototyping', 'user research', 'visual design', 'design systems', 'accessibility'],
    summary: 'Designs interfaces, user journeys, and design systems.',
    roadmap: {
      beginner: ['Learn layout, typography, and color basics', 'Practice wireframes and user flows', 'Study good product interfaces'],
      intermediate: ['Create interactive prototypes in Figma', 'Design mobile-first case studies', 'Learn usability testing and feedback loops'],
      advanced: ['Build scalable design systems', 'Create portfolio case studies with rationale', 'Work on accessibility and handoff quality']
    }
  },
  'devops engineer': {
    label: 'DevOps Engineer',
    requiredSkills: ['linux', 'docker', 'ci/cd', 'cloud', 'automation', 'monitoring', 'scripting'],
    summary: 'Automates deployment, infrastructure, and system reliability.',
    roadmap: {
      beginner: ['Learn Linux and networking basics', 'Understand Docker and containers', 'Practice shell scripting'],
      intermediate: ['Set up CI/CD pipelines', 'Deploy apps to cloud services', 'Monitor logs and system health'],
      advanced: ['Automate infrastructure provisioning', 'Improve observability and security', 'Build scalable deployment workflows']
    }
  },
  'machine learning engineer': {
    label: 'Machine Learning Engineer',
    requiredSkills: ['python', 'machine learning', 'statistics', 'data preprocessing', 'model evaluation', 'mlops', 'apis'],
    summary: 'Builds data pipelines, models, and deployment workflows for ML products.',
    roadmap: {
      beginner: ['Learn Python, math, and core ML concepts', 'Train models on small datasets', 'Understand preprocessing and evaluation'],
      intermediate: ['Work with pipelines and feature engineering', 'Deploy models through APIs', 'Track experiments and model performance'],
      advanced: ['Learn MLOps and monitoring', 'Optimize model reliability', 'Ship end-to-end ML products']
    }
  }
};

const allSkills = Array.from(
  new Set(
    Object.values(roleCatalog).flatMap((role) => role.requiredSkills)
  )
).sort((left, right) => right.length - left.length);

const defaultRole = 'full stack developer';

module.exports = {
  roleCatalog,
  allSkills,
  defaultRole
};
