import { Response } from 'express';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';

export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id as any).populate('currentEvent', 'name startDate endDate');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      'name', 'profilePicture', 'professionalInfo', 'networkingProfile'
    ];
    
    const updateKeys = Object.keys(updates);
    const isValidUpdate = updateKeys.every(key => allowedUpdates.includes(key));
    
    if (!isValidUpdate) {
      res.status(400).json({ error: 'Invalid updates' });
      return;
    }
    
    const user = await User.findById(req.user._id as any);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    updateKeys.forEach(key => {
      if (key === 'professionalInfo' || key === 'networkingProfile') {
        user[key] = { ...user[key], ...updates[key] };
      } else {
        (user as any)[key] = updates[key];
      }
    });
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const completeOnboarding = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { professionalInfo, networkingProfile } = req.body;
    
    const user = await User.findById(req.user._id as any);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    if (professionalInfo) {
      user.professionalInfo = { ...user.professionalInfo, ...professionalInfo };
    }
    
    if (networkingProfile) {
      user.networkingProfile = { ...user.networkingProfile, ...networkingProfile };
    }
    
    await user.save();
    
    res.json({
      message: 'Onboarding completed successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    res.status(500).json({ error: 'Failed to complete onboarding' });
  }
};

export const getNetworkingStyle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id as any);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json({
      networkingProfile: user.networkingProfile,
      professionalInfo: {
        experience: user.professionalInfo.experience,
        skills: user.professionalInfo.skills,
        interests: user.professionalInfo.interests
      }
    });
  } catch (error) {
    console.error('Get networking style error:', error);
    res.status(500).json({ error: 'Failed to get networking preferences' });
  }
};