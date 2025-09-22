'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Users, 
  Calendar, 
  MessageSquare, 
  Check, 
  CheckCheck, 
  Trash2, 
  Filter,
  Search,
  X
} from 'lucide-react';
import Navigation from '@/components/ui/Navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

interface Notification {
  id: string;
  type: 'match' | 'message' | 'event' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: any;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'match' | 'message' | 'event'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock notifications data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'match',
          title: 'New Match Found!',
          description: 'Sarah Chen from TechCorp matches your networking goals in AI/ML.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
          actionUrl: '/matches',
          metadata: { matchId: 'match1', score: 95 }
        },
        {
          id: '2',
          type: 'message',
          title: 'New Message',
          description: 'Alex Johnson sent you a message: "Great meeting you at the conference!"',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: false,
          actionUrl: '/connections',
          metadata: { senderId: 'user2' }
        },
        {
          id: '3',
          type: 'event',
          title: 'Event Reminder',
          description: 'Web3 Summit 2024 starts in 2 days. Don\'t forget to update your networking goals!',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
          read: true,
          actionUrl: '/events',
          metadata: { eventId: 'web3-summit-2024' }
        },
        {
          id: '4',
          type: 'match',
          title: '5 New Potential Matches',
          description: 'We found 5 new networking opportunities based on your interests in blockchain and DeFi.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          read: true,
          actionUrl: '/matches',
          metadata: { count: 5 }
        },
        {
          id: '5',
          type: 'system',
          title: 'Profile Optimization Tip',
          description: 'Add more skills to your profile to get better matches. Current completeness: 75%',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          read: true,
          actionUrl: '/profile',
          metadata: { completeness: 75 }
        }
      ];
      
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter notifications
  useEffect(() => {
    let filtered = notifications;

    if (filter !== 'all') {
      if (filter === 'unread') {
        filtered = filtered.filter(n => !n.read);
      } else {
        filtered = filtered.filter(n => n.type === filter);
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, filter, searchTerm]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <Users className="w-5 h-5 text-blue-400" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-green-400" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      return `${days} days ago`;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <Navigation />
          <div className="max-w-4xl mx-auto px-6 sm:px-10 md:px-16 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-slate-700 rounded w-1/3"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-slate-700 rounded"></div>
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
        
        <div className="max-w-4xl mx-auto px-6 sm:px-10 md:px-16 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Bell className="w-8 h-8 text-blue-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Notifications</h1>
                <p className="text-slate-300">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {['all', 'unread', 'match', 'message', 'event'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === filterType
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark All Read
                  </button>
                )}
                
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Notifications List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredNotifications.length === 0 ? (
              <div className="card p-8 text-center">
                <Bell className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {notifications.length === 0 ? 'No notifications yet' : 'No notifications match your filter'}
                </h3>
                <p className="text-slate-400">
                  {notifications.length === 0 
                    ? "You'll see your networking updates and messages here."
                    : "Try adjusting your filter or search terms."
                  }
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`card p-6 transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                    !notification.read ? 'border-l-4 border-blue-500 bg-slate-800/50' : ''
                  }`}
                  onClick={() => {
                    if (!notification.read) markAsRead(notification.id);
                    if (notification.actionUrl) {
                      // Navigate to the action URL
                      console.log('Navigate to:', notification.actionUrl);
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 bg-slate-700 rounded-lg">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-400">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-slate-300 mb-3">
                        {notification.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          notification.type === 'match' ? 'bg-blue-500/20 text-blue-300' :
                          notification.type === 'message' ? 'bg-green-500/20 text-green-300' :
                          notification.type === 'event' ? 'bg-purple-500/20 text-purple-300' :
                          'bg-slate-500/20 text-slate-300'
                        }`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                        
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}