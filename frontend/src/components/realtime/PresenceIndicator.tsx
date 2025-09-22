'use client';

import React, { useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WifiIcon,
  UserGroupIcon,
  MapPinIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface PresenceIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  showDetails = true,
  className = ''
}) => {
  const { isConnected, presenceData, onlineUsers, currentUserStatus, updateStatus } = useSocket();
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-400';
      case 'away':
        return 'bg-yellow-400';
      case 'busy':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      default:
        return 'Offline';
    }
  };

  const handleStatusChange = (newStatus: 'online' | 'away' | 'busy') => {
    updateStatus(newStatus);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Connection Status */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
          <WifiIcon className={`w-4 h-4 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
          {showDetails && (
            <span className={`text-xs font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          )}
        </div>

        {/* Presence Stats */}
        {showDetails && isConnected && (
          <div className="flex items-center space-x-4 text-xs text-neutral-600 dark:text-neutral-400">
            <div
              className="flex items-center space-x-1 cursor-pointer hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
              onClick={() => setShowOnlineUsers(!showOnlineUsers)}
            >
              <UserGroupIcon className="w-4 h-4" />
              <span>{presenceData.totalOnline} online</span>
              {showOnlineUsers ? (
                <EyeSlashIcon className="w-3 h-3" />
              ) : (
                <EyeIcon className="w-3 h-3" />
              )}
            </div>

            {presenceData.eventAttendees > 0 && (
              <div className="flex items-center space-x-1">
                <MapPinIcon className="w-4 h-4" />
                <span>{presenceData.eventAttendees} at event</span>
              </div>
            )}
          </div>
        )}

        {/* User Status Selector */}
        {showDetails && isConnected && (
          <div className="relative">
            <select
              value={currentUserStatus}
              onChange={(e) => handleStatusChange(e.target.value as 'online' | 'away' | 'busy')}
              className="text-xs bg-transparent border border-neutral-300 dark:border-neutral-600 rounded px-2 py-1 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="busy">Busy</option>
            </select>
            <div className={`absolute left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full ${getStatusColor(currentUserStatus)}`} />
          </div>
        )}
      </div>

      {/* Online Users List */}
      <AnimatePresence>
        {showOnlineUsers && isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50 max-h-64 overflow-y-auto"
          >
            <div className="p-3">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Online Users ({onlineUsers.length})
              </h4>

              {onlineUsers.length === 0 ? (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  No other users online
                </p>
              ) : (
                <div className="space-y-2">
                  {onlineUsers.map((user) => (
                    <div
                      key={user.userId}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=cdff81&color=251a1e`}
                          alt={user.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 ${getStatusColor(user.status)}`} />
                      </div>

                      <div className="flex-1">
                        <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                          {user.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {getStatusText(user.status)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PresenceIndicator;