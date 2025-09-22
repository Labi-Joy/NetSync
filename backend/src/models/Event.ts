import mongoose, { Schema, Document } from 'mongoose';
import { IEvent, IEventSession } from '../types';

export interface IEventDocument extends Omit<IEvent, '_id'>, Document {
  isCurrentlyActive(): boolean;
  hasCapacity(): boolean;
  remainingSpots(): number | null;
  attendeeCount: number;
}

const eventSessionSchema = new Schema<IEventSession>({
  sessionId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  }
}, { _id: false });

const eventSchema = new Schema<IEventDocument>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  venue: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    mapData: {
      type: Schema.Types.Mixed,
      default: null
    }
  },
  schedule: [eventSessionSchema],
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  capacity: {
    type: Number,
    default: null, // null means unlimited
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ isActive: 1 });
eventSchema.index({ attendees: 1 });

eventSchema.virtual('attendeeCount').get(function() {
  return this.attendees.length;
});

eventSchema.methods.isCurrentlyActive = function(): boolean {
  const now = new Date();
  return this.isActive && now >= this.startDate && now <= this.endDate;
};

// Check if event has space for more attendees
eventSchema.methods.hasCapacity = function(): boolean {
  if (this.capacity === null) return true; // unlimited capacity
  return this.attendees.length < this.capacity;
};

// Get remaining spots
eventSchema.methods.remainingSpots = function(): number | null {
  if (this.capacity === null) return null; // unlimited
  return Math.max(0, this.capacity - this.attendees.length);
};

export const Event = mongoose.model<IEventDocument>('Event', eventSchema);