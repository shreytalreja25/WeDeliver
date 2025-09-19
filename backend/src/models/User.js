import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'driver', 'customer'], required: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } },
);

export const User = mongoose.model('User', userSchema);
