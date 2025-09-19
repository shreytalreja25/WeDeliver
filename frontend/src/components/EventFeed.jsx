import { useLiveStore } from '../store/useLiveStore.js';

export default function EventFeed() {
  const logs = useLiveStore((state) => state.logs);
  return (
    <div className="flex h-48 flex-col overflow-hidden rounded-xl bg-slate-900/60 shadow-inner">
      <div className="border-b border-slate-700 px-4 py-2 text-sm font-semibold uppercase text-slate-400">
        Event Feed
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-2 text-xs">
        {logs.length === 0 && <p className="text-slate-500">No events yet.</p>}
        {logs.map((log) => (
          <div key={log.id} className="text-slate-200">
            <span className="font-mono text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className="ml-2">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
