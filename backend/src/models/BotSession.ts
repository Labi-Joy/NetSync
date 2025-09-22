import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from 'mongoose';

export interface IBotSession extends Document {
  sessionId: string;
  conversationId: string;
  userId: ObjectId;
  eventId?: ObjectId;
  context: {
    purpose: string;
    sessionType: string;
    eventContext: boolean;
    userPreferences: any;
  };
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    metadata?: any;
  }>;
  isActive: boolean;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BotSessionSchema: Schema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  conversationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    index: true
  },
  context: {
    purpose: {
      type: String,
      required: true,
      enum: ['networking_facilitation', 'introduction_assistance', 'meetup_scheduling', 'general_help']
    },
    sessionType: {
      type: String,
      required: true,
      enum: ['dashboard_chat', 'event_chat', 'networking_session', 'introduction']
    },
    eventContext: {
      type: Boolean,
      default: false
    },
    userPreferences: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  messages: [{
    role: {
      type: String,
      required: true,
      enum: ['user', 'assistant']
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      type: Schema.Types.Mixed
    }
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastActivity: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for performance
BotSessionSchema.index({ userId: 1, isActive: 1 });
BotSessionSchema.index({ eventId: 1, isActive: 1 });
BotSessionSchema.index({ lastActivity: 1 });
BotSessionSchema.index({ createdAt: 1 });

// Instance methods
BotSessionSchema.methods.addMessage = function(role: 'user' | 'assistant', content: string, metadata?: any) {
  this.messages.push({
    role,
    content,
    timestamp: new Date(),
    metadata
  });
  this.lastActivity = new Date();

  // Keep only last 100 messages for performance
  if (this.messages.length > 100) {
    this.messages = this.messages.slice(-100);
  }

  return this.save();
};

BotSessionSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

BotSessionSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

// Static methods
BotSessionSchema.statics.findActiveByUser = function(userId: ObjectId) {
  return this.find({ userId, isActive: true }).sort({ lastActivity: -1 });
};

BotSessionSchema.statics.findByConversationId = function(conversationId: string) {
  return this.findOne({ conversationId });
};

BotSessionSchema.statics.cleanupOldSessions = function(hoursOld: number = 24) {
  const cutoffDate = new Date(Date.now() - hoursOld * 60 * 60 * 1000);
  return this.updateMany(
    { lastActivity: { $lt: cutoffDate }, isActive: true },
    { isActive: false }
  );
};

// Virtual for message count
BotSessionSchema.virtual('messageCount').get(function(this: IBotSession) {
  return this.messages?.length || 0;
});

// Virtual for session duration
BotSessionSchema.virtual('sessionDuration').get(function(this: IBotSession) {
  if (this.lastActivity && this.createdAt) {
    return this.lastActivity.getTime() - this.createdAt.getTime();
  }
  return 0;
});

BotSessionSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

export const BotSession = mongoose.model<IBotSession>('BotSession', BotSessionSchema);
export default BotSession;