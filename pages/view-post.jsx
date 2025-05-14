import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "@/components/Spinner";

const ViewPostPage = () => {
  const router = useRouter();
  const { id, from } = router.query;
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [author, setAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    if (!id) return;
    loadPostData(id);
  }, [id]);

  const loadPostData = async (postId) => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/posts?id=${postId}`);
      const data = await res.json();
      const postData = data.data.data || data.data;
      setPost(postData);

      const usersRes = await fetch("/api/users");
      const users = await usersRes.json();
      const found = users.data.find((u) => u._id === postData.authorId);
      setAuthor(found);

      // Fetch comments
      if (postData.comments?.length) {
        const queryString = postData.comments.map((id) => `ids=${id}`).join("&");
        console.log("Fetching comments with query:", queryString);
        const commentsRes = await fetch("/api/comments?" + queryString);
        const commentsData = await commentsRes.json();
        console.log("Received comments:", commentsData);
        setComments(commentsData.data || []);
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Error loading post or comments:", err);
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
    if (res.ok) router.push("/profile");
    else alert("Failed to delete post.");
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
  
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: id,
        commentatorId: user._id,
        text: commentText,
      }),
    });
  
    const comment = await res.json();
    if (comment.success) {
      setCommentText("");
      loadPostData(id);
    } else {
      console.error("Failed to post comment:", comment);
    }
  };

  if (isLoading || !post) return <Spinner />;

  const profileImage = author?.profilePicture?.trim() ? author.profilePicture : "/profile_icon.jpg";

  return (
    <div className="min-h-screen bg-beige flex flex-col overflow-y-auto pb-24">
      {/* Header */}
      <div className="relative h-96 overflow-hidden p-4">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Background" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          Post View
        </div>
      </div>

      {/* Author info in card-style box */}
      <div className="flex justify-center mt-4">
        <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow p-4 dark:bg-gray-800 dark:border-gray-700">
          <img src={profileImage} className="w-12 h-12 rounded-full object-cover mb-2" alt="Author" />
          <span className="text-lg font-semibold text-gray-800 dark:text-white">{author?.name}</span>
        </div>
      </div>

      {/* Post content */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-8 px-6 py-8">
        <div className="flex flex-col items-center w-full lg:w-1/2 gap-4">
          <h3 className="text-lg font-semibold text-black">Picture:</h3>
          {post.images?.length > 0 ? (
            <img src={post.images[0]} alt="Post" className="rounded-lg w-full max-w-xl object-contain border" />
          ) : (
            <p className="text-sm text-gray-500 italic">No image available</p>
          )}
        </div>

        <div className="flex flex-col w-full lg:w-1/2 gap-4">
          <h3 className="text-lg font-semibold text-black">Description:</h3>
          <p className="border border-gray-300 rounded-md p-4 bg-white shadow text-gray-800">
            {post.description || "No description provided."}
          </p>
          <p className="text-sm text-gray-500">Posted on: {new Date(post.createdAt).toLocaleString()}</p>

          {/* Comments section */}
          <div className="border border-gray-300 bg-white rounded-lg p-4 shadow max-h-[300px] overflow-y-auto">
            <h4 className="font-semibold text-gray-800 mb-2">Comments</h4>
            {comments.length === 0 ? (
              <p className="text-gray-500 italic text-sm">No comments yet.</p>
            ) : (
              comments.map((c, idx) => {
                const commentator = c.commentator || {};
                const commentatorImage = commentator.profilePicture?.trim()
                  ? commentator.profilePicture
                  : "/profile_icon.jpg";
                return (
                  <div key={idx} className="border-b border-gray-200 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={commentatorImage} className="w-6 h-6 rounded-full" alt="User" />
                        <span className="font-medium text-gray-800 text-sm">{commentator.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(c.commentDate).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-700 text-sm mt-1">{c.text}</p>
                  </div>
                );
              })
            )}

            {/* Add new comment */}
            <div className="mt-4 flex items-center gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none"
              />
              <button
                onClick={handlePostComment}
                className="text-sm px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Post
              </button>
            </div>
          </div>

          {/* Control buttons */}
          <div className="flex gap-4 mt-4">
            {user?._id === post.authorId ? (
              <>
                <button onClick={() => router.push("/profile")} className="text-white bg-gray-600 hover:bg-gray-700 rounded-lg text-sm px-5 py-2.5">
                  Back to Profile
                </button>
                <button onClick={handleDelete} className="text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm px-5 py-2.5">
                  Delete Post
                </button>
              </>
            ) : (
              <button onClick={() => router.push(from === "feed" ? "/feed" : "/requests")} className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm px-5 py-2.5">
                {from === "feed" ? "Back to Feed" : "Back to Requests"}
              </button>
            )}
          </div>
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
        <button className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/AI_chat_icon.jpg" alt="CookAId" className="w-5 h-5 rounded-full" /> CookAId
        </button>
      </div>
    </div>
  );
};

export default ViewPostPage;
