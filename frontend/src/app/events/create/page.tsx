'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AppLayout } from '@/components/layouts/AppLayout';
import CreateEventForm, { EventFormData } from '@/components/events/CreateEventForm';
import { enhancedEventAPI } from '@/lib/apiWithRetry';
import { useAuth } from '@/context/AuthContext';

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleCreateEvent = async (eventData: EventFormData) => {
    if (!user) {
      setError('You must be logged in to create events');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Transform form data to API format
      const apiData = {
        title: eventData.title,
        description: eventData.description,
        shortDescription: eventData.shortDescription,
        type: eventData.type,
        category: eventData.category,
        tags: eventData.tags,
        
        // Date and time
        date: new Date(eventData.date).toISOString(),
        endDate: eventData.endDate ? new Date(eventData.endDate).toISOString() : undefined,
        timeZone: eventData.timeZone,
        
        // Location
        isVirtual: eventData.isVirtual,
        location: eventData.location,
        venue: eventData.venue,
        address: eventData.address,
        virtualLink: eventData.virtualLink,
        
        // Capacity and pricing
        maxAttendees: eventData.maxAttendees,
        price: eventData.price,
        currency: eventData.currency,
        earlyBirdPrice: eventData.earlyBirdPrice,
        earlyBirdDeadline: eventData.earlyBirdDeadline ? new Date(eventData.earlyBirdDeadline).toISOString() : undefined,
        
        // Media
        imageUrl: eventData.imageUrl,
        bannerUrl: eventData.bannerUrl,
        
        // Settings
        requiresApproval: eventData.requiresApproval,
        isPublic: eventData.isPublic,
        allowGuests: eventData.allowGuests,
        sendReminders: eventData.sendReminders,
        collectFeedback: eventData.collectFeedback,
        
        // Additional info
        agenda: eventData.agenda,
        requirements: eventData.requirements,
        contactEmail: eventData.contactEmail || user.email,
        website: eventData.website,
        
        // Auto-populate organizer info
        organizer: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || '/api/placeholder/40/40'
        }
      };

      console.log('Creating event with data:', apiData);

      // In real implementation, this would call the backend API
      // const response = await enhancedEventAPI.createEvent(apiData);
      
      // For demo purposes, we'll simulate a successful creation
      const mockResponse = {
        data: {
          id: `event_${Date.now()}`,
          ...apiData,
          status: 'draft',
          attendeeCount: 0,
          registrations: 0,
          revenue: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };

      console.log('✅ Event created successfully:', mockResponse.data);
      
      // Redirect to event management page
      router.push('/events/manage');
      
    } catch (error: any) {
      console.error('❌ Failed to create event:', error);
      setError(error.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/events/manage');
  };

  return (
    <AppLayout 
      title="Create New Event" 
      description="Set up your event and start building your community"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/events/manage" className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Manage Events
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-100">Create New Event</h1>
              <p className="text-neutral-400">Build your event page and start accepting registrations</p>
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-100"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CreateEventForm
            onSubmit={handleCreateEvent}
            onCancel={handleCancel}
            loading={loading}
            mode="create"
          />
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 card p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-100 mb-4">Tips for a Successful Event</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-neutral-200 mb-2">Event Title & Description</h4>
              <ul className="text-sm text-neutral-400 space-y-1">
                <li>• Use clear, descriptive titles that convey value</li>
                <li>• Include key details like skill level and outcomes</li>
                <li>• Mention notable speakers or unique features</li>
                <li>• Keep descriptions concise but informative</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-neutral-200 mb-2">Pricing & Capacity</h4>
              <ul className="text-sm text-neutral-400 space-y-1">
                <li>• Consider early bird discounts to drive early registration</li>
                <li>• Set realistic capacity based on venue/platform limits</li>
                <li>• Free events often have higher no-show rates</li>
                <li>• Premium pricing can increase perceived value</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-neutral-200 mb-2">Location & Timing</h4>
              <ul className="text-sm text-neutral-400 space-y-1">
                <li>• Choose accessible locations with parking/transit</li>
                <li>• Consider time zones for virtual events</li>
                <li>• Avoid holidays and major industry conferences</li>
                <li>• Weekday evenings and weekends work best</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-neutral-200 mb-2">Promotion & Engagement</h4>
              <ul className="text-sm text-neutral-400 space-y-1">
                <li>• Share on relevant social media and communities</li>
                <li>• Send reminder emails to registered attendees</li>
                <li>• Create follow-up content and networking opportunities</li>
                <li>• Collect feedback to improve future events</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}