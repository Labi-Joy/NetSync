import mongoose, { Schema, Document } from 'mongoose';
import { IEvent, IEventSession } from '../types';

export interface IEventDocument extends Omit<IEvent, '_id'>, Document {
  isCurrentlyActive(): boolean;
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

export const Event = mongoose.model<IEventDocument>('Event', eventSchema);