'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Clock,
  Download,
  ArrowLeft,
  Eye,
  Share2,
  UserCheck,
  Star,
  Zap,
  Target,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AppLayout } from '@/components/layouts/AppLayout';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';

interface AnalyticsData {
  event: {
    id: string;
    title: string;
    date: Date;
    location: string;
    status: string;
  };
  overview: {
    totalRegistrations: number;
    checkedIn: number;
    noShows: number;
    revenue: number;
    conversionRate: number;
    satisfactionRating: number;
    netPromoterScore: number;
  };
  registrations: {
    timeline: Array<{ date: string; count: number; cumulative: number }>;
    sources: Array<{ source: string; count: number; percentage: number }>;
    ticketTypes: Array<{ type: string; count: number; revenue: number }>;
  };
  demographics: {
    companies: Array<{ name: string; count: number }>;
    roles: Array<{ title: string; count: number }>;
    experience: Array<{ level: string; count: number }>;
    interests: Array<{ interest: string; count: number }>;
  };
  engagement: {
    pageViews: number;
    uniqueVisitors: number;
    averageTimeOnPage: number;
    socialShares: number;
    emailOpens: number;
    emailClicks: number;
  };
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  feedback: {
    ratings: Array<{ rating: number; count: number }>;
    comments: Array<{ 
      id: string; 
      rating: number; 
      comment: string; 
      attendee: string; 
      date: Date;
    }>;
  };
}

export default function EventAnalyticsPage() {
  const params = useParams();
  const eventId = params.id as string;
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | 'all'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [eventId, selectedTimeframe]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Mock analytics data
      const mockData: AnalyticsData = {
        event: {
          id: eventId,
          title: 'Web3 Developer Workshop',
          date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          location: 'San Francisco, CA',
          status: 'published'
        },
        overview: {
          totalRegistrations: 145,
          checkedIn: 112,
          noShows: 8,
          revenue: 14250,
          conversionRate: 23.5,
          satisfactionRating: 4.7,
          netPromoterScore: 72
        },
        registrations: {
          timeline: [
            { date: '2024-01-01', count: 12, cumulative: 12 },
            { date: '2024-01-02', count: 8, cumulative: 20 },
            { date: '2024-01-03', count: 15, cumulative: 35 },
            { date: '2024-01-04', count: 22, cumulative: 57 },
            { date: '2024-01-05', count: 18, cumulative: 75 },
            { date: '2024-01-06', count: 25, cumulative: 100 },
            { date: '2024-01-07', count: 28, cumulative: 128 },
            { date: '2024-01-08', count: 17, cumulative: 145 }
          ],
          sources: [
            { source: 'Direct', count: 58, percentage: 40 },
            { source: 'Social Media', count: 43, percentage: 30 },
            { source: 'Email Campaign', count: 29, percentage: 20 },
            { source: 'Referral', count: 15, percentage: 10 }
          ],
          ticketTypes: [
            { type: 'Early Bird', count: 45, revenue: 4050 },
            { type: 'Regular', count: 75, revenue: 7500 },
            { type: 'VIP', count: 20, revenue: 4000 },
            { type: 'Student', count: 5, revenue: 250 }
          ]
        },
        demographics: {
          companies: [
            { name: 'Google', count: 12 },
            { name: 'Meta', count: 8 },
            { name: 'Ethereum Foundation', count: 6 },
            { name: 'Coinbase', count: 5 },
            { name: 'Freelancer', count: 25 },
            { name: 'Other', count: 89 }
          ],
          roles: [
            { title: 'Software Engineer', count: 45 },
            { title: 'Product Manager', count: 22 },
            { title: 'Designer', count: 18 },
            { title: 'DevOps Engineer', count: 15 },
            { title: 'Data Scientist', count: 12 },
            { title: 'Other', count: 33 }
          ],
          experience: [
            { level: 'Junior (0-2 years)', count: 35 },
            { level: 'Mid (3-5 years)', count: 52 },
            { level: 'Senior (6-10 years)', count: 38 },
            { level: 'Lead/Principal (10+ years)', count: 20 }
          ],
          interests: [
            { interest: 'Web3', count: 89 },
            { interest: 'Blockchain', count: 67 },
            { interest: 'DeFi', count: 45 },
            { interest: 'Smart Contracts', count: 52 },
            { interest: 'React', count: 38 },
            { interest: 'Node.js', count: 34 }
          ]
        },
        engagement: {
          pageViews: 2340,
          uniqueVisitors: 1850,
          averageTimeOnPage: 285,
          socialShares: 127,
          emailOpens: 1240,
          emailClicks: 298
        },
        devices: {
          desktop: 62,
          mobile: 32,
          tablet: 6
        },
        feedback: {
          ratings: [
            { rating: 5, count: 67 },
            { rating: 4, count: 28 },
            { rating: 3, count: 8 },
            { rating: 2, count: 2 },
            { rating: 1, count: 1 }
          ],
          comments: [
            {
              id: '1',
              rating: 5,
              comment: 'Excellent workshop! Great hands-on examples and practical insights.',
              attendee: 'Alice Johnson',
              date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
            },
            {
              id: '2',
              rating: 5,
              comment: 'Very informative and well-structured. The speaker was fantastic!',
              attendee: 'Bob Smith',
              date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
            },
            {
              id: '3',
              rating: 4,
              comment: 'Good content overall, could use more time for Q&A.',
              attendee: 'Carol Davis',
              date: new Date(Date.now() - 1000 * 60 * 60 * 12)
            }
          ]
        }
      };

      setAnalyticsData(mockData);
      
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <AppLayout title="Event Analytics" description="Track your event performance">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} className="h-24" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!analyticsData) {
    return (
      <AppLayout title="Event Analytics" description="Track your event performance">
        <div className="text-center py-12">
          <p className="text-neutral-400">Failed to load analytics data</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Event Analytics" description="Track your event performance and insights">
      {/* Header */}
      <div className="mb-8">
        <Link href="/events/manage" className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Manage Events
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-100">{analyticsData.event.title}</h1>
            <div className="flex items-center gap-4 text-sm text-neutral-400 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(analyticsData.event.date)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {analyticsData.event.location}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="input-base"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
            
            <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-neutral-400">Total Registrations</h3>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-neutral-100">{analyticsData.overview.totalRegistrations}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">+12% from last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-neutral-400">Total Revenue</h3>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-neutral-100">{formatCurrency(analyticsData.overview.revenue)}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">+8% from target</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-neutral-400">Attendance Rate</h3>
            <UserCheck className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-neutral-100">
            {Math.round((analyticsData.overview.checkedIn / analyticsData.overview.totalRegistrations) * 100)}%
          </p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-sm text-neutral-400">
              {analyticsData.overview.checkedIn} of {analyticsData.overview.totalRegistrations} attended
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-neutral-400">Satisfaction</h3>
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-neutral-100">{analyticsData.overview.satisfactionRating}/5</p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-sm text-neutral-400">
              NPS: {analyticsData.overview.netPromoterScore}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">Registration Sources</h3>
          <div className="space-y-4">
            {analyticsData.registrations.sources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                  }`} />
                  <span className="text-neutral-300">{source.source}</span>
                </div>
                <div className="text-right">
                  <p className="text-neutral-100 font-medium">{source.count}</p>
                  <p className="text-sm text-neutral-400">{source.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ticket Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">Ticket Sales</h3>
          <div className="space-y-4">
            {analyticsData.registrations.ticketTypes.map((ticket, index) => (
              <div key={ticket.type} className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-300 font-medium">{ticket.type}</p>
                  <p className="text-sm text-neutral-400">{ticket.count} sold</p>
                </div>
                <div className="text-right">
                  <p className="text-neutral-100 font-medium">{formatCurrency(ticket.revenue)}</p>
                  <p className="text-sm text-neutral-400">
                    {formatCurrency(ticket.revenue / ticket.count)} avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Demographics - Companies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">Top Companies</h3>
          <div className="space-y-3">
            {analyticsData.demographics.companies.slice(0, 5).map((company) => (
              <div key={company.name} className="flex items-center justify-between">
                <span className="text-neutral-300">{company.name}</span>
                <span className="text-neutral-100 font-medium">{company.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Demographics - Roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">Job Roles</h3>
          <div className="space-y-3">
            {analyticsData.demographics.roles.slice(0, 5).map((role) => (
              <div key={role.title} className="flex items-center justify-between">
                <span className="text-neutral-300">{role.title}</span>
                <span className="text-neutral-100 font-medium">{role.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Engagement Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">Engagement</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span className="text-neutral-300">Page Views</span>
              </div>
              <span className="text-neutral-100 font-medium">{analyticsData.engagement.pageViews.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-neutral-300">Unique Visitors</span>
              </div>
              <span className="text-neutral-100 font-medium">{analyticsData.engagement.uniqueVisitors.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-neutral-300">Avg. Time on Page</span>
              </div>
              <span className="text-neutral-100 font-medium">{formatDuration(analyticsData.engagement.averageTimeOnPage)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-orange-400" />
                <span className="text-neutral-300">Social Shares</span>
              </div>
              <span className="text-neutral-100 font-medium">{analyticsData.engagement.socialShares}</span>
            </div>
          </div>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">Device Usage</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-400" />
                <span className="text-neutral-300">Desktop</span>
              </div>
              <span className="text-neutral-100 font-medium">{analyticsData.devices.desktop}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-green-400" />
                <span className="text-neutral-300">Mobile</span>
              </div>
              <span className="text-neutral-100 font-medium">{analyticsData.devices.mobile}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span className="text-neutral-300">Tablet</span>
              </div>
              <span className="text-neutral-100 font-medium">{analyticsData.devices.tablet}%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Feedback Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="mt-8 card p-6"
      >
        <h3 className="text-lg font-semibold text-neutral-100 mb-6">Recent Feedback</h3>
        
        {/* Rating Distribution */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-neutral-300 mb-3">Rating Distribution</h4>
          <div className="space-y-2">
            {analyticsData.feedback.ratings.reverse().map((rating) => {
              const percentage = (rating.count / analyticsData.feedback.ratings.reduce((sum, r) => sum + r.count, 0)) * 100;
              return (
                <div key={rating.rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm text-neutral-400">{rating.rating}</span>
                    <Star className="w-3 h-3 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-neutral-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-neutral-400 w-8">{rating.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Comments */}
        <div>
          <h4 className="text-sm font-medium text-neutral-300 mb-4">Recent Comments</h4>
          <div className="space-y-4">
            {analyticsData.feedback.comments.map((feedback) => (
              <div key={feedback.id} className="p-4 bg-neutral-800 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-neutral-600'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-neutral-400">by {feedback.attendee}</span>
                  </div>
                  <span className="text-sm text-neutral-500">{formatDate(feedback.date)}</span>
                </div>
                <p className="text-neutral-300">{feedback.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}