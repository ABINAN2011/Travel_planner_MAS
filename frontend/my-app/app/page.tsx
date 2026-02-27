'use client';

import { useState, useRef, useEffect } from "react";
import axios from "axios";

interface ChatMessage {
  user: string;
  bot: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const newHistory = [...chatHistory, { user: input, bot: "" }];
    setChatHistory(newHistory);
    setInput(""); // Clear input immediately for better UX

    try {
      const res = await axios.post<{ reply: string }>("http://localhost:8000/chat", {
        message: input
      });

      const reply = res.data.reply;

      setChatHistory((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 ? { ...msg, bot: reply } : msg
        )
      );
    } catch (err) {
      console.error(err);
      setChatHistory((prev) =>
        prev.map((msg, idx) =>
          idx === prev.length - 1 
            ? { ...msg, bot: "Sorry, I couldn't process your request. Please try again." } 
            : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrompts = [
    "Plan a 3-day trip to Paris",
    "Best beaches in Bali",
    "Weekend getaway ideas",
    "Budget travel tips for Europe"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-2xl">
            ✈️
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Travel Planner</h1>
            <p className="text-sm text-gray-600">Your personal travel assistant</p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl w-full mx-auto px-6 py-6">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg">
                🌍
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Where would you like to go?
              </h2>
              <p className="text-gray-600 mb-8 max-w-md">
                Ask me anything about travel destinations, itineraries, tips, or recommendations!
              </p>
              
              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(prompt)}
                    className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-blue-400 hover:shadow-md transition-all group"
                  >
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {chatHistory.map((msg, idx) => (
                <div key={idx} className="space-y-3">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
                      <p className="text-sm leading-relaxed">{msg.user}</p>
                    </div>
                  </div>

                  {/* Bot Message */}
                  {msg.bot && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {msg.bot}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Loading indicator */}
                  {idx === chatHistory.length - 1 && !msg.bot && loading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                className="w-full p-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="Ask about destinations, itineraries, travel tips..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
                style={{ 
                  minHeight: '44px',
                  maxHeight: '120px',
                  height: 'auto'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
            </div>
            <button
              className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg flex items-center gap-2"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}