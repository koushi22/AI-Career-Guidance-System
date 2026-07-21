const JobCard = ({ job, onSave, onApply, saved = false }) => {
  const handleApply = () => {
    const targetUrl = job.applyLink || job.job_apply_link || job.job_google_link;

    if (!targetUrl) {
      return;
    }

    const opened = window.open(targetUrl, '_blank', 'noopener,noreferrer');

    if (!opened) {
      return;
    }

    if (onApply) {
      onApply(job);
    }
  };

  return (
    <article className="glass-card flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{job.title}</h3>
            <p className="mt-1 text-sm text-slate-300">{job.company}</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
            {job.remote ? 'Remote' : 'On-site'}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="rounded-full bg-white/5 px-3 py-1">{job.location || 'Remote'}</span>
          <span className="rounded-full bg-white/5 px-3 py-1">{job.source || 'JSearch'}</span>
          <span className="rounded-full bg-white/5 px-3 py-1">{job.salary || 'Salary not listed'}</span>
        </div>

        <p className="mt-4 line-clamp-4 text-sm leading-6 text-slate-300">
          {job.description || 'Review the role details and apply directly to the job listing.'}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className="soft-button-primary" onClick={handleApply} disabled={!job.applyLink && !job.job_apply_link && !job.job_google_link}>
          Apply now
        </button>
        {onSave ? (
          <button type="button" className="soft-button-secondary" onClick={() => onSave(job)}>
            {saved ? 'Saved' : 'Save job'}
          </button>
        ) : null}
      </div>
    </article>
  );
};

export default JobCard;
