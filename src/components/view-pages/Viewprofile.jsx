import React, { useEffect, useState } from "react";

const Viewprofile = () => {
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1 234 567 890",
    about: "I am a web developer passionate about building modern web apps.",
    role: "Freelancer",
    status: "accepted✅",
    profilePicture:
      "https://img.freepik.com/free-vector/tiktok-profile-picture-template_742173-4482.jpg?t=st=1737694326~exp=1737697926~hmac=628706551f208884edfb4b02acf83a36c191c0f98ef6e6a77227b5dcf0780f49&w=740",
  };

//   const [user , setUser] = useState(null);
//   const [loading, setLoading] = useState(true); 
//   const [error, setError] = useState(null); 

//   useEffect(()=>{
//     const fetchUserData = async()=>{
//       try {
//         const response = await fetch("http://192.168.1.14:3030/user_api/getUserByusername/username");
//         if(!response){
//               throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         setUser(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//     }
//     }

//     fetchUserData();
//   },[])

// if (loading) {
//   return (
//     <div className="h-dvh flex justify-center items-center">Loading...</div>
//   );
// }

// if (error) {
//   return (
//     <div className="h-dvh flex justify-center items-center text-red-500">
//       Error: {error}
//     </div>
//   );
// }

  return (
    <div className="max-w-2xl mx-auto my-20 p-10 bg-white border border-gray-200 rounded-lg shadow-md text-center">
      {/* Profile Picture */}
      <img
        src={user.profilePicture}
        alt="Profile"
        className="w-24 h-24 mx-auto rounded-full absolute top-10 left-[565px]"
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
          <strong>About:</strong> {user.description}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Status:</strong> {user.status}
        </p>
        {/* Button */}
        <div className="space-x-5">
        <button className="mt-4 px-4 py-2 bg-indigo-700 text-white rounded">
          Edit Profile
        </button>
        <button className="mt-4 px-4 py-2 bg-green-700 text-white rounded">
          Acception
        </button>
        <button className="mt-4 px-4 py-2 bg-red-700 text-white rounded">
          Rejection
        </button>
        </div>
        
      </div>
    </div>
  );
};

export default Viewprofile;
