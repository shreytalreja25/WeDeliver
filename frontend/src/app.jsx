import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ToastContext } from './lib/ToastContext.jsx';
import { setAuthInterceptor } from './lib/api.js';
import { useToast } from './lib/useToast.js';
import Admin from './routes/Admin.jsx';
import Customer from './routes/Customer.jsx';
import Driver from './routes/Driver.jsx';
import Login from './routes/Login.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { useLiveStore } from './store/useLiveStore.js';

export default function App() {
  const { toasts, pushToast, dismissToast } = useToast();
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const connected = useLiveStore((state) => state.connected);

  useEffect(() => {
    setAuthInterceptor((error) => {
      const message = error.response?.data?.message || 'Request failed';
      pushToast(message, 'error');
    });
  }, [pushToast]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <ToastContext.Provider value={{ pushToast }}>
      <div className="min-h-screen bg-slate-950 text-white">
        <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold">Deliwer — AI Control Tower</h1>
            <p className="text-sm text-slate-400">Live visibility for dispatch, safety, and customer tracking.</p>
          </div>
          <div
            className={`rounded-full px-4 py-1 text-sm font-semibold ${
              connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}
          >
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </header>
        <main className="mx-auto flex max-w-7xl flex-1 flex-col gap-6 px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/driver/:driverId" element={<Driver />} />
            <Route path="/track/:deliveryId" element={<Customer />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
        <div className="fixed bottom-4 right-4 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`rounded-lg px-4 py-2 text-sm shadow-lg ${
                toast.variant === 'error'
                  ? 'bg-red-500/20 text-red-200'
                  : toast.variant === 'success'
                  ? 'bg-green-500/20 text-green-200'
                  : 'bg-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span>{toast.message}</span>
                <button type="button" onClick={() => dismissToast(toast.id)} className="text-xs text-slate-400">
                  Close
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
