import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';

// Production security checks
export const enforceHTTPS = (req: Request, res: Response, next: NextFunction): void => {
  if (process.env.NODE_ENV === 'production' && !req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(`https://${req.get('host')}${req.url}`);
  }
  next();
};

// Block access to sensitive routes in production
export const blockSensitiveRoutes = (req: Request, res: Response, next: NextFunction): void => {
  const sensitiveRoutes = [
    '/api/admin',
    '/api/debug',
    '/api/test',
    '/.env',
    '/config',
    '/secrets'
  ];

  if (process.env.NODE_ENV === 'production') {
    const isSensitive = sensitiveRoutes.some(route => req.path.startsWith(route));
    if (isSensitive) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
  }

  next();
};

// Add security headers for API responses
export const apiSecurityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Don't expose server info
  res.removeHeader('X-Powered-By');
  
  next();
};

// Rate limiting for authentication endpoints
export const authRateLimiting = (req: Request, res: Response, next: NextFunction): void => {
  // This will be handled by the rate limiting middleware
  // but we can add additional checks here if needed
  next();
};

// Monitor and log suspicious activities
export const securityMonitoring = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const suspiciousPatterns = [
    /script/i,
    /javascript:/i,
    /<iframe/i,
    /<script/i,
    /eval\(/i,
    /union.*select/i,
    /drop.*table/i
  ];

  const requestContent = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params,
    url: req.originalUrl
  });

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(requestContent));

  if (isSuspicious) {
    console.warn('Suspicious request detected:', {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      url: req.originalUrl,
      method: req.method,
      userId: req.user?._id,
      timestamp: new Date().toISOString()
    });
  }

  next();
};

// Validate file uploads
export const validateFileUpload = (req: Request, res: Response, next: NextFunction): void => {
  if (req.file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(req.file.mimetype)) {
      res.status(400).json({ 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' 
      });
      return;
    }

    if (req.file.size > maxSize) {
      res.status(400).json({ 
        error: 'File too large. Maximum size is 5MB.' 
      });
      return;
    }
  }

  next();
};

// Production middleware stack
export const productionSecurity = [
  enforceHTTPS,
  blockSensitiveRoutes,
  apiSecurityHeaders,
  securityMonitoring
];