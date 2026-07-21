import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    location: '',
    education: '',
    experience: '',
    targetRole: 'full stack developer',
    skills: ''
  });
  const [latestResume, setLatestResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [{ data: profileData }, { data: resumeData }] = await Promise.all([
          api.get('/users/profile'),
          api.get('/resumes/latest')
        ]);
        const nextUser = profileData.user;
        setUser(nextUser);
        setLatestResume(resumeData.resume);
        setProfile({
          name: nextUser.name || '',
          bio: nextUser.bio || '',
          location: nextUser.location || '',
          education: nextUser.education || '',
          experience: nextUser.experience || '',
          targetRole: nextUser.targetRole || 'full stack developer',
          skills: (nextUser.skills || []).join(', ')
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [setUser]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { data } = await api.put('/users/profile', profile);
      setUser(data.user);
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-hero">
        <section className="mx-auto max-w-5xl px-4 py-10 text-slate-300 sm:px-6 lg:px-8">Loading profile...</section>
      </main>
    );
  }

  return (
    <main className="bg-hero">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.3em] text-aqua">Profile</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Your profile</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Keep your target role, skills, and background updated so the dashboard can personalize your roadmap.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <form className="glass-card p-6" onSubmit={handleSave}>
            <h2 className="section-title">Edit profile</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">Name</label>
                <input className="soft-input" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">Bio</label>
                <textarea rows="4" className="soft-input" value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Location</label>
                <input className="soft-input" value={profile.location} onChange={(event) => setProfile({ ...profile, location: event.target.value })} />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Target role</label>
                <select className="soft-input" value={profile.targetRole} onChange={(event) => setProfile({ ...profile, targetRole: event.target.value })}>
                  <option value="full stack developer">Full Stack Developer</option>
                  <option value="frontend developer">Frontend Developer</option>
                  <option value="backend developer">Backend Developer</option>
                  <option value="data analyst">Data Analyst</option>
                  <option value="ui/ux designer">UI/UX Designer</option>
                  <option value="devops engineer">DevOps Engineer</option>
                  <option value="machine learning engineer">Machine Learning Engineer</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">Education</label>
                <input className="soft-input" value={profile.education} onChange={(event) => setProfile({ ...profile, education: event.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">Experience</label>
                <textarea rows="4" className="soft-input" value={profile.experience} onChange={(event) => setProfile({ ...profile, experience: event.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">Skills</label>
                <input
                  className="soft-input"
                  value={profile.skills}
                  onChange={(event) => setProfile({ ...profile, skills: event.target.value })}
                  placeholder="React, Node.js, MongoDB, Python"
                />
              </div>
            </div>
            {message ? <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">{message}</p> : null}
            <button type="submit" className="soft-button-primary mt-5 w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Save profile'}
            </button>
          </form>

          <div className="grid gap-6">
            <div className="glass-card p-6">
              <h2 className="section-title">Current details</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p><span className="text-slate-100">Name:</span> {user?.name}</p>
                <p><span className="text-slate-100">Email:</span> {user?.email}</p>
                <p><span className="text-slate-100">Target role:</span> {user?.targetRole}</p>
                <p><span className="text-slate-100">Skills:</span> {(user?.skills || []).join(', ') || 'None yet'}</p>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="section-title">Latest resume</h2>
              {latestResume ? (
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <p>File: {latestResume.originalName}</p>
                  <p>ATS score: {latestResume.atsScore}%</p>
                  <p>Suggested role: {latestResume.targetRole}</p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-300">Upload a resume from the dashboard to see it here.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
