import { createBrowserRouter } from 'react-router-dom';


import LandingPage from '../pages/shared/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleGuard from '../components/RoleGuard';
import StudentLayout from '../components/layout/StudentLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Define the application routes using React Router
export const router = createBrowserRouter([
  // Define the root route

  // the landing page
  { path: '/', element: <LandingPage /> },

  // the login pages
  { path: '/login', element: <LoginPage /> },

  // the register page
  { path: '/register', element: <RegisterPage /> },

  // the protected routes
  {
    // if the user is authenticated, render the child routes
    element: <ProtectedRoute />,
    children: [
      {
        // the student routes
        element: <RoleGuard role="student" />,
        children: [
          {
            path: '/student',
            element: <StudentLayout />,
            children: [
              
            ],
          },
        ],
      },
      {
        // the admin routes
        element: <RoleGuard role="admin" />,
        children: [
          {
            path: '/admin',
            element: <AdminLayout />,
            children: [
             
            ],
          },
        ],
      },
    ],
  },
]);
