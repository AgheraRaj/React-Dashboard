import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Pencil, CheckCircle, XCircle } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "../ui/input";

const Viewprofile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profile: {
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      experience: "",
      certification: "",
      education: "",
      description: "",
      bank: {
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
      },
    },
    skills: [],
  });
  const location = useLocation();
  const id = location.state?.id || null
  const username = location.state?.username || null;
  const url = import.meta.env.VITE_API_URL;

  const rejectionInputRef = useRef(null);

  useEffect(() => {
    if (!username) return;
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found. Please login again.");
        const response = await fetch(`${url}/user_api/getUserByUsername/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setUser(data);
        setStatus(data.status);
        setFormData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [username]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rejectionInputRef.current && !rejectionInputRef.current.contains(event.target)) {
        setShowReasonInput(false);
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    setFormData((prevData) => {
      const newData = { ...prevData };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found. Please login again.");
      const response = await fetch(`${url}/user_api/updateUser/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, username }),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error.message);
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
    <div className="container py-10 max-w-4xl mx-auto my-20 p-8 bg-white border border-gray-200 rounded-lg shadow-md">
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
            {!isEditing ? (
              <Button onClick={handleEditClick} className="px-4 py-2 flex items-center gap-2 bg-white text-black border border-black rounded hover:bg-black hover:text-white transition">
                <Pencil size={18} />
                Edit Profile
              </Button>
            ) : (
              <form onSubmit={handleSubmit}>
                <Button type="submit" className="px-4 py-2 flex items-center gap-2 bg-white text-black border border-black rounded hover:bg-black hover:text-white transition">
                  Save Changes
                </Button>
              </form>
            )}
            {status !== "Accepted✅" && (
              <>
                <Button
                  onClick={handleAcception}
                  className="px-4 py-2 flex items-center gap-2 bg-white text-green-700 border border-green-700 rounded hover:bg-green-700 hover:text-white transition"
                >
                  <CheckCircle size={18} />
                  Accept
                </Button>

                <Button onClick={handleRejection} className="px-4 py-2 flex items-center gap-2 bg-white text-red-700 border border-red-700 rounded hover:bg-red-700 hover:text-white transition">
                  <XCircle size={18} />
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
        {/* Personal Information */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="space-y-2">
            <Label className="block text-sm text-gray-600">
              <strong>Name: </strong>
              {isEditing ? (
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              ) : (
                `${user?.firstName || ""} ${user?.lastName || ""}`
              )}
            </Label>
            <Label className="block text-sm text-gray-600">
              <strong>Email: </strong>
              {isEditing ? (
                <Input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              ) : (
                user?.email || "N/A"
              )}
            </Label>
            <Label className="block text-sm text-gray-600">
              <strong>Phone: </strong>
              {isEditing ? (
                <Input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              ) : (
                user?.phone || "N/A"
              )}
            </Label>
            <Label className="block text-sm text-gray-600">
              <strong>Address: </strong>
              {isEditing ? (
                <Input
                  type="text"
                  name="profile.address"
                  value={formData.profile?.address || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              ) : (
                user?.profile?.address || "N/A"
              )}
            </Label>
            <Label className="block text-sm text-gray-600">
              <strong>City: </strong>
              {isEditing ? (
                <Input
                  type="text"
                  name="profile.city"
                  value={formData.profile?.city || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              ) : (
                user?.profile?.city || "N/A"
              )}
            </Label>
            <Label className="block text-sm text-gray-600">
              <strong>State: </strong>
              {isEditing ? (
                <Input
                  type="text"
                  name="profile.state"
                  value={formData.profile?.state || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              ) : (
                user?.profile?.state || "N/A"
              )}
            </Label>
            <Label className="block text-sm text-gray-600">
              <strong>Country: </strong>
              {isEditing ? (
                <Input
                  type="text"
                  name="profile.country"
                  value={formData.profile?.country || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              ) : (
                user?.profile?.country || "N/A"
              )}
            </Label>
            <Label className="block text-sm text-gray-600">
              <strong>ZipCode: </strong>
              {isEditing ? (
                <Input
                  type="number"
                  name="profile.zipCode"
                  value={formData.profile?.zipCode || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              ) : (
                user?.profile?.zipCode || "N/A"
              )}
            </Label>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h3>
          <div className="space-y-2">
            <Label className="block text-sm text-gray-600">
              <strong>Skills: </strong>
              {isEditing ? (
                <Input
                  type="text"
                  name="skills"
                  value={(formData.skills || []).join(", ")}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              ) : (
                user?.skills?.join(", ") || "N/A"
              )}
            </Label>
            <Label className="block text-sm text-gray-600">
              <strong>Experience: </strong>
              {isEditing ? (
                <Input
                  type="text"
                  name="profile.experience"
                  value={formData.profile?.experience || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              ) : (
                user?.profile?.experience || "N/A"
              )}
            </Label>
            <Label className="block text-sm text-gray-600">
              <strong>Certification: </strong>
              {isEditing ? (
                <Input
                  type="text"
                  name="profile.certification"
                  value={formData.profile?.certification || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              ) : (
                user?.profile?.certification || "N/A"
              )}
            </Label>
            <Label className="block text-sm text-gray-600">
              <strong>Education: </strong>
              {isEditing ? (
                <Input
                  type="text"
                  name="profile.education"
                  value={formData.profile?.education || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              ) : (
                user?.profile?.education || "N/A"
              )}
            </Label>
            <Label className="block text-sm text-gray-600">
              <strong>Description: </strong>
              {isEditing ? (
                <Input
                  type="text"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              ) : (
                user?.description || "N/A"
              )}
            </Label>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Bank Details</h3>
        <div className="space-y-2">
          <Label className="block text-sm text-gray-600">
            <strong>Account Holder Name: </strong>
            {isEditing ? (
              <Input
                type="text"
                name="profile.bank.accountHolderName"
                value={formData.profile?.bank?.accountHolderName || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 mt-1"
              />
            ) : (
              user?.profile?.bank?.accountHolderName || "N/A"
            )}
          </Label>
          <Label className="block text-sm text-gray-600">
            <strong>Account Number: </strong>
            {isEditing ? (
              <Input
                type="text"
                name="profile.bank.accountNumber"
                value={formData.profile?.bank?.accountNumber || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 mt-1"
              />
            ) : (
              user?.profile?.bank?.accountNumber || "N/A"
            )}
          </Label>
          <Label className="block text-sm text-gray-600">
            <strong>IFSC Code: </strong>
            {isEditing ? (
              <Input
                type="text"
                name="profile.bank.ifscCode"
                value={formData.profile?.bank?.ifscCode || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 mt-1"
              />
            ) : (
              user?.profile?.bank?.ifscCode || "N/A"
            )}
          </Label>
          <Label className="block text-sm text-gray-600">
            <strong>Bank Name: </strong>
            {isEditing ? (
              <Input
                type="text"
                name="profile.bank.bankName"
                value={formData.profile?.bank?.bankName || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 mt-1"
              />
            ) : (
              user?.profile?.bank?.bankName || "N/A"
            )}
          </Label>
        </div>
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
            className="px-4 py-2 bg-white text-red-700 border border-red-700 rounded hover:bg-red-700 hover:text-white transition"
          >
            Submit Reason
          </Button>
        </div>
      )}
    </div>
  );
};

export default Viewprofile;