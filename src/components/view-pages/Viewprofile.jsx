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

  useEffect(() => {
    if (!username) {
      setError("No username provided.");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://192.168.0.156:3030/user_api/getUserByUsername/${username}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

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
      const response = await fetch(
        `http://192.168.0.156:3030/user_api/accept/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Accepted✅" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to accept");
      }

      const result = await response.json();
      setStatus(result.status);
    } catch (error) {
      console.error("Error accepting:", error.message);
    }
  };

  const handleRejection = async () => {
    setShowReasonInput(true); 
  };

  const submitRejectionReason = async () => {
    try {
      const response = await fetch(
        `http://192.168.0.156:3030/user_api/reject/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Rejected❌", reason: rejectionReason }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject");
      }

      const result = await response.json();
      setStatus(result.status);
      setShowReasonInput(false); 
    } catch (error) {
      console.error("Error rejecting:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="h-dvh flex justify-center items-center">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="h-dvh flex justify-center items-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-20 p-10 bg-white border border-gray-200 rounded-lg shadow-md text-center">
      {/* Profile Picture */}
      <img
        src={user.profilePicture}
        alt="Profile"
        className="w-24 h-24 mx-auto rounded-full"
      />

      <div className="mt-10">
        {/* User Name */}
        <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
        {/* User Details */}
        <p className="text-sm text-gray-600 mt-2">
          <strong>Role:</strong> {user.role}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Email:</strong> {user.email}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Phone:</strong> {user.phone}
        </p>
        <p className="text-sm text-gray-600">
          <strong>About:</strong> {user.about}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Status:</strong> {status || "Pending..."}
        </p>

        {/* Buttons */}
        <div className="space-x-5">
          <button className="mt-4 px-4 py-2 bg-indigo-700 text-white rounded">
            Edit Profile
          </button>
          <button
            onClick={handleAcception}
            className="mt-4 px-4 py-2 bg-green-700 text-white rounded"
          >
            Accept
          </button>
          <button
            onClick={handleRejection}
            className="mt-4 px-4 py-2 bg-red-700 text-white rounded"
          >
            Reject
          </button>
        </div>
      </div>

      {/* Reason Input Field */}
      {showReasonInput && (
        <div className="mt-8">
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter reason for rejection"
            className="w-full border border-gray-300 rounded-lg p-2"
          ></textarea>
          <button
            onClick={submitRejectionReason}
            className="mt-4 px-4 py-2 bg-indigo-700 text-white rounded"
          >
            Submit Reason
          </button>
        </div>
      )}
    </div>
  );
};

export default Viewprofile;
