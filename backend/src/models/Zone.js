import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
  },
  { _id: false },
);

const zoneSchema = new mongoose.Schema(
  {
    center: { type: locationSchema, required: true },
    radiusM: { type: Number, required: true },
    level: { type: Number, min: 0, max: 1, required: true },
    label: { type: String, required: true },
  },
  { timestamps: true },
);

export const Zone = mongoose.model('Zone', zoneSchema);
