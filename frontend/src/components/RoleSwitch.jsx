import { useAuthStore } from '../store/useAuthStore.js';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'driver', label: 'Driver' },
  { value: 'customer', label: 'Customer' },
];

export default function RoleSwitch() {
  const role = useAuthStore((state) => state.role);
  const setRole = useAuthStore((state) => state.setRole);

  return (
    <div className="rounded-xl bg-slate-900/60 p-4 shadow-lg">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Role</h3>
      <div className="mt-3 flex gap-2">
        {roles.map((entry) => (
          <button
            key={entry.value}
            type="button"
            onClick={() => setRole(entry.value)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold shadow transition ${
              role === entry.value ? 'bg-driver text-white' : 'bg-slate-700 text-slate-200'
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>
    </div>
  );
}
