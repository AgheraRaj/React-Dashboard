import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react"; 
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;

  const handleLogin = async () => {
    try {
      const response = await fetch(`${url}/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const token = data.token;

      if (token) {
        sessionStorage.setItem("jwtToken", token);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {/* Card Component */}
      <Card className="w-full max-w-md">
        {/* Card Header */}
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="space-y-5">
          {/* Username Field */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="johndoe123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Field with Eye Icon */}
          <div className="flex flex-col space-y-1.5 relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Eye Icon */}
            <button
              type="button"
              className="absolute right-3 top-8 transform -translate-y-1/2"
              onClick={() => setShowPassword((prev) => !prev)} // Toggle password visibility
            >
              {showPassword ? (
                <Eye size={20} className="text-black" /> 
              ) : (
                <EyeOff size={20} className="text-black" /> 
              )}
            </button>
          </div>
        </CardContent>

        {/* Card Footer */}
        <CardFooter className="flex justify-center">
          <Button onClick={handleLogin} className="w-full  bg-white text-black border border-black rounded hover:bg-black hover:text-white">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;