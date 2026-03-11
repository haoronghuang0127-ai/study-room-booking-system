import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Component to protect routes based on user role
export default function RoleGuard({ role }: { role: 'student' | 'admin' }) {
  // Get the user information from the AuthContext
  const { user } = useAuth();

  // If there is no user or the user's role does not match the required role, redirect to the appropriate page
  if (!user){
    return <Navigate to="/login" replace />;
  }

  // If the user's role does not match the required role, redirect to the home page
  if (user.role !== role){
    return <Navigate to="/" replace />;
  }

  // If the user's role matches the required role, render the child routes
  return <Outlet />;
}
