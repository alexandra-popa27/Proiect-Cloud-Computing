import React, { useState } from "react";
import { useRouter } from "next/router";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
  
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const json = await res.json();
  
      if (!res.ok) {
        alert(json.error || "Login failed.");
        return;
      }

      //save user in localStorage
      localStorage.setItem("user", JSON.stringify(json.data));
  
      alert(`Welcome, ${json.data.name}!`);
      router.push("/main");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-beige flex flex-col">
      {/* Background cu text overlay */}
      <div className="relative h-60 overflow-hidden p-4">
        <img className="absolute inset-0 w-full h-full object-cover" src="/cooking.jpg" alt="Login Background" />
        <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold tracking-tight text-center">
          Welcome to The Cooking Hub
        </div>
      </div>

      {/* Conținut Login + Register */}
      <div className="flex flex-col md:flex-row justify-center gap-12 px-6 py-12">
        {/* Login */}
        <div className="w-full md:w-1/2 max-w-md bg-white p-6 rounded-xl shadow-md dark:bg-gray-800">
          <h2 className="text-2xl font-semibold text-center mb-6 dark:text-white">Login</h2>

          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-2 text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 dark:text-white dark:border-gray-600 dark:focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-6 relative">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-2 text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 dark:text-white dark:border-gray-600 dark:focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-9 text-xs text-blue-600 hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleLogin}
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Login
            </button>
          </div>
        </div>

        {/* Register */}
        <div className="w-full md:w-1/2 max-w-md bg-white p-6 rounded-xl shadow-md dark:bg-gray-800 flex flex-col justify-center items-center">
          <h2 className="text-xl font-medium text-center text-gray-700 mb-4 dark:text-white">
            You do not have an account? <br /> Register here for unlimited cooking ideas!
          </h2>
          <button
            type="button"
            onClick={handleRegisterRedirect}
            className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;