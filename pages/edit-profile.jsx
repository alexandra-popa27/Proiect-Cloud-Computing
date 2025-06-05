import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const EditProfilePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    profilePicture: ""
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        profilePicture: user.profilePicture || ""
      });
    } else {
      router.push("/");
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange("profilePicture", reader.result); // base64 string
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Update failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(json.data));
      alert("Profile updated!");
      router.push("/profile");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="relative bg-beige min-h-screen overflow-y-auto pb-24">
      {/* Header */}
      <div className="relative h-96 overflow-hidden">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Edit Profile" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          Edit Profile
        </div>
      </div>

      {/* Form */}
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <div className="mb-4">
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Profile Picture</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {formData.profilePicture && (
            <img
              src={formData.profilePicture}
              alt="Preview"
              className="w-24 h-24 mt-3 rounded-full object-cover border"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Update Information
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
