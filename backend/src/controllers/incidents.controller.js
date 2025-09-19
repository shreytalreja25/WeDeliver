import { Incident } from '../models/Incident.js';

const withinBbox = (bbox, location) => {
  if (!bbox) return true;
  const [west, south, east, north] = bbox.split(',').map(Number);
  return location.lng >= west && location.lng <= east && location.lat >= south && location.lat <= north;
};

export const listIncidents = async (req, res) => {
  const bbox = req.validated.query?.bbox;
  const incidents = await Incident.find().lean();
  const filtered = incidents.filter((incident) => withinBbox(bbox, incident.location));
  return res.json(filtered);
};

export const createIncident = async (req, res) => {
  const payload = req.validated.body;
  const incident = await Incident.create(payload);
  return res.status(201).json(incident);
};

export const deleteIncident = async (req, res) => {
  const { id } = req.validated.params;
  const incident = await Incident.findByIdAndDelete(id);
  if (!incident) {
    return res.status(404).json({ message: 'Incident not found' });
  }
  return res.json({ message: 'Deleted' });
};

export const addExternalIncidents = async (payloads = []) => {
  if (!Array.isArray(payloads) || payloads.length === 0) return [];
  // TODO: Integrate Twitter/X, Reddit, RSS, and traffic APIs once available.
  const incidents = await Incident.insertMany(payloads);
  return incidents;
};
