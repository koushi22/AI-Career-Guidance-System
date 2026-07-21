import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <main className="bg-hero">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:px-8">
        <div className="glass-card px-8 py-10">
          <p className="text-sm uppercase tracking-[0.3em] text-aqua">404</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Page not found</h1>
          <p className="mt-4 text-slate-300">The page you are looking for does not exist or was moved.</p>
          <Link to="/" className="soft-button-primary mt-6">
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
