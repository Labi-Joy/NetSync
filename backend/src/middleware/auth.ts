import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';
import { User, IUserDocument } from '../models/User';
import { getRequiredSecret } from '../utils/secrets';
import { redisClient } from '../config/database';

export interface AuthenticatedRequest extends Request {
  user?: IUserDocument; // Optional but guaranteed by authenticateToken middleware
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface OptionalAuthRequest extends Request {
  user?: IUserDocument; // Optional for public endpoints
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const jwtSecret = getRequiredSecret('JWT_SECRET');
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    
    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      res.status(401).json({ error: 'Token has been revoked' });
      return;
    }
    
    const user = await User.findById(decoded.userId).select('-password -refreshTokens');
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: 'Invalid or expired token' });
    } else {
      res.status(500).json({ error: 'Authentication error' });
    }
  }
};

export const optionalAuth = async (
  req: OptionalAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const jwtSecret = getRequiredSecret('JWT_SECRET');
      const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
      const user = await User.findById(decoded.userId).select('-password -refreshTokens');
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};