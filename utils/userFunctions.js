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