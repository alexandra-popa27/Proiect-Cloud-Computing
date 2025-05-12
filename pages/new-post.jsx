import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const NewPostPage = () => {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      console.log("User from localStorage in new-post.jsx:", parsed);
      setUser(parsed);
    } else {
      router.push("/");
    }
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  const handlePost = async () => {
    if (!description || images.length === 0 || !user) return;

    const imageUrls = imagePreviews;

    const post = {
      authorId: user._id?.toString?.() || user._id,
      description,
      images: imageUrls,
      likes: [],
      comments: [],
    };

    console.log("Post being sent:", post);
    console.log("user._id:", user._id);

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    if (response.ok) {
      router.push("/profile");
    } else {
      alert("Failed to create post.");
    }
  };

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      <div className="relative h-96 overflow-hidden p-4">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Background" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          Create a New Post
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-start gap-8 px-6 py-8">
            {/* Stânga: Imagine + Upload */}
            <div className="flex flex-col items-center w-full lg:w-1/2 gap-4">
                <h3 className="text-lg font-semibold text-black">Add your picture here:</h3>
                <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full max-w-sm"
                />
                <div className="flex flex-wrap gap-4 justify-center">
                {imagePreviews.map((src, idx) => (
                    <div
                    key={idx}
                    className="w-full max-w-xl bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                    >
                    <img
                        src={src}
                        alt={`Preview ${idx}`}
                        className="rounded-lg w-full h-auto object-contain"
                    />
                    </div>
                ))}
                </div>
            </div>

            {/* Dreapta: Descriere + Butoane */}
            <div className="flex flex-col w-full lg:w-1/2 gap-4">
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write something about your post..."
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring focus:border-blue-500"
                rows={6}
                />
                <div className="flex gap-4">
                <button
                    onClick={handleCancel}
                    className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                    Cancel
                </button>
                <button
                    onClick={handlePost}
                    disabled={!description || images.length === 0}
                    className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 ${
                    !description || images.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300"
                    }`}
                >
                    Post
                </button>
                </div>
            </div>
        </div>

      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around py-3 border-t border-gray-700 z-50">
        <button onClick={() => router.push("/main")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/recipie_icon.jpg" alt="Recipes" className="w-5 h-5 rounded-full" /> Recipes
        </button>
        <button className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/feed_icon.png" alt="Feed" className="w-5 h-5 rounded-full" /> Feed
        </button>
        <button className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/request_icon.jpg" alt="Requests" className="w-5 h-5 rounded-full" /> Requests
        </button>
        <button className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/AI_chat_icon.jpg" alt="CookAId" className="w-5 h-5 rounded-full" /> CookAId
        </button>
      </div>
    </div>
  );
};

export default NewPostPage;