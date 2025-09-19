import { useParams } from 'react-router-dom';

import EventFeed from '../components/EventFeed.jsx';
import MapView from '../components/MapView.jsx';
import { useToastContext } from '../lib/ToastContext.jsx';
import api from '../lib/api.js';
import { useLiveStore } from '../store/useLiveStore.js';

export default function Driver() {
  const { driverId } = useParams();
  const { pushToast } = useToastContext();
  const drivers = useLiveStore((state) => state.drivers);

  const driver = drivers.find((item) => item.id === driverId || item._id === driverId);

  const reportStalled = async () => {
    try {
      await api.post('/api/incidents', {
        type: 'accident',
        severity: 2,
        ttlSec: 600,
        location: driver?.location || { lat: -33.87, lng: 151.21 },
      });
      pushToast('Stall reported to dispatch', 'success');
    } catch (error) {
      pushToast('Failed to report incident', 'error');
    }
  };

  return (
    <div className="flex h-full flex-col gap-4 lg:flex-row">
      <div className="flex w-full flex-col gap-4 lg:w-72">
        <div className="rounded-xl bg-slate-900/60 p-4 text-sm text-slate-200 shadow-lg">
          <h2 className="text-lg font-semibold text-white">Driver Console</h2>
          <p className="mt-2 text-slate-400">Vehicle ID: {driver?.code || driverId}</p>
          <button
            type="button"
            onClick={reportStalled}
            className="mt-3 rounded-lg bg-accident px-3 py-2 text-xs font-semibold text-white"
          >
            Report Incident
          </button>
        </div>
        <EventFeed />
      </div>
      <div className="h-[420px] flex-1 overflow-hidden rounded-xl bg-slate-800 lg:h-full">
        <MapView />
      </div>
    </div>
  );
}
