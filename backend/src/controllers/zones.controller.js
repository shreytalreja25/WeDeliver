import { Zone } from '../models/Zone.js';

export const listZones = async (_req, res) => {
  const zones = await Zone.find().lean();
  return res.json(zones);
};

export const createZone = async (req, res) => {
  const zone = await Zone.create(req.validated.body);
  return res.status(201).json(zone);
};

export const updateZone = async (req, res) => {
  const { id } = req.validated.params;
  const zone = await Zone.findByIdAndUpdate(id, req.validated.body, { new: true });
  if (!zone) {
    return res.status(404).json({ message: 'Zone not found' });
  }
  return res.json(zone);
};

export const deleteZone = async (req, res) => {
  const { id } = req.validated.params;
  const zone = await Zone.findByIdAndDelete(id);
  if (!zone) {
    return res.status(404).json({ message: 'Zone not found' });
  }
  return res.json({ message: 'Deleted' });
};
