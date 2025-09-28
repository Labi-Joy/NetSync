'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  TrendingUp,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Download,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AppLayout } from '@/components/layouts/AppLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAuth } from '@/context/AuthContext';
import { enhancedEventAPI } from '@/lib/apiWithRetry';

interface ManagedEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: string;
  type: 'conference' | 'meetup' | 'workshop' | 'networking' | 'webinar';
  status: 'draft' | 'published' | 'live' | 'completed' | 'cancelled';
  attendeeCount: number;
  maxAttendees?: number;
  registrations: number;
  revenue: number;
  currency: string;
  isVirtual: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EVENT_STATUS_CONFIG = {
  draft: { color: 'bg-gray-500', label: 'Draft', icon: Edit },
  published: { color: 'bg-blue-500', label: 'Published', icon: CheckCircle },
  live: { color: 'bg-green-500', label: 'Live', icon: Clock },
  completed: { color: 'bg-purple-500', label: 'Completed', icon: CheckCircle },
  cancelled: { color: 'bg-red-500', label: 'Cancelled', icon: AlertCircle },
};

export default function EventManagePage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ManagedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<ManagedEvent | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    totalRevenue: 0,
    upcomingEvents: 0
  });

  const loadMyEvents = useCallback(async () => {
    try {
      setLoading(true);
      
      // In real implementation, this would call the backend
      // For now, we'll use mock data
      const mockEvents: ManagedEvent[] = [
        {
          id: '1',
          title: 'Web3 Developer Workshop',
          description: 'Hands-on workshop for smart contract development',
          date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 4),
          location: 'San Francisco, CA',
          type: 'workshop',
          status: 'published',
          attendeeCount: 45,
          maxAttendees: 50,
          registrations: 45,
          revenue: 4500,
          currency: 'USD',
          isVirtual: false,
          imageUrl: '/api/placeholder/300/200',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
        },
        {
          id: '2',
          title: 'DeFi Security Masterclass',
          description: 'Advanced security practices for DeFi protocols',
          date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
          location: 'Online',
          type: 'conference',
          status: 'published',
          attendeeCount: 120,
          maxAttendees: 150,
          registrations: 120,
          revenue: 23800,
          currency: 'USD',
          isVirtual: true,
          imageUrl: '/api/placeholder/300/200',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
        },
        {
          id: '3',
          title: 'Networking Happy Hour',
          description: 'Casual networking event for tech professionals',
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
          location: 'New York, NY',
          type: 'networking',
          status: 'completed',
          attendeeCount: 85,
          maxAttendees: 100,
          registrations: 92,
          revenue: 0,
          currency: 'USD',
          isVirtual: false,
          imageUrl: '/api/placeholder/300/200',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
        },
        {
          id: '4',
          title: 'AI in Blockchain Panel',
          description: 'Expert panel discussion on AI and blockchain intersection',
          date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          location: 'London, UK',
          type: 'conference',
          status: 'draft',
          attendeeCount: 0,
          maxAttendees: 200,
          registrations: 0,
          revenue: 0,
          currency: 'USD',
          isVirtual: false,
          imageUrl: '/api/placeholder/300/200',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
        }
      ];

      setEvents(mockEvents);
      
      // Calculate stats
      const totalEvents = mockEvents.length;
      const totalAttendees = mockEvents.reduce((sum, event) => sum + event.attendeeCount, 0);
      const totalRevenue = mockEvents.reduce((sum, event) => sum + event.revenue, 0);
      const upcomingEvents = mockEvents.filter(event => 
        event.date > new Date() && event.status !== 'cancelled'
      ).length;

      setStats({
        totalEvents,
        totalAttendees,
        totalRevenue,
        upcomingEvents
      });

    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterEvents = useCallback(() => {
    let filtered = events;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter]);

  useEffect(() => {
    loadMyEvents();
  }, [loadMyEvents]);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      // await enhancedEventAPI.deleteEvent(selectedEvent.id);
      setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
      setShowDeleteDialog(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <AppLayout title="Manage Events" description="Manage your hosted events">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Manage Events" description="Manage your hosted events">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Total Events</p>
              <p className="text-2xl font-bold text-neutral-100">{stats.totalEvents}</p>
            </div>
            <Calendar className="w-8 h-8 text-primary-400" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Total Attendees</p>
              <p className="text-2xl font-bold text-neutral-100">{stats.totalAttendees}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Total Revenue</p>
              <p className="text-2xl font-bold text-neutral-100">
                {formatCurrency(stats.totalRevenue, 'USD')}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Upcoming</p>
              <p className="text-2xl font-bold text-neutral-100">{stats.upcomingEvents}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Actions and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-base pl-10"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-base"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="live">Live</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        <Link href="/events/create">
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Create Event
          </Button>
        </Link>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-16 h-16" />}
          title="No events found"
          description="Create your first event to start building your community"
          actionLabel="Create Event"
          actionHref="/events/create"
          size="lg"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const StatusIcon = EVENT_STATUS_CONFIG[event.status].icon;
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-0 overflow-hidden"
              >
                {/* Event Header */}
                <div className="relative h-48 bg-gradient-to-br from-primary-500 to-purple-600">
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${EVENT_STATUS_CONFIG[event.status].color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {EVENT_STATUS_CONFIG[event.status].label}
                    </span>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <div className="relative group">
                      <button className="p-2 bg-black/20 rounded-lg backdrop-blur-sm text-white hover:bg-black/40 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      <div className="absolute right-0 top-full mt-1 w-48 bg-neutral-800 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <Link href={`/events/${event.id}`} className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700">
                          <Eye className="w-4 h-4" />
                          View Event
                        </Link>
                        <Link href={`/events/${event.id}/edit`} className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700">
                          <Edit className="w-4 h-4" />
                          Edit Event
                        </Link>
                        <Link href={`/events/${event.id}/analytics`} className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700">
                          <BarChart3 className="w-4 h-4" />
                          Analytics
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowDeleteDialog(true);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-neutral-700"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-2 py-1 bg-black/40 backdrop-blur-sm rounded text-xs text-white">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-100 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <MapPin className="w-4 h-4" />
                      <span>{event.isVirtual ? 'Virtual Event' : event.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.attendeeCount} registered
                        {event.maxAttendees && ` / ${event.maxAttendees} max`}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between items-center pt-4 border-t border-neutral-700">
                    <div className="text-center">
                      <p className="text-lg font-bold text-neutral-100">{event.registrations}</p>
                      <p className="text-xs text-neutral-400">Registrations</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-lg font-bold text-neutral-100">
                        {formatCurrency(event.revenue, event.currency)}
                      </p>
                      <p className="text-xs text-neutral-400">Revenue</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-lg font-bold text-neutral-100">
                        {event.maxAttendees ? Math.round((event.attendeeCount / event.maxAttendees) * 100) : '∞'}%
                      </p>
                      <p className="text-xs text-neutral-400">Capacity</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Link href={`/events/${event.id}/analytics`} className="flex-1">
                      <Button variant="outline" size="sm" fullWidth leftIcon={<BarChart3 className="w-4 h-4" />}>
                        Analytics
                      </Button>
                    </Link>
                    
                    <Link href={`/events/${event.id}/attendees`} className="flex-1">
                      <Button variant="outline" size="sm" fullWidth leftIcon={<Users className="w-4 h-4" />}>
                        Attendees
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        description={`Are you sure you want to delete "${selectedEvent?.title}"? This action cannot be undone.`}
        confirmText="Delete Event"
        variant="danger"
      />
    </AppLayout>
  );
}