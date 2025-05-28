import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getChefRequests, promoteUser, getAllUsers } from "@/utils/userFunctions";
import { getFriendRequests, acceptFriendRequest } from "@/utils/userFunctions";

const RequestsPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCurrentUser(parsed);

      if (parsed.role === "admin") {
        loadChefRequests();
      } else if (parsed.role === "generic" || parsed.role === "chef") {
        loadAllUsers();
        loadFriendRequests(parsed._id);
      }
    } else {
      router.push("/");
    }
  }, []);

  const loadChefRequests = async () => {
    const fetched = await getChefRequests();
    setUsers(fetched);
  };

  const loadAllUsers = async () => {
    const all = await getAllUsers();
    setUsers(all);
  };

  const loadFriendRequests = async (receiverId) => {
    const requests = await getFriendRequests(receiverId);
    setFriendRequests(requests);
  };

  const handlePromote = async (id) => {
    const confirm = window.confirm("Promote this user to chef?");
    if (!confirm) return;

    const result = await promoteUser(id);
    if (result.success) {
      alert("User promoted!");
      await loadChefRequests();
    } else {
      alert(result.error || "Failed to promote.");
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers([]);
    } else {
      const lower = searchQuery.toLowerCase();
      const results = users.filter((user) =>
        user.name.toLowerCase().includes(lower)
      );
      setFilteredUsers(results);
    }
  }, [searchQuery, users]);

  return (
    <div className="relative bg-beige min-h-screen overflow-y-auto pb-24">
      <div className="relative h-60 overflow-hidden mb-8">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Requests" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold text-center">
          Requests
        </div>
      </div>

      {/* Two columns */}
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        {/* Left column: Search */}
        <div className="lg:w-1/2 w-full">
          <h2 className="text-xl font-semibold mb-4">Search for users</h2>
          <input
            type="text"
            placeholder="Search user by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm mb-6 focus:outline-none focus:ring focus:border-blue-500"
          />

          <div className="flex flex-col gap-4">
          {filteredUsers
            .filter((user) => user._id !== currentUser?._id)
            .map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-4 bg-white p-3 rounded-lg shadow border cursor-pointer hover:bg-gray-100 transition"
                onClick={() => router.push(`/view-user?id=${user._id}`)}
              >
                <img
                  src={user.profilePicture || "/profile_icon.jpg"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-800">{user.name}</span>
              </div>
          ))}
          </div>
        </div>

        {/* Right column: Friend requests */}
        <div className="lg:w-1/2 w-full">
          <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
          {friendRequests.length === 0 ? (
            <p className="text-gray-600">No friend requests</p>
          ) : (
            <div className="flex flex-col gap-4">
              {friendRequests.map((req) => {
                const requester = users.find((u) => u._id === req.requesterId.toString());
                if (!requester) return null;

                return (
                  <div key={req._id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow border">
                    <div className="flex items-center gap-3">
                      <img
                        src={requester.profilePicture || "/profile_icon.jpg"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-800">{requester.name}</span>
                    </div>
                    <button
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                      onClick={async () => {
                        const res = await acceptFriendRequest(req._id);
                        if (res.success) {
                          alert("Friend request accepted!");
                          setFriendRequests((prev) => prev.filter((r) => r._id !== req._id));

                          // ⬇️ Fetch updated user info and update localStorage
                          const userRes = await fetch("/api/users");
                          const allUsers = await userRes.json();
                          const updatedUser = allUsers.data.find((u) => u._id === currentUser._id);
                          if (updatedUser) {
                            localStorage.setItem("user", JSON.stringify(updatedUser));
                            setCurrentUser(updatedUser); // opțional, dacă vrei să actualizezi și state-ul
                          }
                        }
                      }}
                    >
                      Accept
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Admin-only promote section */}
      {currentUser?.role === "admin" && (
        <div className="mt-10 p-4 flex flex-wrap justify-center gap-6">
          {users.map((user) => (
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
      )}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white flex justify-around py-3 border-t border-gray-700 z-50">
        <button onClick={() => router.push("/profile")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/profile_icon.jpg" alt="Profile" className="w-5 h-5 rounded-full" /> Profile
        </button>
        <button onClick={() => router.push("/feed")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/feed_icon.png" alt="Feed" className="w-5 h-5 rounded-full" /> Feed
        </button>
        <button onClick={() => router.push("/main")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/recipie_icon.jpg" alt="Recipes" className="w-5 h-5 rounded-full" /> Recipes
        </button>
        <button onClick={() => router.push("/map")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/map_icon.jpg" alt="Map" className="w-5 h-5 rounded-full" />Map
        </button>
        <button onClick={() => router.push("/cookaid")} className="flex items-center gap-2 text-sm hover:text-yellow-400">
          <img src="/AI_chat_icon.jpg" alt="CookAId" className="w-5 h-5 rounded-full" /> CookAId
        </button>
      </div>
    </div>
  );
};

export default RequestsPage;