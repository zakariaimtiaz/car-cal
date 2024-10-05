"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState("1018");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://devs.apps.friendship.ngo:8080/appsvault-api/user/get-by-username-password?appsId=2&username=" +
          username +
          "&password=" +
          password,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "V2kGIwEJs4oko7aXfYJiq8WzVnwEOC9oKzMobU16M4zj0fMLQlwcxpt0uT8a2096YmrTJzgc9j7IRDMWTJfXSEZQ4mpldesy",
          },
        }
      );

      // Read the response body once
      const responseBody = await response.text(); // Read response as text first
      // Check if the response is successful
      if (response.ok) {
        const res = JSON.parse(responseBody); // Parse the response body as JSON
        if (res.code == 200) {
          // Check if the body contains the necessary data
          const data = res.body;
          if (data) {
            console.log(JSON.stringify(data));
            // Store user information in localStorage
            localStorage.setItem("USER_INFO", JSON.stringify(data));
            router.push("/schedule"); // Redirect to schedule page on successful login
          } else {
            throw new Error("Invalid response format"); // Custom error for unexpected response structure
          }
        } else {
          console.error(res.message); // Log the error message
          setError(res.message); // Set error message
        }
      } else {
        // Handle the case where the response is not ok
        console.error("Login failed:", responseBody); // Log the error message
        setError("Login failed. Please check your username and password."); // Set error message
      }
    } catch (error) {
      console.error("Error during login:", error); // Log the error
      setError("Login failed. Please check your username and password."); // Show a generic error message
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-4 border rounded bg-green-200">
        <h2 className="text-2xl mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="mb-2 border rounded w-full p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 border rounded w-full p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
