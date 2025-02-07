import Chart from "./Chart";

const Dashboard = () => {
  return (
    <div className="flex flex-col space-y-6 py-12 px-14">
      <h2 className="text-2xl font-bold ">Dashboard</h2>

      <div className="flex space-x-8">
        <div className="w-2/5 h-[150px] border border-black rounded flex flex-col justify-center p-4 bg-gray-100">
          <span className="font-semibold">Tasks Completed</span>
          <span className="text-gray-600">Count: 75</span>
        </div>

        <div className="w-2/5 h-[150px] border border-black rounded flex flex-col justify-center p-4 bg-gray-100">
          <span className=" font-semibold">Ongoing Tasks</span>
          <span className="text-gray-600">Count: 20</span>
        </div>
      </div>

      <div className="flex flex-col w-4/5 space-y-4">
        <h2 className="text-xl font-semibold">Performance Chart</h2>
        <Chart className="w-4/5" />
      </div>

      {/* <div className="flex space-x-8">
        <div className="w-2/5 h-[150px] border border-indigo-700 rounded flex flex-col justify-center p-4 bg-indigo-50">
          <span className="text-indigo-700 font-semibold">Recent Activity</span>
          <ul className="mt-4 list-disc list-inside">
            <li>You submitted a report on time</li>
          </ul>
        </div>

        <div className="w-2/5 h-[150px] border border-indigo-700 rounded flex flex-col justify-center p-4 bg-indigo-50">
          <span className="text-indigo-700 font-semibold">Upcoming Deadlines</span>
          <ul className="mt-4 list-disc list-inside">
            <li>Project Review: Jan 25</li>
          </ul>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;