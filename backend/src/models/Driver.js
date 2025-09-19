import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
  },
  { _id: false },
);

const driverSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    status: { type: String, default: 'idle' },
    location: { type: locationSchema, required: true },
    routeId: { type: String },
    speedKph: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

export const Driver = mongoose.model('Driver', driverSchema);
