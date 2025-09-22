'use client';

import React, { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import {
  WifiIcon,
  UserGroupIcon,
  BellIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  PlayIcon,
  StopIcon
} from '@heroicons/react/24/outline';

export const RealtimeDemo: React.FC = () => {
  const {
    isConnected,
    presenceData,
    onlineUsers,
    currentUserStatus,
    updateStatus,
    requestIntroduction,
    scheduleMeetup,
    updateLocation,
    typingUsers
  } = useSocket();

  const [demoActive, setDemoActive] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  // Demo data
  const demoUsers = [
    { id: 'demo1', name: 'Alex Chen', role: 'Frontend Developer' },
    { id: 'demo2', name: 'Sarah Johnson', role: 'Product Manager' },
    { id: 'demo3', name: 'Michael Kim', role: 'Data Scientist' },
    { id: 'demo4', name: 'Emily Rodriguez', role: 'UX Designer' }
  ];

  const statusOptions: Array<'online' | 'away' | 'busy'> = ['online', 'away', 'busy'];

  useEffect(() => {
    if (demoActive && isConnected) {
      // Simulate some demo activities
      const interval = setInterval(() => {
        // Simulate random status updates or activities
        const activities = [
          () => console.log('Demo: Simulating background activity'),
          // Add more demo activities here
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        randomActivity();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [demoActive, isConnected]);

  const handleLocationToggle = () => {
    if (!locationEnabled) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            updateLocation(latitude, longitude);
            setLocationEnabled(true);
          },
          (error) => {
            console.error('Error getting location:', error);
            // Use demo coordinates
            updateLocation(37.7749, -122.4194); // San Francisco
            setLocationEnabled(true);
          }
        );
      } else {
        // Use demo coordinates
        updateLocation(37.7749, -122.4194);
        setLocationEnabled(true);
      }
    } else {
      setLocationEnabled(false);
    }
  };

  const simulateIntroductionRequest = () => {
    const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];
    requestIntroduction(randomUser.id, `Hi ${randomUser.name}! I'd love to connect and learn more about your work in ${randomUser.role}.`);
  };

  const simulateMeetupScheduling = () => {
    const randomUsers = demoUsers
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map(u => u.id);

    scheduleMeetup(randomUsers, {
      title: 'Networking Coffee Chat',
      duration: 30,
      location: 'Conference Lounge',
      time: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'away':
        return 'text-yellow-500';
      case 'busy':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Real-time Features Demo
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
            isConnected
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            <WifiIcon className="w-3 h-3" />
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <UserGroupIcon className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Presence
            </span>
          </div>
          <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
            <p>{presenceData.totalOnline} users online</p>
            <p>{presenceData.eventAttendees} at current event</p>
            <p>{onlineUsers.length} visible connections</p>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <BellIcon className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Activity
            </span>
          </div>
          <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
            <p>{typingUsers.length} users typing</p>
            <p className={getStatusColor(currentUserStatus)}>
              Status: {currentUserStatus}
            </p>
            <p>{locationEnabled ? 'Location enabled' : 'Location disabled'}</p>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Demo Controls
            </span>
          </div>
          <button
            onClick={() => setDemoActive(!demoActive)}
            className={`flex items-center space-x-1 text-sm px-3 py-1 rounded ${
              demoActive
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            }`}
          >
            {demoActive ? <StopIcon className="w-3 h-3" /> : <PlayIcon className="w-3 h-3" />}
            <span>{demoActive ? 'Stop Demo' : 'Start Demo'}</span>
          </button>
        </div>
      </div>

      {/* Status Controls */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
          Your Status
        </h4>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(status => (
            <Button
              key={status}
              variant={currentUserStatus === status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => updateStatus(status)}
              className="capitalize"
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${
                status === 'online' ? 'bg-green-400' :
                status === 'away' ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Feature Actions */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
          Real-time Actions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={simulateIntroductionRequest}
            disabled={!isConnected}
            className="flex items-center justify-center"
          >
            <UserGroupIcon className="w-4 h-4 mr-2" />
            Request Introduction
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={simulateMeetupScheduling}
            disabled={!isConnected}
            className="flex items-center justify-center"
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Schedule Meetup
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLocationToggle}
            disabled={!isConnected}
            className="flex items-center justify-center"
          >
            <MapPinIcon className="w-4 h-4 mr-2" />
            {locationEnabled ? 'Disable' : 'Enable'} Location
          </Button>
        </div>
      </div>

      {/* Online Users */}
      {onlineUsers.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
            Online Users ({onlineUsers.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {onlineUsers.map((user, index) => (
              <motion.div
                key={user.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-2 bg-neutral-50 dark:bg-neutral-800 rounded"
              >
                <div className="relative">
                  <img
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=cdff81&color=251a1e`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-800 ${
                    user.status === 'online' ? 'bg-green-400' :
                    user.status === 'away' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {user.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                    {user.status}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h5 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
          Real-time Features
        </h5>
        <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Live user presence and status updates</li>
          <li>• Real-time notifications for matches, introductions, and meetups</li>
          <li>• Proximity detection for nearby networking opportunities</li>
          <li>• Typing indicators for chat conversations</li>
          <li>• Event-based room management</li>
          <li>• Automatic connection status monitoring</li>
        </ul>
      </div>
    </div>
  );
};

export default RealtimeDemo;