import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

const CookAIdPage = () => {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setUserId(user._id);
      loadHistory(user._id);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadHistory = async (userId) => {
    try {
      const res = await fetch(`/api/history?userId=${userId}`);
      const data = await res.json();
      const historyArray = data?.data?.data;
      if (res.ok && Array.isArray(historyArray)) {
        const formatted = historyArray.flatMap((entry) => [
          { role: "user", content: entry.question },
          { role: "ai", content: entry.answer },
        ]);
        setChatHistory(formatted);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  const askQuestion = async () => {
    if (!question.trim() || !userId) return;

    const userMessage = { role: "user", content: question };
    setChatHistory((prev) => [...prev, userMessage]);
    setLoading(true);
    setQuestion("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, userId }),
      });

      const data = await res.json();
      const aiMessage = {
        role: "ai",
        content: res.ok ? data.response : data.error || "Something went wrong.",
      };

      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error asking question:", err);
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", content: "Failed to get a response." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-beige flex flex-col pb-24">
      {/* Header */}
      <div className="relative h-96 overflow-hidden">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Cooking Background" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          Ask CookAId
        </div>
      </div>

      {/* Message */}
      <div className="text-center text-gray-800 text-lg my-4">Ask me anything about cooking! 🍳</div>

      {/* Chat History Scrollable */}
      <div className="flex justify-center">
        <div className="w-full max-w-xl bg-white p-4 rounded-lg shadow space-y-4 max-h-[400px] overflow-y-auto">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg ${
                msg.role === "user" ? "bg-purple-100 text-right ml-auto" : "bg-gray-100 text-left mr-auto"
              } max-w-[85%]`}
            >
              <p className="text-sm text-gray-800 whitespace-pre-line">{msg.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Form */}
      <div className="flex justify-center mt-6">
        <div className="w-full max-w-xl">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="w-full h-28 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring focus:border-blue-500"
          />
          <button
            onClick={askQuestion}
            className="mt-2 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? "Asking..." : "Ask"}
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around py-3 border-t border-gray-700 z-50">
        <button onClick={() => router.push("/main")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/recipie_icon.jpg" alt="Recipies" className="w-5 h-5 rounded-full" /> Recipies
        </button>
        <button onClick={() => router.push("/feed")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/feed_icon.png" alt="Feed" className="w-5 h-5 rounded-full" /> Feed
        </button>
        <button onClick={() => router.push("/requests")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/request_icon.jpg" alt="Requests" className="w-5 h-5 rounded-full" /> Requests
        </button>
        <button onClick={() => router.push("/profile")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/profile_icon.jpg" alt="Profile" className="w-5 h-5 rounded-full" /> Profile
        </button>
        <button onClick={() => router.push("/map")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/map_icon.jpg" alt="Map" className="w-5 h-5 rounded-full" />Map
        </button>
      </div>
    </div>
  );
};

export default CookAIdPage;
