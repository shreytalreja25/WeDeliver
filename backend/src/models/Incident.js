import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
  },
  { _id: false },
);

const incidentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['accident', 'police', 'ambulance'], required: true },
    location: { type: locationSchema, required: true },
    severity: { type: Number, min: 1, max: 5, default: 3 },
    ttlSec: { type: Number, default: 600 },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } },
);

export const Incident = mongoose.model('Incident', incidentSchema);
