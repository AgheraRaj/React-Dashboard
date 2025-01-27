import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Viewjob = () => {

  const [jobs, setJobs] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { skillName } = location.state || {};

  useEffect(() => {
    const fetchJobData = async () => {
  
      try {
        const response = await fetch(`http://192.168.0.155:3030/jobs/job/skill/${skillName}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Jobs data:", data);  
        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          setError("Expected an array of jobs, but received something else");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (skillName) {
      fetchJobData();
    } else {
      setError("Skill name is missing");
      setLoading(false);
    }
  }, [skillName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="mx-14 my-12">
      <h1 className="text-2xl font-bold text-indigo-700">Jobs for Skill: {skillName}</h1>
      <p>Details about the jobs are displayed below.</p>

      {jobs.length > 0 ? (
        jobs.map((job, index) => (
          <div key={index} className="h-auto border border-indigo-700 rounded flex flex-col justify-center my-10 px-10 py-5 bg-indigo-50">
            <span className="text-indigo-700 font-semibold text-xl">
              Title: {job.title}
            </span>
            <span className="text-gray-600">Description: {job.description}</span>
            <span className="text-gray-600">Amount: ${job.amount}</span>
            <span className="text-gray-600">Duration: {job.duration}</span>
          </div>
        ))
      ) : (
        <p>No jobs available for this skill.</p>
      )}
    </div>
  );
};

export default Viewjob;
