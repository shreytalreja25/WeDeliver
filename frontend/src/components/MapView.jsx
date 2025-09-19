import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { useLiveStore } from '../store/useLiveStore.js';

export default function MapView() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const { drivers, incidents, zones, t } = useLiveStore((state) => ({
    drivers: state.drivers,
    incidents: state.incidents,
    zones: state.zones,
    t: state.t,
  }));

  useEffect(() => {
    if (import.meta.env.MODE === 'test') return;
    if (mapRef.current || !containerRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: import.meta.env.VITE_MAPTILES_URL
        ? {
            version: 8,
            sources: {
              osm: {
                type: 'raster',
                tiles: [import.meta.env.VITE_MAPTILES_URL],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors',
              },
            },
            layers: [
              {
                id: 'osm',
                type: 'raster',
                source: 'osm',
              },
            ],
          }
        : 'https://demotiles.maplibre.org/style.json',
      center: [151.2093, -33.8688],
      zoom: 12,
    });
  }, []);

  useEffect(() => {
    if (import.meta.env.MODE === 'test') return;
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    drivers.forEach((driver) => {
      const marker = new maplibregl.Marker({ color: '#7c3aed' })
        .setLngLat([driver.location.lng, driver.location.lat])
        .setPopup(new maplibregl.Popup().setText(`${driver.code} • ${driver.status}`))
        .addTo(mapRef.current);
      markersRef.current.push(marker);
    });

    incidents.forEach((incident) => {
      const colorMap = { accident: '#ef4444', police: '#f59e0b', ambulance: '#22c55e' };
      const marker = new maplibregl.Marker({ color: colorMap[incident.type] })
        .setLngLat([incident.location.lng, incident.location.lat])
        .setPopup(new maplibregl.Popup().setText(`${incident.type} severity ${incident.severity}`))
        .addTo(mapRef.current);
      markersRef.current.push(marker);
    });
  }, [drivers, incidents]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full rounded-xl bg-slate-800" aria-label="Map canvas" />
      <div className="absolute bottom-4 left-4 rounded bg-slate-900/80 px-3 py-1 text-sm" aria-label="Sim time">
        Sim time t={t}
      </div>
      <div className="sr-only" data-testid="map-drivers">
        {drivers.map((driver) => (
          <span key={driver.id || driver.code}>{driver.code}</span>
        ))}
      </div>
      <div className="sr-only" data-testid="map-incidents">
        {incidents.map((incident) => (
          <span key={incident.id || `${incident.type}-${incident.location.lat}`}>{incident.type}</span>
        ))}
      </div>
      <div className="sr-only" data-testid="map-zones">
        {zones.map((zone, idx) => (
          <span key={zone._id || idx}>{zone.label}</span>
        ))}
      </div>
    </div>
  );
}
