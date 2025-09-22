import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  professionalInfo: {
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    experience: {
      type: String,
      enum: ['junior', 'mid', 'senior', 'executive'],
      required: true
    },
    skills: [{
      type: String
    }],
    interests: [{
      type: String
    }]
  },
  networkingProfile: {
    goals: [{
      type: String
    }],
    lookingFor: {
      type: String,
      enum: ['mentor', 'mentee', 'peers', 'collaborators', 'all'],
      default: 'all'
    },
    communicationStyle: {
      type: String,
      enum: ['proactive', 'reactive', 'structured'],
      default: 'reactive'
    },
    availability: [{
      type: String
    }]
  },
  currentEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  refreshTokens: [{
    type: String
  }]
}, {
  timestamps: true
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'professionalInfo.skills': 1 });
userSchema.index({ 'professionalInfo.interests': 1 });
userSchema.index({ currentEvent: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshTokens;
  return userObject;
};

export const User = mongoose.model<IUserDocument>('User', userSchema);