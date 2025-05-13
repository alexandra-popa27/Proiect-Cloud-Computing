import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getChefRequests, promoteUser } from "@/utils/userFunctions";

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
        loadUsers();
      }
    } else {
      router.push("/");
    }
  }, []);

  const loadUsers = async () => {
    const fetchedUsers = await getChefRequests();
    setUsers(fetchedUsers);
  };

  const handlePromote = async (id) => {
    const confirmed = window.confirm("Are you sure you want to upgrade this user to professional chef?");
    if (!confirmed) return;

    const result = await promoteUser(id);
    if (result.success) {
      alert("User promoted!");
      await loadUsers(); // re-fetch list
    } else {
      alert(result.error || "Failed to promote.");
    }
  };

  return (
    <div className="min-h-screen bg-beige p-4">
      <div className="relative h-60 overflow-hidden mb-8">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Requests" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold text-center">
          Requests
        </div>
      </div>

      <div className="p-4 flex flex-wrap justify-center gap-6">
        {currentUser?.role === "admin" &&
          users.map((user) => (
            <div
              key={user.email}
              className="max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col items-center"
            >
              <img
                src={user.profilePicture || "/profile_icon.jpg"}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-700">{user.email}</p>
              <p className="text-sm text-gray-700 mb-3">{user.phone}</p>
              <button
                onClick={() => handlePromote(user._id)}
                className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Promote to chef
              </button>
            </div>
          ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around py-3 border-t border-gray-700 z-50">
        <button onClick={() => router.push("/profile")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/profile_icon.jpg" alt="Profile" className="w-5 h-5 rounded-full" /> Profile
        </button>
        <button className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/feed_icon.png" alt="Feed" className="w-5 h-5 rounded-full" /> Feed
        </button>
        <button onClick={() => router.push("/main")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
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