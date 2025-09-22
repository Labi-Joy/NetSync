'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star,
  Heart,
  Share2,
  ExternalLink,
  ArrowLeft,
  Tag,
  Building,
  Ticket,
  MessageSquare,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Globe,
  Phone,
  Mail,
  CheckCircle
} from 'lucide-react';
import Navigation from '@/components/ui/Navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  bio: string;
}

interface Session {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  speaker?: Speaker;
  type: 'keynote' | 'talk' | 'panel' | 'workshop' | 'networking';
  location: string;
}

interface EventDetails {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  date: Date;
  endDate?: Date;
  location: string;
  venue: string;
  address: string;
  type: 'conference' | 'meetup' | 'workshop' | 'networking';
  category: string[];
  attendeeCount: number;
  maxAttendees?: number;
  price: number;
  currency: string;
  imageUrl: string;
  organizer: {
    name: string;
    avatar: string;
    bio: string;
    contact: {
      email?: string;
      phone?: string;
      website?: string;
    };
  };
  isRegistered: boolean;
  isFavorite: boolean;
  registrationUrl?: string;
  tags: string[];
  speakers: Speaker[];
  sessions: Session[];
  amenities: string[];
  requirements: string[];
  attendees: {
    id: string;
    name: string;
    title: string;
    company: string;
    avatar: string;
  }[];
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const eventId = params.eventId as string;
  
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'speakers' | 'attendees'>('overview');
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to fetch event details
    setTimeout(() => {
      const mockEvent: EventDetails = {
        id: eventId,
        title: 'Web3 Summit 2024',
        description: 'The premier gathering for Web3 developers, builders, and innovators. Join us for three days of cutting-edge presentations, workshops, and networking.',
        longDescription: 'Web3 Summit 2024 is the most anticipated event for blockchain developers, DeFi innovators, and Web3 entrepreneurs. Over three intensive days, you\'ll dive deep into the latest trends, technologies, and opportunities shaping the decentralized web. From technical workshops led by core protocol developers to fireside chats with industry leaders, this summit offers unparalleled learning and networking opportunities. Whether you\'re a seasoned blockchain developer or just starting your Web3 journey, you\'ll find sessions tailored to your experience level. Connect with like-minded builders, discover new projects, and shape the future of the decentralized internet.',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days from now
        location: 'San Francisco, CA',
        venue: 'Moscone Center',
        address: '747 Howard St, San Francisco, CA 94103',
        type: 'conference',
        category: ['blockchain', 'web3', 'defi'],
        attendeeCount: 2500,
        maxAttendees: 3000,
        price: 799,
        currency: 'USD',
        imageUrl: '/api/placeholder/1200/600',
        organizer: {
          name: 'Web3 Foundation',
          avatar: '/api/placeholder/100/100',
          bio: 'Leading the development and promotion of Web3 technologies and decentralized applications worldwide.',
          contact: {
            email: 'contact@web3foundation.org',
            website: 'web3foundation.org',
            phone: '+1 (555) 123-4567'
          }
        },
        isRegistered: false,
        isFavorite: false,
        registrationUrl: 'https://web3summit.com/register',
        tags: ['Blockchain', 'DeFi', 'NFTs', 'Networking', 'Developer'],
        speakers: [
          {
            id: '1',
            name: 'Vitalik Buterin',
            title: 'Co-founder',
            company: 'Ethereum',
            avatar: '/api/placeholder/80/80',
            bio: 'Co-founder of Ethereum and leading voice in blockchain technology and decentralization.'
          },
          {
            id: '2',
            name: 'Gavin Wood',
            title: 'Founder',
            company: 'Polkadot',
            avatar: '/api/placeholder/80/80',
            bio: 'Founder of Polkadot and co-founder of Ethereum, pioneering interoperability in blockchain.'
          },
          {
            id: '3',
            name: 'Stani Kulechov',
            title: 'Founder & CEO',
            company: 'Aave',
            avatar: '/api/placeholder/80/80',
            bio: 'Founder and CEO of Aave, leading innovation in decentralized finance protocols.'
          }
        ],
        sessions: [
          {
            id: '1',
            title: 'The Future of Ethereum: Scaling Solutions and Beyond',
            description: 'Exploring the latest developments in Ethereum scaling, including Layer 2 solutions, sharding, and the road to Ethereum 2.0.',
            startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 9), // Day 1, 9 AM
            endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 10), // Day 1, 10 AM
            speaker: {
              id: '1',
              name: 'Vitalik Buterin',
              title: 'Co-founder',
              company: 'Ethereum',
              avatar: '/api/placeholder/80/80',
              bio: 'Co-founder of Ethereum and leading voice in blockchain technology.'
            },
            type: 'keynote',
            location: 'Main Stage'
          },
          {
            id: '2',
            title: 'Building Interoperable Blockchain Networks',
            description: 'Deep dive into cross-chain protocols and the vision for a multi-chain future.',
            startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 11),
            endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 12),
            speaker: {
              id: '2',
              name: 'Gavin Wood',
              title: 'Founder',
              company: 'Polkadot',
              avatar: '/api/placeholder/80/80',
              bio: 'Founder of Polkadot and co-founder of Ethereum.'
            },
            type: 'talk',
            location: 'Tech Theater'
          },
          {
            id: '3',
            title: 'DeFi Innovation Workshop',
            description: 'Hands-on workshop covering the latest DeFi protocols, yield farming strategies, and risk management.',
            startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 14),
            endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 16),
            speaker: {
              id: '3',
              name: 'Stani Kulechov',
              title: 'Founder & CEO',
              company: 'Aave',
              avatar: '/api/placeholder/80/80',
              bio: 'Founder and CEO of Aave.'
            },
            type: 'workshop',
            location: 'Workshop Room A'
          },
          {
            id: '4',
            title: 'Networking Lunch',
            description: 'Connect with fellow attendees over lunch and discover collaboration opportunities.',
            startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 12),
            endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 13),
            type: 'networking',
            location: 'Networking Lounge'
          }
        ],
        amenities: [
          'Free Wi-Fi',
          'Lunch & Coffee',
          'Networking Areas',
          'Live Streaming',
          'Recording Available',
          'Swag Bag',
          'Parking Available'
        ],
        requirements: [
          'Valid photo ID required',
          'Vaccination certificate recommended',
          'Business attire suggested',
          'Laptop recommended for workshops'
        ],
        attendees: [
          { id: '1', name: 'Sarah Chen', title: 'AI Engineer', company: 'TechCorp', avatar: '/api/placeholder/50/50' },
          { id: '2', name: 'Alex Rodriguez', title: 'Blockchain Developer', company: 'CryptoStart', avatar: '/api/placeholder/50/50' },
          { id: '3', name: 'Emma Wilson', title: 'Product Manager', company: 'DefiProtocol', avatar: '/api/placeholder/50/50' },
          { id: '4', name: 'David Kim', title: 'Venture Partner', company: 'Crypto Ventures', avatar: '/api/placeholder/50/50' },
          { id: '5', name: 'Lisa Zhang', title: 'UX Designer', company: 'Web3 Design Studio', avatar: '/api/placeholder/50/50' }
        ]
      };

      setEvent(mockEvent);
      setIsLoading(false);
    }, 1000);
  }, [eventId]);

  const toggleFavorite = () => {
    if (event) {
      setEvent({
        ...event,
        isFavorite: !event.isFavorite
      });
    }
  };

  const toggleRegistration = () => {
    if (event) {
      setEvent({
        ...event,
        isRegistered: !event.isRegistered
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'keynote':
        return 'bg-red-500/20 text-red-300';
      case 'talk':
        return 'bg-blue-500/20 text-blue-300';
      case 'panel':
        return 'bg-green-500/20 text-green-300';
      case 'workshop':
        return 'bg-purple-500/20 text-purple-300';
      case 'networking':
        return 'bg-orange-500/20 text-orange-300';
      default:
        return 'bg-slate-500/20 text-slate-300';
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <Navigation />
          <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-16 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-700 rounded w-1/4"></div>
              <div className="h-96 bg-slate-700 rounded"></div>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-60 bg-slate-700 rounded"></div>
                <div className="h-60 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <Navigation />
          <div className="max-w-4xl mx-auto px-6 sm:px-10 md:px-16 py-8">
            <div className="card p-8 text-center">
              <Calendar className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">Event not found</h2>
              <p className="text-slate-400 mb-6">The event you're looking for doesn't exist or has been removed.</p>
              <button
                onClick={() => router.push('/events')}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors mx-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Events
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navigation />
        
        <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-16 py-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/events')}
            className="flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Events
          </motion.button>

          {/* Event Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-0 overflow-hidden mb-8"
          >
            {/* Hero Image */}
            <div className="relative h-96 bg-gradient-to-r from-blue-500 to-purple-600">
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute top-6 right-6 flex gap-3">
                <button
                  onClick={toggleFavorite}
                  className={`p-3 rounded-full backdrop-blur-sm transition-colors ${
                    event.isFavorite 
                      ? 'bg-red-500 text-white' 
                      : 'bg-black/30 text-white hover:bg-red-500'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-3 bg-black/30 rounded-full backdrop-blur-sm text-white hover:bg-black/50 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="absolute bottom-6 left-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    event.type === 'conference' ? 'bg-blue-500 text-white' :
                    event.type === 'meetup' ? 'bg-green-500 text-white' :
                    event.type === 'workshop' ? 'bg-purple-500 text-white' :
                    'bg-orange-500 text-white'
                  }`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                  {event.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
                <p className="text-xl text-slate-200 max-w-2xl">{event.description}</p>
              </div>
            </div>

            {/* Event Info */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-sm text-slate-400">Date</p>
                    <p className="text-white font-medium">{formatDate(event.date)}</p>
                    {event.endDate && (
                      <p className="text-slate-300 text-sm">to {formatDate(event.endDate)}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-sm text-slate-400">Location</p>
                    <p className="text-white font-medium">{event.venue}</p>
                    <p className="text-slate-300 text-sm">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="text-sm text-slate-400">Attendees</p>
                    <p className="text-white font-medium">
                      {event.attendeeCount}
                      {event.maxAttendees && ` / ${event.maxAttendees}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Ticket className="w-6 h-6 text-orange-400" />
                  <div>
                    <p className="text-sm text-slate-400">Price</p>
                    <p className="text-white font-medium">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {event.isRegistered ? (
                  <div className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium">
                    <CheckCircle className="w-5 h-5" />
                    Registered
                  </div>
                ) : (
                  <button
                    onClick={toggleRegistration}
                    className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Register Now - {event.price === 0 ? 'Free' : `$${event.price}`}
                  </button>
                )}

                <div className="flex gap-2">
                  <button className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  {event.registrationUrl && (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'agenda', label: 'Agenda', count: event.sessions.length },
                { id: 'speakers', label: 'Speakers', count: event.speakers.length },
                { id: 'attendees', label: 'Attendees', count: event.attendees.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {tab.label}
                  {tab.count && (
                    <span className="ml-2 px-2 py-1 bg-slate-600 text-xs rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <div className="card p-8">
                    <h2 className="text-2xl font-semibold text-white mb-4">About This Event</h2>
                    <p className="text-slate-300 leading-relaxed">{event.longDescription}</p>
                  </div>

                  {/* What's Included */}
                  <div className="card p-8">
                    <h3 className="text-xl font-semibold text-white mb-4">What's Included</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {event.amenities.map(amenity => (
                        <div key={amenity} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-slate-300">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  {event.requirements.length > 0 && (
                    <div className="card p-8">
                      <h3 className="text-xl font-semibold text-white mb-4">Requirements</h3>
                      <ul className="space-y-2">
                        {event.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-3 text-slate-300">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Organizer Info */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Organized by</h3>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {event.organizer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{event.organizer.name}</h4>
                        <p className="text-slate-300 text-sm mb-3">{event.organizer.bio}</p>
                        
                        {/* Contact Links */}
                        <div className="space-y-2">
                          {event.organizer.contact.email && (
                            <a
                              href={`mailto:${event.organizer.contact.email}`}
                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                            >
                              <Mail className="w-4 h-4" />
                              Email
                            </a>
                          )}
                          {event.organizer.contact.website && (
                            <a
                              href={`https://${event.organizer.contact.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                            >
                              <Globe className="w-4 h-4" />
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Details */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Location</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-white font-medium">{event.venue}</p>
                          <p className="text-slate-400 text-sm">{event.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-2 bg-slate-700 text-slate-300 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Agenda Tab */}
            {activeTab === 'agenda' && (
              <div className="card p-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Event Agenda</h2>
                <div className="space-y-4">
                  {event.sessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-slate-700 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                        className="w-full p-6 text-left hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <div className="flex items-center gap-4 mb-2">
                              <span className={`px-3 py-1 text-sm rounded-full ${getSessionTypeColor(session.type)}`}>
                                {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                              </span>
                              <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Clock className="w-4 h-4" />
                                <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                                <MapPin className="w-4 h-4 ml-2" />
                                <span>{session.location}</span>
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">{session.title}</h3>
                            {session.speaker && (
                              <p className="text-slate-400 text-sm">
                                by {session.speaker.name}, {session.speaker.title} at {session.speaker.company}
                              </p>
                            )}
                          </div>
                          {expandedSession === session.id ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {expandedSession === session.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-700"
                        >
                          <div className="p-6">
                            <p className="text-slate-300 mb-4">{session.description}</p>
                            {session.speaker && (
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {session.speaker.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <h4 className="text-white font-medium">{session.speaker.name}</h4>
                                  <p className="text-slate-400 text-sm">{session.speaker.title} at {session.speaker.company}</p>
                                  <p className="text-slate-300 text-sm mt-2">{session.speaker.bio}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers Tab */}
            {activeTab === 'speakers' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {event.speakers.map((speaker, index) => (
                  <motion.div
                    key={speaker.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card p-6 text-center"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                      {speaker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-1">{speaker.name}</h3>
                    <p className="text-slate-300 mb-1">{speaker.title}</p>
                    <p className="text-slate-400 text-sm mb-4">{speaker.company}</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{speaker.bio}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Attendees Tab */}
            {activeTab === 'attendees' && (
              <div className="card p-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Other Attendees</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.attendees.map((attendee, index) => (
                    <motion.div
                      key={attendee.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {attendee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-grow">
                        <p className="text-white font-medium">{attendee.name}</p>
                        <p className="text-slate-400 text-sm">{attendee.title}</p>
                        <p className="text-slate-500 text-xs">{attendee.company}</p>
                      </div>
                      <button className="p-2 text-slate-400 hover:text-blue-400 transition-colors">
                        <UserPlus className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}