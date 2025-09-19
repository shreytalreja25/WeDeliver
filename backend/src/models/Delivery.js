import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema(
  {
    lat: Number,
    lng: Number,
  },
  { _id: false },
);

const timelineEventSchema = new mongoose.Schema(
  {
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
  },
  { _id: false },
);

const deliverySchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    status: {
      type: String,
      enum: ['assigned', 'picked', 'enroute', 'delivered', 'failed'],
      default: 'assigned',
    },
    eta: Date,
    origin: { type: pointSchema, required: true },
    destination: { type: pointSchema, required: true },
    timeline: { type: [timelineEventSchema], default: [] },
  },
  { timestamps: true },
);

export const Delivery = mongoose.model('Delivery', deliverySchema);
