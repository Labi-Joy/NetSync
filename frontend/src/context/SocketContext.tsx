'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { socketManager } from '@/lib/socket';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface SocketContextType {
  isConnected: boolean;
  onlineUsers: OnlineUser[];
  currentUserStatus: UserStatus;
  joinEvent: (eventId: string) => void;
  updateStatus: (status: UserStatus) => void;
  requestIntroduction: (targetUserId: string, message: string) => void;
  scheduleMeetup: (participants: string[], meetupData: any) => void;
  updateLocation: (latitude: number, longitude: number) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  typingUsers: TypingUser[];
  presenceData: PresenceData;
}

interface OnlineUser {
  userId: string;
  name: string;
  status: UserStatus;
  profilePicture?: string;
  lastSeen?: Date;
}

interface TypingUser {
  userId: string;
  name: string;
  conversationId: string;
}

interface PresenceData {
  totalOnline: number;
  eventAttendees: number;
  nearbyUsers: number;
}

type UserStatus = 'online' | 'away' | 'busy' | 'offline';

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showInfo, showWarning } = useToast();

  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [currentUserStatus, setCurrentUserStatus] = useState<UserStatus>('online');
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [presenceData, setPresenceData] = useState<PresenceData>({
    totalOnline: 0,
    eventAttendees: 0,
    nearbyUsers: 0
  });

  // Initialize socket connection when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('🔌 Initializing socket connection...');
      const socket = socketManager.connect();

      if (socket) {
        setIsConnected(true);

        // Set up event listeners
        setupSocketEventListeners();
      }
    } else {
      // Disconnect when not authenticated
      socketManager.disconnect();
      setIsConnected(false);
      setOnlineUsers([]);
      setTypingUsers([]);
    }

    return () => {
      if (!isAuthenticated) {
        socketManager.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  const setupSocketEventListeners = useCallback(() => {
    // Connection events
    socketManager.on('connect', () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
      showSuccess('Connected', 'Real-time features are now active');
    });

    socketManager.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
      showWarning('Disconnected', 'Real-time features are temporarily unavailable');
    });

    // Networking events
    socketManager.on('newMatch', (data: any) => {
      console.log('🎯 New match found:', data);
      showSuccess(
        'New Match Found!',
        `You have a new networking match with ${data.fromUser.name}`,
        {
          action: {
            label: 'View Match',
            onClick: () => {
              // Navigate to matches page
              if (typeof window !== 'undefined') {
                window.location.href = '/matches';
              }
            }
          }
        }
      );
    });

    socketManager.on('introductionReceived', (data: any) => {
      console.log('🤝 Introduction received:', data);
      showInfo(
        'Introduction Request',
        `${data.fromUser.name} would like to connect with you`,
        {
          action: {
            label: 'View Request',
            onClick: () => {
              // Navigate to connections page
              if (typeof window !== 'undefined') {
                window.location.href = '/connections';
              }
            }
          }
        }
      );
    });

    socketManager.on('meetupScheduled', (data: any) => {
      console.log('📅 Meetup scheduled:', data);
      showSuccess(
        'Meetup Scheduled',
        `${data.organizer.name} has scheduled a meetup with you`,
        {
          action: {
            label: 'View Details',
            onClick: () => {
              // Navigate to meetings/calendar
              if (typeof window !== 'undefined') {
                window.location.href = '/dashboard';
              }
            }
          }
        }
      );
    });

    socketManager.on('proximityAlert', (data: any) => {
      console.log('📍 Proximity alert:', data);
      showInfo(
        'Nearby Connection',
        `${data.user.name} is nearby and available for networking`,
        {
          duration: 8000,
          action: {
            label: 'Connect',
            onClick: () => {
              socketManager.requestIntroduction(data.user.id, 'Hi! I noticed we\'re both at the same event. Would you like to connect?');
            }
          }
        }
      );
    });

    // User presence events
    socketManager.on('userJoined', (data: any) => {
      console.log('👋 User joined event:', data);
      setOnlineUsers(prev => {
        const filtered = prev.filter(u => u.userId !== data.userId);
        return [...filtered, {
          userId: data.userId,
          name: data.name,
          status: data.status,
          profilePicture: data.profilePicture
        }];
      });

      updatePresenceData(1, 0);
    });

    socketManager.on('userLeft', (data: any) => {
      console.log('👋 User left event:', data);
      setOnlineUsers(prev => prev.filter(u => u.userId !== data.userId));
      updatePresenceData(-1, 0);
    });

    socketManager.on('userStatusChanged', (data: any) => {
      console.log('🔄 User status changed:', data);
      setOnlineUsers(prev => prev.map(u =>
        u.userId === data.userId
          ? { ...u, status: data.status }
          : u
      ));
    });

    // Chat events
    socketManager.on('userTyping', (data: any) => {
      console.log('⌨️ User typing:', data);
      setTypingUsers(prev => {
        const filtered = prev.filter(u => u.userId !== data.userId);
        return [...filtered, {
          userId: data.userId,
          name: data.name,
          conversationId: data.conversationId
        }];
      });
    });

    socketManager.on('userStoppedTyping', (data: any) => {
      console.log('⌨️ User stopped typing:', data);
      setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
    });

    // Event updates
    socketManager.on('eventUpdate', (data: any) => {
      console.log('📅 Event update:', data);
      showInfo('Event Update', data.message || 'Event information has been updated');
    });

  }, [showSuccess, showInfo, showWarning]);

  const updatePresenceData = useCallback((totalOnlineDelta: number, eventAttendeesDelta: number) => {
    setPresenceData(prev => ({
      totalOnline: Math.max(0, prev.totalOnline + totalOnlineDelta),
      eventAttendees: Math.max(0, prev.eventAttendees + eventAttendeesDelta),
      nearbyUsers: prev.nearbyUsers // This would be updated by proximity detection
    }));
  }, []);

  // Socket action methods
  const joinEvent = useCallback((eventId: string) => {
    console.log('🎪 Joining event:', eventId);
    socketManager.joinEvent(eventId);
  }, []);

  const updateStatus = useCallback((status: UserStatus) => {
    console.log('🔄 Updating status to:', status);
    setCurrentUserStatus(status);
    if (status !== 'offline') {
      socketManager.updateStatus(status);
    }
  }, []);

  const requestIntroduction = useCallback((targetUserId: string, message: string) => {
    console.log('🤝 Requesting introduction to:', targetUserId);
    socketManager.requestIntroduction(targetUserId, message);
    showInfo('Introduction Sent', 'Your introduction request has been sent');
  }, [showInfo]);

  const scheduleMeetup = useCallback((participants: string[], meetupData: any) => {
    console.log('📅 Scheduling meetup with participants:', participants);
    socketManager.scheduleMeetup(participants, meetupData);
    showSuccess('Meetup Scheduled', 'Participants will be notified');
  }, [showSuccess]);

  const updateLocation = useCallback((latitude: number, longitude: number) => {
    console.log('📍 Updating location:', { latitude, longitude });
    socketManager.updateLocation(latitude, longitude);
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    console.log('💬 Joining conversation:', conversationId);
    socketManager.joinConversation(conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    console.log('💬 Leaving conversation:', conversationId);
    socketManager.leaveConversation(conversationId);
  }, []);

  const startTyping = useCallback((conversationId: string) => {
    socketManager.startTyping(conversationId);
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    socketManager.stopTyping(conversationId);
  }, []);

  const value: SocketContextType = {
    isConnected,
    onlineUsers,
    currentUserStatus,
    joinEvent,
    updateStatus,
    requestIntroduction,
    scheduleMeetup,
    updateLocation,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    typingUsers,
    presenceData
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketProvider;