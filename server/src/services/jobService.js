const mapJob = (job) => ({
  externalJobId: String(job.job_id || job.external_job_id || job.id || job.externalJobId || ''),
  title: job.job_title || job.title || 'Unknown Role',
  company: job.employer_name || job.company || 'Unknown Company',
  location: job.job_city || job.location || job.job_country || 'Remote',
  remote: Boolean(job.job_is_remote || job.remote || String(job.job_city || '').toLowerCase().includes('remote')),
  applyLink: job.job_apply_link || job.applyLink || job.job_google_link || null,
  source: job.job_publisher || job.source || 'JSearch',
  salary: job.job_salary || job.salary || 'Not specified',
  description: job.job_description || job.description || '',
  postedAt: job.job_posted_at_datetime_utc || job.postedAt || new Date().toISOString()
});

const getFallbackJobs = ({ query = 'developer', location = '', remoteOnly = false }) => {
  const normalizedQuery = `${query} ${location}`.trim() || 'developer';
  const remoteSuffix = remoteOnly ? ' remote' : '';

  return [
    {
      job_id: `${normalizedQuery}-fallback-1`,
      job_title: `${query || 'Developer'} role`,
      employer_name: 'Sample Opportunity',
      job_city: location || 'Remote',
      job_is_remote: remoteOnly,
      job_apply_link: 'https://www.linkedin.com/jobs',
      job_description: `A sample ${query || 'developer'} opening while the live provider is unavailable.`,
      job_salary: '$80k - $120k',
      job_publisher: 'Fallback',
      job_posted_at_datetime_utc: new Date().toISOString()
    },
    {
      job_id: `${normalizedQuery}-fallback-2`,
      job_title: `${query || 'Software'} Engineer${remoteSuffix}`,
      employer_name: 'Local Startup',
      job_city: location || 'Remote',
      job_is_remote: remoteOnly,
      job_apply_link: 'https://careers.google.com/jobs/',
      job_description: `A fallback listing for ${query || 'software engineering'} while the live jobs API is temporarily unavailable.`,
      job_salary: '$90k - $130k',
      job_publisher: 'Fallback',
      job_posted_at_datetime_utc: new Date().toISOString()
    }
  ].map(mapJob);
};

const searchJobs = async ({ query = 'developer', location = '', remoteOnly = false }) => {
  // Return jobs plus a `fallback` flag so callers can indicate when results
  // are synthetic (fallback) vs live provider results.
  if (!process.env.JSEARCH_API_KEY) {
    console.warn('JSearch API key is not configured, returning fallback jobs.');
    return { jobs: getFallbackJobs({ query, location, remoteOnly }), fallback: true };
  }

  try {
    const url = new URL('https://jsearch.p.rapidapi.com/search');
    url.searchParams.set('query', query);
    url.searchParams.set('page', '1');
    url.searchParams.set('num_pages', '1');
    url.searchParams.set('country', 'us');

    if (location) {
      url.searchParams.set('location', location);
    }

    if (remoteOnly) {
      url.searchParams.set('remote_jobs_only', 'true');
    }

    const response = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': process.env.JSEARCH_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`JSearch request failed with status ${response.status}`);
    }

    const data = await response.json();
    const jobs = Array.isArray(data.data) ? data.data : [];
    return { jobs: jobs.slice(0, 20).map(mapJob), fallback: false };
  } catch (error) {
    console.warn('Live jobs lookup failed, returning fallback jobs:', error.message || error);
    return { jobs: getFallbackJobs({ query, location, remoteOnly }), fallback: true };
  }
};

module.exports = {
  searchJobs,
  mapJob
};
