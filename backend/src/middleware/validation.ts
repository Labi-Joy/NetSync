import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppValidationError } from './errorHandler';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('🚨 VALIDATION ERRORS DETECTED:');
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    console.log('❌ Validation errors:', errors.array());

    const formattedErrors = errors.array().map(error => ({
      field: 'path' in error ? error.path : error.type,
      message: error.msg,
      value: 'value' in error ? error.value : undefined,
      location: 'location' in error ? error.location : undefined
    }));

    console.log('📋 Formatted errors:', formattedErrors);
    throw new AppValidationError('Validation failed', formattedErrors);
  }
  next();
};

export const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-Z\s\-'\.]+$/)
    .withMessage('Name must be 2-100 characters and contain only letters, spaces, hyphens, apostrophes, and periods'),
  body('professionalInfo.title')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Professional title must be 2-100 characters'),
  body('professionalInfo.company')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be 2-100 characters'),
  body('professionalInfo.experience')
    .isIn(['junior', 'mid', 'senior', 'executive'])
    .withMessage('Experience level must be one of: junior, mid, senior, executive'),
  body('professionalInfo.skills')
    .isArray({ min: 1, max: 20 })
    .withMessage('Skills must be an array with 1-20 items'),
  body('professionalInfo.skills.*')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each skill must be 1-50 characters'),
  body('professionalInfo.interests')
    .isArray({ min: 1, max: 20 })
    .withMessage('Interests must be an array with 1-20 items'),
  body('professionalInfo.interests.*')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each interest must be 1-50 characters'),
  body('networkingProfile.goals')
    .isArray({ min: 1, max: 10 })
    .withMessage('Goals must be an array with 1-10 items'),
  body('networkingProfile.goals.*')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each goal must be 1-100 characters'),
  body('networkingProfile.lookingFor')
    .optional()
    .isIn(['mentor', 'mentee', 'peers', 'collaborators', 'all'])
    .withMessage('Looking for must be one of: mentor, mentee, peers, collaborators, all'),
  body('networkingProfile.communicationStyle')
    .optional()
    .isIn(['proactive', 'reactive', 'structured'])
    .withMessage('Communication style must be one of: proactive, reactive, structured'),
  body('networkingProfile.availability')
    .optional()
    .isArray({ max: 20 })
    .withMessage('Availability must be an array with max 20 items'),
  body('networkingProfile.availability.*')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each availability item must be 1-50 characters'),
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
    .isLength({ min: 3, max: 200 })
    .withMessage('Event name must be 3-200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Event description must be 10-5000 characters'),
  body('startDate')
    .isISO8601()
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Start date must be in the future');
      }
      return true;
    })
    .withMessage('Valid future start date is required'),
  body('endDate')
    .isISO8601()
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    })
    .withMessage('Valid end date after start date is required'),
  body('venue.name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Venue name must be 2-200 characters'),
  body('venue.address')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Venue address must be 5-500 characters'),
  body('capacity')
    .optional()
    .isInt({ min: 1, max: 100000 })
    .withMessage('Capacity must be between 1 and 100,000'),
  handleValidationErrors
];

// Parameter validation
export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

export const validateEventId = [
  param('eventId')
    .isMongoId()
    .withMessage('Invalid event ID format'),
  handleValidationErrors
];

// Query validation for general endpoints
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .matches(/^[a-zA-Z_][a-zA-Z0-9_.]*$/)
    .withMessage('Sort field must be a valid field name'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  handleValidationErrors
];

// Enhanced pagination for large datasets
export const validateAdvancedPagination = [
  query('page')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Page must be between 1 and 10000'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('Limit must be between 1 and 1000'),
  query('sort')
    .optional()
    .isString()
    .isLength({ min: 1, max: 50 })
    .matches(/^[a-zA-Z_][a-zA-Z0-9_.]*$/)
    .withMessage('Sort field must be a valid field name'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  query('cursor')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Cursor must be a valid string'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Search term cannot exceed 200 characters'),
  handleValidationErrors
];

// Cursor-based pagination validation
export const validateCursorPagination = [
  query('cursor')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Cursor must be a valid string'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('direction')
    .optional()
    .isIn(['forward', 'backward'])
    .withMessage('Direction must be forward or backward'),
  handleValidationErrors
];

export const validateEventFilters = [
  query('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Search term cannot exceed 200 characters'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO8601 date'),
  query('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location filter cannot exceed 200 characters'),
  query('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),
  handleValidationErrors
];

// Connection feedback validation
export const validateConnectionFeedback = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
  handleValidationErrors
];

// Bot interaction validation
export const validateBotInitialization = [
  body('userId')
    .optional()
    .isMongoId()
    .withMessage('Valid user ID is required'),
  body('eventId')
    .optional()
    .isMongoId()
    .withMessage('Valid event ID is required'),
  body('context')
    .optional()
    .isString()
    .isIn(['dashboard_chat', 'event_chat', 'networking_session', 'introduction'])
    .withMessage('Valid context is required'),
  body('preferences')
    .optional()
    .isObject()
    .withMessage('Preferences must be an object'),
  body('preferences.style')
    .optional()
    .isIn(['helpful', 'professional', 'casual', 'formal'])
    .withMessage('Valid style preference is required'),
  body('preferences.focus')
    .optional()
    .isIn(['networking', 'learning', 'collaboration', 'general'])
    .withMessage('Valid focus preference is required'),
  handleValidationErrors
];

export const validateBotMessage = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be 1-2000 characters'),
  body('sessionId')
    .optional()
    .isString()
    .withMessage('Session ID must be a string'),
  body('conversationId')
    .optional()
    .isString()
    .withMessage('Conversation ID must be a string'),
  body('context')
    .optional()
    .isObject()
    .withMessage('Context must be an object'),
  body('context.type')
    .optional()
    .isIn(['general_chat', 'introduction_request', 'meetup_scheduling', 'feedback'])
    .withMessage('Valid context type is required'),
  handleValidationErrors
];

export const validateBotIntroduction = [
  body('targetUserId')
    .isMongoId()
    .withMessage('Valid target user ID is required'),
  body('connectionData')
    .optional()
    .isObject()
    .withMessage('Connection data must be an object'),
  body('connectionData.commonInterests')
    .optional()
    .isArray()
    .withMessage('Common interests must be an array'),
  body('connectionData.matchScore')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('Match score must be between 0 and 1'),
  body('connectionData.complementarySkills')
    .optional()
    .isArray()
    .withMessage('Complementary skills must be an array'),
  handleValidationErrors
];

export const validateBotMeetupScheduling = [
  body('conversationId')
    .isString()
    .isLength({ min: 1 })
    .withMessage('Conversation ID is required'),
  body('participants')
    .isArray({ min: 2, max: 10 })
    .withMessage('Participants must be an array with 2-10 users'),
  body('participants.*')
    .isMongoId()
    .withMessage('Each participant must be a valid user ID'),
  body('preferences')
    .optional()
    .isObject()
    .withMessage('Preferences must be an object'),
  body('preferences.duration')
    .optional()
    .isInt({ min: 15, max: 180 })
    .withMessage('Duration must be between 15 and 180 minutes'),
  body('preferences.locationType')
    .optional()
    .isIn(['conference_venue', 'virtual', 'external', 'flexible'])
    .withMessage('Valid location type is required'),
  body('preferences.timePreference')
    .optional()
    .isIn(['morning', 'afternoon', 'evening', 'flexible'])
    .withMessage('Valid time preference is required'),
  handleValidationErrors
];

export const validateBotSuggestions = [
  query('eventId')
    .optional()
    .isMongoId()
    .withMessage('Valid event ID is required'),
  query('type')
    .optional()
    .isIn(['networking', 'sessions', 'meetups', 'general'])
    .withMessage('Valid suggestion type is required'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  handleValidationErrors
];

// User search and filtering validation
export const validateUserFilters = [
  query('search')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Search term cannot exceed 200 characters'),
  query('skills')
    .optional()
    .isString()
    .withMessage('Skills filter must be a string'),
  query('interests')
    .optional()
    .isString()
    .withMessage('Interests filter must be a string'),
  query('experience')
    .optional()
    .isIn(['junior', 'mid', 'senior', 'executive'])
    .withMessage('Experience must be one of: junior, mid, senior, executive'),
  query('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company filter cannot exceed 100 characters'),
  query('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title filter cannot exceed 100 characters'),
  handleValidationErrors
];

// Connection/Match filtering validation
export const validateMatchFilters = [
  query('status')
    .optional()
    .isIn(['suggested', 'introduced', 'connected', 'met', 'collaborated'])
    .withMessage('Status must be a valid connection status'),
  query('minScore')
    .optional()
    .isFloat({ min: 0, max: 1 })
    .withMessage('Minimum score must be between 0 and 1'),
  query('eventId')
    .optional()
    .isMongoId()
    .withMessage('Valid event ID is required'),
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Date from must be a valid ISO8601 date'),
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Date to must be a valid ISO8601 date'),
  handleValidationErrors
];

// Analytics and reporting pagination
export const validateAnalyticsPagination = [
  query('timeframe')
    .optional()
    .isIn(['1h', '6h', '1d', '7d', '30d', '90d', '1y'])
    .withMessage('Timeframe must be a valid duration'),
  query('granularity')
    .optional()
    .isIn(['minute', 'hour', 'day', 'week', 'month'])
    .withMessage('Granularity must be a valid time unit'),
  query('metrics')
    .optional()
    .isString()
    .withMessage('Metrics must be a comma-separated string'),
  handleValidationErrors
];