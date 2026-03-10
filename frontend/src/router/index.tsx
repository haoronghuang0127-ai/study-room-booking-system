import { createBrowserRouter } from 'react-router-dom';


import LandingPage from '../pages/shared/LandingPage';

// Define the application routes using React Router
export const router = createBrowserRouter([
  // Define the root route

  // the landing page
  { path: '/', element: <LandingPage /> },



]);
