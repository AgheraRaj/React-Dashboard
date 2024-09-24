import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import StackHolder from './components/StackHolder.jsx';
import Jobs from './components/Jobs.jsx';
import Skills from './components/Skills.jsx';
import Transaction from './components/Transaction.jsx';
import Layout from './Layout.jsx';

const router = createBrowserRouter([
  {
    path: '/', // Fixed path
    element: <Layout />,
    children: [
      { path: '', element: <Dashboard /> }, // For root page
      { path: 'stackholder', element: <StackHolder /> }, // Removed leading slash
      { path: 'jobs', element: <Jobs /> }, // Removed leading slash
      { path: 'skills', element: <Skills /> }, // Removed leading slash
      { path: 'transaction', element: <Transaction /> }, // Removed leading slash
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
