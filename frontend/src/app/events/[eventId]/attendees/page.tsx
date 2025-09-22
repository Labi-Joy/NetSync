'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Download,
  Send,
  MoreVertical,
  Check,
  X,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  UserPlus,
  MessageSquare,
  Star,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AppLayout } from '@/components/layouts/AppLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { enhancedEventAPI } from '@/lib/apiWithRetry';

interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'registered' | 'checked-in' | 'no-show' | 'cancelled';
  registrationDate: Date;
  checkInTime?: Date;
  ticketType: 'regular' | 'early-bird' | 'vip' | 'free';
  amountPaid: number;
  currency: string;
  company?: string;
  title?: string;
  phone?: string;
  dietaryRestrictions?: string;
  specialRequests?: string;
  networkingInterests?: string[];
  registrationSource: 'direct' | 'social' | 'referral' | 'partner';
  isVip: boolean;
  hasAttended: boolean;
  feedback?: {
    rating: number;
    comment: string;
  };
}

interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  maxAttendees?: number;
}

const ATTENDEE_STATUS_CONFIG = {
  registered: { color: 'bg-blue-500', label: 'Registered', icon: Clock },
  'checked-in': { color: 'bg-green-500', label: 'Checked In', icon: Check },
  'no-show': { color: 'bg-red-500', label: 'No Show', icon: X },
  cancelled: { color: 'bg-gray-500', label: 'Cancelled', icon: X },
};

const TICKET_TYPE_CONFIG = {
  regular: { label: 'Regular', color: 'bg-blue-500' },
  'early-bird': { label: 'Early Bird', color: 'bg-green-500' },
  vip: { label: 'VIP', color: 'bg-purple-500' },
  free: { label: 'Free', color: 'bg-gray-500' },
};

export default function EventAttendeesPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ticketFilter, setTicketFilter] = useState<string>('all');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  
  const [stats, setStats] = useState({
    total: 0,
    registered: 0,
    checkedIn: 0,
    noShow: 0,
    revenue: 0
  });

  useEffect(() => {
    loadEventAndAttendees();
  }, [eventId]);

  useEffect(() => {
    filterAttendees();
  }, [attendees, searchTerm, statusFilter, ticketFilter]);

  const loadEventAndAttendees = async () => {
    try {
      setLoading(true);
      
      // Mock event data
      const mockEvent: Event = {
        id: eventId,
        title: 'Web3 Developer Workshop',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        location: 'San Francisco, CA',
        maxAttendees: 50
      };

      // Mock attendees data
      const mockAttendees: Attendee[] = [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          avatar: '/api/placeholder/40/40',
          status: 'registered',
          registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
          ticketType: 'early-bird',
          amountPaid: 89,
          currency: 'USD',
          company: 'TechCorp',
          title: 'Frontend Developer',
          phone: '+1 (555) 123-4567',
          networkingInterests: ['React', 'Web3', 'DeFi'],
          registrationSource: 'direct',
          isVip: false,
          hasAttended: false
        },
        {
          id: '2',
          name: 'Bob Smith',
          email: 'bob@startup.com',
          avatar: '/api/placeholder/40/40',
          status: 'checked-in',
          registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
          checkInTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
          ticketType: 'vip',
          amountPaid: 199,
          currency: 'USD',
          company: 'Crypto Startup',
          title: 'CTO',
          phone: '+1 (555) 987-6543',
          dietaryRestrictions: 'Vegetarian',
          networkingInterests: ['Blockchain', 'Smart Contracts', 'Solidity'],
          registrationSource: 'referral',
          isVip: true,
          hasAttended: true,
          feedback: {
            rating: 5,
            comment: 'Great workshop! Very informative.'
          }
        },
        {
          id: '3',
          name: 'Carol Davis',
          email: 'carol@agency.com',
          status: 'no-show',
          registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          ticketType: 'regular',
          amountPaid: 99,
          currency: 'USD',
          company: 'Design Agency',
          title: 'UX Designer',
          networkingInterests: ['Design Systems', 'Web3 UX'],
          registrationSource: 'social',
          isVip: false,
          hasAttended: false
        },
        {
          id: '4',
          name: 'David Wilson',
          email: 'david@freelance.dev',
          status: 'registered',
          registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
          ticketType: 'free',
          amountPaid: 0,
          currency: 'USD',
          title: 'Full Stack Developer',
          networkingInterests: ['Node.js', 'Ethereum', 'DApps'],
          registrationSource: 'partner',
          isVip: false,
          hasAttended: false
        }
      ];

      setEvent(mockEvent);
      setAttendees(mockAttendees);
      
      // Calculate stats
      const total = mockAttendees.length;
      const registered = mockAttendees.filter(a => a.status === 'registered').length;
      const checkedIn = mockAttendees.filter(a => a.status === 'checked-in').length;
      const noShow = mockAttendees.filter(a => a.status === 'no-show').length;
      const revenue = mockAttendees.reduce((sum, a) => sum + a.amountPaid, 0);

      setStats({ total, registered, checkedIn, noShow, revenue });
      
    } catch (error) {
      console.error('Failed to load attendees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAttendees = () => {
    let filtered = attendees;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(attendee => attendee.status === statusFilter);
    }

    if (ticketFilter !== 'all') {
      filtered = filtered.filter(attendee => attendee.ticketType === ticketFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(attendee =>
        attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAttendees(filtered);
  };

  const handleCheckIn = async (attendeeId: string) => {
    try {
      setAttendees(prev => prev.map(attendee =>
        attendee.id === attendeeId
          ? { ...attendee, status: 'checked-in' as const, checkInTime: new Date() }
          : attendee
      ));
    } catch (error) {
      console.error('Failed to check in attendee:', error);
    }
  };

  const handleCancelRegistration = async () => {
    if (!selectedAttendee) return;

    try {
      setAttendees(prev => prev.map(attendee =>
        attendee.id === selectedAttendee.id
          ? { ...attendee, status: 'cancelled' as const }
          : attendee
      ));
      setShowCancelDialog(false);
      setSelectedAttendee(null);
    } catch (error) {
      console.error('Failed to cancel registration:', error);
    }
  };

  const handleBulkAction = async (action: string) => {
    console.log(`Performing ${action} on:`, selectedAttendees);
    // Implement bulk actions
  };

  const exportAttendees = async (format: 'csv' | 'xlsx') => {
    try {
      // In real implementation, this would call the API
      console.log(`Exporting attendees in ${format} format`);
    } catch (error) {
      console.error('Failed to export attendees:', error);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AppLayout title="Event Attendees" description="Manage your event attendees">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

  return (
    <AppLayout 
      title={`${event?.title} - Attendees`} 
      description="Manage registrations and check-ins"
    >
      {/* Header */}
      <div className="mb-6">
        <Link href="/events/manage" className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Manage Events
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-100">{event?.title}</h1>
            <div className="flex items-center gap-4 text-sm text-neutral-400 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {event?.date && formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event?.location}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => exportAttendees('csv')} leftIcon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button variant="primary" leftIcon={<Send className="w-4 h-4" />}>
              Send Update
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Total</p>
              <p className="text-2xl font-bold text-neutral-100">{stats.total}</p>
            </div>
            <Users className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Registered</p>
              <p className="text-2xl font-bold text-neutral-100">{stats.registered}</p>
            </div>
            <Clock className="w-6 h-6 text-orange-400" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Checked In</p>
              <p className="text-2xl font-bold text-neutral-100">{stats.checkedIn}</p>
            </div>
            <Check className="w-6 h-6 text-green-400" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">No Show</p>
              <p className="text-2xl font-bold text-neutral-100">{stats.noShow}</p>
            </div>
            <X className="w-6 h-6 text-red-400" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-400">Revenue</p>
              <p className="text-2xl font-bold text-neutral-100">
                {formatCurrency(stats.revenue, 'USD')}
              </p>
            </div>
            <div className="w-6 h-6 text-green-400">$</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search attendees..."
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
          <option value="registered">Registered</option>
          <option value="checked-in">Checked In</option>
          <option value="no-show">No Show</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        <select
          value={ticketFilter}
          onChange={(e) => setTicketFilter(e.target.value)}
          className="input-base"
        >
          <option value="all">All Tickets</option>
          <option value="regular">Regular</option>
          <option value="early-bird">Early Bird</option>
          <option value="vip">VIP</option>
          <option value="free">Free</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedAttendees.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary-500/20 border border-primary-500 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-primary-100">
              {selectedAttendees.length} attendee{selectedAttendees.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleBulkAction('check-in')}>
                Check In All
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('send-email')}>
                Send Email
              </Button>
              <Button 
                size="sm" 
                variant="danger" 
                onClick={() => handleBulkAction('cancel')}
              >
                Cancel Registrations
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Attendees List */}
      {filteredAttendees.length === 0 ? (
        <EmptyState
          icon={<Users className="w-16 h-16" />}
          title="No attendees found"
          description="No attendees match your current filters"
          size="md"
        />
      ) : (
        <div className="space-y-4">
          {filteredAttendees.map((attendee) => {
            const StatusIcon = ATTENDEE_STATUS_CONFIG[attendee.status].icon;
            
            return (
              <motion.div
                key={attendee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedAttendees.includes(attendee.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAttendees(prev => [...prev, attendee.id]);
                      } else {
                        setSelectedAttendees(prev => prev.filter(id => id !== attendee.id));
                      }
                    }}
                    className="mt-1 w-4 h-4 text-primary-500 rounded border-neutral-600 bg-neutral-700"
                  />
                  
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {attendee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-neutral-100">{attendee.name}</h3>
                          {attendee.isVip && (
                            <Star className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-neutral-400 text-sm">{attendee.email}</p>
                        {attendee.company && attendee.title && (
                          <p className="text-neutral-500 text-sm">{attendee.title} at {attendee.company}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${ATTENDEE_STATUS_CONFIG[attendee.status].color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {ATTENDEE_STATUS_CONFIG[attendee.status].label}
                        </span>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${TICKET_TYPE_CONFIG[attendee.ticketType].color}`}>
                          {TICKET_TYPE_CONFIG[attendee.ticketType].label}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-neutral-500">Registered</p>
                        <p className="text-neutral-300">{formatDate(attendee.registrationDate)}</p>
                      </div>
                      
                      {attendee.checkInTime && (
                        <div>
                          <p className="text-neutral-500">Checked In</p>
                          <p className="text-neutral-300">{formatDate(attendee.checkInTime)}</p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-neutral-500">Amount Paid</p>
                        <p className="text-neutral-300">{formatCurrency(attendee.amountPaid, attendee.currency)}</p>
                      </div>
                      
                      <div>
                        <p className="text-neutral-500">Source</p>
                        <p className="text-neutral-300 capitalize">{attendee.registrationSource}</p>
                      </div>
                    </div>
                    
                    {attendee.networkingInterests && attendee.networkingInterests.length > 0 && (
                      <div className="mt-3">
                        <p className="text-neutral-500 text-sm mb-1">Interests</p>
                        <div className="flex flex-wrap gap-1">
                          {attendee.networkingInterests.map((interest) => (
                            <span key={interest} className="px-2 py-1 bg-neutral-700 text-neutral-300 text-xs rounded">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {attendee.feedback && (
                      <div className="mt-3 p-3 bg-neutral-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < attendee.feedback!.rating ? 'text-yellow-400 fill-current' : 'text-neutral-600'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-neutral-400">Feedback</span>
                        </div>
                        <p className="text-sm text-neutral-300">{attendee.feedback.comment}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {attendee.status === 'registered' && (
                      <Button
                        size="sm"
                        onClick={() => handleCheckIn(attendee.id)}
                        leftIcon={<Check className="w-4 h-4" />}
                      >
                        Check In
                      </Button>
                    )}
                    
                    <div className="relative group">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      
                      <div className="absolute right-0 top-full mt-1 w-48 bg-neutral-800 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700">
                          <Mail className="w-4 h-4" />
                          Send Email
                        </button>
                        <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700">
                          <MessageSquare className="w-4 h-4" />
                          Add Note
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAttendee(attendee);
                            setShowCancelDialog(true);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-neutral-700"
                        >
                          <X className="w-4 h-4" />
                          Cancel Registration
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Cancel Registration Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelRegistration}
        title="Cancel Registration"
        description={`Are you sure you want to cancel ${selectedAttendee?.name}'s registration? This action cannot be undone.`}
        confirmText="Cancel Registration"
        variant="danger"
      />
    </AppLayout>
  );
}