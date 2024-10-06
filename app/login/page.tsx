"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `/api/doLogin?username=${username}&password=${password}`
      );
      const res = await response.json();

      if (response.ok) {
        if (res.code === 200) {
          const data = res.body;
          if (data) {
            localStorage.setItem("USER_INFO", JSON.stringify(data));
            router.push("/schedule");
          } else {
            throw new Error("Invalid response format");
          }
        } else {
          console.error(res.message);
          setError(res.message);
        }
      } else {
        console.error("Login failed:", res.message);
        setError(res.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Login failed. Please check your username and password.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-4">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Book your car easily and quickly!
        </p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="mb-4 border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 border border-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white py-2 rounded-lg w-full hover:bg-blue-600 transition duration-200 ease-in-out"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
