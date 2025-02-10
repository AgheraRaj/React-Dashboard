import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Login from "./components/authentication/Login";
import Dashboard from "./components/Dashboard";
import AllJobs from "./components/Jobs/AllJobs";
import Contracts from "./components/Jobs/Contracts";
import Skills from "./components/Skills";
import AllTransactions from "./components/Transaction/AllTransactions";
import Invoice from "./components/Transaction/Invoice";
import Milestone from "./components/Transaction/Milestone";
import Employee from "./components/StackeHolder/Employee";
import Users from "./components/StackeHolder/Users";
import Viewjob from "./components/view-pages/Viewjob";
import Viewprofile from "./components/view-pages/Viewprofile";
import ProposalsDetails from "./components/view-pages/ProposalsDetails";

let isLoggedIn = sessionStorage.getItem("jwtToken");

const router = createBrowserRouter([
  {
    path: "/",
    element: isLoggedIn ? <App /> : <Login />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "jobs/alljobs", element: <AllJobs /> },
      { path: "jobs/contracts", element: <Contracts /> },
      {
        path: "skills",
        element: <Skills />,
      },
      { path: "proposalsdetails", element: <ProposalsDetails/>},
      { path: "skills/viewjob", element: <Viewjob /> }, 
      { path: "transaction/alltransactions", element: <AllTransactions /> },
      { path: "transaction/invoice", element: <Invoice /> },
      { path: "transaction/milestone", element: <Milestone /> },
      { path: "StackHolder/employee", element: <Employee /> },
      { path: "StackHolder/users", element: <Users /> },
      {path: "StackHolder/users/viewprofile", element: <Viewprofile/>}
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
