import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/useAuthStore.js';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const loading = useAuthStore((state) => state.loading);

  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(form);
    if (result) {
      navigate('/admin');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl bg-slate-800 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold text-white">Deliwer Console</h1>
        <p className="text-sm text-slate-400">Sign in to access the control tower.</p>
        <div className="space-y-2">
          <label className="flex flex-col gap-1 text-sm text-slate-300">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-300">
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white"
              required
            />
          </label>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-driver px-4 py-2 text-center text-sm font-semibold text-white"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
