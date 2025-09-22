import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { getRequiredSecret } from '../utils/secrets';

// File filter function
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'));
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
    files: 1 // Only allow 1 file per upload
  },
  fileFilter: fileFilter
});

// Middleware exports
export const uploadProfilePicture = upload.single('profilePicture');
export const uploadEventImage = upload.single('eventImage');

// Helper function to get file URL
export const getFileUrl = (filename: string): string => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `${baseUrl}/uploads/${filename}`;
};

// Helper function to delete file
export const deleteFile = (filename: string): void => {
  const fs = require('fs');
  const path = require('path');
  const uploadPath = process.env.UPLOAD_PATH || './uploads';
  const filePath = path.join(uploadPath, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};