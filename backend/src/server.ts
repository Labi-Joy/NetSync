import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { connectMongoDB, connectRedis } from './config/database';
import { SocketHandler } from './socket/socketHandler';
import { requestLogger, logger } from './middleware/logging';
import { generalLimiter, authLimiter, apiLimiter, botLimiter } from './middleware/rateLimiting';
import { 
  securityMiddleware, 
  corsOptions, 
  generalRateLimit, 
  authRateLimit, 
  apiRateLimit 
} from './middleware/security';
import { validateSecretsOrExit } from './utils/secrets';
import { errorHandler, notFoundHandler, gracefulShutdown } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import eventRoutes from './routes/events';
import networkingRoutes from './routes/networking';
import botRoutes from './routes/bot';
import uploadRoutes from './routes/upload';

dotenv.config();

// Validate secrets on startup
validateSecretsOrExit();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Apply security middleware stack
app.use(securityMiddleware);

// CORS configuration
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Request logging is handled by the proper logging middleware below

// Logging middleware
app.use(requestLogger);

// Rate limiting
app.use('/auth', authLimiter);
app.use('/api', apiLimiter);
app.use('/api/bot', botLimiter);
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/networking', networkingRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler for undefined routes
app.use('*', notFoundHandler);

// Global error handler
app.use(errorHandler);

// Initialize Socket.IO
const socketHandler = new SocketHandler(server);

// Database connections and server startup
const startServer = async () => {
  try {
    // Connect to databases
    await connectMongoDB();
    await connectRedis();
    
    // Start server
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
    
    // Setup graceful shutdown
    gracefulShutdown(server);
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

export default app;
