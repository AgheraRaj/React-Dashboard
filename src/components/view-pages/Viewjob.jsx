import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Viewjob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { skillName } = location.state || {};

  useEffect(() => {
    if (!skillName) {
      setError("Skill name is missing");
      setLoading(false);
      return;
    }

    const fetchJobData = async () => {
      try {
        const token = sessionStorage.getItem("jwtToken"); // Retrieve JWT token

        if (!token) {
          throw new Error("No token found. Please log in again.");
        }

        const response = await fetch(
          `http://192.168.0.155:3030/jobs/job/skill/${skillName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [skillName]);

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-gray-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-red-700 bg-red-100 px-6 py-3 rounded-lg shadow">
          ⚠️ Error: {error}
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto my-10 p-6 h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 text-center">
        Job Listings for <span className="text-indigo-600">{skillName}</span>
      </h1>

      {jobs.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="p-5 border rounded-md shadow-md bg-gray-50 hover:shadow-lg transition-all"
            >
              <h2 className="text-lg font-bold text-indigo-700">{job.title}</h2>
              <p className="text-gray-600 mt-1">{job.description}</p>
              <div className="mt-3 text-sm text-gray-700">
                <p><strong>Amount:</strong> <span className="text-green-600">${job.amount}</span></p>
                <p><strong>Duration:</strong> {job.duration}</p>
              </div>
              <button className="mt-4 w-full bg-indigo-700 text-white py-2 rounded-md hover:bg-indigo-800 transition">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">No jobs available for this skill.</p>
      )}
    </div>
  );
};

export default Viewjob;
