import mongoose from 'mongoose';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { Connection } from '../models/Connection';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export async function initializeDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/netsync');
    console.log('✅ Connected to MongoDB');

    // Create indexes
    console.log('📚 Creating indexes...');
    
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ 'professionalInfo.skills': 1 });
    await User.collection.createIndex({ 'professionalInfo.interests': 1 });
    await User.collection.createIndex({ currentEvent: 1 });
    
    // Event indexes
    await Event.collection.createIndex({ startDate: 1, endDate: 1 });
    await Event.collection.createIndex({ isActive: 1 });
    await Event.collection.createIndex({ attendees: 1 });
    
    // Connection indexes
    await Connection.collection.createIndex({ eventId: 1, status: 1 });
    await Connection.collection.createIndex({ participants: 1 });
    await Connection.collection.createIndex({ matchScore: -1 });
    await Connection.collection.createIndex({ 'suggestedMeetup.time': 1 });

    console.log('✅ Database indexes created');
    console.log('🎉 Database initialization complete!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

export async function seedSampleData() {
  try {
    console.log('🌱 Seeding sample data...');

    // Check if sample event already exists
    const existingEvent = await Event.findOne({ name: 'Web3 Developer Conference 2024' });
    if (existingEvent) {
      console.log('ℹ️ Sample data already exists, skipping seed');
      return;
    }

    // Create sample event
    const sampleEvent = new Event({
      name: 'Web3 Developer Conference 2024',
      description: 'The premier gathering for Web3 developers, entrepreneurs, and innovators',
      startDate: new Date('2024-12-01T09:00:00Z'),
      endDate: new Date('2024-12-03T18:00:00Z'),
      venue: {
        name: 'Tech Convention Center',
        address: '123 Innovation Drive, San Francisco, CA 94105',
        mapData: null
      },
      schedule: [
        {
          sessionId: 'opening',
          title: 'Opening Keynote',
          startTime: new Date('2024-12-01T09:00:00Z'),
          endTime: new Date('2024-12-01T10:00:00Z'),
          location: 'Main Hall'
        },
        {
          sessionId: 'networking',
          title: 'Networking Session',
          startTime: new Date('2024-12-01T15:00:00Z'),
          endTime: new Date('2024-12-01T17:00:00Z'),
          location: 'Networking Lounge'
        }
      ],
      attendees: [],
      isActive: true
    });

    await sampleEvent.save();
    console.log('✅ Sample event created');

    // Create sample users
    const sampleUsers = [
      {
        email: 'alice@example.com',
        password: 'password123',
        name: 'Alice Johnson',
        professionalInfo: {
          title: 'Senior Blockchain Developer',
          company: 'DeFi Innovations',
          experience: 'senior',
          skills: ['Solidity', 'Web3.js', 'React', 'Node.js'],
          interests: ['DeFi', 'Smart Contracts', 'DAO Governance']
        },
        networkingProfile: {
          goals: ['Find potential co-founders', 'Learn about new protocols'],
          lookingFor: 'collaborators',
          communicationStyle: 'proactive',
          availability: ['Morning sessions', 'Networking events']
        }
      },
      {
        email: 'bob@example.com',
        password: 'password123',
        name: 'Bob Smith',
        professionalInfo: {
          title: 'Product Manager',
          company: 'Web3 Ventures',
          experience: 'mid',
          skills: ['Product Strategy', 'User Research', 'Agile'],
          interests: ['NFTs', 'Gaming', 'Community Building']
        },
        networkingProfile: {
          goals: ['Understand technical implementation', 'Meet developers'],
          lookingFor: 'mentor',
          communicationStyle: 'structured',
          availability: ['Afternoon sessions', 'Coffee meetings']
        }
      }
    ];

    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
    }

    console.log('✅ Sample users created');
    console.log('🎉 Sample data seeding complete!');

  } catch (error) {
    console.error('❌ Sample data seeding failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  (async () => {
    try {
      await initializeDatabase();
      await seedSampleData();
      process.exit(0);
    } catch (error) {
      console.error('Script failed:', error);
      process.exit(1);
    }
  })();
}