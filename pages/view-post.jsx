import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ViewPostPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }

    if (id) {
        console.log("Fetching post with id:", id);

      fetch(`/api/posts?id=${id}`)
        .then(res => res.json())
        .then(data => setPost(data.data))
        .catch(err => console.error("Failed to fetch post:", err));
    }
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/posts?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/profile");
    } else {
      alert("Failed to delete post.");
    }
  };

  if (!post) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-beige flex flex-col overflow-y-auto pb-24">
      {/* Background banner */}
      <div className="relative h-96 overflow-hidden p-4">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Background" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          Post View
        </div>
      </div>

      {/* Post content */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-8 px-6 py-8">
        {/* Left: Image */}
        <div className="flex flex-col items-center w-full lg:w-1/2 gap-4">
          <h3 className="text-lg font-semibold text-black">Picture:</h3>
          {post.images?.length > 0 ? (
            <img
              src={post.images[0]}
              alt="Post"
              className="rounded-lg w-full max-w-xl object-contain border"
            />
          ) : (
            <p className="text-sm text-gray-500 italic">No image available</p>
          )}
        </div>

        {/* Right: Description and controls */}
        <div className="flex flex-col w-full lg:w-1/2 gap-4">
          <h3 className="text-lg font-semibold text-black">Description:</h3>
          <p className="border border-gray-300 rounded-md p-4 bg-white shadow text-gray-800">
            {post.description || "No description provided."}
          </p>
          <p className="text-sm text-gray-500">Posted on: {new Date(post.createdAt).toLocaleString()}</p>

          {user?._id === post.authorId && (
            <button
              onClick={handleDelete}
              className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
            >
              Delete Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPostPage;