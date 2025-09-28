"use client";
import { useState, useEffect, useCallback } from "react";
import { enhancedBotAPI } from "@/lib/apiWithRetry";
import { useToast } from "@/context/ToastContext";

interface MessageItem {
  text: string;
  isBot: boolean;
  timestamp?: Date;
}

interface BotSession {
  sessionId: string;
  conversationId: string;
}

export function BotChat({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<BotSession | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [typing, setTyping] = useState(false);
  const { showSuccess, showError, showInfo } = useToast();

  const initializeBotSession = useCallback(async () => {
      if (!userId || initialized) return;
      
      try {
        console.log('🤖 Initializing bot session for user:', userId);
        const response = await enhancedBotAPI.initialize({ 
          userId,
          context: 'dashboard_chat',
          preferences: {
            style: 'helpful',
            focus: 'networking'
          }
        });
        
        setSession({
          sessionId: response.data.sessionId,
          conversationId: response.data.conversationId
        });

        // Add welcome message with capabilities
        setMessages([{
          text: response.data.welcomeMessage || "Hi! I'm your NetSync assistant. I can help you with networking, finding matches, and scheduling meetups. How can I assist you today?",
          isBot: true,
          timestamp: new Date()
        }]);

        setInitialized(true);
        showSuccess('Bot Connected', 'Your networking assistant is ready to help!');
        console.log('✅ Bot session initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize bot session:', error);
        setMessages([{
          text: "Hi! I'm your NetSync assistant. I'm having trouble connecting right now, but I can still try to help you.",
          isBot: true,
          timestamp: new Date()
        }]);
        setInitialized(true);
        showError('Connection Issue', 'Bot is running in offline mode', {
          action: {
            label: 'Retry Connection',
            onClick: () => {
              setInitialized(false);
            }
          }
        });
      }
    }, [userId, initialized, showSuccess, showError]);

  // Initialize bot session when component mounts
  useEffect(() => {
    if (!userId || initialized) return;
    initializeBotSession();
  }, [userId, initialized, initializeBotSession]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    const userMessage: MessageItem = { 
      text: message, 
      isBot: false, 
      timestamp: new Date() 
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setTyping(true);
    
    try {
      console.log('💬 Sending message to bot:', message);
      
      const response = await enhancedBotAPI.sendMessage({
        userId,
        message,
        sessionId: session?.sessionId,
        conversationId: session?.conversationId,
        context: {
          type: 'general_chat',
          location: 'dashboard'
        }
      });
      
      const botMessage: MessageItem = {
        text: response.data.response || response.data.message,
        isBot: true,
        timestamp: new Date()
      };
      
      // Add a slight delay for better UX
      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
        setTyping(false);

        // Show suggestions if provided
        if (response.data.suggestions && response.data.suggestions.length > 0) {
          showInfo('Suggestions Available', 'The bot has provided some helpful suggestions for you.');
        }
      }, 600);
      
      console.log('✅ Bot response received');
    } catch (error: any) {
      console.error('❌ Failed to send message to bot:', error);
      
      // Provide helpful fallback responses
      const fallbackMessage = getFallbackResponse(message);
      
      setMessages((prev) => [...prev, {
        text: fallbackMessage,
        isBot: true,
        timestamp: new Date()
      }]);
      setLoading(false);
      setTyping(false);

      showError('Bot Offline', 'Using fallback responses. Try reconnecting for full functionality.', {
        action: {
          label: 'Reconnect',
          onClick: () => {
            setInitialized(false);
          }
        }
      });
    }
  };

  // Fallback responses when API is unavailable
  const getFallbackResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('match') || msg.includes('connect')) {
      return "I'd love to help you find networking matches! You can check out your potential matches on the Matches page, or try updating your profile to get better recommendations.";
    }
    if (msg.includes('event') || msg.includes('conference')) {
      return "For events and conferences, check out the Events page where you can discover networking opportunities and register for upcoming tech conferences.";
    }
    if (msg.includes('profile') || msg.includes('update')) {
      return "You can update your professional profile by visiting the Profile page. Make sure to add your skills, interests, and networking goals for better matches!";
    }
    if (msg.includes('help') || msg.includes('how')) {
      return "I'm here to help with networking, finding matches, and scheduling meetups. You can also check out the Help page for detailed guides and FAQs.";
    }
    
    return "I'm having trouble connecting to my full capabilities right now, but I'm still here to help! Try asking about matches, events, or updating your profile.";
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">🤖 NetSync Assistant</h3>

      <div className="space-y-4 mb-4 max-h-64 overflow-y-auto pr-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.isBot
                  ? "bg-blue-50 dark:bg-blue-900/30 text-slate-800 dark:text-slate-200 border border-blue-100 dark:border-blue-800"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="max-w-xs p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-slate-800 dark:text-slate-200 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400 ml-2">Assistant is typing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 focus:border-blue-400 outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage(input);
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || typing || !input.trim()}
          className="btn-primary px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading || typing ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}


