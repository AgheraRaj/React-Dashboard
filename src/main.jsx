import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import Skills from './components/Skills.jsx';
import Employee from './components/StackeHolder/Employee.jsx';
import Users from './components/StackeHolder/Users.jsx';
import AllJobs from './components/Jobs/AllJobs';
import Proposals from './components/Jobs/Proposals';
import Contracts from './components/Jobs/Contracts';
import Invoice from './components/Transaction/Invoice';
import Milestone from './components/Transaction/Milestone';
import AllTransactions from './components/Transaction/AllTransactions';
import App from './App';


const router = createBrowserRouter([
  {
    path: '', 
    element: <App />,
    children: [
      { path: '', element: <Dashboard /> }, 
      { path: 'jobs/alljobs', element: <AllJobs /> }, 
      { path: 'jobs/proposals', element: <Proposals /> },
      { path: 'jobs/contracts', element: <Contracts /> },
      { path: 'skills', element: <Skills /> },
      { path: 'transaction/alltransactions', element: <AllTransactions /> }, 
      { path: 'transaction/invoice', element: <Invoice /> },
      { path: 'transaction/milestone', element: <Milestone /> },
      { path: '/StackHolder/employee', element: <Employee/> }, 
      { path: '/StackHolder/users', element: <Users/> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
