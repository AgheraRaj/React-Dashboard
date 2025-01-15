import { StrictMode} from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Login from "./components/authentication/Login";
import Dashboard from "./components/Dashboard";
import AllJobs from "./components/Jobs/AllJobs";
import Proposals from "./components/Jobs/Proposals";
import Contracts from "./components/Jobs/Contracts";
import Skills from "./components/Skills";
import AllTransactions from "./components/Transaction/AllTransactions";
import Invoice from "./components/Transaction/Invoice";
import Milestone from "./components/Transaction/Milestone";
import Employee from "./components/StackeHolder/Employee";
import Users from "./components/StackeHolder/Users";

let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";


const router = createBrowserRouter([
  {
    path: "/",
    element: isLoggedIn ? <App /> : <Login/>,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "jobs/alljobs", element: <AllJobs /> },
      { path: "jobs/proposals", element: <Proposals /> },
      { path: "jobs/contracts", element: <Contracts /> },
      { path: "skills", element: <Skills /> },
      { path: "transaction/alltransactions", element: <AllTransactions /> },
      { path: "transaction/invoice", element: <Invoice /> },
      { path: "transaction/milestone", element: <Milestone /> },
      { path: "StackHolder/employee", element: <Employee /> },
      { path: "StackHolder/users", element: <Users /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
