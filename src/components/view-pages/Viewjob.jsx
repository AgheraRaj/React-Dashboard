import React from "react";

const Viewjob = () => {
  return (
    <div className="mx-14 my-12">
      <h1 className="text-2xl font-bold text-indigo-700">View Job</h1>
      <p>Details about the job will be displayed here.</p>

      <div className="h-[150px] border border-indigo-700 rounded flex flex-col justify-center my-10 px-10 bg-indigo-50">
        <span className="text-indigo-700 font-semibold text-xl">Title:</span>
        <span className="text-gray-600">Description:</span>
        <span className="text-gray-600">Amount:</span>
        <span className="text-gray-600">Time:</span>
      </div>
    </div>
  );
};

export default Viewjob;
