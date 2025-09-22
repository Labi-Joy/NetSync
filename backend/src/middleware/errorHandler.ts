import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Standard error response interface
export interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
  code?: string;
  timestamp: string;
  path: string;
}

// Custom error classes
export class AppError extends Error {
  statusCode: number;
  code?: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AppValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'AppValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

// Error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  const path = req.originalUrl;

  // Handle known operational errors
  if (err instanceof AppError) {
    const response: ErrorResponse = {
      error: err.message,
      code: err.code,
      timestamp,
      path
    };

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));

    const response: ErrorResponse = {
      error: 'Validation failed',
      message: 'Invalid input data',
      details: errors,
      code: 'VALIDATION_ERROR',
      timestamp,
      path
    };

    res.status(400).json(response);
    return;
  }

  // Handle Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    const response: ErrorResponse = {
      error: `${field} already exists`,
      message: 'Duplicate field value',
      code: 'DUPLICATE_ERROR',
      timestamp,
      path
    };

    res.status(409).json(response);
    return;
  }

  // Handle Mongoose cast errors
  if (err instanceof mongoose.Error.CastError) {
    const response: ErrorResponse = {
      error: `Invalid ${err.path}: ${err.value}`,
      message: 'Invalid data format',
      code: 'CAST_ERROR',
      timestamp,
      path
    };

    res.status(400).json(response);
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    const response: ErrorResponse = {
      error: 'Invalid token',
      message: 'Authentication token is invalid',
      code: 'JWT_ERROR',
      timestamp,
      path
    };

    res.status(401).json(response);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    const response: ErrorResponse = {
      error: 'Token expired',
      message: 'Authentication token has expired',
      code: 'JWT_EXPIRED',
      timestamp,
      path
    };

    res.status(401).json(response);
    return;
  }

  // Handle multer errors (file upload)
  if (err.name === 'MulterError') {
    const response: ErrorResponse = {
      error: 'File upload error',
      message: err.message,
      code: 'UPLOAD_ERROR',
      timestamp,
      path
    };

    res.status(400).json(response);
    return;
  }

  // Log unexpected errors
  console.error('Unexpected error:', {
    error: err.message,
    stack: err.stack,
    path,
    timestamp,
    headers: req.headers,
    body: req.body,
    params: req.params,
    query: req.query
  });

  // Handle unexpected errors
  const response: ErrorResponse = {
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    message: 'Something went wrong',
    code: 'INTERNAL_ERROR',
    timestamp,
    path
  };

  res.status(500).json(response);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const response: ErrorResponse = {
    error: `Route ${req.originalUrl} not found`,
    message: 'The requested endpoint does not exist',
    code: 'ROUTE_NOT_FOUND',
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  };

  res.status(404).json(response);
};

// Graceful shutdown handler
export const gracefulShutdown = (server: any) => {
  const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
  
  signals.forEach(signal => {
    process.on(signal, () => {
      console.log(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });

      // Force close after 30 seconds
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    });
  });

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
};