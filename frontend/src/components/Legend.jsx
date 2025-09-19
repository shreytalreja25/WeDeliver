const entries = [
  { label: 'Drivers', color: 'bg-driver' },
  { label: 'Accident', color: 'bg-accident' },
  { label: 'Police', color: 'bg-police' },
  { label: 'Ambulance', color: 'bg-ambulance' },
  { label: 'Routes', color: 'bg-blue-500' },
  { label: 'Risk Zones', color: 'bg-zone' },
];

export default function Legend() {
  return (
    <div className="rounded-xl bg-slate-900/60 p-4 shadow-lg">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Legend</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {entries.map((entry) => (
          <li key={entry.label} className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${entry.color}`} aria-hidden />
            <span>{entry.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
