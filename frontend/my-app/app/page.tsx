'use client';

import { useState } from "react";
import axios from "axios";

interface ChatMessage {
  user: string;
  bot: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const newHistory = [...chatHistory, { user: input, bot: "" }];
    setChatHistory(newHistory);

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
      setInput("");
    } catch (err) {
      console.error(err);
      alert("Error contacting backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-700">🧭 AI Travel Planner</h1>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
        {chatHistory.length === 0 && (
          <p className="text-gray-600">Ask your travel question to start the chatbot.</p>
        )}

        {chatHistory.map((msg, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <div className="text-right">
              <span className="inline-block bg-blue-600 text-white p-3 rounded-2xl max-w-[80%] break-words">
                {msg.user}
              </span>
            </div>
            {msg.bot && (
              <div className="text-left">
                <span className="inline-block bg-gray-200 text-gray-900 p-3 rounded-2xl max-w-[80%] break-words whitespace-pre-wrap">
                  {msg.bot}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl mt-6 flex gap-3">
        <input
          className="flex-1 p-3 rounded-xl text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700 transition-colors"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
