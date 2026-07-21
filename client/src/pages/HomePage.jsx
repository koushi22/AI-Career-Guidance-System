import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  'JWT authentication',
  'Resume PDF analysis',
  'ATS scoring with suggestions',
  'Gemini career mentor',
  'JSearch job listings',
  'Personalized learning roadmap'
];

const HomePage = () => {
  return (
    <main className="bg-hero">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex rounded-full border border-aqua/30 bg-aqua/10 px-4 py-2 text-sm font-semibold text-aqua">
              AI-Powered Smart Career Assistant
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Turn your resume into a career plan, job tracker, and mentor in one dashboard.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Built for engineering students who want a clean, practical project that combines React, Node.js, MongoDB, Gemini, and live job listings.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="soft-button-primary">
                Get started
              </Link>
              <Link to="/login" className="soft-button-secondary">
                Login
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="glass-card px-4 py-3 text-sm text-slate-200">
                  {feature}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-card p-6"
          >
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Career dashboard preview</p>
              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl bg-aqua/10 p-4">
                  <p className="text-sm text-aqua">ATS score</p>
                  <p className="mt-2 text-4xl font-bold text-white">84%</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Matched skills</p>
                    <p className="mt-2 text-2xl font-semibold text-white">12</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Saved jobs</p>
                    <p className="mt-2 text-2xl font-semibold text-white">6</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-sun/30 bg-sun/10 p-4 text-sm text-slate-200">
                  Gemini-generated advice, skill gap breakdown, roadmap, and job search tools all in one place.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
