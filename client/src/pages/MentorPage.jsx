import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

const starterPrompts = [
  'What should I learn next for full stack roles?',
  'Review my resume strengths and weaknesses.',
  'How do I prepare for an internship interview?',
  'Give me a 30-day learning plan.'
];

const MentorPage = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ask me about career roles, resume improvement, learning plans, or interview preparation.' }
  ]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (text = message) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const nextMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setMessage('');
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/ai/chat', {
        message: trimmed,
        history: nextMessages
      });
      setMessages((current) => [...current, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reach the mentor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-hero">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.3em] text-aqua">Mentor mode</p>
          <h1 className="mt-2 text-4xl font-bold text-white">AI Career Mentor</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Use the Gemini-powered chatbot to get practical advice on resumes, skills, projects, and interviews.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.4fr]">
          <div className="glass-card flex h-[70vh] flex-col p-5">
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
              {messages.map((entry, index) => (
                <div key={`${entry.role}-${index}`} className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                      entry.role === 'user'
                        ? 'bg-aqua text-slate-950'
                        : 'border border-white/10 bg-white/5 text-slate-100'
                    }`}
                  >
                    {entry.content}
                  </div>
                </div>
              ))}
              {loading ? <div className="text-sm text-slate-400">Thinking...</div> : null}
            </div>

            {error ? <div className="mt-4 rounded-2xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

            <div className="mt-4 grid gap-3">
              <div className="flex flex-wrap gap-2">
                {starterPrompts.map((prompt) => (
                  <button key={prompt} type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200" onClick={() => sendMessage(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  className="soft-input"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Ask the mentor anything career-related"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button type="button" className="soft-button-primary shrink-0" onClick={() => sendMessage()} disabled={loading}>
                  Send
                </button>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="section-title">How to use</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li>• Ask for a roadmap for your target role.</li>
              <li>• Paste a resume summary and request improvement ideas.</li>
              <li>• Ask which projects best match your current skill level.</li>
              <li>• Request interview preparation advice for internships or placements.</li>
            </ul>
            <div className="mt-6 rounded-3xl border border-aqua/20 bg-aqua/10 p-4 text-sm text-slate-100">
              The mentor uses Gemini when your API key is available and falls back to practical guidance when it is not.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MentorPage;
