import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { sendFriendRequest } from "@/utils/userFunctions";

const ViewUserPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [buttonState, setButtonState] = useState({ label: "Request Friend", disabled: false });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    fetchUserById(id);
    fetchPostsByUser(id);
  }, [id]);

  useEffect(() => {
    if (user && currentUser) {
      checkFriendshipStatus();
    }
  }, [user, currentUser]);

  const fetchUserById = async (userId) => {
    try {
      const res = await fetch("/api/users");
      const all = await res.json();
      const found = all.data.find((u) => u._id === userId);
      setUser(found);
    } catch (err) {
      console.error("Failed to fetch user by ID:", err);
    }
  };

  const fetchPostsByUser = async (userId) => {
    try {
      const res = await fetch("/api/posts");
      const allPosts = await res.json();
      const userPosts = allPosts.data.data.filter((post) => {
        const postAuthor = typeof post.authorId === "object" ? post.authorId.$oid : post.authorId;
        return postAuthor === userId;
      });
      setPosts(userPosts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  const checkFriendshipStatus = async () => {
    if (currentUser.friends?.includes(user._id)) {
      setButtonState({ label: "Friend", disabled: true });
      return;
    }

    const sentRes = await fetch(`/api/friends?requesterId=${currentUser._id}&receiverId=${user._id}`);
    const sentData = await sentRes.json();
    console.log("Sent friend request data:", sentData);
    if (sentData?.data?.status === "sent") {
      setButtonState({ label: "Request Sent", disabled: true });
      return;
    }

    const receivedRes = await fetch(`/api/friends?requesterId=${user._id}&receiverId=${currentUser._id}`);
    const receivedData = await receivedRes.json();
    console.log("Received friend request data:", receivedData);
    if (receivedData?.data?.status === "sent") {
      setButtonState({ label: "This user asked to be your friend", disabled: true });
      return;
    }

    setButtonState({ label: "Request Friend", disabled: false });
  };

  const handleSendRequest = async () => {
    const result = await sendFriendRequest(currentUser._id, user._id);
    if (result.success || result.message === "Already sent") {
      setButtonState({ label: "Request Sent", disabled: true });
    }
  };

  if (!user || !currentUser) return null;

  const profileImage = user.profilePicture?.trim() !== ""
    ? user.profilePicture
    : "/profile_icon.jpg";

  return (
    <div className="min-h-screen bg-beige flex flex-col overflow-y-auto pb-24">
      {/* Background */}
      <div className="relative h-96 overflow-hidden p-4">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Background" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          User Profile
        </div>
      </div>

      {/* Profile Info */}
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
            <p className="text-sm text-gray-700 dark:text-black">Friends: {user.friends?.length || 0}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            disabled={buttonState.disabled}
            onClick={handleSendRequest}
            className={`text-white ${
              buttonState.disabled ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
            } focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5`}
          >
            {buttonState.label}
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="p-4 flex flex-wrap justify-center gap-6">
            {currentUser?.friends?.includes(user._id) ? (
                posts.map((post) => (
                <div
                    key={post._id}
                    className="cursor-pointer w-full sm:w-72 md:w-80 lg:w-72 bg-white border border-gray-200 rounded-lg shadow hover:shadow-xl transition-shadow dark:bg-gray-800 dark:border-gray-700"
                >
                    <img src={post.images[0]} alt="Post" className="rounded-t-lg w-full h-48 object-cover" />
                    <div className="p-5">
                    <h5 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {post.description}
                    </h5>
                    <p className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    </div>
                </div>
                ))
            ) : (
                <p className="text-gray-600 text-center w-full mt-4">
                You must be friends with this user to view their posts.
                </p>
            )}
        </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around py-3 border-t border-gray-700 z-50">
        <button
          onClick={() => router.push("/main")}
          className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/recipie_icon.jpg" alt="Recipies" className="w-5 h-5 rounded-full" />Recipies
        </button>
        <button className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/feed_icon.png" alt="Feed" className="w-5 h-5 rounded-full" /> Feed
        </button>
        <button
          onClick={() => router.push("/requests")}
          className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/request_icon.jpg" alt="Requests" className="w-5 h-5 rounded-full" />Requests
        </button>
        <button className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/AI_chat_icon.jpg" alt="CookAId" className="w-5 h-5 rounded-full" /> CookAId
        </button>
      </div>
    </div>
  );
};

export default ViewUserPage;