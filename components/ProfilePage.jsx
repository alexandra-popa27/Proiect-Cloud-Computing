import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetchUserPosts(parsed._id);
    } else {
      router.push("/");
    }
  }, []);

  const fetchUserPosts = async (userId) => {
    try {
      const res = await fetch("/api/posts");
      const allPosts = await res.json();
      console.log("allPosts:", allPosts);

      const userPosts = allPosts.data.data.filter((post) => {
        if (typeof post.authorId === "object") {
          return post.authorId.$oid === userId || post.authorId === userId;
        }
        return post.authorId === userId;
      });
      setPosts(userPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  if (!user) return null;

  const profileImage = user.profilePicture && user.profilePicture.trim() !== ""
    ? user.profilePicture
    : "/profile_icon.jpg";

  return (
    <div className="min-h-screen bg-beige flex flex-col overflow-y-auto pb-24">
      <div className="relative h-96 overflow-hidden p-4">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Cooking Hub Background" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          The Cooking Hub - My Profile
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-10 px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow-md border-2 border-white"
          />
          <div className="text-center md:text-left">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-black mb-2">{user.name}</h2>
            <p className="text-sm text-gray-700 dark:text-black">Posts: {posts.length}</p>
            <p className="text-sm text-gray-700 dark:text-black">Friends: 0</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <button type="button" onClick={() => router.push("/edit-profile")}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
            Edit Profile
          </button>
          <button type="button" onClick={() => {localStorage.removeItem("user"); router.push("/");}}
            className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5">
            Log Out
          </button>
          {user.role !== "admin" && (
            <button type="button" onClick={() => router.push("/new-post")}
              className="text-white bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5">
              New Post
            </button>
          )}
        </div>
      </div>

      {/* User Posts Section */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
      {posts.map((post) => (
        <div
          key={post._id}
          onClick={() => router.push(`/view-post?id=${post._id}`)}
          className="cursor-pointer max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow"
        >
          <img src={post.images[0]} alt="Post" className="rounded-t-lg w-full h-48 object-cover" />
          <div className="p-5">
            <p className="text-gray-700 dark:text-gray-300 text-sm">{post.description}</p>
          </div>
        </div>
      ))}
      </div>

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
        <button onClick={() => router.push("/requests")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
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