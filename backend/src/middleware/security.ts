import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AuthenticatedRequest } from './auth';

// Enhanced security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow for development
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Rate limiting configurations
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 API requests per minute
  message: {
    error: 'Too many API requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Request sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  // Remove potential XSS and injection attempts
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      // Basic HTML entity encoding and script tag removal
      return obj
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  
  if (req.query) {
    req.query = sanitize(req.query);
  }

  next();
};

// IP and User Agent tracking
export const trackRequestMetadata = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  // Get real IP address (considering proxies)
  req.ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                  req.headers['x-real-ip'] as string || 
                  req.connection.remoteAddress || 
                  req.ip;

  // Get user agent
  req.userAgent = req.headers['user-agent'] || 'Unknown';

  next();
};

// CORS configuration for production
export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || [
      'http://localhost:3000',
      'https://localhost:3000'
    ];

    console.log('CORS Check - Origin:', origin, 'Allowed Origins:', allowedOrigins);

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      console.log('CORS - Origin allowed:', origin);
      callback(null, true);
    } else {
      console.error('CORS - Origin rejected:', origin, 'Allowed:', allowedOrigins);
      callback(new Error(`Not allowed by CORS - Origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
};

// Request logging middleware
export const requestLogger = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ipAddress,
      userAgent: req.userAgent,
      userId: req.user?._id || 'anonymous',
      timestamp: new Date().toISOString()
    };

    // Log suspicious activities
    if (res.statusCode >= 400) {
      console.warn('Suspicious request:', logData);
    }

    // Log slow requests
    if (duration > 5000) {
      console.warn('Slow request:', logData);
    }
  });

  next();
};

// Validate content type for POST/PUT requests
export const validateContentType = (req: Request, res: Response, next: NextFunction): void => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    
    if (!contentType || !contentType.includes('application/json')) {
      res.status(415).json({
        error: 'Unsupported Media Type. Content-Type must be application/json'
      });
      return;
    }
  }
  
  next();
};

// Prevent NoSQL injection
export const preventNoSQLInjection = (req: Request, res: Response, next: NextFunction): void => {
  const checkForInjection = (obj: any): boolean => {
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        // Check for MongoDB operators
        if (key.startsWith('$') || key.includes('.')) {
          return true;
        }
        
        if (typeof obj[key] === 'object' && checkForInjection(obj[key])) {
          return true;
        }
      }
    }
    
    return false;
  };

  if (req.body && checkForInjection(req.body)) {
    res.status(400).json({
      error: 'Potentially malicious input detected'
    });
    return;
  }

  if (req.query && checkForInjection(req.query)) {
    res.status(400).json({
      error: 'Potentially malicious query parameters detected'
    });
    return;
  }

  next();
};

// Security middleware stack
export const securityMiddleware = [
  securityHeaders,
  trackRequestMetadata,
  requestLogger,
  sanitizeInput,
  validateContentType,
  preventNoSQLInjection
];