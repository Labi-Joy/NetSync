'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  MessageSquare, 
  UserPlus, 
  UserCheck,
  UserMinus,
  MapPin,
  Building,
  Star,
  MoreHorizontal,
  Send,
  Calendar,
  Phone,
  Mail,
  Clock
} from 'lucide-react';
import Navigation from '@/components/ui/Navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { enhancedNetworkingAPI } from '@/lib/apiWithRetry';

interface Connection {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar: string;
  status: 'connected' | 'pending' | 'invited' | 'suggested';
  matchScore: number;
  skills: string[];
  interests: string[];
  mutualConnections: number;
  lastInteraction?: Date;
  connectionDate: Date;
  bio: string;
  contact: {
    email?: string;
    phone?: string;
    linkedin?: string;
  };
  isOnline: boolean;
}

export default function ConnectionsPage() {
  const { user, isAuthenticated } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [showQuickMessage, setShowQuickMessage] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Load connections data from API
  useEffect(() => {
    const loadConnections = async () => {
      if (!isAuthenticated || !user?._id) {
        setIsLoading(false);
        setError('Please log in to view connections');
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        
        console.log('🔗 Loading connections from backend API for user:', user._id);
        const response = await enhancedNetworkingAPI.getConnections({ 
          userId: user._id 
        });
        
        console.log('✅ Connections loaded successfully:', response.data);
        setConnections(response.data.connections || []);
      } catch (err: any) {
        console.error('❌ Failed to load connections:', err);
        setError('Failed to load connections');
        
        // Fallback to mock data for demo purposes
        const mockConnections: Connection[] = [
          {
            id: '1',
            name: 'Sarah Chen',
            title: 'Senior AI Engineer',
            company: 'TechCorp',
            location: 'San Francisco, CA',
            avatar: '/api/placeholder/64/64',
            status: 'connected',
            matchScore: 95,
            skills: ['Machine Learning', 'Python', 'TensorFlow', 'Blockchain'],
            interests: ['AI Ethics', 'DeFi', 'Startups'],
            mutualConnections: 12,
            lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            connectionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
            bio: 'Passionate about building AI systems that make a positive impact.',
            contact: {
              email: 'sarah.chen@techcorp.com',
              linkedin: 'linkedin.com/in/sarahchen'
            },
            isOnline: true
          },
          {
            id: '2',
            name: 'Alex Rodriguez',
            title: 'Blockchain Developer',
            company: 'CryptoStart',
            location: 'Austin, TX',
            avatar: '/api/placeholder/64/64',
            status: 'connected',
            matchScore: 88,
            skills: ['Solidity', 'Web3.js', 'Smart Contracts', 'DeFi'],
            interests: ['Gaming', 'NFTs', 'Open Source'],
            mutualConnections: 8,
            lastInteraction: new Date(Date.now() - 1000 * 60 * 60 * 6),
            connectionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
            bio: 'Full-stack blockchain developer with 5+ years experience.',
            contact: {
              email: 'alex@cryptostart.io',
              linkedin: 'linkedin.com/in/alexrodriguez'
            },
            isOnline: false
          }
        ];
        
        setConnections(mockConnections);
        console.log('📝 Using mock data as fallback');
      } finally {
        setIsLoading(false);
      }
    };

    loadConnections();
  }, [isAuthenticated, user?._id]);

  // Filter connections
  useEffect(() => {
    let filtered = connections;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        c.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort by match score for suggested connections, by last interaction for others
    filtered.sort((a, b) => {
      if (a.status === 'suggested' && b.status === 'suggested') {
        return b.matchScore - a.matchScore;
      }
      if (a.lastInteraction && b.lastInteraction) {
        return b.lastInteraction.getTime() - a.lastInteraction.getTime();
      }
      return b.connectionDate.getTime() - a.connectionDate.getTime();
    });

    setFilteredConnections(filtered);
  }, [connections, statusFilter, searchTerm]);

  const handleConnectionAction = (connectionId: string, action: 'connect' | 'accept' | 'decline' | 'remove') => {
    setConnections(prev =>
      prev.map(c => {
        if (c.id === connectionId) {
          switch (action) {
            case 'connect':
              return { ...c, status: 'pending' as const };
            case 'accept':
              return { ...c, status: 'connected' as const };
            case 'decline':
            case 'remove':
              return { ...c, status: 'suggested' as const };
            default:
              return c;
          }
        }
        return c;
      })
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">Connected</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-medium rounded-full">Pending</span>;
      case 'invited':
        return <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">Invited</span>;
      case 'suggested':
        return <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">Suggested</span>;
      default:
        return null;
    }
  };

  const formatLastInteraction = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const statusCounts = connections.reduce((acc, conn) => {
    acc[conn.status] = (acc[conn.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <Navigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-1/3"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-slate-300 dark:bg-slate-700 rounded-2xl"></div>
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
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Network</h1>
                <p className="text-slate-600 dark:text-slate-400">Manage your professional connections and discover new opportunities</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center hover:shadow-lg transition-all"
              >
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{statusCounts.connected || 0}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Connected</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center hover:shadow-lg transition-all"
              >
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{statusCounts.pending || 0}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Pending</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center hover:shadow-lg transition-all"
              >
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{statusCounts.invited || 0}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Invitations</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center hover:shadow-lg transition-all"
              >
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{statusCounts.suggested || 0}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Suggested</div>
              </motion.div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search connections by name, company, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Connections</option>
                <option value="connected">Connected</option>
                <option value="pending">Pending</option>
                <option value="invited">Invitations</option>
                <option value="suggested">Suggested</option>
              </select>
            </div>
          </motion.div>

          {/* Connections Grid */}
          {filteredConnections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-8 text-center"
            >
              <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No connections found</h3>
              <p className="text-slate-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start building your professional network!'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredConnections.map((connection, index) => (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {connection.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {connection.isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{connection.name}</h3>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">{connection.title}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">{connection.company}</p>
                        </div>
                        {connection.status === 'suggested' && (
                          <div className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                            <Star className="w-4 h-4" />
                            <span>{connection.matchScore}%</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-500 dark:text-slate-400 text-sm">{connection.location}</span>
                      </div>

                      {getStatusBadge(connection.status)}
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">{connection.bio}</p>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {connection.skills.slice(0, 3).map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {connection.skills.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded-full">
                          +{connection.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Connection Info */}
                  {connection.mutualConnections > 0 && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                      <Users className="w-4 h-4" />
                      <span>{connection.mutualConnections} mutual connections</span>
                    </div>
                  )}

                  {connection.lastInteraction && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      Last interaction: {formatLastInteraction(connection.lastInteraction)}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {connection.status === 'connected' && (
                      <>
                        <button
                          onClick={() => setShowQuickMessage(connection.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-medium"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </button>
                        <button className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {connection.status === 'pending' && (
                      <div className="flex-1 flex items-center justify-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-xl text-sm font-medium">
                        <Clock className="w-4 h-4 mr-2" />
                        Pending
                      </div>
                    )}

                    {connection.status === 'invited' && (
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => handleConnectionAction(connection.id, 'accept')}
                          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors text-sm font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleConnectionAction(connection.id, 'decline')}
                          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-colors text-sm font-medium"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {connection.status === 'suggested' && (
                      <button
                        onClick={() => handleConnectionAction(connection.id, 'connect')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-medium"
                      >
                        <UserPlus className="w-4 h-4" />
                        Connect
                      </button>
                    )}
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