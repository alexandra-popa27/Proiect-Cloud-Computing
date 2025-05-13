export const getChefRequests = async () => {
    try {
      const response = await fetch("/api/requests", { method: "GET" });
      const data = await response.json();
  
      if (!data?.data) return [];
      return data.data;
    } catch (error) {
      console.error("Error fetching chef requests:", error);
      return [];
    }
  };
  
  export const promoteUser = async (id) => {
    try {
      const response = await fetch("/api/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error promoting user:", error);
      return { error: "Promotion failed" };
    }
  };

  export const getAllUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const json = await response.json();
      if (!json?.data || !Array.isArray(json.data)) return [];
      return json.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
  };

  export const sendFriendRequest = async (requesterId, receiverId) => {
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requesterId, receiverId }),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to send friend request:", err);
      return { error: true };
    }
  };

  export const getFriendRequests = async (receiverId) => {
    try {
      const res = await fetch(`/api/friends?receiverId=${receiverId}`);
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.error("Failed to fetch friend requests:", err);
      return [];
    }
  };
  
  export const acceptFriendRequest = async (requestId) => {
    try {
      const res = await fetch("/api/friends", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      return await res.json();
    } catch (err) {
      console.error("Failed to accept friend request:", err);
      return { error: true };
    }
  };