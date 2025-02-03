import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Viewprofile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const location = useLocation();
  const { username } = location.state || {};
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!username) {
      setError("No username provided.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found. Please login again.");

        const response = await fetch(
          `${url}/user_api/getUserByUsername/${username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setUser(data);
        setStatus(data.status);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const handleAcception = async () => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found. Please login again.");

      const response = await fetch(
        `${url}/user_api/accept/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Accepted✅" }),
        }
      );

      if (!response.ok) throw new Error("Failed to accept");

      const result = await response.json();
      setStatus(result.status);
    } catch (error) {
      console.error("Error accepting:", error.message);
    }
  };

  const handleRejection = () => {
    setShowReasonInput(true);
  };

  const submitRejectionReason = async () => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found. Please login again.");

      const response = await fetch(
        `${url}/user_api/reject/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: rejectionReason
        }
      );

      if (!response.ok) throw new Error("Failed to reject");

      const result = await response.json();
      setStatus(result.status);
      setShowReasonInput(false);
    } catch (error) {
      console.error("Error rejecting:", error.message);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-gray-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-red-700 bg-red-100 px-6 py-3 rounded-lg shadow">⚠️ Error: {error}</div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto my-20 p-10 bg-white border border-gray-200 rounded-lg shadow-md text-center">
      <img src={user?.profilePicture || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg=="} alt="Profile" className="w-24 h-24 mx-auto rounded-full" />
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800">{user?.username}</h2>
        <p className="text-sm text-gray-600 mt-2"><strong>Role:</strong> {user?.role}</p>
        <p className="text-sm text-gray-600"><strong>Email:</strong> {user?.email}</p>
        <p className="text-sm text-gray-600"><strong>Phone:</strong> {user?.phone}</p>
        <p className="text-sm text-gray-600"><strong>About:</strong> {user?.about}</p>
        <p className="text-sm text-gray-600"><strong>Status:</strong> {status || "Pending..."}</p>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button className="px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-800 transition">Edit Profile</button>
          <button onClick={handleAcception} className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition">Accept</button>
          <button onClick={handleRejection} className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition">Reject</button>
        </div>
      </div>
      {showReasonInput && (
        <div className="mt-8">
          <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Enter reason for rejection" className="w-full border border-gray-300 rounded-lg p-2"></textarea>
          <button onClick={submitRejectionReason} className="mt-4 px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-800 transition">Submit Reason</button>
        </div>
      )}
    </div>
  );
};

export default Viewprofile;
