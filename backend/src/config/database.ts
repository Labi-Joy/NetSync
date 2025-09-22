import mongoose from 'mongoose';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const connectMongoDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/netsync';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create Redis client with proper URL validation
const createRedisClient = () => {
  const redisUrl = process.env.REDIS_URL;

  // Skip Redis if no valid URL provided or using placeholder
  if (!redisUrl || redisUrl.includes('your-redis-password') || redisUrl.includes('your-redis-host')) {
    console.log('⚠️  Redis URL not configured, skipping Redis connection');
    return null;
  }

  try {
    return createClient({ url: redisUrl });
  } catch (error) {
    console.error('Redis client creation error:', error);
    return null;
  }
};

export const redisClient = createRedisClient();

export const connectRedis = async (): Promise<void> => {
  if (!redisClient) {
    console.log('📝 Running without Redis - some features may be limited');
    return;
  }

  try {
    await redisClient.connect();
    console.log('Connected to Redis successfully');
  } catch (error) {
    console.error('Redis connection error:', error);
    console.log('📝 Continuing without Redis - some features may be limited');
  }
};

// Add Redis event handlers only if client exists
if (redisClient) {
  redisClient.on('error', (err) => {
    console.error('Redis error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Redis client connected');
  });

  redisClient.on('ready', () => {
    console.log('Redis client ready');
  });
}