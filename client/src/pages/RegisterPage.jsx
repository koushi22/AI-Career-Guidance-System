import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    targetRole: 'full stack developer',
    skills: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/register', form);
      register(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-hero">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mx-auto w-full max-w-xl p-8"
        >
          <h1 className="text-3xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-300">Store your profile, resume, roadmap, and job search in one place.</p>

          <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">Full name</label>
              <input
                className="soft-input"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input
                type="email"
                className="soft-input"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-300">Password</label>
              <input
                type="password"
                className="soft-input"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Target role</label>
              <select
                className="soft-input"
                value={form.targetRole}
                onChange={(event) => setForm({ ...form, targetRole: event.target.value })}
              >
                <option value="full stack developer">Full Stack Developer</option>
                <option value="frontend developer">Frontend Developer</option>
                <option value="backend developer">Backend Developer</option>
                <option value="data analyst">Data Analyst</option>
                <option value="ui/ux designer">UI/UX Designer</option>
                <option value="devops engineer">DevOps Engineer</option>
                <option value="machine learning engineer">Machine Learning Engineer</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Skills</label>
              <input
                className="soft-input"
                value={form.skills}
                onChange={(event) => setForm({ ...form, skills: event.target.value })}
                placeholder="React, Node.js, MongoDB"
              />
            </div>
            {error ? <p className="md:col-span-2 rounded-2xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
            <button type="submit" className="soft-button-primary md:col-span-2" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-300">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-aqua hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </section>
    </main>
  );
};

export default RegisterPage;
