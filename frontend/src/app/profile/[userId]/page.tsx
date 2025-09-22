'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Building, 
  Calendar, 
  Star, 
  MessageSquare,
  UserPlus,
  UserCheck,
  Share2,
  Award,
  TrendingUp,
  Users,
  ExternalLink,
  ArrowLeft,
  Mail,
  Linkedin,
  Github,
  Clock,
  FileText
} from 'lucide-react';
import Navigation from '@/components/ui/Navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

interface UserProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar: string;
  bio: string;
  joinDate: Date;
  profileViews: number;
  connectionsCount: number;
  eventsAttended: number;
  matchScore?: number;
  connectionStatus: 'connected' | 'pending' | 'not-connected' | 'self';
  professionalInfo: {
    title: string;
    company: string;
    experience: 'junior' | 'mid' | 'senior' | 'executive';
    skills: string[];
    interests: string[];
  };
  networkingProfile: {
    goals: string[];
    lookingFor: 'mentor' | 'mentee' | 'peers' | 'collaborators' | 'all';
    communicationStyle: 'proactive' | 'reactive' | 'structured';
    availability: string[];
  };
  contact: {
    email?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  recentActivity: {
    type: 'event' | 'connection' | 'post';
    title: string;
    date: Date;
    description: string;
  }[];
  mutualConnections: {
    id: string;
    name: string;
    avatar: string;
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
    date: Date;
    type: 'event' | 'networking' | 'milestone';
  }[];
  isOnline: boolean;
  lastSeen?: Date;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const userId = params.userId as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'activity' | 'connections'>('about');

  useEffect(() => {
    // Simulate API call to fetch user profile
    setTimeout(() => {
      // Mock profile data
      const mockProfile: UserProfile = {
        id: userId,
        name: 'Sarah Chen',
        title: 'Senior AI Engineer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        avatar: '/api/placeholder/128/128',
        bio: 'Passionate AI engineer with 8+ years of experience building scalable machine learning systems. Currently working on cutting-edge AI applications in the Web3 space. Love mentoring junior developers and contributing to open source projects. Always excited to connect with fellow builders and innovators in the tech industry.',
        joinDate: new Date(2023, 5, 15), // June 15, 2023
        profileViews: 1247,
        connectionsCount: 342,
        eventsAttended: 23,
        matchScore: currentUser?._id !== userId ? 95 : undefined,
        connectionStatus: currentUser?._id === userId ? 'self' : 'not-connected',
        professionalInfo: {
          title: 'Senior AI Engineer',
          company: 'TechCorp',
          experience: 'senior',
          skills: ['Machine Learning', 'Python', 'TensorFlow', 'PyTorch', 'Blockchain', 'Smart Contracts', 'Data Science', 'Deep Learning'],
          interests: ['AI Ethics', 'DeFi', 'Web3', 'Open Source', 'Mentoring', 'Startups', 'Product Development']
        },
        networkingProfile: {
          goals: ['Learn about Web3 technologies', 'Share AI/ML expertise', 'Find collaboration opportunities', 'Mentor junior developers'],
          lookingFor: 'all',
          communicationStyle: 'proactive',
          availability: ['Conferences', 'Online meetups', 'Coffee chats', '1:1 mentoring']
        },
        contact: {
          email: 'sarah.chen@techcorp.com',
          linkedin: 'linkedin.com/in/sarahchen',
          github: 'github.com/sarahchen',
          website: 'sarahchen.dev'
        },
        recentActivity: [
          {
            type: 'event',
            title: 'Attended AI/ML Conference 2024',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
            description: 'Participated in panel discussion on AI Ethics in Web3'
          },
          {
            type: 'connection',
            title: 'Connected with 5 new professionals',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
            description: 'Made valuable connections at the blockchain developer meetup'
          },
          {
            type: 'post',
            title: 'Published article on AI in DeFi',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 2 weeks ago
            description: 'Shared insights on machine learning applications in decentralized finance'
          }
        ],
        mutualConnections: [
          { id: '1', name: 'Alex Rodriguez', avatar: '/api/placeholder/40/40' },
          { id: '2', name: 'Emma Wilson', avatar: '/api/placeholder/40/40' },
          { id: '3', name: 'David Kim', avatar: '/api/placeholder/40/40' },
          { id: '4', name: 'Lisa Zhang', avatar: '/api/placeholder/40/40' },
          { id: '5', name: 'Mike Johnson', avatar: '/api/placeholder/40/40' }
        ],
        achievements: [
          {
            id: '1',
            title: 'Top Networker',
            description: 'Made 50+ meaningful connections this year',
            date: new Date(2024, 2, 15),
            type: 'networking'
          },
          {
            id: '2',
            title: 'Conference Speaker',
            description: 'Spoke at 3 major tech conferences',
            date: new Date(2024, 1, 20),
            type: 'event'
          },
          {
            id: '3',
            title: 'Mentor Excellence',
            description: 'Successfully mentored 10+ junior developers',
            date: new Date(2024, 0, 10),
            type: 'milestone'
          }
        ],
        isOnline: true,
        lastSeen: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
      };

      setProfile(mockProfile);
      setIsLoading(false);
    }, 1000);
  }, [userId, currentUser]);

  const handleConnect = () => {
    if (profile) {
      setProfile({
        ...profile,
        connectionStatus: 'pending'
      });
      // Implement actual connection logic here
      console.log('Connection request sent to:', profile.name);
    }
  };

  const handleMessage = () => {
    // Implement messaging logic
    console.log('Opening message thread with:', profile?.name);
  };

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const formatActivityDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getExperienceBadge = (experience: string) => {
    const colors = {
      junior: 'bg-green-500/20 text-green-300',
      mid: 'bg-blue-500/20 text-blue-300',
      senior: 'bg-purple-500/20 text-purple-300',
      executive: 'bg-orange-500/20 text-orange-300'
    };
    
    return colors[experience as keyof typeof colors] || 'bg-slate-500/20 text-slate-300';
  };

  const getConnectionStatusButton = () => {
    if (!profile || profile.connectionStatus === 'self') return null;

    switch (profile.connectionStatus) {
      case 'connected':
        return (
          <div className="flex gap-3">
            <button
              onClick={handleMessage}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              Message
            </button>
            <button className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              <UserCheck className="w-5 h-5" />
            </button>
          </div>
        );
      case 'pending':
        return (
          <button className="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg cursor-not-allowed">
            <Clock className="w-5 h-5 mr-2" />
            Connection Pending
          </button>
        );
      case 'not-connected':
      default:
        return (
          <div className="flex gap-3">
            <button
              onClick={handleConnect}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Connect
            </button>
            <button
              onClick={handleMessage}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <Navigation />
          <div className="max-w-4xl mx-auto px-6 sm:px-10 md:px-16 py-8">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 bg-slate-700 rounded-full"></div>
                <div className="space-y-3 flex-grow">
                  <div className="h-8 bg-slate-700 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                </div>
              </div>
              <div className="h-40 bg-slate-700 rounded"></div>
              <div className="h-60 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <Navigation />
          <div className="max-w-4xl mx-auto px-6 sm:px-10 md:px-16 py-8">
            <div className="card p-8 text-center">
              <User className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">User not found</h2>
              <p className="text-slate-400 mb-6">The profile you're looking for doesn't exist or has been deleted.</p>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors mx-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex flex-col items-center lg:items-start">
                {/* Profile Picture */}
                <div className="relative mb-4">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-4xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {profile.isOnline && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-slate-800 rounded-full"></div>
                  )}
                </div>

                {/* Match Score */}
                {profile.matchScore && (
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-lg font-bold text-white">{profile.matchScore}% Match</span>
                  </div>
                )}
              </div>

              <div className="flex-grow">
                {/* Name and Title */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                  <p className="text-xl text-slate-300 mb-2">{profile.title}</p>
                  <div className="flex items-center gap-4 text-slate-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{profile.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatJoinDate(profile.joinDate)}</span>
                    </div>
                  </div>
                  
                  {/* Experience Level */}
                  <span className={`px-3 py-1 text-sm rounded-full ${getExperienceBadge(profile.professionalInfo.experience)}`}>
                    {profile.professionalInfo.experience.charAt(0).toUpperCase() + profile.professionalInfo.experience.slice(1)} Level
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{profile.connectionsCount}</div>
                    <div className="text-sm text-slate-400">Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{profile.eventsAttended}</div>
                    <div className="text-sm text-slate-400">Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{profile.profileViews}</div>
                    <div className="text-sm text-slate-400">Profile Views</div>
                  </div>
                </div>

                {/* Action Buttons */}
                {getConnectionStatusButton()}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-8 pt-8 border-t border-slate-700">
              <p className="text-slate-300 leading-relaxed">{profile.bio}</p>
            </div>

            {/* Contact Links */}
            {(profile.contact.email || profile.contact.linkedin || profile.contact.github || profile.contact.website) && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="flex flex-wrap gap-4">
                  {profile.contact.email && (
                    <a
                      href={`mailto:${profile.contact.email}`}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">Email</span>
                    </a>
                  )}
                  {profile.contact.linkedin && (
                    <a
                      href={`https://${profile.contact.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="text-sm">LinkedIn</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {profile.contact.github && (
                    <a
                      href={`https://${profile.contact.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm">GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {profile.contact.website && (
                    <a
                      href={`https://${profile.contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">Website</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Content Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex gap-1">
              {[
                { id: 'about', label: 'About', count: null },
                { id: 'activity', label: 'Activity', count: profile.recentActivity.length },
                { id: 'connections', label: 'Mutual Connections', count: profile.mutualConnections.length }
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
                  {tab.count !== null && (
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
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Skills */}
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.professionalInfo.skills.map(skill => (
                        <span
                          key={skill}
                          className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.professionalInfo.interests.map(interest => (
                        <span
                          key={interest}
                          className="px-3 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Networking Goals */}
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Networking Goals</h3>
                    <ul className="space-y-2">
                      {profile.networkingProfile.goals.map((goal, index) => (
                        <li key={index} className="text-slate-300 flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Achievements */}
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Achievements</h3>
                    <div className="space-y-4">
                      {profile.achievements.map(achievement => (
                        <div key={achievement.id} className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            achievement.type === 'networking' ? 'bg-blue-500/20' :
                            achievement.type === 'event' ? 'bg-green-500/20' :
                            'bg-purple-500/20'
                          }`}>
                            <Award className={`w-4 h-4 ${
                              achievement.type === 'networking' ? 'text-blue-400' :
                              achievement.type === 'event' ? 'text-green-400' :
                              'text-purple-400'
                            }`} />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{achievement.title}</h4>
                            <p className="text-slate-400 text-sm">{achievement.description}</p>
                            <p className="text-slate-500 text-xs mt-1">
                              {achievement.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Networking Preferences */}
                  <div className="card p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Networking Style</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-400 text-sm">Looking for:</span>
                        <p className="text-white capitalize">{profile.networkingProfile.lookingFor === 'all' ? 'All types of connections' : profile.networkingProfile.lookingFor}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">Communication style:</span>
                        <p className="text-white capitalize">{profile.networkingProfile.communicationStyle}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-sm">Availability:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {profile.networkingProfile.availability.map(availability => (
                            <span key={availability} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                              {availability}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Recent Activity</h3>
                <div className="space-y-6">
                  {profile.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 pb-6 border-b border-slate-700 last:border-b-0 last:pb-0">
                      <div className={`p-3 rounded-lg ${
                        activity.type === 'event' ? 'bg-green-500/20' :
                        activity.type === 'connection' ? 'bg-blue-500/20' :
                        'bg-purple-500/20'
                      }`}>
                        {activity.type === 'event' ? (
                          <Calendar className="w-5 h-5 text-green-400" />
                        ) : activity.type === 'connection' ? (
                          <Users className="w-5 h-5 text-blue-400" />
                        ) : (
                          <FileText className="w-5 h-5 text-purple-400" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-white font-semibold mb-1">{activity.title}</h4>
                        <p className="text-slate-300 mb-2">{activity.description}</p>
                        <p className="text-slate-400 text-sm">{formatActivityDate(activity.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connections Tab */}
            {activeTab === 'connections' && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Mutual Connections</h3>
                {profile.mutualConnections.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No mutual connections yet</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {profile.mutualConnections.map(connection => (
                      <div key={connection.id} className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {connection.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-white font-medium">{connection.name}</p>
                          <p className="text-slate-400 text-sm">Mutual connection</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}