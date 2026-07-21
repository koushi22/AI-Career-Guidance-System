import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import JobCard from '../components/JobCard';

const JobsPage = () => {
  const [filters, setFilters] = useState({ query: 'react developer', location: '', remoteOnly: true });
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [isFallback, setIsFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');

  const savedJobIds = useMemo(() => new Set(savedJobs.map((job) => job.externalJobId)), [savedJobs]);

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    setIsFallback(false);
    try {
      const { data: jobsData } = await api.get('/jobs', { params: filters });
      setJobs(jobsData.jobs || []);
      setIsFallback(Boolean(jobsData.fallback));

      // Saved jobs requires auth; fetch separately and ignore failures for unauthenticated users
      try {
        const { data: savedData } = await api.get('/jobs/saved');
        setSavedJobs(savedData.jobs || []);
      } catch (e) {
        setSavedJobs([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadJobs();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.query, filters.location, filters.remoteOnly]);

  const handleSearch = async (event) => {
    event.preventDefault();
    await loadJobs();
  };

  const handleSave = async (job) => {
    setSavingId(job.externalJobId || job.title);
    try {
      const { data } = await api.post('/jobs/save', job);
      setSavedJobs((current) => {
        const filtered = current.filter((savedJob) => savedJob.externalJobId !== data.savedJob.externalJobId);
        return [data.savedJob, ...filtered];
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job');
    } finally {
      setSavingId('');
    }
  };

  const handleApply = (job) => {
    setError('');
    loadJobs();
  };

  return (
    <main className="bg-hero">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.3em] text-aqua">Live opportunities</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Real-time job listings</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Search and save jobs using the JSearch API. Filters update the listings and apply links stay direct to the source.
          </p>
        </motion.div>

        <form className="glass-card mt-8 grid gap-4 p-5 md:grid-cols-[1.4fr_1fr_0.6fr_auto]" onSubmit={handleSearch}>
          <input
            className="soft-input"
            value={filters.query}
            onChange={(event) => setFilters({ ...filters, query: event.target.value })}
            placeholder="Search by role or keyword"
          />
          <input
            className="soft-input"
            value={filters.location}
            onChange={(event) => setFilters({ ...filters, location: event.target.value })}
            placeholder="Location"
          />
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={filters.remoteOnly}
              onChange={(event) => setFilters({ ...filters, remoteOnly: event.target.checked })}
            />
            Remote only
          </label>
          <button type="submit" className="soft-button-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error ? <div className="mt-6 rounded-2xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}
        {isFallback ? (
          <div className="mt-6 rounded-2xl border border-amber-600/30 bg-amber-600/8 px-4 py-3 text-sm text-amber-200">Showing sample results while live jobs are unavailable.</div>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="glass-card p-6 text-slate-300">Loading job listings...</div>
          ) : jobs.length > 0 ? (
            jobs.map((job, index) => (
              <motion.div
                key={`${job.externalJobId}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
              >
                <JobCard job={job} onSave={handleSave} onApply={handleApply} saved={savedJobIds.has(job.externalJobId)} />
              </motion.div>
            ))
          ) : (
            <div className="glass-card p-6 text-slate-300">No jobs found for the current search.</div>
          )}
        </div>

        <div className="mt-10 glass-card p-6">
          <h2 className="section-title">Saved jobs</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {savedJobs.length > 0 ? (
              savedJobs.map((job) => (
                <div key={job._id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="font-semibold text-white">{job.title}</p>
                  <p className="mt-1 text-sm text-slate-300">{job.company}</p>
                  <a href={job.applyLink} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-aqua hover:underline">
                    Open application
                  </a>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-300">Save jobs from the listings to track them here.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default JobsPage;
