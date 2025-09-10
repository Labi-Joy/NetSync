// MongoDB Initialization Script
// This script runs when the MongoDB container starts for the first time

// Create database and collections
db = db.getSiblingDB('netsync');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'name'],
      properties: {
        email: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        password: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        name: {
          bsonType: 'string',
          description: 'must be a string and is required'
        }
      }
    }
  }
});

db.createCollection('events', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'startDate', 'endDate'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        startDate: {
          bsonType: 'date',
          description: 'must be a date and is required'
        },
        endDate: {
          bsonType: 'date',
          description: 'must be a date and is required'
        }
      }
    }
  }
});

db.createCollection('connections');

// Create indexes
db.users.createIndex({ 'email': 1 }, { unique: true });
db.users.createIndex({ 'professionalInfo.skills': 1 });
db.users.createIndex({ 'professionalInfo.interests': 1 });
db.users.createIndex({ 'currentEvent': 1 });

db.events.createIndex({ 'startDate': 1, 'endDate': 1 });
db.events.createIndex({ 'isActive': 1 });
db.events.createIndex({ 'attendees': 1 });

db.connections.createIndex({ 'eventId': 1, 'status': 1 });
db.connections.createIndex({ 'participants': 1 });
db.connections.createIndex({ 'matchScore': -1 });

// Insert sample event for testing
db.events.insertOne({
  name: 'TechConf 2024',
  description: 'Annual technology conference bringing together industry leaders and innovators.',
  startDate: new Date('2024-12-01T09:00:00Z'),
  endDate: new Date('2024-12-03T18:00:00Z'),
  venue: {
    name: 'Convention Center',
    address: '123 Main St, Tech City, TC 12345',
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
      title: 'Networking Break',
      startTime: new Date('2024-12-01T10:00:00Z'),
      endTime: new Date('2024-12-01T10:30:00Z'),
      location: 'Exhibition Hall'
    }
  ],
  attendees: [],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print('MongoDB initialization completed successfully');
print('Sample data inserted for testing');
print('Indexes created for optimal performance');