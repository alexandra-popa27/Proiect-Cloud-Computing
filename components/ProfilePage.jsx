import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Redirect if not logged in
      router.push("/");
    }
  }, []);

  if (!user) return null;

  const profileImage = user.profilePicture && user.profilePicture.trim() !== ""
    ? user.profilePicture
    : "/profile_icon.jpg";

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      {/* Image with text overlay */}
      <div className="relative h-96 overflow-hidden p-4">
            <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Cooking Hub Background" />
            <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
                The Cooking Hub - My Profile
            </div>
            </div>

      {/* Profile info */}
      <div className="flex flex-col items-center justify-center mt-10 px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow-md border-2 border-white"
          />
          <div className="text-center md:text-left">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{user.name}</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300">Posts: 0</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Friends: 0</p>
          </div>
        </div>

        {/* Buttons under profile */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button
            type="button"
            onClick={() => alert("Edit profile coming soon!")}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
            Edit Profile
            </button>
            <button
            type="button"
            onClick={() => {
                localStorage.removeItem("user");
                router.push("/");
            }}
            className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
            Log Out
            </button>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around py-3 border-t border-gray-700 z-50">
        <button
          onClick={() => router.push("/main")}
          className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/recipie_icon.jpg" alt="Recipies" className="w-5 h-5 rounded-full" />
          Recipies
        </button>
        <button className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/feed_icon.png" alt="Feed" className="w-5 h-5 rounded-full" />
          Feed
        </button>
        <button className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/request_icon.jpg" alt="Requests" className="w-5 h-5 rounded-full" />
          Requests
        </button>
        <button className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/AI_chat_icon.jpg" alt="CookAId" className="w-5 h-5 rounded-full" />
          CookAId
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;