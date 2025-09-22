"use client";
import { useState, useEffect } from "react";
import { enhancedBotAPI } from "@/lib/apiWithRetry";

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

  // Initialize bot session when component mounts
  useEffect(() => {
    const initializeBotSession = async () => {
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
        
        // Add welcome message
        setMessages([{
          text: response.data.welcomeMessage || "Hi! I'm your NetSync assistant. I can help you with networking, finding matches, and scheduling meetups. How can I assist you today?",
          isBot: true,
          timestamp: new Date()
        }]);
        
        setInitialized(true);
        console.log('✅ Bot session initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize bot session:', error);
        setMessages([{
          text: "Hi! I'm your NetSync assistant. I'm having trouble connecting right now, but I can still try to help you.",
          isBot: true,
          timestamp: new Date()
        }]);
        setInitialized(true);
      }
    };

    initializeBotSession();
  }, [userId, initialized]);

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
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-xs p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-slate-800 dark:text-slate-200 border border-blue-100 dark:border-blue-800 animate-pulse">
              typing...
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
          className="btn-primary px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
}


