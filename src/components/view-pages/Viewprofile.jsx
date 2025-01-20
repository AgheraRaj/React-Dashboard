import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input"; // Assuming this component exists for form inputs
import { Button } from "../ui/button"; // Assuming button component exists

const ViewProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetching user data, simulating with mock data for now
    const fetchProfileData = () => {
      const mockProfileData = {
        username: "Your Fiverr Name",
        handle: "@harshllmalavla",
        location: "India",
        joinedDate: "June 2021",
        preferredLanguages: "English, Hindi",
        preferredWorkingHours: "9 AM - 6 PM",
        profileImageUrl:
          "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=", // Profile image URL
        bannerImageUrl:
          "https://png.pngtree.com/thumb_back/fh260/back_our/20190625/ourmid/pngtree-simple-small-fresh-watercolor-company-profile-ppt-background-image_260406.jpg", // Banner image URL
        profileCompletion: 10, // Profile completion progress in percentage
      };

      setProfile(mockProfileData);
    };

    fetchProfileData();
  }, []);

  if (!profile) {
    return <div>Loading...</div>; // Add loading state
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Profile Banner */}
      <div className="relative">
        <img
          src={profile.bannerImageUrl}
          alt="Banner"
          className="w-full h-60 object-cover rounded-lg"
        />
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
          <img
            src={profile.profileImageUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-32 space-y-4">
        <h1 className="text-3xl font-semibold text-indigo-700">
          {profile.username}
        </h1>
        <p className="text-lg text-gray-600">{profile.handle}</p>
        <p className="text-sm text-gray-500">Located in {profile.location}</p>
        <p className="text-sm text-gray-500">Joined in {profile.joinedDate}</p>

        <div className="space-y-2 mt-6">
          <h3 className="text-xl font-semibold">Preferred Languages</h3>
          <p className="text-sm">{profile.preferredLanguages}</p>
        </div>

        <div className="space-y-2 mt-6">
          <h3 className="text-xl font-semibold">Preferred Working Hours</h3>
          <p className="text-sm">{profile.preferredWorkingHours}</p>
        </div>

        {/* Profile Completion Progress */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Profile Completion</h3>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-indigo-500 h-2 rounded-full"
              style={{ width: `${profile.profileCompletion}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {profile.profileCompletion}% completed
          </p>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 mt-6">
          <Button
            variant="primary"
            className="bg-indigo-700 text-white hover:bg-indigo-800 transition-colors duration-300"
          >
            Edit Profile
          </Button>
          <Button
            variant="secondary"
            className="bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors duration-300"
          >
            Preview Public Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
