import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { User } from '../models/User';
import { getFileUrl, deleteFile } from '../middleware/upload';
import { asyncHandler } from '../middleware/errorHandler';

export const uploadProfilePicture = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete old profile picture if exists
    if (user.profilePicture) {
      const oldFilename = user.profilePicture.split('/').pop();
      if (oldFilename) {
        deleteFile(oldFilename);
      }
    }

    // Update user with new profile picture URL
    const fileUrl = getFileUrl(req.file.filename);
    user.profilePicture = fileUrl;
    await user.save();

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: fileUrl,
      user: user.toJSON()
    });
  } catch (error) {
    // Clean up uploaded file if database update fails
    if (req.file) {
      deleteFile(req.file.filename);
    }
    throw error;
  }
});

export const deleteProfilePicture = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.profilePicture) {
      return res.status(400).json({ error: 'No profile picture to delete' });
    }

    // Delete file from storage
    const filename = user.profilePicture.split('/').pop();
    if (filename) {
      deleteFile(filename);
    }

    // Update user
    user.profilePicture = null;
    await user.save();

    res.json({
      message: 'Profile picture deleted successfully',
      user: user.toJSON()
    });
  } catch (error) {
    throw error;
  }
});