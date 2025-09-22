import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

class SocketManager {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(): Socket | null {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    const token = Cookies.get('accessToken');
    if (!token) {
      console.warn('No access token found, cannot connect to socket');
      return null;
    }

    const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      auth: {
        token,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    this.setupEventHandlers();
    return this.socket;
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Networking events
    this.socket.on('new_match_found', (data) => {
      console.log('New match found:', data);
      this.emit('newMatch', data);
    });

    this.socket.on('introduction_received', (data) => {
      console.log('Introduction received:', data);
      this.emit('introductionReceived', data);
    });

    this.socket.on('meetup_scheduled', (data) => {
      console.log('Meetup scheduled:', data);
      this.emit('meetupScheduled', data);
    });

    this.socket.on('proximity_alert', (data) => {
      console.log('Proximity alert:', data);
      this.emit('proximityAlert', data);
    });

    this.socket.on('event_update', (data) => {
      console.log('Event update:', data);
      this.emit('eventUpdate', data);
    });

    // User status events
    this.socket.on('user_joined', (data) => {
      console.log('User joined event:', data);
      this.emit('userJoined', data);
    });

    this.socket.on('user_left', (data) => {
      console.log('User left event:', data);
      this.emit('userLeft', data);
    });

    this.socket.on('user_status_changed', (data) => {
      console.log('User status changed:', data);
      this.emit('userStatusChanged', data);
    });

    // Chat events
    this.socket.on('user_typing', (data) => {
      this.emit('userTyping', data);
    });

    this.socket.on('user_stopped_typing', (data) => {
      this.emit('userStoppedTyping', data);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Event-specific methods
  joinEvent(eventId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_event', eventId);
    }
  }

  updateStatus(status: 'online' | 'away' | 'busy'): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('update_status', status);
    }
  }

  notifyNewMatch(targetUserId: string, matchData: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('notify_new_match', { targetUserId, matchData });
    }
  }

  requestIntroduction(targetUserId: string, message: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('request_introduction', { targetUserId, message });
    }
  }

  scheduleMeetup(participants: string[], meetupData: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('schedule_meetup', { participants, meetupData });
    }
  }

  updateLocation(latitude: number, longitude: number): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('update_location', { latitude, longitude });
    }
  }

  // Chat methods
  joinConversation(conversationId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_conversation', conversationId);
    }
  }

  leaveConversation(conversationId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_conversation', conversationId);
    }
  }

  startTyping(conversationId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_start', { conversationId });
    }
  }

  stopTyping(conversationId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_stop', { conversationId });
    }
  }

  // Event listener management
  private eventHandlers: { [event: string]: Function[] } = {};

  on(event: string, handler: Function): void {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  off(event: string, handler?: Function): void {
    if (!this.eventHandlers[event]) return;

    if (handler) {
      this.eventHandlers[event] = this.eventHandlers[event].filter(h => h !== handler);
    } else {
      this.eventHandlers[event] = [];
    }
  }

  private emit(event: string, data: any): void {
    if (this.eventHandlers[event]) {
      this.eventHandlers[event].forEach(handler => handler(data));
    }
  }

  // Utility methods
  isSocketConnected(): boolean {
    return this.isConnected;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketManager = new SocketManager();
export default socketManager;