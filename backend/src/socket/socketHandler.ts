import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { redisClient } from '../config/database';
import { JWTPayload, SocketUser } from '../types';

export class SocketHandler {
  private io: SocketIOServer;
  private connectedUsers: Map<string, SocketUser> = new Map();
  
  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      },
      transports: ['websocket', 'polling']
    });
    
    this.setupMiddleware();
    this.setupEventHandlers();
  }
  
  private setupMiddleware(): void {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication token required'));
        }
        
        const jwtSecret = process.env.JWT_SECRET!;
        const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
        
        const user = await User.findById(decoded.userId).select('-password -refreshTokens');
        if (!user) {
          return next(new Error('User not found'));
        }
        
        socket.data.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });
  }
  
  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`User ${socket.data.user.name} connected: ${socket.id}`);
      
      const socketUser: SocketUser = {
        userId: socket.data.user._id.toString(),
        socketId: socket.id,
        eventId: socket.data.user.currentEvent?.toString(),
        status: 'online'
      };
      
      this.connectedUsers.set(socket.id, socketUser);
      this.updateUserStatus(socketUser.userId, 'online');
      
      // Join event room if user is attending an event
      if (socketUser.eventId) {
        socket.join(`event:${socketUser.eventId}`);
        socket.to(`event:${socketUser.eventId}`).emit('user_joined', {
          userId: socketUser.userId,
          name: socket.data.user.name,
          status: 'online'
        });
      }
      
      // Handle joining specific event rooms
      socket.on('join_event', async (eventId: string) => {
        try {
          // Verify user is attending this event
          const user = await User.findById(socket.data.user._id);
          if (!user || user.currentEvent?.toString() !== eventId) {
            socket.emit('error', { message: 'Not authorized to join this event' });
            return;
          }
          
          // Leave previous event room
          if (socketUser.eventId && socketUser.eventId !== eventId) {
            socket.leave(`event:${socketUser.eventId}`);
          }
          
          socketUser.eventId = eventId;
          this.connectedUsers.set(socket.id, socketUser);
          
          socket.join(`event:${eventId}`);
          socket.to(`event:${eventId}`).emit('user_joined', {
            userId: socketUser.userId,
            name: socket.data.user.name,
            status: socketUser.status
          });
          
          socket.emit('event_joined', { eventId });
        } catch (error) {
          socket.emit('error', { message: 'Failed to join event' });
        }
      });
      
      // Handle status updates
      socket.on('update_status', (status: 'online' | 'away' | 'busy') => {
        socketUser.status = status;
        this.connectedUsers.set(socket.id, socketUser);
        this.updateUserStatus(socketUser.userId, status);
        
        if (socketUser.eventId) {
          socket.to(`event:${socketUser.eventId}`).emit('user_status_changed', {
            userId: socketUser.userId,
            status
          });
        }
      });
      
      // Handle new match notifications
      socket.on('notify_new_match', (data: { targetUserId: string; matchData: any }) => {
        this.notifyUser(data.targetUserId, 'new_match_found', {
          fromUser: {
            id: socketUser.userId,
            name: socket.data.user.name,
            profilePicture: socket.data.user.profilePicture
          },
          matchData: data.matchData
        });
      });
      
      // Handle introduction requests
      socket.on('request_introduction', (data: { targetUserId: string; message: string }) => {
        this.notifyUser(data.targetUserId, 'introduction_received', {
          fromUser: {
            id: socketUser.userId,
            name: socket.data.user.name,
            profilePicture: socket.data.user.profilePicture
          },
          message: data.message
        });
      });
      
      // Handle meetup scheduling
      socket.on('schedule_meetup', (data: { participants: string[]; meetupData: any }) => {
        data.participants.forEach(participantId => {
          if (participantId !== socketUser.userId) {
            this.notifyUser(participantId, 'meetup_scheduled', {
              organizer: {
                id: socketUser.userId,
                name: socket.data.user.name
              },
              meetupData: data.meetupData
            });
          }
        });
      });
      
      // Handle proximity alerts (mock implementation)
      socket.on('update_location', (data: { latitude: number; longitude: number }) => {
        if (socketUser.eventId) {
          // In a real implementation, you would calculate proximity to other users
          // and send proximity alerts
          socket.to(`event:${socketUser.eventId}`).emit('user_location_updated', {
            userId: socketUser.userId,
            location: data
          });
        }
      });
      
      // Handle typing indicators for chat
      socket.on('typing_start', (data: { conversationId: string }) => {
        socket.to(`conv:${data.conversationId}`).emit('user_typing', {
          userId: socketUser.userId,
          name: socket.data.user.name
        });
      });
      
      socket.on('typing_stop', (data: { conversationId: string }) => {
        socket.to(`conv:${data.conversationId}`).emit('user_stopped_typing', {
          userId: socketUser.userId
        });
      });
      
      // Handle conversation room joining
      socket.on('join_conversation', (conversationId: string) => {
        socket.join(`conv:${conversationId}`);
      });
      
      socket.on('leave_conversation', (conversationId: string) => {
        socket.leave(`conv:${conversationId}`);
      });
      
      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`User ${socket.data.user.name} disconnected: ${socket.id}`);
        
        if (socketUser.eventId) {
          socket.to(`event:${socketUser.eventId}`).emit('user_left', {
            userId: socketUser.userId,
            name: socket.data.user.name
          });
        }
        
        this.connectedUsers.delete(socket.id);
        this.updateUserStatus(socketUser.userId, 'offline');
      });
    });
  }
  
  private async updateUserStatus(userId: string, status: string): Promise<void> {
    try {
      await redisClient.setEx(`user:${userId}:status`, 300, status); // 5 minutes TTL
    } catch (error) {
      console.error('Error updating user status in Redis:', error);
    }
  }
  
  private notifyUser(userId: string, event: string, data: any): void {
    // Find user's socket
    const userSocket = Array.from(this.connectedUsers.entries()).find(
      ([_, socketUser]) => socketUser.userId === userId
    );
    
    if (userSocket) {
      this.io.to(userSocket[0]).emit(event, data);
    }
  }
  
  public broadcastToEvent(eventId: string, event: string, data: any): void {
    this.io.to(`event:${eventId}`).emit(event, data);
  }
  
  public getConnectedUsers(eventId?: string): SocketUser[] {
    const users = Array.from(this.connectedUsers.values());
    return eventId ? users.filter(user => user.eventId === eventId) : users;
  }
  
  public isUserOnline(userId: string): boolean {
    return Array.from(this.connectedUsers.values()).some(user => user.userId === userId);
  }
}