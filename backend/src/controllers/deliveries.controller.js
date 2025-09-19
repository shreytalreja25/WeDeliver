import dayjs from 'dayjs';

import { Delivery } from '../models/Delivery.js';

export const listDeliveries = async (_req, res) => {
  const deliveries = await Delivery.find().lean();
  return res.json(deliveries);
};

export const createDelivery = async (req, res) => {
  const payload = req.validated.body;
  const delivery = await Delivery.create({
    ...payload,
    eta: payload.eta ? dayjs(payload.eta).toDate() : undefined,
    timeline: [
      {
        status: 'assigned',
        timestamp: new Date(),
        note: 'Delivery created',
      },
    ],
  });
  return res.status(201).json(delivery);
};

export const getDelivery = async (req, res) => {
  const { id } = req.validated.params;
  const delivery = await Delivery.findById(id).lean();
  if (!delivery) {
    return res.status(404).json({ message: 'Delivery not found' });
  }
  return res.json(delivery);
};

export const updateDeliveryStatus = async (req, res) => {
  const { id } = req.validated.params;
  const { status, note } = req.validated.body;

  const delivery = await Delivery.findById(id);
  if (!delivery) {
    return res.status(404).json({ message: 'Delivery not found' });
  }

  delivery.status = status;
  delivery.timeline.push({ status, note, timestamp: new Date() });
  await delivery.save();

  return res.json(delivery);
};
