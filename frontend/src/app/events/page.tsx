'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Search,
  Filter,
  Plus,
  ExternalLink,
  Heart,
  Share2,
  ChevronRight,
  Tag,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Navigation from '@/components/ui/Navigation';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { eventAPI } from '@/lib/api';
import { enhancedEventAPI } from '@/lib/apiWithRetry';
import { CardLoading } from '@/components/ui/LoadingSpinner';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  venue: string;
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
  };
  isRegistered: boolean;
  isFavorite: boolean;
  registrationUrl?: string;
  tags: string[];
}

export default function EventsPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'upcoming' | 'registered' | 'favorites'>('upcoming');
  const [error, setError] = useState<string>('');

  // Load events from backend API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        console.log('🎪 Loading events from backend API...');
        
        // Try to fetch events from the backend API
        const response = await enhancedEventAPI.getEvents();
        
        console.log('✅ Events loaded successfully:', response.data);
        
        // Transform backend data to match frontend interface
        const transformedEvents: Event[] = response.data.events?.map((event: any) => ({
          id: event._id || event.id,
          title: event.name || event.title || 'Untitled Event',
          description: event.description || 'No description available',
          date: event.startDate ? new Date(event.startDate) : new Date(),
          endDate: event.endDate ? new Date(event.endDate) : undefined,
          location: event.venue?.address || event.location || 'Location TBD',
          venue: event.venue?.name || event.venue || event.location || 'Venue TBD',
          type: event.type || 'meetup',
          category: event.tags || event.category || [],
          attendeeCount: event.attendees?.length || 0,
          maxAttendees: event.capacity || event.maxAttendees || 100,
          price: event.price || 0,
          currency: event.currency || 'USD',
          imageUrl: event.imageUrl || '/api/placeholder/600/300',
          organizer: {
            name: event.organizer?.name || 'Event Organizer',
            avatar: event.organizer?.avatar || '/api/placeholder/40/40'
          },
          isRegistered: event.isRegistered || false,
          isFavorite: event.isFavorite || false,
          registrationUrl: event.registrationUrl,
          tags: event.tags || []
        })) || [];
        
        setEvents(transformedEvents);
        
      } catch (err: any) {
        console.error('❌ Failed to load events from backend:', err);
        
        // Provide mock data as fallback for demo purposes
        const mockEvents: Event[] = [
          {
            id: '1',
            title: 'Web3 Summit 2024',
            description: 'The premier gathering for Web3 developers, builders, and innovators. Join us for three days of cutting-edge presentations, workshops, and networking.',
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
            location: 'San Francisco, CA',
            venue: 'Moscone Center',
            type: 'conference',
            category: ['blockchain', 'web3', 'defi'],
            attendeeCount: 2500,
            maxAttendees: 3000,
            price: 799,
            currency: 'USD',
            imageUrl: '/api/placeholder/600/300',
            organizer: {
              name: 'Web3 Foundation',
              avatar: '/api/placeholder/40/40'
            },
            isRegistered: true,
            isFavorite: true,
            registrationUrl: 'https://web3summit.com',
            tags: ['Blockchain', 'DeFi', 'NFTs', 'Networking']
          },
          {
            id: '2',
            title: 'AI & Blockchain Meetup',
            description: 'Monthly meetup discussing the intersection of AI and blockchain technology. Perfect for developers and entrepreneurs.',
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
            location: 'New York, NY',
            venue: 'TechHub NYC',
            type: 'meetup',
            category: ['ai', 'blockchain', 'networking'],
            attendeeCount: 85,
            maxAttendees: 100,
            price: 0,
            currency: 'USD',
            imageUrl: '/api/placeholder/600/300',
            organizer: {
              name: 'NYC Blockchain Group',
              avatar: '/api/placeholder/40/40'
            },
            isRegistered: false,
            isFavorite: false,
            registrationUrl: 'https://meetup.com/nyc-blockchain',
            tags: ['AI', 'Blockchain', 'Startups']
          },
          {
            id: '3',
            title: 'DeFi Security Workshop',
            description: 'Hands-on workshop covering smart contract security, auditing practices, and best practices for DeFi protocols.',
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
            location: 'Online',
            venue: 'Virtual Event',
            type: 'workshop',
            category: ['defi', 'security', 'smartcontracts'],
            attendeeCount: 150,
            maxAttendees: 200,
            price: 199,
            currency: 'USD',
            imageUrl: '/api/placeholder/600/300',
            organizer: {
              name: 'DeFi Security Alliance',
              avatar: '/api/placeholder/40/40'
            },
            isRegistered: false,
            isFavorite: true,
            registrationUrl: 'https://defisecurity.org',
            tags: ['Security', 'DeFi', 'Workshop', 'Online']
          },
          {
            id: '4',
            title: 'Ethereum Developer Conference',
            description: 'Join core Ethereum developers and researchers for technical presentations, protocol updates, and ecosystem discussions.',
            date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
            endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 23),
            location: 'London, UK',
            venue: 'ExCeL London',
            type: 'conference',
            category: ['ethereum', 'development', 'protocol'],
            attendeeCount: 1200,
            maxAttendees: 1500,
            price: 599,
            currency: 'USD',
            imageUrl: '/api/placeholder/600/300',
            organizer: {
              name: 'Ethereum Foundation',
              avatar: '/api/placeholder/40/40'
            },
            isRegistered: true,
            isFavorite: false,
            registrationUrl: 'https://ethereum-dev-con.org',
            tags: ['Ethereum', 'Development', 'Protocol']
          }
        ];
        
        setEvents(mockEvents);
        setError('Using demo data - backend connection in progress');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []); // Load all events once, filtering is done client-side

  // Filter events
  useEffect(() => {
    let filtered = events;

    // Filter by view mode
    if (viewMode === 'registered') {
      filtered = filtered.filter(e => e.isRegistered);
    } else if (viewMode === 'favorites') {
      filtered = filtered.filter(e => e.isFavorite);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.category.includes(selectedCategory));
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(e => e.type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredEvents(filtered);
  }, [events, viewMode, selectedCategory, selectedType, searchTerm]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleFavorite = (eventId: string) => {
    setEvents(prev =>
      prev.map(e =>
        e.id === eventId ? { ...e, isFavorite: !e.isFavorite } : e
      )
    );
  };

  const toggleRegistration = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    try {
      if (event.isRegistered) {
        console.log('🚫 Unregistering from event:', eventId);
        await enhancedEventAPI.leaveEvent(eventId);
        showSuccess('Left Event', `You've successfully left ${event.title}`);
      } else {
        console.log('✅ Registering for event:', eventId);
        await enhancedEventAPI.joinEvent(eventId);
        showSuccess('Registered!', `You're now registered for ${event.title}`);
      }
      
      // Update local state
      setEvents(prev =>
        prev.map(e =>
          e.id === eventId ? { ...e, isRegistered: !e.isRegistered } : e
        )
      );
      
      console.log(`✅ Event registration ${event.isRegistered ? 'removed' : 'added'} successfully`);
    } catch (error: any) {
      console.error('❌ Failed to update event registration:', error);
      showError('Registration Failed', 'Could not update your registration. Please try again.');
      
      // For demo purposes, still update local state
      setEvents(prev =>
        prev.map(e =>
          e.id === eventId ? { ...e, isRegistered: !e.isRegistered } : e
        )
      );
    }
  };

  const categories = ['all', 'blockchain', 'web3', 'defi', 'ai', 'ethereum', 'security'];
  const eventTypes = ['all', 'conference', 'meetup', 'workshop', 'networking'];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <AnimatedBackground />
          <Navigation />
          <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-700 rounded w-1/3"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-slate-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <AnimatedBackground />
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Events & Conferences</h1>
                  <p className="text-slate-600 dark:text-slate-300">Discover and join networking events in your industry</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link href="/events/manage">
                  <Button variant="outline" leftIcon={<Settings className="w-4 h-4" />}>
                    Manage Events
                  </Button>
                </Link>
                <Link href="/events/create">
                  <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                    Host Event
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="mb-4 bg-yellow-500/20 border border-yellow-500 text-yellow-100 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* View Mode Tabs */}
            <div className="flex gap-2 mb-6">
              {[
                { key: 'upcoming', label: 'Upcoming Events' },
                { key: 'registered', label: 'My Events' },
                { key: 'favorites', label: 'Favorites' }
              ].map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setViewMode(mode.key as any)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    viewMode === mode.key
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events, topics, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Category'}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  {eventTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Type'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-8 text-center"
            >
              <Calendar className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {viewMode === 'registered' ? 'No registered events' :
                 viewMode === 'favorites' ? 'No favorite events' :
                 'No events found'}
              </h3>
              <p className="text-slate-400">
                {viewMode === 'upcoming' ? 'Try adjusting your search or filters.' :
                 viewMode === 'registered' ? 'Register for events to see them here.' :
                 'Add events to favorites to see them here.'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-0 overflow-hidden hover:scale-[1.02] transition-transform duration-200"
                >
                  {/* Event Image */}
                  <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => toggleFavorite(event.id)}
                        className={`p-2 rounded-full backdrop-blur-sm ${
                          event.isFavorite ? 'bg-red-500 text-white' : 'bg-black/30 text-white hover:bg-red-500'
                        } transition-colors`}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-black/30 rounded-full backdrop-blur-sm text-white hover:bg-black/50 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="absolute bottom-4 left-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        event.type === 'conference' ? 'bg-blue-500 text-white' :
                        event.type === 'meetup' ? 'bg-green-500 text-white' :
                        event.type === 'workshop' ? 'bg-purple-500 text-white' :
                        'bg-orange-500 text-white'
                      }`}>
                        {event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : 'Event'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white leading-tight">
                        {event?.title || 'Untitled Event'}
                      </h3>
                    </div>

                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                      {event?.description || 'No description available'}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span>{event?.date ? formatDate(event.date) : 'TBD'}</span>
                        {event.endDate && (
                          <span>- {formatDate(event.endDate)}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span>{event?.location || 'Location TBD'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Users className="w-4 h-4" />
                        <span>
                          {event?.attendeeCount || 0} attendees
                          {event?.maxAttendees && ` / ${event.maxAttendees}`}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {(event?.tags || []).slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {(event?.tags || []).length > 3 && (
                        <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">
                          +{(event?.tags || []).length - 3}
                        </span>
                      )}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="text-white font-bold">
                        {(event?.price ?? 0) === 0 ? 'Free' : `$${event?.price ?? 0}`}
                      </div>
                      
                      <div className="flex gap-2">
                        {event.isRegistered ? (
                          <button
                            onClick={() => toggleRegistration(event.id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                          >
                            Registered
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleRegistration(event.id)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                          >
                            Register
                          </button>
                        )}
                        
                        {event.registrationUrl && (
                          <button className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}