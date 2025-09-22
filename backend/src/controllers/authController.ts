import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User';
import { redisClient } from '../config/database';
import { JWTPayload } from '../types';

const generateTokens = (userId: string, email: string) => {
  const jwtSecret = process.env.JWT_SECRET!;
  const accessTokenOptions = { expiresIn: process.env.JWT_EXPIRE || '24h' };
  const refreshTokenOptions = { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' };

  try {
    const accessToken = jwt.sign(
      { userId, email },
      jwtSecret,
      accessTokenOptions as any
    );

    const refreshToken = jwt.sign(
      { userId, email },
      jwtSecret,
      refreshTokenOptions as any
    );

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Token generation failed:', error);
    throw error;
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, professionalInfo, networkingProfile } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const user = new User({
      email,
      password,
      name,
      professionalInfo,
      networkingProfile: networkingProfile || {},
      isEmailVerified: true // Auto-verify all users on signup
    });

    await user.save();

    const { accessToken, refreshToken } = generateTokens((user._id as any).toString(), user.email);

    user.refreshTokens.push(refreshToken);
    await user.save();

    await redisClient.setEx(`user:${user._id}:session`, 86400, JSON.stringify({
      userId: user._id,
      email: user.email,
      lastActivity: new Date()
    }));

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('❌ Registration error occurred:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    // More specific error handling
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message
      }));
      console.error('📋 Validation errors:', validationErrors);
      res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    } else if (error.code === 11000) {
      console.error('🔄 Duplicate key error');
      res.status(409).json({ error: 'Email already registered' });
    } else {
      console.error('🚨 Unexpected error during registration');
      res.status(500).json({ 
        error: 'Registration failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    const { accessToken, refreshToken } = generateTokens((user._id as any).toString(), user.email);
    
    user.refreshTokens.push(refreshToken);
    await user.save();
    
    await redisClient.setEx(`user:${user._id}:session`, 86400, JSON.stringify({
      userId: user._id,
      email: user.email,
      lastActivity: new Date()
    }));
    
    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token required' });
      return;
    }
    
    const jwtSecret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(refreshToken, jwtSecret) as JWTPayload;
    
    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      res.status(403).json({ error: 'Invalid refresh token' });
      return;
    }
    
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      (user._id as any).toString(),
      user.email
    );
    
    user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();
    
    res.json({
      tokens: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: 'Invalid refresh token' });
    } else {
      console.error('Token refresh error:', error);
      res.status(500).json({ error: 'Token refresh failed' });
    }
  }
};

export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id as any);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const logout = async (req: any, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findById(req.user._id as any);
    
    if (user && refreshToken) {
      user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
      await user.save();
    }
    
    await redisClient.del(`user:${req.user._id as any}:session`);
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};