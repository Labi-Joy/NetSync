'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Image,
  Tag,
  Clock,
  Globe,
  Building,
  Info,
  Plus,
  X,
  Save,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';

interface CreateEventFormProps {
  onSubmit: (eventData: EventFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Partial<EventFormData>;
  mode?: 'create' | 'edit';
}

export interface EventFormData {
  title: string;
  description: string;
  shortDescription: string;
  type: 'conference' | 'meetup' | 'workshop' | 'networking' | 'webinar';
  category: string[];
  tags: string[];
  
  // Date and time
  date: string;
  endDate?: string;
  timeZone: string;
  
  // Location
  isVirtual: boolean;
  location: string;
  venue: string;
  address?: string;
  virtualLink?: string;
  
  // Capacity and pricing
  maxAttendees?: number;
  price: number;
  currency: string;
  earlyBirdPrice?: number;
  earlyBirdDeadline?: string;
  
  // Media and branding
  imageUrl?: string;
  bannerUrl?: string;
  
  // Settings
  requiresApproval: boolean;
  isPublic: boolean;
  allowGuests: boolean;
  sendReminders: boolean;
  collectFeedback: boolean;
  
  // Additional info
  agenda?: string;
  requirements?: string;
  contactEmail?: string;
  website?: string;
}

const EVENT_TYPES = [
  { value: 'conference', label: 'Conference', icon: '🎪' },
  { value: 'meetup', label: 'Meetup', icon: '🤝' },
  { value: 'workshop', label: 'Workshop', icon: '🛠️' },
  { value: 'networking', label: 'Networking', icon: '🌐' },
  { value: 'webinar', label: 'Webinar', icon: '📹' },
];

const CATEGORIES = [
  'Technology', 'Web3', 'Blockchain', 'AI/ML', 'DevOps', 'Frontend',
  'Backend', 'Mobile', 'Design', 'Security', 'Startup', 'Business',
  'Marketing', 'Finance', 'Career', 'Education'
];

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'ETH', label: 'ETH (Ξ)' },
];

export const CreateEventForm: React.FC<CreateEventFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  initialData,
  mode = 'create'
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    shortDescription: '',
    type: 'meetup',
    category: [],
    tags: [],
    date: '',
    endDate: '',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    isVirtual: false,
    location: '',
    venue: '',
    address: '',
    virtualLink: '',
    maxAttendees: undefined,
    price: 0,
    currency: 'USD',
    earlyBirdPrice: undefined,
    earlyBirdDeadline: '',
    imageUrl: '',
    bannerUrl: '',
    requiresApproval: false,
    isPublic: true,
    allowGuests: false,
    sendReminders: true,
    collectFeedback: true,
    agenda: '',
    requirements: '',
    contactEmail: '',
    website: '',
    ...initialData
  });

  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateField('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateField('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const toggleCategory = (category: string) => {
    const currentCategories = formData.category;
    if (currentCategories.includes(category)) {
      updateField('category', currentCategories.filter(c => c !== category));
    } else {
      updateField('category', [...currentCategories, category]);
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
      if (formData.category.length === 0) newErrors.category = 'At least one category is required';
    } else if (stepNumber === 2) {
      if (!formData.date) newErrors.date = 'Start date is required';
      if (formData.endDate && new Date(formData.endDate) < new Date(formData.date)) {
        newErrors.endDate = 'End date must be after start date';
      }
      if (!formData.isVirtual && !formData.location.trim()) {
        newErrors.location = 'Location is required for in-person events';
      }
      if (formData.isVirtual && !formData.virtualLink?.trim()) {
        newErrors.virtualLink = 'Virtual link is required for online events';
      }
    } else if (stepNumber === 3) {
      if (formData.maxAttendees && formData.maxAttendees < 1) {
        newErrors.maxAttendees = 'Max attendees must be at least 1';
      }
      if (formData.price < 0) newErrors.price = 'Price cannot be negative';
      if (formData.earlyBirdPrice && formData.earlyBirdPrice >= formData.price) {
        newErrors.earlyBirdPrice = 'Early bird price must be less than regular price';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit event:', error);
    }
  };

  const stepTitles = [
    'Event Details',
    'Date & Location',
    'Pricing & Capacity',
    'Settings & Review'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {stepTitles.map((title, index) => (
            <div
              key={index}
              className={`flex items-center ${index < stepTitles.length - 1 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step > index + 1
                    ? 'bg-green-500 text-white'
                    : step === index + 1
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-700 text-neutral-400'
                }`}
              >
                {step > index + 1 ? '✓' : index + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step >= index + 1 ? 'text-neutral-200' : 'text-neutral-500'
              }`}>
                {title}
              </span>
              {index < stepTitles.length - 1 && (
                <div className={`flex-1 h-px mx-4 ${
                  step > index + 1 ? 'bg-green-500' : 'bg-neutral-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Event Details */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-neutral-100 mb-6">Event Details</h2>
              
              <div className="space-y-6">
                <FormField
                  name="title"
                  label="Event Title"
                  value={formData.title}
                  onChange={(value) => updateField('title', value)}
                  error={errors.title}
                  required
                  placeholder="Enter a compelling event title"
                  hint="This will be the main headline for your event"
                />

                <FormField
                  name="shortDescription"
                  label="Short Description"
                  value={formData.shortDescription}
                  onChange={(value) => updateField('shortDescription', value)}
                  error={errors.shortDescription}
                  required
                  placeholder="A brief one-liner about your event"
                  hint="This appears in search results and previews (max 150 characters)"
                  maxLength={150}
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Full Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={6}
                    className={`
                      w-full px-4 py-3 text-base transition-all duration-200
                      border border-neutral-600 rounded-lg bg-neutral-800
                      text-neutral-100 placeholder-neutral-400
                      focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                      disabled:opacity-50 disabled:cursor-not-allowed
                      resize-vertical min-h-[120px]
                      ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
                    `}
                    placeholder="Provide a detailed description of your event, including what attendees can expect, key topics, speakers, and any other relevant information..."
                    required
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Event Type *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {EVENT_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateField('type', type.value)}
                        className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                          formData.type === type.value
                            ? 'border-primary-500 bg-primary-500/20'
                            : 'border-neutral-600 hover:border-neutral-500'
                        }`}
                      >
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <div className="text-sm font-medium text-neutral-200">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Categories * (Select at least one)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          formData.category.includes(category)
                            ? 'bg-primary-500 text-white'
                            : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-400">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Tags (Optional)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1"
                    />
                    <Button type="button" onClick={addTag} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-700 text-neutral-200 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-neutral-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Date & Location */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-neutral-100 mb-6">Date & Location</h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    name="date"
                    label="Start Date & Time"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(value) => updateField('date', value)}
                    error={errors.date}
                    required
                  />
                  
                  <FormField
                    name="endDate"
                    label="End Date & Time (Optional)"
                    type="datetime-local"
                    value={formData.endDate || ''}
                    onChange={(value) => updateField('endDate', value)}
                    error={errors.endDate}
                  />
                </div>

                <FormField
                  name="timeZone"
                  label="Time Zone"
                  value={formData.timeZone}
                  onChange={(value) => updateField('timeZone', value)}
                  hint="Events will be displayed in attendees' local time zones"
                />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isVirtual"
                      checked={formData.isVirtual}
                      onChange={(e) => updateField('isVirtual', e.target.checked)}
                      className="w-4 h-4 text-primary-500 rounded border-neutral-600 bg-neutral-700"
                    />
                    <label htmlFor="isVirtual" className="text-sm font-medium text-neutral-300">
                      This is a virtual event
                    </label>
                  </div>

                  {formData.isVirtual ? (
                    <FormField
                      name="virtualLink"
                      label="Virtual Meeting Link"
                      value={formData.virtualLink || ''}
                      onChange={(value) => updateField('virtualLink', value)}
                      error={errors.virtualLink}
                      required
                      placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                      leftIcon={<Globe className="w-5 h-5" />}
                    />
                  ) : (
                    <div className="space-y-4">
                      <FormField
                        name="location"
                        label="City/Location"
                        value={formData.location}
                        onChange={(value) => updateField('location', value)}
                        error={errors.location}
                        required
                        placeholder="e.g., San Francisco, CA"
                        leftIcon={<MapPin className="w-5 h-5" />}
                      />
                      
                      <FormField
                        name="venue"
                        label="Venue Name"
                        value={formData.venue}
                        onChange={(value) => updateField('venue', value)}
                        placeholder="e.g., Moscone Center"
                        leftIcon={<Building className="w-5 h-5" />}
                      />
                      
                      <FormField
                        name="address"
                        label="Full Address (Optional)"
                        value={formData.address || ''}
                        onChange={(value) => updateField('address', value)}
                        placeholder="Street address for directions"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Pricing & Capacity */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-neutral-100 mb-6">Pricing & Capacity</h2>
              
              <div className="space-y-6">
                <FormField
                  name="maxAttendees"
                  label="Maximum Attendees (Optional)"
                  type="number"
                  value={formData.maxAttendees?.toString() || ''}
                  onChange={(value) => updateField('maxAttendees', value ? parseInt(value) : undefined)}
                  error={errors.maxAttendees}
                  placeholder="Leave empty for unlimited"
                  leftIcon={<Users className="w-5 h-5" />}
                  hint="Set a limit to create exclusivity or manage venue capacity"
                />

                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    name="price"
                    label="Ticket Price"
                    type="number"
                    value={formData.price.toString()}
                    onChange={(value) => updateField('price', parseFloat(value) || 0)}
                    error={errors.price}
                    required
                    placeholder="0.00"
                    leftIcon={<DollarSign className="w-5 h-5" />}
                    step="0.01"
                    min="0"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => updateField('currency', e.target.value)}
                      className="input-base"
                    >
                      {CURRENCIES.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <FormField
                    name="earlyBirdPrice"
                    label="Early Bird Price (Optional)"
                    type="number"
                    value={formData.earlyBirdPrice?.toString() || ''}
                    onChange={(value) => updateField('earlyBirdPrice', value ? parseFloat(value) : undefined)}
                    error={errors.earlyBirdPrice}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                {formData.earlyBirdPrice && (
                  <FormField
                    name="earlyBirdDeadline"
                    label="Early Bird Deadline"
                    type="datetime-local"
                    value={formData.earlyBirdDeadline || ''}
                    onChange={(value) => updateField('earlyBirdDeadline', value)}
                    hint="When does the early bird pricing end?"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Settings & Review */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-neutral-100 mb-6">Settings & Additional Info</h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-200">Event Settings</h3>
                    
                    {[
                      { key: 'isPublic', label: 'Public Event', desc: 'Anyone can discover and join' },
                      { key: 'requiresApproval', label: 'Requires Approval', desc: 'Manual review before registration' },
                      { key: 'allowGuests', label: 'Allow Guests', desc: 'Attendees can bring guests' },
                      { key: 'sendReminders', label: 'Send Reminders', desc: 'Automatic email reminders' },
                      { key: 'collectFeedback', label: 'Collect Feedback', desc: 'Post-event feedback form' },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id={setting.key}
                          checked={formData[setting.key as keyof EventFormData] as boolean}
                          onChange={(e) => updateField(setting.key as keyof EventFormData, e.target.checked)}
                          className="w-4 h-4 mt-1 text-primary-500 rounded border-neutral-600 bg-neutral-700"
                        />
                        <div>
                          <label htmlFor={setting.key} className="text-sm font-medium text-neutral-300">
                            {setting.label}
                          </label>
                          <p className="text-xs text-neutral-500">{setting.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-200">Contact & Links</h3>
                    
                    <FormField
                      name="contactEmail"
                      label="Contact Email (Optional)"
                      type="email"
                      value={formData.contactEmail || ''}
                      onChange={(value) => updateField('contactEmail', value)}
                      placeholder="event@company.com"
                    />
                    
                    <FormField
                      name="website"
                      label="Event Website (Optional)"
                      type="url"
                      value={formData.website || ''}
                      onChange={(value) => updateField('website', value)}
                      placeholder="https://myevent.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Agenda (Optional)
                  </label>
                  <textarea
                    value={formData.agenda || ''}
                    onChange={(e) => updateField('agenda', e.target.value)}
                    rows={4}
                    className="input-base h-auto"
                    placeholder="Event schedule, speakers, session details..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Requirements (Optional)
                  </label>
                  <textarea
                    value={formData.requirements || ''}
                    onChange={(e) => updateField('requirements', e.target.value)}
                    rows={3}
                    className="input-base h-auto"
                    placeholder="What should attendees bring? Prerequisites? Dress code?"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <div className="flex gap-3">
            {step > 1 && (
              <Button type="button" onClick={prevStep} variant="outline">
                Previous
              </Button>
            )}
            <Button type="button" onClick={onCancel} variant="ghost">
              Cancel
            </Button>
          </div>
          
          <div className="flex gap-3">
            {step < 4 ? (
              <Button type="button" onClick={nextStep} variant="primary">
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                leftIcon={<Save className="w-4 h-4" />}
              >
                {mode === 'create' ? 'Create Event' : 'Update Event'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;