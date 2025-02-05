import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Viewjob = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { skillName } = location.state || {};

  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!skillName) {
      setError("Skill name is missing");
      setLoading(false);
      return;
    }

    const fetchJobData = async () => {
      try {
        const token = sessionStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("No token found. Please log in again.");
        }

        const response = await fetch(`${url}/jobs/job/skill/${skillName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

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
        Job Listings for <span className="text-indigo-700">{skillName}</span>
      </h1>

      {jobs.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, index) => (
            <Card key={index} className="bg-gray-50 border border-gray-200 shadow-md hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-indigo-700">{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{job.description}</p>
                <div className="mt-3 text-sm text-gray-700">
                  <p><strong>Amount:</strong> <span className="text-green-600">${job.amount}</span></p>
                  <p><strong>Duration:</strong> {job.duration}</p>
                </div>
                <Button className="mt-4 w-full bg-indigo-700 text-white hover:bg-indigo-800 transition">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">No jobs available for this skill.</p>
      )}
    </div>
  );
};

export default Viewjob;
