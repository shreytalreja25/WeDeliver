import { Driver } from '../models/Driver.js';

export const listDrivers = async (_req, res) => {
  const drivers = await Driver.find().lean();
  return res.json(drivers);
};

export const createDriver = async (req, res) => {
  const driver = await Driver.create(req.validated.body);
  return res.status(201).json(driver);
};

export const updateDriver = async (req, res) => {
  const { id } = req.validated.params;
  const driver = await Driver.findByIdAndUpdate(id, req.validated.body, { new: true });
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }
  return res.json(driver);
};

export const getDriver = async (req, res) => {
  const { id } = req.validated.params;
  const driver = await Driver.findById(id).lean();
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }
  return res.json(driver);
};
