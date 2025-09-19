import { useParams, useSearchParams } from 'react-router-dom';

import MapView from '../components/MapView.jsx';
import { useLiveStore } from '../store/useLiveStore.js';

export default function Customer() {
  const { deliveryId } = useParams();
  const [params] = useSearchParams();
  const token = params.get('token');
  const incidents = useLiveStore((state) => state.incidents);
  const drivers = useLiveStore((state) => state.drivers);

  const driver = drivers[0];

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="rounded-xl bg-slate-900/60 p-4 text-sm text-slate-200 shadow-lg">
        <h2 className="text-lg font-semibold text-white">Tracking #{deliveryId}</h2>
        <p className="mt-1 text-slate-400">
          Token: <span className="font-mono text-slate-300">{token || 'demo'}</span>
        </p>
        <p className="mt-2 text-slate-400">
          Assigned driver: <span className="font-semibold text-white">{driver?.code || 'Pending'}</span>
        </p>
        <p className="mt-2 text-slate-400">
          Nearby alerts: <span className="font-semibold text-white">{incidents.length}</span>
        </p>
      </div>
      <div className="h-[420px] flex-1 overflow-hidden rounded-xl bg-slate-800">
        <MapView />
      </div>
    </div>
  );
}
