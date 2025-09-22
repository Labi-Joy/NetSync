#!/usr/bin/env ts-node
import { SecretsManager } from '../utils/secrets';
import path from 'path';

const secretsManager = new SecretsManager();

// Generate secure environment file
const envPath = path.join(process.cwd(), '.env.generated');
secretsManager.createSampleEnvFile(envPath);

console.log('✅ Generated secure environment file with random secrets');
console.log('📝 Please review and customize the values as needed');
console.log('🔒 Remember to keep this file secure and never commit it to version control');