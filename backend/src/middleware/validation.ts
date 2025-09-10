import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
    return;
  }
  next();
};

export const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('professionalInfo.title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Professional title is required'),
  body('professionalInfo.company')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Company name is required'),
  body('professionalInfo.experience')
    .isIn(['junior', 'mid', 'senior', 'executive'])
    .withMessage('Valid experience level is required'),
  handleValidationErrors
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required'),
  handleValidationErrors
];

export const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('professionalInfo.title')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Professional title cannot be empty'),
  body('professionalInfo.company')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Company name cannot be empty'),
  body('professionalInfo.experience')
    .optional()
    .isIn(['junior', 'mid', 'senior', 'executive'])
    .withMessage('Valid experience level is required'),
  body('professionalInfo.skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('professionalInfo.interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  body('networkingProfile.goals')
    .optional()
    .isArray()
    .withMessage('Goals must be an array'),
  body('networkingProfile.lookingFor')
    .optional()
    .isIn(['mentor', 'mentee', 'peers', 'collaborators', 'all'])
    .withMessage('Valid lookingFor option is required'),
  body('networkingProfile.communicationStyle')
    .optional()
    .isIn(['proactive', 'reactive', 'structured'])
    .withMessage('Valid communication style is required'),
  handleValidationErrors
];

export const validateEventCreation = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Event name is required'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Event description must be at least 10 characters long'),
  body('startDate')
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('endDate')
    .isISO8601()
    .withMessage('Valid end date is required'),
  body('venue.name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Venue name is required'),
  body('venue.address')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Venue address is required'),
  handleValidationErrors
];