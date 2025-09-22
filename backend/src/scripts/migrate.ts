import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initializeDatabase, seedSampleData } from './init-db';

// Load environment variables
dotenv.config();

interface Migration {
  version: string;
  description: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

// Migration tracking collection
const MigrationSchema = new mongoose.Schema({
  version: { type: String, required: true, unique: true },
  appliedAt: { type: Date, default: Date.now },
  description: String
});

const MigrationRecord = mongoose.model('Migration', MigrationSchema);

const migrations: Migration[] = [
  {
    version: '001',
    description: 'Initial database setup and indexes',
    up: async () => {
      await initializeDatabase();
    },
    down: async () => {
      // Drop all indexes except _id
      const collections = await mongoose.connection.db!.collections();
      for (const collection of collections) {
        const indexes = await collection.indexes();
        for (const index of indexes) {
          if (index.name !== '_id_') {
            await collection.dropIndex(index.name!);
          }
        }
      }
    }
  },
  {
    version: '002',
    description: 'Seed sample data for development',
    up: async () => {
      if (process.env.NODE_ENV === 'development') {
        await seedSampleData();
      }
    },
    down: async () => {
      // Remove sample data
      await mongoose.connection.db!.collection('events').deleteMany({
        name: 'Web3 Developer Conference 2024'
      });
      await mongoose.connection.db!.collection('users').deleteMany({
        email: { $in: ['alice@example.com', 'bob@example.com'] }
      });
    }
  }
];

export async function runMigrations() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/netsync');
    console.log('✅ Connected to MongoDB');

    // Get applied migrations
    const appliedMigrations = await MigrationRecord.find().sort({ version: 1 });
    const appliedVersions = new Set(appliedMigrations.map(m => m.version));

    console.log(`📊 Found ${appliedMigrations.length} applied migrations`);

    // Run pending migrations
    for (const migration of migrations) {
      if (!appliedVersions.has(migration.version)) {
        console.log(`⏳ Running migration ${migration.version}: ${migration.description}`);
        
        try {
          await migration.up();
          await new MigrationRecord({
            version: migration.version,
            description: migration.description
          }).save();
          
          console.log(`✅ Migration ${migration.version} completed`);
        } catch (error) {
          console.error(`❌ Migration ${migration.version} failed:`, error);
          throw error;
        }
      } else {
        console.log(`⏭️ Migration ${migration.version} already applied`);
      }
    }

    console.log('🎉 All migrations completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

export async function rollbackMigration(version: string) {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/netsync');
    console.log('✅ Connected to MongoDB');

    const migration = migrations.find(m => m.version === version);
    if (!migration) {
      throw new Error(`Migration ${version} not found`);
    }

    const record = await MigrationRecord.findOne({ version });
    if (!record) {
      throw new Error(`Migration ${version} was not applied`);
    }

    console.log(`⏳ Rolling back migration ${version}: ${migration.description}`);
    
    await migration.down();
    await MigrationRecord.deleteOne({ version });
    
    console.log(`✅ Migration ${version} rolled back successfully`);

  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  const version = process.argv[3];

  (async () => {
    try {
      switch (command) {
        case 'up':
          await runMigrations();
          break;
        case 'down':
          if (!version) {
            console.error('Please specify a version to rollback');
            process.exit(1);
          }
          await rollbackMigration(version);
          break;
        default:
          console.log('Usage:');
          console.log('  npm run migrate up     - Run all pending migrations');
          console.log('  npm run migrate down <version> - Rollback specific migration');
          process.exit(1);
      }
      process.exit(0);
    } catch (error) {
      console.error('Migration script failed:', error);
      process.exit(1);
    }
  })();
}