import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import StatCard from '../components/StatCard';
import ResumeUploadCard from '../components/ResumeUploadCard';
import { useAuth } from '../context/AuthContext';

const stageLabels = [
  { key: 'beginner', title: 'Beginner' },
  { key: 'intermediate', title: 'Intermediate' },
  { key: 'advanced', title: 'Advanced' }
];

const DashboardPage = () => {
  const { user, setUser, refreshUser } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/dashboard/summary');
      setDashboard(data);
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    refreshUser();
  }, []);

  const handleUpload = async (formData) => {
    setUploading(true);
    setError('');
    try {
      await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await loadDashboard();
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Resume upload failed');
    } finally {
      setUploading(false);
    }
  };

  const atsScore = dashboard?.latestResume?.atsScore ?? 0;
  const skillMatch = dashboard?.skillGap?.matchPercent ?? 0;
  const recommendation = dashboard?.recommendation;
  const savedJobs = dashboard?.savedJobs || [];

  return (
    <main className="bg-hero">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-aqua">Workspace</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Welcome back, {user?.name || 'student'}.</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Upload a resume, view your ATS score, track skills, save jobs, and chat with your AI career mentor.
          </p>
        </motion.div>

        {error ? <div className="mb-6 rounded-2xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="ATS Score"
                value={`${atsScore}%`}
                description="How well your resume matches your target role."
              />
              <StatCard
                title="Skill Match"
                value={`${skillMatch}%`}
                description="Overlap between your current skills and the target role."
                accent="text-sun"
              />
              <StatCard
                title="Saved Jobs"
                value={savedJobs.length}
                description="Jobs you have saved to revisit later."
                accent="text-sky"
              />
              <StatCard
                title="Target Role"
                value={dashboard?.skillGap?.role?.split(' ')[0] || 'Open'}
                description={dashboard?.skillGap?.role || 'Choose a role in your profile.'}
                accent="text-ember"
              />
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="section-title">Career recommendation</h2>
                  <p className="mt-2 text-sm text-slate-300">Gemini-guided direction for your next move.</p>
                </div>
                <span className="rounded-full border border-aqua/30 bg-aqua/10 px-3 py-1 text-xs text-aqua">
                  AI insight
                </span>
              </div>

              {recommendation ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Summary</p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{recommendation.summary}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Recommended roles</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(recommendation.recommendedRoles || []).map((role) => (
                        <span key={role} className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-100">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Strengths</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(recommendation.strengths || []).map((item) => (
                        <span key={item} className="rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1 text-sm text-aqua">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Next steps</p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                      {(recommendation.nextSteps || []).map((step) => (
                        <li key={step} className="rounded-2xl bg-slate-950/40 px-3 py-2">{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-300">Upload a resume to generate a personalized recommendation.</p>
              )}
            </div>

            <div className="glass-card p-6">
              <h2 className="section-title">Skill gap analysis</h2>
              <p className="mt-2 text-sm text-slate-300">Use this to plan what to learn before applying.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(dashboard?.skillGap?.matchedSkills || []).map((skill) => (
                  <span key={skill} className="rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1 text-sm text-aqua">
                    {skill}
                  </span>
                ))}
                {(dashboard?.skillGap?.missingSkills || []).map((skill) => (
                  <span key={skill} className="rounded-full border border-sun/20 bg-sun/10 px-3 py-1 text-sm text-sun">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {stageLabels.map(({ key, title }) => (
                  <div key={key} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{title}</p>
                    <ul className="mt-4 space-y-2 text-sm text-slate-200">
                      {(dashboard?.skillGap?.roadmap?.stages?.[key] || []).map((step) => (
                        <li key={step} className="rounded-2xl bg-slate-950/40 px-3 py-2">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <ResumeUploadCard onUpload={handleUpload} loading={uploading} />

            <div className="glass-card p-6">
              <h2 className="section-title">Latest resume</h2>
              {dashboard?.latestResume ? (
                <div className="mt-4 space-y-4 text-sm text-slate-300">
                  <p>File: {dashboard.latestResume.originalName}</p>
                  <p>Target role: {dashboard.latestResume.targetRole}</p>
                  <p>Extracted skills: {(dashboard.latestResume.extractedSkills || []).join(', ') || 'None yet'}</p>
                  <p>Suggestions: {(dashboard.latestResume.suggestions || []).join(' • ') || 'No suggestions'}</p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-300">No resume uploaded yet.</p>
              )}
            </div>

            <div className="glass-card p-6">
              <h2 className="section-title">Saved jobs</h2>
              <div className="mt-4 space-y-3">
                {savedJobs.length > 0 ? (
                  savedJobs.map((job) => (
                    <div key={job._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="font-semibold text-white">{job.title}</p>
                      <p className="text-sm text-slate-300">{job.company}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-300">Saved jobs will appear here after you click Save on a job listing.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
