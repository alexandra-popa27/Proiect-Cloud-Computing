import React from "react";
import { useRouter } from "next/router";

const FeedPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-beige flex flex-col overflow-y-auto pb-24">
      {/* Header */}
      <div className="relative h-96 overflow-hidden p-4">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="/cooking.jpg"
          alt="Cooking Background"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          Recipies from friends
        </div>
      </div>

      {/* Content will go here */}
      <div className="p-4 text-center text-gray-700 text-lg">
        {/* Aici vei adăuga rețetele de la prieteni în pasul următor */}
        Coming soon: friend posts...
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around py-3 border-t border-gray-700 z-50">
        <button
          onClick={() => router.push("/main")}
          className="flex items-center gap-2 text-sm hover:text-yellow-400"
        >
          <img src="/recipie_icon.jpg" alt="Recipies" className="w-5 h-5 rounded-full" />
          Recipies
        </button>
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-2 text-sm hover:text-yellow-400"
        >
          <img src="/profile_icon.jpg" alt="Profile" className="w-5 h-5 rounded-full" />
          Profile
        </button>
        <button
          onClick={() => router.push("/requests")}
          className="flex items-center gap-2 text-sm hover:text-yellow-400"
        >
          <img src="/request_icon.jpg" alt="Requests" className="w-5 h-5 rounded-full" />
          Requests
        </button>
        <button
          onClick={() => router.push("/chat")}
          className="flex items-center gap-2 text-sm hover:text-yellow-400"
        >
          <img src="/AI_chat_icon.jpg" alt="CookAId" className="w-5 h-5 rounded-full" />
          CookAId
        </button>
      </div>
    </div>
  );
};

export default FeedPage;