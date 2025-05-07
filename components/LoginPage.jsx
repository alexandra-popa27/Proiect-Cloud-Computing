import React from "react";
import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/");
  };

  return (
    <div className="relative bg-beige p-4 h-screen">
      {/* Imagine + overlay text */}
      <div className="relative h-96 overflow-hidden p-4">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Login Background" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          Welcome to The Cooking Hub
        </div>
      </div>

      {/* Buton de login */}
      <div className="p-4 flex justify-center mt-10">
        <button
          type="button"
          onClick={handleLogin}
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Enter the Cooking Hub
        </button>
      </div>
    </div>
  );
};

export default LoginPage;