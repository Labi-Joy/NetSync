'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/context/SocketContext';
import { socketManager } from '@/lib/socket';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  UserPlusIcon,
  CalendarIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface RealtimeNotificationsProps {
  className?: string;
}

interface Notification {
  id: string;
  type: 'match' | 'introduction' | 'meetup' | 'proximity' | 'event_update' | 'user_activity';
  title: string;
  message: string;
  timestamp: Date;
  data?: any;
  isRead?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const RealtimeNotifications: React.FC<RealtimeNotificationsProps> = ({ className = '' }) => {
  const { isConnected } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const notification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      isRead: false
    };

    setNotifications(prev => [notification, ...prev.slice(0, 19)]); // Keep only 20 notifications
    setUnreadCount(prev => prev + 1);

    // Auto-remove certain types of notifications after a delay
    if (notification.type === 'user_activity' || notification.type === 'proximity') {
      setTimeout(() => {
        removeNotification(notification.id);
      }, 10000); // Remove after 10 seconds
    }
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    const handleNewMatch = (data: any) => {
      addNotification({
        type: 'match',
        title: 'New Match Found!',
        message: `You have a new networking match with ${data.fromUser.name}`,
        data,
        action: {
          label: 'View Match',
          onClick: () => {
            if (typeof window !== 'undefined') {
              window.location.href = '/matches';
            }
          }
        }
      });
    };

    const handleIntroductionReceived = (data: any) => {
      addNotification({
        type: 'introduction',
        title: 'Introduction Request',
        message: `${data.fromUser.name} would like to connect with you`,
        data,
        action: {
          label: 'View Request',
          onClick: () => {
            if (typeof window !== 'undefined') {
              window.location.href = '/connections';
            }
          }
        }
      });
    };

    const handleMeetupScheduled = (data: any) => {
      addNotification({
        type: 'meetup',
        title: 'Meetup Scheduled',
        message: `${data.organizer.name} has scheduled a meetup with you`,
        data,
        action: {
          label: 'View Details',
          onClick: () => {
            if (typeof window !== 'undefined') {
              window.location.href = '/dashboard';
            }
          }
        }
      });
    };

    const handleProximityAlert = (data: any) => {
      addNotification({
        type: 'proximity',
        title: 'Nearby Connection',
        message: `${data.user.name} is nearby and available for networking`,
        data,
        action: {
          label: 'Connect',
          onClick: () => {
            socketManager.requestIntroduction(data.user.id, 'Hi! I noticed we\'re both at the same event. Would you like to connect?');
          }
        }
      });
    };

    const handleUserJoined = (data: any) => {
      addNotification({
        type: 'user_activity',
        title: 'User Joined Event',
        message: `${data.name} joined the event`,
        data
      });
    };

    const handleEventUpdate = (data: any) => {
      addNotification({
        type: 'event_update',
        title: 'Event Update',
        message: data.message || 'Event information has been updated',
        data
      });
    };

    // Register event listeners
    socketManager.on('newMatch', handleNewMatch);
    socketManager.on('introductionReceived', handleIntroductionReceived);
    socketManager.on('meetupScheduled', handleMeetupScheduled);
    socketManager.on('proximityAlert', handleProximityAlert);
    socketManager.on('userJoined', handleUserJoined);
    socketManager.on('eventUpdate', handleEventUpdate);

    // Cleanup listeners
    return () => {
      socketManager.off('newMatch', handleNewMatch);
      socketManager.off('introductionReceived', handleIntroductionReceived);
      socketManager.off('meetupScheduled', handleMeetupScheduled);
      socketManager.off('proximityAlert', handleProximityAlert);
      socketManager.off('userJoined', handleUserJoined);
      socketManager.off('eventUpdate', handleEventUpdate);
    };
  }, [isConnected, addNotification]);

  const removeNotification = (id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.isRead) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== id);
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <UserPlusIcon className="w-5 h-5 text-purple-500" />;
      case 'introduction':
        return <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-500" />;
      case 'meetup':
        return <CalendarIcon className="w-5 h-5 text-green-500" />;
      case 'proximity':
        return <MapPinIcon className="w-5 h-5 text-orange-500" />;
      case 'event_update':
        return <BellIcon className="w-5 h-5 text-indigo-500" />;
      case 'user_activity':
        return <UserPlusIcon className="w-5 h-5 text-gray-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 z-50 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Notifications
                </h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <BellIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                  <p className="text-neutral-500 dark:text-neutral-400">
                    No notifications yet
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                    {isConnected ? 'Real-time notifications will appear here' : 'Connect to receive real-time notifications'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  <AnimatePresence>
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.2 }}
                        className={`p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors ${
                          !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                        }`}
                        onClick={() => !notification.isRead && markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium ${
                                !notification.isRead
                                  ? 'text-neutral-900 dark:text-neutral-100'
                                  : 'text-neutral-700 dark:text-neutral-300'
                              }`}>
                                {notification.title}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </div>

                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                              {notification.message}
                            </p>

                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                {formatTimestamp(notification.timestamp)}
                              </span>

                              {notification.action && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    notification.action!.onClick();
                                    markAsRead(notification.id);
                                  }}
                                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {notification.action.label}
                                </button>
                              )}
                            </div>

                            {!notification.isRead && (
                              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RealtimeNotifications;