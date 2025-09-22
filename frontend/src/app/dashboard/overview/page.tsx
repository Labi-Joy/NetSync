"use client";
import Navigation from "@/components/ui/Navigation";
import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Zap, 
  Award, 
  MessageSquare,
  Star,
  Target,
  Activity,
  Clock,
  Network,
  ArrowUpRight,
  BarChart3,
  Plus,
  CheckCircle,
  AlertCircle,
  Bot,
  Globe,
  Bookmark
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { enhancedNetworkingAPI, enhancedEventAPI } from '@/lib/apiWithRetry';
import Link from 'next/link';

export default function DashboardOverviewPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    matchesCount: 23,
    connectionsCount: 47,
    eventsCount: 5,
    profileViews: 94
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load dashboard data from APIs
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAuthenticated || !user) return;
      
      try {
        setLoading(true);
        console.log('📈 Loading dashboard data...');
        
        // Load data in parallel for better performance
        const [matchesResponse, connectionsResponse, eventsResponse] = await Promise.allSettled([
          enhancedNetworkingAPI.findMatches({ userId: user._id }),
          enhancedNetworkingAPI.getConnections({ userId: user._id }),
          enhancedEventAPI.getEvents({ userId: user._id, registered: true })
        ]);
        
        const newData = { ...dashboardData };
        
        // Process matches data
        if (matchesResponse.status === 'fulfilled') {
          newData.matchesCount = matchesResponse.value.data.matches?.length || dashboardData.matchesCount;
          console.log('✅ Matches data loaded:', newData.matchesCount);
        } else {
          console.log('⚠️ Using fallback matches count');
        }
        
        // Process connections data
        if (connectionsResponse.status === 'fulfilled') {
          newData.connectionsCount = connectionsResponse.value.data.connections?.length || dashboardData.connectionsCount;
          console.log('✅ Connections data loaded:', newData.connectionsCount);
        } else {
          console.log('⚠️ Using fallback connections count');
        }
        
        // Process events data
        if (eventsResponse.status === 'fulfilled') {
          newData.eventsCount = eventsResponse.value.data.events?.length || dashboardData.eventsCount;
          console.log('✅ Events data loaded:', newData.eventsCount);
        } else {
          console.log('⚠️ Using fallback events count');
        }
        
        setDashboardData(newData);
        console.log('✅ Dashboard data loaded successfully');
        
      } catch (error) {
        console.error('❌ Failed to load dashboard data:', error);
        // Keep existing fallback data
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Authentication check
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleViewMatches = () => {
    router.push('/matches');
  };

  const handleViewEvents = () => {
    router.push('/events');
  };

  const handleViewConnections = () => {
    router.push('/connections');
  };

  const handleViewNotifications = () => {
    router.push('/notifications');
  };

  const handleViewProfile = () => {
    router.push('/profile');
  };

  // Mock data for enhanced dashboard
  const recentActivities = [
    { type: 'match', user: 'Sarah Chen', action: 'New high-compatibility match', time: '2 hours ago', score: 95 },
    { type: 'event', event: 'Web3 Summit 2024', action: 'Registered successfully', time: '1 day ago' },
    { type: 'message', user: 'David Kim', action: 'Sent you a connection request', time: '2 days ago' },
    { type: 'achievement', action: 'Earned "Super Connector" badge', time: '3 days ago' }
  ];

  const upcomingEvents = [
    { name: 'Web3 Summit 2024', date: 'Dec 15-17', location: 'San Francisco', attendees: 1200 },
    { name: 'DeFi Innovation Conference', date: 'Jan 8-10', location: 'New York', attendees: 800 },
    { name: 'Blockchain Builders Meetup', date: 'Jan 20', location: 'Austin', attendees: 150 }
  ];

  const topMatches = [
    { name: 'Alex Rodriguez', title: 'Senior Frontend Developer', company: 'Coinbase', score: 98, interests: ['React', 'Web3', 'DeFi'] },
    { name: 'Maria Santos', title: 'Blockchain Architect', company: 'Polygon', score: 95, interests: ['Solidity', 'Layer 2', 'DeFi'] },
    { name: 'James Park', title: 'Product Manager', company: 'Uniswap', score: 92, interests: ['DeFi', 'Product', 'Strategy'] }
  ];

  const achievements = [
    { name: 'First Connection', description: 'Made your first professional connection', earned: true },
    { name: 'Event Attendee', description: 'Attended 3+ networking events', earned: true },
    { name: 'Super Connector', description: 'Connected with 10+ professionals', earned: true },
    { name: 'Mentor', description: 'Provided mentorship to 5+ people', earned: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navigation />
      
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Welcome back, {user?.name?.split(' ')[0] || 'Professional'}!
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Let's make meaningful connections today
                  </p>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/chat"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
              >
                <Bot className="w-4 h-4" />
                AI Assistant
              </Link>
              <button 
                onClick={handleViewMatches}
                className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-medium transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Find Matches
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer group"
                onClick={handleViewMatches}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {loading ? '...' : dashboardData.matchesCount}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Active Matches</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer group"
                onClick={handleViewConnections}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Network className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 transition-colors" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {loading ? '...' : dashboardData.connectionsCount}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Connections</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer group"
                onClick={handleViewEvents}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {loading ? '...' : dashboardData.eventsCount}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Events Joined</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <BarChart3 className="w-5 h-5 text-slate-400 group-hover:text-orange-600 transition-colors" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">94%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Match Quality</div>
              </motion.div>
            </div>

            {/* Recent Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
                </div>
                <button 
                  onClick={handleViewNotifications} 
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center">
                      {activity.type === 'match' && (
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      {activity.type === 'event' && (
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                      )}
                      {activity.type === 'message' && (
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                      )}
                      {activity.type === 'achievement' && (
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                          <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-white font-medium leading-relaxed">
                        {activity.user && <span className="font-semibold">{activity.user}</span>} {activity.action}
                        {activity.score && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                            {activity.score}% match
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Top Matches Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top AI Matches */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Top AI Matches</h3>
                  </div>
                  <button 
                    onClick={handleViewMatches} 
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {topMatches.slice(0, 3).map((match, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {match.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{match.name}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{match.title} at {match.company}</p>
                        <div className="flex gap-1">
                          {match.interests.slice(0, 2).map((interest, i) => (
                            <span key={i} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{match.score}%</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Match</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Upcoming Events</h3>
                  </div>
                  <button 
                    onClick={handleViewEvents} 
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Browse All
                  </button>
                </div>
                <div className="space-y-4">
                  {upcomingEvents.slice(0, 3).map((event, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {event.name}
                        </h4>
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                      </div>
                      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          <span>{event.attendees} attending</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Completion & Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Profile</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Completion</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">85%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div className="h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                    <div className="text-xl font-bold text-slate-900 dark:text-white">147</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-slate-900 dark:text-white">92%</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Response</div>
                  </div>
                </div>

                <button 
                  onClick={handleViewProfile} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Achievements</h3>
              </div>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      achievement.earned 
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' 
                        : 'bg-slate-50 dark:bg-slate-800/50 opacity-60'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      achievement.earned 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
                    }`}>
                      {achievement.earned ? '🏆' : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold ${
                        achievement.earned 
                          ? 'text-slate-900 dark:text-white' 
                          : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {achievement.name}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleViewMatches}
                  className="w-full flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Find Matches</span>
                </button>
                
                <button 
                  onClick={handleViewEvents}
                  className="w-full flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Browse Events</span>
                </button>
                
                <Link
                  href="/chat"
                  className="w-full flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Bot className="w-4 h-4" />
                  </div>
                  <span className="font-medium">AI Assistant</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}