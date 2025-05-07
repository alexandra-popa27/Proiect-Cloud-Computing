import React, { useState } from "react";

const RegisterForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    checkChef: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      {/* Background cu text overlay */}
      <div className="relative h-60 overflow-hidden p-4">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Register Background" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          Create your Cooking Hub account
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8 dark:bg-gray-800">
        <div className="mb-5">
          <input
            type="text"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="block w-full py-2.5 px-0 text-sm border-b-2 bg-transparent focus:outline-none focus:border-blue-600"
            required
          />
        </div>
        <div className="mb-5">
          <input
            type="tel"
            placeholder="Your phone number"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="block w-full py-2.5 px-0 text-sm border-b-2 bg-transparent focus:outline-none focus:border-blue-600"
            required
          />
        </div>
        <div className="mb-5">
          <input
            type="email"
            placeholder="Your email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="block w-full py-2.5 px-0 text-sm border-b-2 bg-transparent focus:outline-none focus:border-blue-600"
            required
          />
        </div>
        <div className="mb-5 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="block w-full py-2.5 px-0 text-sm border-b-2 bg-transparent focus:outline-none focus:border-blue-600"
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-xs text-blue-600 hover:underline">
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="mb-5 relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            className="block w-full py-2.5 px-0 text-sm border-b-2 bg-transparent focus:outline-none focus:border-blue-600"
            required
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-2 text-xs text-blue-600 hover:underline">
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
        <div className="mb-5 flex items-start">
          <input
            type="checkbox"
            id="checkChef"
            checked={formData.checkChef}
            onChange={(e) => handleChange("checkChef", e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="checkChef" className="ml-2 text-sm">
            If you are joining this platform as a professional chef, please check this box. Please be informed you will be verified by one of our administrators.
          </label>
        </div>
        <div className="flex justify-center gap-4">
          <button type="button" onClick={onCancel} className="text-white bg-orange-500 px-5 py-2 rounded-lg">
            Cancel
          </button>
          <button type="button" onClick={() => onSubmit(formData)} className="text-white bg-green-600 px-5 py-2 rounded-lg">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;