import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Pencil, CheckCircle, XCircle } from "lucide-react";

const Viewprofile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const location = useLocation();
  const username = location.state?.username || null;
  const url = import.meta.env.VITE_API_URL;

  // Ref for rejection input container
  const rejectionInputRef = useRef(null);

  useEffect(() => {
    if (!username) return;
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
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

  // Handle clicking outside the rejection input field
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        rejectionInputRef.current &&
        !rejectionInputRef.current.contains(event.target)
      ) {
        setShowReasonInput(false); // Hide the rejection input field
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAcception = async () => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found. Please login again.");
      const response = await fetch(`${url}/user_api/accept/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Accepted✅" }),
      });
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
      const response = await fetch(`${url}/user_api/reject/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rejectionReason }),
      });
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
    <div className="max-w-4xl mx-auto my-20 p-8 bg-white border border-gray-200 rounded-lg shadow-md">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <img
          src={user?.profilePicture || "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
        />
        <div className="text-left">
          <h2 className="text-3xl font-bold text-gray-800">{`${user?.firstName || ""} ${user?.lastName || ""}`}</h2>
          <p className="text-sm text-gray-600 mt-2"><strong>Status:</strong> {status || "Pending..."}</p>
          <div className="flex gap-3 mt-4">
            <Button
              className="px-4 py-2 flex items-center gap-2 bg-white text-black border border-black rounded hover:bg-black hover:text-white transition"
            >
              <Pencil size={18} />
              Edit Profile
            </Button>
            {status !== "Accepted✅" && (
              <>
                <Button
                  onClick={handleAcception}
                  className="px-4 py-2 flex items-center gap-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
                >
                  <CheckCircle size={18} />
                  Accept
                </Button>
                <Button
                  onClick={handleRejection}
                  className="px-4 py-2 flex items-center gap-2 bg-red-700 text-white rounded hover:bg-red-800 transition"
                >
                  <XCircle size={18} />
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
          <p className="text-sm text-gray-600"><strong>Name:</strong> {`${user?.firstName || ""} ${user?.lastName || ""}`}</p>
          <p className="text-sm text-gray-600"><strong>Email:</strong> {user?.email || "N/A"}</p>
          <p className="text-sm text-gray-600"><strong>Phone:</strong> {user?.phone || "N/A"}</p>
          <p className="text-sm text-gray-600"><strong>Address:</strong> {user?.profile?.address || "N/A"}</p>
          <p className="text-sm text-gray-600"><strong>City:</strong> {user?.profile?.city || "N/A"}</p>
          <p className="text-sm text-gray-600"><strong>State:</strong> {user?.profile?.state || "N/A"}</p>
          <p className="text-sm text-gray-600"><strong>Country:</strong> {user?.profile?.country || "N/A"}</p>
          <p className="text-sm text-gray-600"><strong>Zip Code:</strong> {user?.profile?.zipCode || "N/A"}</p>
        </div>

        {/* Professional Information */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h3>
          <p className="text-sm text-gray-600"><strong>Skills:</strong> {user?.skills?.join(", ") || "N/A"}</p>
          <p className="text-sm text-gray-600"><strong>Experience:</strong> {user?.profile?.experience || "N/A"}</p>
          <p className="text-sm text-gray-600"><strong>Certifications:</strong> {user?.profile?.certification || "N/A"}</p>
          <p className="text-sm text-gray-600"><strong>Education:</strong> {user?.profile?.education || "N/A"}</p>
          <p className="text-sm text-gray-600"><strong>About:</strong> {user?.description || "N/A"}</p>
        </div>
      </div>

      {/* Bank Details */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Bank Details</h3>
        <p className="text-sm text-gray-600"><strong>Account Holder Name:</strong> {user?.profile?.bank?.accountHolderName || "N/A"}</p>
        <p className="text-sm text-gray-600"><strong>Account Number:</strong> {user?.profile?.bank?.accountNumber || "N/A"}</p>
        <p className="text-sm text-gray-600"><strong>IFSC Code:</strong> {user?.profile?.bank?.ifscCode || "N/A"}</p>
        <p className="text-sm text-gray-600"><strong>Bank Name:</strong> {user?.profile?.bank?.bankName || "N/A"}</p>
      </div>

      {/* Rejection Reason Input */}
      {showReasonInput && (
        <div ref={rejectionInputRef} className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Reason for Rejection</h3>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter reason for rejection"
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          ></textarea>
          <Button
            onClick={submitRejectionReason}
            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition"
          >
            Submit Reason
          </Button>
        </div>
      )}
    </div>
  );
};

export default Viewprofile;