'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/ui/Navigation';
import { 
  Bot, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  Zap,
  Lightbulb,
  Users,
  Calendar,
  Target,
  Mic,
  Image,
  Paperclip,
  MoreHorizontal
} from 'lucide-react';
import { enhancedBotAPI } from '@/lib/apiWithRetry';

interface MessageItem {
  text: string;
  isBot: boolean;
  timestamp?: Date;
  id: string;
  status?: 'sending' | 'sent' | 'error';
}

interface BotSession {
  sessionId: string;
  conversationId: string;
}

export default function ChatPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<BotSession | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [suggestions] = useState([
    "Help me find networking matches",
    "What events are coming up?",
    "How can I improve my profile?",
    "Show me my connection analytics"
  ]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize bot session
  useEffect(() => {
    const initializeBotSession = async () => {
      if (!user?._id || initialized) return;
      
      try {
        console.log('🤖 Initializing bot session for user:', user._id);
        const response = await enhancedBotAPI.initialize({ 
          userId: user._id,
          context: 'dedicated_chat',
          preferences: {
            style: 'conversational',
            focus: 'comprehensive_networking'
          }
        });
        
        setSession({
          sessionId: response.data.sessionId,
          conversationId: response.data.conversationId
        });
        
        // Add welcome message
        const welcomeMessage: MessageItem = {
          id: 'welcome',
          text: response.data.welcomeMessage || `Hey ${user.name}! 👋 I'm your personal NetSync AI assistant. I can help you discover networking opportunities, analyze your connections, schedule meetups, and optimize your professional growth. What would you like to explore today?`,
          isBot: true,
          timestamp: new Date(),
          status: 'sent'
        };
        
        setMessages([welcomeMessage]);
        setInitialized(true);
        console.log('✅ Bot session initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize bot session:', error);
        const fallbackMessage: MessageItem = {
          id: 'fallback',
          text: `Hi ${user.name}! I'm your NetSync AI assistant. I'm having some connection issues, but I'm still here to help you with networking advice, event recommendations, and profile optimization. How can I assist you today?`,
          isBot: true,
          timestamp: new Date(),
          status: 'sent'
        };
        setMessages([fallbackMessage]);
        setInitialized(true);
      }
    };

    initializeBotSession();
  }, [user, initialized]);

  // Authentication check
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    const messageId = Date.now().toString();
    const userMessage: MessageItem = { 
      id: messageId,
      text: messageText, 
      isBot: false, 
      timestamp: new Date(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Update message status to sent
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'sent' } : msg
    ));
    
    try {
      console.log('💬 Sending message to bot:', messageText);
      
      const response = await enhancedBotAPI.sendMessage({
        userId: user?._id || '',
        message: messageText,
        sessionId: session?.sessionId,
        conversationId: session?.conversationId,
        context: {
          type: 'dedicated_chat',
          location: 'chat_page'
        }
      });
      
      const botMessage: MessageItem = {
        id: Date.now().toString(),
        text: response.data.response || response.data.message,
        isBot: true,
        timestamp: new Date(),
        status: 'sent'
      };
      
      // Add bot response with typing animation
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setLoading(false);
      }, 1000 + Math.random() * 1000); // Realistic typing delay
      
      console.log('✅ Bot response received');
    } catch (error: any) {
      console.error('❌ Failed to send message to bot:', error);
      
      const fallbackMessage: MessageItem = {
        id: Date.now().toString(),
        text: getFallbackResponse(messageText),
        isBot: true,
        timestamp: new Date(),
        status: 'sent'
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, fallbackMessage]);
        setLoading(false);
      }, 800);
    }
  };

  const getFallbackResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('match') || msg.includes('connect')) {
      return "I'd love to help you find networking matches! Visit your Matches page to see AI-curated professionals who align with your goals. I can also help you optimize your profile for better matching algorithms.";
    }
    if (msg.includes('event') || msg.includes('conference')) {
      return "Great question about events! Check out the Events page for upcoming tech conferences and networking meetups. I can help you choose events that match your interests and career goals.";
    }
    if (msg.includes('profile') || msg.includes('improve')) {
      return "Profile optimization is key for networking success! Visit your Profile page to update your skills, experience, and networking goals. I can provide specific tips for better visibility and matches.";
    }
    if (msg.includes('analytics') || msg.includes('stats')) {
      return "Your networking analytics show valuable insights! I can help you understand your connection patterns, optimal networking times, and suggest strategies to expand your professional reach.";
    }
    
    return "I'm having some technical difficulties, but I'm still here to help! Try asking about networking matches, upcoming events, profile optimization, or connection strategies. I'm your dedicated networking assistant! 🚀";
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
            NetSync AI Assistant
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Your intelligent networking companion
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {message.isBot && (
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.isBot
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    {message.timestamp && (
                      <p className={`text-xs mt-2 ${message.isBot ? 'text-slate-500' : 'text-blue-100'}`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    )}
                  </div>
                  {!message.isBot && (
                    <div className="flex-shrink-0 ml-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Typing Indicator */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about networking, events, or growing your professional connections..."
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none resize-none transition-all"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Features Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-4 mt-8"
        >
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <Lightbulb className="w-6 h-6 text-yellow-500 mb-2" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Smart Insights</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Get personalized networking advice and strategies</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <Users className="w-6 h-6 text-blue-500 mb-2" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Match Analysis</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Discover why certain connections are recommended</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <Calendar className="w-6 h-6 text-green-500 mb-2" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Event Guidance</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Find the best events for your networking goals</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}