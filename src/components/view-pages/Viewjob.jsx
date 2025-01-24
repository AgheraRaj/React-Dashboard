import React, { useEffect, useState } from "react";

const Viewjob = () => {
  const [job, setJob] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await fetch("https://example.com/api/job/1"); 
        if (!response.ok) {
          throw new Error("Failed to fetch job data");
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="mx-14 my-12">
      <h1 className="text-2xl font-bold text-indigo-700">View Job</h1>
      <p>Details about the job are displayed below.</p>

      <div className="h-auto border border-indigo-700 rounded flex flex-col justify-center my-10 px-10 py-5 bg-indigo-50">
        <span className="text-indigo-700 font-semibold text-xl">
          Title: {job.title}
        </span>
        <span className="text-gray-600">Description: {job.description}</span>
        <span className="text-gray-600">Amount: ${job.amount}</span>
        <span className="text-gray-600">Time: {job.time}</span>
      </div>
    </div>
  );
};

export default Viewjob;

