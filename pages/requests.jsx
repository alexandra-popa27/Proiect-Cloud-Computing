import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const RequestsPage = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCurrentUser(parsed);

      if (parsed.role === "admin") {
        fetchUsers();
      }
    } else {
      router.push("/");
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/requests");
      const json = await res.json();
      console.log("Fetched users data:", json);
      if (json.success) {
        setUsers(json.data);
      } else {
        alert(json.message || "Failed to load chef requests."); // safer fallback
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load users.");
    }
  };

  const handlePromote = async (email) => {
    const confirm = window.confirm("Are you sure you want to upgrade this user to professional chef?");
    if (!confirm) return;

    try {
      const res = await fetch("/api/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (res.ok) {
        setUsers(users.filter((u) => u.email !== email));
        alert("User promoted to chef!");
      } else {
        alert(json.message || "Failed to promote.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };

  if (!currentUser || currentUser.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-beige p-4">
      {/* Header */}
      <div className="relative h-60 overflow-hidden mb-8">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Requests" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          Chef Requests
        </div>
      </div>

      <div className="p-4 flex flex-wrap justify-center gap-6">
        {users.map((user) => (
          <div key={user.email} className="max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col items-center">
            <img
              src={user.profilePicture || "/profile_icon.jpg"}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-700">{user.email}</p>
            <p className="text-sm text-gray-700 mb-3">{user.phone}</p>
            <button
              onClick={() => handlePromote(user.email)}
              className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2"
            >
              Promote to chef
            </button>
          </div>
        ))}
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around py-3 border-t border-gray-700 z-50">
        <button onClick={() => router.push("/profile")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/profile_icon.jpg" alt="Profile" className="w-5 h-5 rounded-full" /> Profile
        </button>
        <button className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/feed_icon.png" alt="Feed" className="w-5 h-5 rounded-full" /> Feed
        </button>
        <button className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/recipie_icon.jpg" alt="Recipes" className="w-5 h-5 rounded-full" /> Recipes
        </button>
        <button className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/AI_chat_icon.jpg" alt="CookAId" className="w-5 h-5 rounded-full" /> CookAId
        </button>
      </div>
    </div>
  );
};

export default RequestsPage;