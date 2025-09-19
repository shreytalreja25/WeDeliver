import { useState } from 'react';

import api from '../lib/api.js';
import { incidentShape } from '../lib/shapes.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { useLiveStore } from '../store/useLiveStore.js';

const defaultIncident = {
  type: 'accident',
  severity: 3,
  ttlSec: 600,
  location: { lat: -33.87, lng: 151.21 },
};

export default function ControlBar({ pushToast }) {
  const [showModal, setShowModal] = useState(false);
  const [incidentForm, setIncidentForm] = useState(defaultIncident);

  const role = useAuthStore((state) => state.role);
  const connectSocket = useLiveStore((state) => state.connectSocket);
  const disconnectSocket = useLiveStore((state) => state.disconnectSocket);
  const seedLocal = useLiveStore((state) => state.seedLocal);
  const addIncident = useLiveStore((state) => state.addIncident);
  const clearIncidents = useLiveStore((state) => state.clearIncidents);
  const connected = useLiveStore((state) => state.connected);

  const loadSnapshot = async () => {
    try {
      const [driversRes, incidentsRes, zonesRes] = await Promise.all([
        api.get('/api/drivers'),
        api.get('/api/incidents'),
        api.get('/api/zones'),
      ]);
      seedLocal({
        drivers: driversRes.data,
        incidents: incidentsRes.data,
        zones: zonesRes.data,
      });
      pushToast('Snapshot loaded', 'success');
    } catch (error) {
      pushToast(error.response?.data?.message || 'Failed to load snapshot', 'error');
    }
  };

  const handleSubmitIncident = async (event) => {
    event.preventDefault();
    const parsed = incidentShape.safeParse(incidentForm);
    if (!parsed.success) {
      pushToast('Invalid incident data', 'error');
      return;
    }
    try {
      await api.post('/api/incidents', parsed.data);
      addIncident(parsed.data);
      pushToast('Incident reported', 'success');
      setShowModal(false);
      setIncidentForm(defaultIncident);
    } catch (error) {
      pushToast(error.response?.data?.message || 'Failed to report incident', 'error');
    }
  };

  return (
    <div className="space-y-3 rounded-xl bg-slate-900/60 p-4 shadow-lg">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Controls</h3>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={connectSocket}
          className="rounded-lg bg-driver px-3 py-2 text-sm font-semibold text-white shadow"
        >
          Connect
        </button>
        <button
          type="button"
          onClick={disconnectSocket}
          className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white shadow"
        >
          Disconnect
        </button>
        <button
          type="button"
          onClick={loadSnapshot}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow"
        >
          Step
        </button>
        <button
          type="button"
          onClick={() => {
            seedLocal({ drivers: [], incidents: [], zones: [] });
            pushToast('Local state cleared', 'info');
          }}
          className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white shadow"
        >
          Reset
        </button>
        {(role === 'admin' || role === 'driver') && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-accident px-3 py-2 text-sm font-semibold text-white shadow"
          >
            Add Incident
          </button>
        )}
        {role === 'admin' && (
          <button
            type="button"
            onClick={() => {
              clearIncidents();
              pushToast('Incidents cleared', 'info');
            }}
            className="rounded-lg bg-slate-600 px-3 py-2 text-sm font-semibold text-white shadow"
          >
            Clear Incidents
          </button>
        )}
      </div>
      <div className="text-xs text-slate-400">
        Status: <span className={connected ? 'text-green-400' : 'text-red-400'}>{connected ? 'Connected' : 'Disconnected'}</span>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4">
          <form
            onSubmit={handleSubmitIncident}
            className="w-full max-w-md space-y-4 rounded-xl bg-slate-800 p-6 shadow-xl"
          >
            <h4 className="text-lg font-semibold text-white">Report Incident</h4>
            <div className="space-y-2 text-sm">
              <label className="flex flex-col gap-1">
                <span>Type</span>
                <select
                  value={incidentForm.type}
                  onChange={(event) => setIncidentForm((prev) => ({ ...prev, type: event.target.value }))}
                  className="rounded border border-slate-600 bg-slate-900 px-2 py-1"
                >
                  <option value="accident">Accident</option>
                  <option value="police">Police</option>
                  <option value="ambulance">Ambulance</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span>Latitude</span>
                <input
                  type="number"
                  step="0.0001"
                  value={incidentForm.location.lat}
                  onChange={(event) =>
                    setIncidentForm((prev) => ({
                      ...prev,
                      location: { ...prev.location, lat: parseFloat(event.target.value) },
                    }))
                  }
                  className="rounded border border-slate-600 bg-slate-900 px-2 py-1"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span>Longitude</span>
                <input
                  type="number"
                  step="0.0001"
                  value={incidentForm.location.lng}
                  onChange={(event) =>
                    setIncidentForm((prev) => ({
                      ...prev,
                      location: { ...prev.location, lng: parseFloat(event.target.value) },
                    }))
                  }
                  className="rounded border border-slate-600 bg-slate-900 px-2 py-1"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span>Severity (1-5)</span>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={incidentForm.severity}
                  onChange={(event) =>
                    setIncidentForm((prev) => ({ ...prev, severity: Number(event.target.value) }))
                  }
                  className="rounded border border-slate-600 bg-slate-900 px-2 py-1"
                />
              </label>
            </div>
            <div className="flex justify-end gap-2 text-sm">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg bg-slate-700 px-3 py-2 text-white"
              >
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-driver px-3 py-2 text-white">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
