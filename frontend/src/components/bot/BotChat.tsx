"use client";
import { useState } from "react";

interface MessageItem {
  text: string;
  isBot: boolean;
}

export function BotChat({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { text: message, isBot: false }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message, type: "general" }),
      });
      const data = await res.json();
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: data.response, isBot: true }]);
        setLoading(false);
      }, 600);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, something went wrong.", isBot: true },
      ]);
      setLoading(false);
    }
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


