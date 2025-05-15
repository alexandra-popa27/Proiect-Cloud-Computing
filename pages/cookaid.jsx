import React from "react";
import { useRouter } from "next/router";

const CookAIdPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-beige flex flex-col overflow-y-auto pb-24">
      {/* Header cu imagine și text */}
      <div className="relative h-96 overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="/cooking.jpg"
          alt="Cooking Background"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          Ask CookAId
        </div>
      </div>

      {/* Zona în care va fi AI-ul */}
      <div className="flex flex-col items-center p-6">
        <p className="text-gray-800 text-lg mb-4">Ask me anything about cooking! 🍳</p>
        {/* Aici va fi formularul/chat-ul AI-ului */}
        <div className="w-full max-w-xl">
          {/* Poți înlocui cu un component de chat mai târziu */}
          <textarea
            placeholder="Type your question here..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring focus:border-blue-500"
          />
          <button className="mt-2 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
            Ask
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
      </div>
    </div>
  );
};

export default CookAIdPage;
