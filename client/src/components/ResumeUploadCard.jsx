import { useState } from 'react';

const ResumeUploadCard = ({ onUpload, loading = false }) => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('full stack developer');
  const [jobDescription, setJobDescription] = useState('');

  const submitUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', targetRole);
    formData.append('jobDescription', jobDescription);

    await onUpload(formData);
    setJobDescription('');
  };

  return (
    <form className="glass-card p-5" onSubmit={submitUpload}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Upload Resume</h3>
          <p className="mt-1 text-sm text-slate-300">Upload a PDF and get ATS insights instantly.</p>
        </div>
        <span className="rounded-full border border-aqua/30 bg-aqua/10 px-3 py-1 text-xs text-aqua">
          PDF only
        </span>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Resume PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="soft-input"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Target role</label>
          <select className="soft-input" value={targetRole} onChange={(event) => setTargetRole(event.target.value)}>
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
          <label className="mb-2 block text-sm text-slate-300">Job description for ATS comparison</label>
          <textarea
            rows="5"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            className="soft-input"
            placeholder="Paste a job description here to compare your resume against it."
          />
        </div>
      </div>

      <button type="submit" className="soft-button-primary mt-5 w-full" disabled={loading}>
        {loading ? 'Analyzing...' : 'Upload and analyze'}
      </button>
    </form>
  );
};

export default ResumeUploadCard;
