import mongoose from 'mongoose';
import { User } from '../models/User';
import { Event } from '../models/Event';
import { Connection } from '../models/Connection';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/netsync';

// Seed Users
const seedUsers = [
  {
    email: 'sarah.chen@techcorp.com',
    password: 'DevCorp2024!',
    name: 'Sarah Chen',
    professionalInfo: {
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      experience: 'senior',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
      interests: ['AI/ML', 'Web Development', 'Cloud Architecture']
    },
    networkingProfile: {
      goals: ['Find mentees', 'Share knowledge', 'Learn about AI/ML'],
      lookingFor: 'mentee',
      communicationStyle: 'proactive',
      availability: ['Weekday evenings', 'Weekend mornings']
    }
  },
  {
    email: 'marcus.rodriguez@startup.io',
    password: 'StartUp123!',
    name: 'Marcus Rodriguez',
    professionalInfo: {
      title: 'Co-Founder & CTO',
      company: 'StartupFlow',
      experience: 'executive',
      skills: ['Leadership', 'Full-Stack Development', 'Product Strategy', 'Team Building'],
      interests: ['Entrepreneurship', 'Product Management', 'Team Leadership']
    },
    networkingProfile: {
      goals: ['Find co-founders', 'Investment opportunities', 'Talent acquisition'],
      lookingFor: 'collaborators',
      communicationStyle: 'structured',
      availability: ['Conference hours', 'Networking events']
    }
  },
  {
    email: 'priya.patel@airesearch.org',
    password: 'Research2024!',
    name: 'Priya Patel',
    professionalInfo: {
      title: 'ML Research Engineer',
      company: 'AI Research Institute',
      experience: 'mid',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'Research'],
      interests: ['Machine Learning', 'Computer Vision', 'Research']
    },
    networkingProfile: {
      goals: ['Find research collaborators', 'Learn industry applications'],
      lookingFor: 'peers',
      communicationStyle: 'reactive',
      availability: ['Academic conferences', 'Research meetups']
    }
  },
  {
    email: 'david.kim@designstudio.com',
    password: 'Design2024!',
    name: 'David Kim',
    professionalInfo: {
      title: 'UX Design Lead',
      company: 'Creative Design Studio',
      experience: 'senior',
      skills: ['UI/UX Design', 'Figma', 'User Research', 'Design Systems', 'Prototyping'],
      interests: ['Design Systems', 'User Psychology', 'Accessibility']
    },
    networkingProfile: {
      goals: ['Share design expertise', 'Learn from other designers'],
      lookingFor: 'peers',
      communicationStyle: 'proactive',
      availability: ['Design conferences', 'Creative workshops']
    }
  },
  {
    email: 'emily.watson@fintech.co',
    password: 'FinTech2024!',
    name: 'Emily Watson',
    professionalInfo: {
      title: 'Product Manager',
      company: 'FinTech Solutions',
      experience: 'mid',
      skills: ['Product Management', 'Agile', 'Data Analysis', 'Market Research'],
      interests: ['FinTech', 'Product Strategy', 'Market Analysis']
    },
    networkingProfile: {
      goals: ['Product strategy insights', 'Industry trends', 'Team building'],
      lookingFor: 'mentor',
      communicationStyle: 'structured',
      availability: ['Business hours', 'Product meetups']
    }
  },
  {
    email: 'alex.thompson@consultant.com',
    password: 'Consult2024!',
    name: 'Alex Thompson',
    professionalInfo: {
      title: 'Technology Consultant',
      company: 'Thompson Consulting',
      experience: 'senior',
      skills: ['Strategy Consulting', 'Digital Transformation', 'Project Management', 'Business Analysis'],
      interests: ['Digital Strategy', 'Business Transformation', 'Leadership']
    },
    networkingProfile: {
      goals: ['Business development', 'Knowledge sharing', 'Client acquisition'],
      lookingFor: 'collaborators',
      communicationStyle: 'proactive',
      availability: ['Professional events', 'Business conferences']
    }
  },
  {
    email: 'lisa.zhang@healthcare.tech',
    password: 'Health2024!',
    name: 'Lisa Zhang',
    professionalInfo: {
      title: 'Healthcare Technology Lead',
      company: 'MedTech Innovations',
      experience: 'senior',
      skills: ['Healthcare IT', 'HIPAA Compliance', 'Electronic Health Records', 'Telemedicine'],
      interests: ['Healthcare Innovation', 'Medical Technology', 'Patient Care']
    },
    networkingProfile: {
      goals: ['Healthcare technology advancement', 'Industry partnerships'],
      lookingFor: 'collaborators',
      communicationStyle: 'structured',
      availability: ['Healthcare conferences', 'Medical tech events']
    }
  },
  {
    email: 'james.wilson@junior.dev',
    password: 'Junior2024!',
    name: 'James Wilson',
    professionalInfo: {
      title: 'Junior Full-Stack Developer',
      company: 'WebDev Agency',
      experience: 'junior',
      skills: ['JavaScript', 'React', 'HTML/CSS', 'Git', 'Basic Node.js'],
      interests: ['Web Development', 'Mobile Apps', 'Software Engineering']
    },
    networkingProfile: {
      goals: ['Find mentors', 'Learn best practices', 'Career guidance'],
      lookingFor: 'mentor',
      communicationStyle: 'reactive',
      availability: ['Coding bootcamps', 'Developer meetups', 'Online communities']
    }
  }
];

// Seed Events
const seedEvents = [
  {
    name: 'TechCon 2024 San Francisco',
    description: 'The premier technology conference bringing together innovators, developers, and thought leaders from across the tech industry. Join us for 3 days of inspiring keynotes, hands-on workshops, and unparalleled networking opportunities.',
    startDate: new Date('2024-03-15T09:00:00Z'),
    endDate: new Date('2024-03-17T18:00:00Z'),
    venue: {
      name: 'Moscone Convention Center',
      address: '747 Howard St, San Francisco, CA 94103',
    },
    capacity: 5000,
    attendees: [],
    isActive: true,
    tags: ['technology', 'software', 'networking', 'innovation'],
    type: 'conference'
  },
  {
    name: 'AI & Machine Learning Summit',
    description: 'Deep dive into the latest advancements in artificial intelligence and machine learning. Features workshops on deep learning, computer vision, NLP, and practical AI applications in industry.',
    startDate: new Date('2024-04-20T09:00:00Z'),
    endDate: new Date('2024-04-21T17:00:00Z'),
    venue: {
      name: 'Stanford University Conference Center',
      address: '320 Via Palou, Stanford, CA 94305',
    },
    capacity: 800,
    attendees: [],
    isActive: true,
    tags: ['AI', 'machine-learning', 'research', 'data-science'],
    type: 'conference'
  },
  {
    name: 'Startup Founder Meetup',
    description: 'Monthly gathering for startup founders, entrepreneurs, and aspiring business leaders. Share experiences, find co-founders, and build meaningful connections in the startup ecosystem.',
    startDate: new Date('2024-02-28T18:30:00Z'),
    endDate: new Date('2024-02-28T21:00:00Z'),
    venue: {
      name: 'Innovation Hub',
      address: '123 Startup Ave, Palo Alto, CA 94301',
    },
    capacity: 150,
    attendees: [],
    isActive: true,
    tags: ['startup', 'entrepreneurship', 'networking', 'founders'],
    type: 'meetup'
  },
  {
    name: 'Design Systems Workshop',
    description: 'Hands-on workshop for UX/UI designers focusing on building scalable design systems. Learn best practices, tools, and methodologies from industry experts.',
    startDate: new Date('2024-03-10T10:00:00Z'),
    endDate: new Date('2024-03-10T16:00:00Z'),
    venue: {
      name: 'Design Studio Co-working',
      address: '456 Creative Blvd, San Francisco, CA 94107',
    },
    capacity: 50,
    attendees: [],
    isActive: true,
    tags: ['design', 'UX', 'UI', 'workshop', 'design-systems'],
    type: 'workshop'
  },
  {
    name: 'FinTech Innovation Conference',
    description: 'Explore the future of financial technology with industry leaders, regulators, and innovators. Covering blockchain, digital payments, lending tech, and regulatory compliance.',
    startDate: new Date('2024-05-15T09:00:00Z'),
    endDate: new Date('2024-05-16T17:00:00Z'),
    venue: {
      name: 'Financial District Conference Center',
      address: '789 Market St, San Francisco, CA 94103',
    },
    capacity: 1200,
    attendees: [],
    isActive: true,
    tags: ['fintech', 'blockchain', 'payments', 'finance', 'innovation'],
    type: 'conference'
  }
];

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Event.deleteMany({});
    await Connection.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];

    for (const userData of seedUsers) {
      const hashedPassword = await hashPassword(userData.password);
      const user = new User({
        ...userData,
        password: hashedPassword,
        isEmailVerified: true
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`   ✅ Created user: ${userData.name} (${userData.email})`);
    }

    // Create events and assign some attendees
    console.log('📅 Creating events...');
    const createdEvents = [];

    for (const eventData of seedEvents) {
      // Assign some random users as attendees (2-4 users per event)
      const attendeeCount = Math.floor(Math.random() * 3) + 2;
      const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());
      const attendees = shuffledUsers.slice(0, attendeeCount).map(user => user._id);

      const event = new Event({
        ...eventData,
        attendees: attendees,
        organizer: createdUsers[0]._id, // Make first user the organizer
      });

      const savedEvent = await event.save();
      createdEvents.push(savedEvent);

      // Update users with current event
      await User.updateMany(
        { _id: { $in: attendees } },
        { currentEvent: savedEvent._id }
      );

      console.log(`   ✅ Created event: ${eventData.name} (${attendees.length} attendees)`);
    }

    // Create some connections
    console.log('🤝 Creating sample connections...');
    const connectionCount = 5;

    for (let i = 0; i < connectionCount; i++) {
      const user1 = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const user2 = createdUsers[Math.floor(Math.random() * createdUsers.length)];

      if (user1._id.toString() !== user2._id.toString()) {
        const event = createdEvents[Math.floor(Math.random() * createdEvents.length)];

        // Generate meaningful connection data
        const reasons = [
          'Shared interests in AI and machine learning',
          'Complementary skills in frontend and backend development',
          'Both looking for mentorship opportunities',
          'Similar experience levels in product management',
          'Common goals in startup development'
        ];

        const starters = [
          "I saw you're working on some interesting projects in AI. I'd love to hear more about your experience.",
          "Your background in product management aligns perfectly with what I'm looking for in a mentor.",
          "I noticed we both have experience with React and TypeScript. Want to share some best practices?",
          "I'm curious about your journey in the startup world. Would you be open to connecting?",
          "Your expertise in design systems caught my attention. I'd appreciate any insights you could share."
        ];

        const locations = [
          'Conference Networking Lounge',
          'Coffee Break Area - Floor 2',
          'Exhibition Hall - Booth 23',
          'Workshop Room C',
          'Outdoor Networking Terrace'
        ];

        const connection = new Connection({
          participants: [user1._id, user2._id],
          eventId: event._id,
          status: Math.random() > 0.5 ? 'connected' : 'suggested',
          matchScore: Math.floor(Math.random() * 40) + 60, // Score between 60-100
          matchReason: reasons[Math.floor(Math.random() * reasons.length)],
          conversationStarter: starters[Math.floor(Math.random() * starters.length)],
          suggestedMeetup: {
            time: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000), // Random time within next 7 days
            location: locations[Math.floor(Math.random() * locations.length)],
            duration: [30, 45, 60][Math.floor(Math.random() * 3)] // 30, 45, or 60 minutes
          }
        });

        await connection.save();
        console.log(`   ✅ Created connection between ${user1.name} and ${user2.name}`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:
    - Users: ${createdUsers.length}
    - Events: ${createdEvents.length}
    - Connections: ${connectionCount}
    `);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('📴 Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}