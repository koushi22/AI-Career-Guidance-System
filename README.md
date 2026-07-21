# CareerPulse AI

CareerPulse AI is a full-stack AI-powered career assistant built for students and job seekers. It helps users manage their profile, upload a resume, analyze it for ATS relevance, explore job opportunities, and get personalized career guidance through an AI mentor.

## What this project does

This application provides a complete career workspace with the following capabilities:

- User registration and login with JWT authentication
- Protected dashboard for authenticated users
- PDF resume upload and parsing
- ATS-style resume scoring with improvement suggestions
- Skill gap analysis for target roles
- Personalized learning roadmap suggestions
- Job search with filters and direct apply links
- Job saving for later review
- AI mentor chat powered by Google Gemini
- Profile management for skills, background, and target role

## Tech stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- pdf-parse for resume text extraction

### AI and external services
- Google Gemini API for career recommendations and mentor responses
- JSearch API for live job listings

## Project structure

```text
trioproject/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── app.js
│   │   ├── index.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── package.json
└── README.md
```

## Main features implemented

### 1. Authentication
Users can register, log in, and stay authenticated with a JWT token stored in the browser.

### 2. Resume analysis
Users can upload a PDF resume and receive:
- extracted text from the uploaded file
- ATS-style score
- matched and missing skills
- actionable suggestions for improvement

### 3. Career guidance
The app evaluates the resume against a target role and generates:
- skill gap insights
- a learning roadmap
- recommended career directions

### 4. Job discovery
The jobs page allows users to:
- search for jobs by keyword and location
- filter by remote-only jobs
- view direct apply links
- save jobs to revisit later

### 5. AI mentor
A chat-based mentor experience uses Gemini to help users with:
- learning plans
- resume improvement advice
- interview preparation guidance
- role-specific career suggestions

### 6. Profile management
Users can update their personal profile including:
- name and bio
- location
- education and experience
- target role
- skills

## How the app works

1. The user creates an account or logs in.
2. They can update their profile and choose a target role.
3. They upload a PDF resume for analysis.
4. The backend extracts the resume text and evaluates it.
5. The dashboard shows ATS score, skill gaps, and AI guidance.
6. The user can search jobs and save ones they want to apply for.
7. The AI mentor helps with career- and interview-related questions.

## Prerequisites

Make sure you have the following installed:
- Node.js (recommended latest LTS)
- npm
- MongoDB Atlas connection string or access to a local MongoDB instance

## Installation

From the project root, install dependencies for both client and server:

```bash
npm install
```

## Environment variables

Create a `.env` file in the project root with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
JSEARCH_API_KEY=your_jsearch_api_key
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api
```

### Notes on environment variables
- `PORT` sets the backend port.
- `MONGODB_URI` is optional. If it is missing, the server falls back to an in-memory MongoDB instance.
- `GEMINI_API_KEY` enables Gemini-based recommendations and mentor chat.
- `JSEARCH_API_KEY` enables live job search; otherwise the app uses fallback sample jobs.
- `CLIENT_URL` is used for CORS configuration.
- `VITE_API_URL` tells the frontend where the backend API is running.

## Running the project locally

Start both the server and the client:

```bash
npm run dev
```

This will run:
- backend on `http://localhost:5000`
- frontend on `http://localhost:5173`

## API overview

The backend exposes these main API groups:

- `/api/auth` — register, login, logout, current user
- `/api/users` — profile read and update
- `/api/resumes` — upload and fetch resumes
- `/api/jobs` — job search and saved jobs
- `/api/ai` — ATS analysis, recommendations, mentor chat
- `/api/dashboard` — dashboard summary data

## Deployment notes

The project is designed to be deployable on services such as Render and Vercel:
- backend: Node.js/Express service
- frontend: Vite app
- database: MongoDB Atlas

## Important implementation notes

- Gemini-based features gracefully fall back to local analysis when the API key is missing.
- Live job search depends on `JSEARCH_API_KEY`; without it, the app still shows fallback job results.
- Resume text and uploaded file data are stored in MongoDB for future analysis.

## Summary

CareerPulse AI is a practical, modern full-stack project that combines authentication, resume analysis, AI-assisted career guidance, job discovery, and profile management in one cohesive experience.
