const StatCard = ({ title, value, description, accent = 'text-aqua' }) => {
  return (
    <div className="glass-card p-5">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <div className={`mt-3 text-4xl font-bold ${accent}`}>{value}</div>
      <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
};

export default StatCard;
