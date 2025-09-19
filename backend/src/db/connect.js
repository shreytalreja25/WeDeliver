import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

let memoryServer;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  let uri = env.MONGODB_URI;

  if (env.NODE_ENV === 'test') {
    if (env.MONGODB_URI_TEST) {
      uri = env.MONGODB_URI_TEST;
    } else {
      memoryServer = await MongoMemoryServer.create();
      uri = memoryServer.getUri();
    }
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  logger.info({ uri }, 'Connected to MongoDB');
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
