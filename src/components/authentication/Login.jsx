import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      alert("Login successful!");
      localStorage.setItem("isLoggedIn", "true");
      navigate("/"); 
      window.location.reload(); 
    } else {
      alert("Invalid credentials");
    }
  };


  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-indigo-700 text-white p-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
