import mongoose, { Schema, Document } from 'mongoose';
import { IConnection, IInteraction } from '../types';

export interface IConnectionDocument extends Omit<IConnection, '_id'>, Document {
  addInteraction(type: string, data: any): Promise<IConnectionDocument>;
  updateStatus(newStatus: string, interactionData?: any): Promise<IConnectionDocument>;
}

const interactionSchema = new Schema<IInteraction>({
  type: {
    type: String,
    enum: ['bot_introduction', 'user_response', 'meetup_scheduled', 'feedback'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  }
}, { _id: false });

const connectionSchema = new Schema<IConnectionDocument>({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  matchReason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['suggested', 'introduced', 'connected', 'met', 'collaborated'],
    default: 'suggested'
  },
  conversationStarter: {
    type: String,
    required: true
  },
  suggestedMeetup: {
    time: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true,
      min: 15,
      max: 180
    }
  },
  interactions: [interactionSchema]
}, {
  timestamps: true
});

connectionSchema.index({ eventId: 1, status: 1 });
connectionSchema.index({ participants: 1 });
connectionSchema.index({ matchScore: -1 });
connectionSchema.index({ 'suggestedMeetup.time': 1 });

connectionSchema.methods.addInteraction = function(type: string, data: any) {
  this.interactions.push({
    type,
    timestamp: new Date(),
    data
  });
  return this.save();
};

connectionSchema.methods.updateStatus = function(newStatus: string, interactionData?: any) {
  this.status = newStatus;
  if (interactionData) {
    this.addInteraction('user_response', interactionData);
  }
  return this.save();
};

export const Connection = mongoose.model<IConnectionDocument>('Connection', connectionSchema);