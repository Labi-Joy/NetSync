import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

interface SecretConfig {
  name: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

const SECRET_CONFIGS: SecretConfig[] = [
  {
    name: 'JWT_SECRET',
    required: true,
    description: 'JWT signing secret (should be 256+ bits)'
  },
  {
    name: 'MONGODB_URI',
    required: true,
    description: 'MongoDB connection string'
  },
  {
    name: 'REDIS_URL',
    required: false,
    description: 'Redis connection URL',
    defaultValue: 'redis://localhost:6379'
  },
  {
    name: 'SENSAY_API_KEY',
    required: false,
    description: 'Sensay API key for bot functionality'
  },
  {
    name: 'SMTP_USER',
    required: false,
    description: 'SMTP username for email notifications'
  },
  {
    name: 'SMTP_PASS',
    required: false,
    description: 'SMTP password for email notifications'
  }
];

export class SecretsManager {
  private secrets: Map<string, string> = new Map();
  private initialized = false;

  constructor() {
    this.loadSecrets();
  }

  private loadSecrets(): void {
    try {
      // Load from environment variables
      for (const config of SECRET_CONFIGS) {
        const envValue = process.env[config.name];
        if (envValue) {
          this.secrets.set(config.name, envValue);
        } else if (config.defaultValue) {
          this.secrets.set(config.name, config.defaultValue);
        }
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to load secrets:', error);
      throw new Error('Secrets initialization failed');
    }
  }

  get(secretName: string): string | undefined {
    if (!this.initialized) {
      throw new Error('SecretsManager not initialized');
    }
    return this.secrets.get(secretName);
  }

  getRequired(secretName: string): string {
    const value = this.get(secretName);
    if (!value) {
      throw new Error(`Required secret '${secretName}' not found`);
    }
    return value;
  }

  has(secretName: string): boolean {
    return this.secrets.has(secretName);
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const config of SECRET_CONFIGS) {
      if (config.required && !this.has(config.name)) {
        errors.push(`Required secret '${config.name}' is missing: ${config.description}`);
      }
    }

    // Validate JWT secret strength
    const jwtSecret = this.get('JWT_SECRET');
    if (jwtSecret) {
      if (jwtSecret.length < 32) {
        errors.push('JWT_SECRET should be at least 32 characters long');
      }
      if (jwtSecret.includes('dev-jwt-secret') || jwtSecret.includes('changeme') || jwtSecret.includes('default')) {
        errors.push('JWT_SECRET is using default/dev value - MUST CHANGE FOR PRODUCTION!');
      }
      if (process.env.NODE_ENV === 'production' && jwtSecret.length < 64) {
        errors.push('JWT_SECRET should be at least 64 characters long in production');
      }
    }

    // Validate MongoDB URI format
    const mongoUri = this.get('MONGODB_URI');
    if (mongoUri && !mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
      errors.push('MONGODB_URI should start with mongodb:// or mongodb+srv://');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  generateJWTSecret(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  generateRandomSecret(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  exportConfiguration(): Record<string, string> {
    const config: Record<string, string> = {};
    for (const [key, value] of this.secrets) {
      // Mask sensitive values in exports
      if (key.includes('SECRET') || key.includes('PASSWORD') || key.includes('KEY')) {
        config[key] = value ? '***MASKED***' : 'NOT_SET';
      } else {
        config[key] = value;
      }
    }
    return config;
  }

  createSampleEnvFile(filepath: string): void {
    let envContent = '# NetSync Environment Configuration\n';
    envContent += '# Generated on ' + new Date().toISOString() + '\n\n';

    for (const config of SECRET_CONFIGS) {
      envContent += `# ${config.description}\n`;
      
      if (config.name === 'JWT_SECRET') {
        envContent += `${config.name}=${this.generateJWTSecret()}\n`;
      } else if (config.defaultValue) {
        envContent += `${config.name}=${config.defaultValue}\n`;
      } else {
        envContent += `${config.name}=\n`;
      }
      envContent += '\n';
    }

    fs.writeFileSync(filepath, envContent);
    console.log(`Sample environment file created at: ${filepath}`);
  }
}

// Singleton instance
export const secretsManager = new SecretsManager();

// Validation helper for startup
export function validateSecretsOrExit(): void {
  // Skip validation in test environment
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  
  const validation = secretsManager.validate();
  
  if (!validation.valid) {
    console.error('❌ Secrets validation failed:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
    console.error('\nPlease check your environment configuration.');
    
    if (process.env.NODE_ENV === 'development') {
      console.log('\n💡 You can generate a sample .env file with:');
      console.log('   npm run generate-env');
    }
    
    process.exit(1);
  }

  console.log('✅ Secrets validation passed');
}

// Helper to safely access secrets with fallbacks
export function getSecret(name: string, fallback?: string): string {
  return secretsManager.get(name) || fallback || '';
}

export function getRequiredSecret(name: string): string {
  return secretsManager.getRequired(name);
}