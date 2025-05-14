import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const FeedPage = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCurrentUser(parsed);
      fetchData(parsed);
    } else {
      router.push("/");
    }
  }, []);

  const fetchData = async (user) => {
    try {
      const [postsRes, usersRes] = await Promise.all([
        fetch("/api/posts"),
        fetch("/api/users"),
      ]);

      const postsData = await postsRes.json();
      const usersData = await usersRes.json();

      const userMap = {};
      usersData.data.forEach((u) => {
        userMap[u._id] = u;
      });
      setUsersMap(userMap);

      const friendPosts = postsData.data.data
        .filter((post) => user.friends?.includes(post.authorId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setAllPosts(friendPosts);
    } catch (error) {
      console.error("Error loading feed data:", error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-beige flex flex-col overflow-y-auto pb-24">
      {/* Header */}
      <div className="relative h-96 overflow-hidden p-4">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Cooking Background" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          Recipies from friends
        </div>
      </div>

      {/* Posts */}
      <div className="p-4 flex flex-col items-center gap-8">
        {allPosts.map((post) => {
          const author = usersMap[post.authorId];
          const profileImage = author?.profilePicture?.trim() !== ""
            ? author.profilePicture
            : "/profile_icon.jpg";

          return (
            <div
              key={post._id}
              className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden"
            >
              {/* User Info */}
              <div className="flex items-center p-4 gap-3">
                <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                <span className="font-semibold text-gray-800 dark:text-white">{author?.name}</span>
              </div>

              {/* Image */}
              <img src={post.images?.[0]} alt="Post" className="w-full max-h-[500px] object-cover" />

              {/* Icons */}
              <div className="flex items-center gap-6 px-4 py-3">
                <img src="/empty_heart.png" alt="Like" className="w-8 h-8 cursor-pointer rounded-full" />
                <img
                  src="/comments_icon.jpg"
                  alt="Comments"
                  className="w-8 h-8 cursor-pointer rounded-full"
                  onClick={() => router.push(`/view-post?id=${post._id}&from=feed`)}
                />
              </div>

              {/* Description */}
              <div className="px-4 pb-2 flex gap-2">
                <span className="text-gray-800 dark:text-white font-semibold">{author?.name}</span>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                  {post.description}
                </p>
              </div>

              {/* Date */}
              <div className="px-4 pb-4 text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around py-3 border-t border-gray-700 z-50">
        <button onClick={() => router.push("/main")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/recipie_icon.jpg" alt="Recipies" className="w-5 h-5 rounded-full" />
          Recipies
        </button>
        <button onClick={() => router.push("/profile")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/profile_icon.jpg" alt="Profile" className="w-5 h-5 rounded-full" />
          Profile
        </button>
        <button onClick={() => router.push("/requests")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/request_icon.jpg" alt="Requests" className="w-5 h-5 rounded-full" />
          Requests
        </button>
        <button onClick={() => router.push("/chat")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/AI_chat_icon.jpg" alt="CookAId" className="w-5 h-5 rounded-full" />
          CookAId
        </button>
      </div>
    </div>
  );
};

export default FeedPage;


