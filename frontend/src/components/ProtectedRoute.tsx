import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from './LoadingScreen';

export default function ProtectedRoute() {
  // Get the authentication status and loading state from the AuthContext
  const { isAuthenticated, loading } = useAuth();

  // Get the current location to redirect back after successful login
  const location = useLocation();
  
  // If the authentication status is still being checked, show a loading screen
  if (loading){
    return <LoadingScreen text="Checking session..." />;
  }

  // If the user is not authenticated, redirect to the login page, preserving the current location in state
  if (!isAuthenticated){
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If the user is authenticated, render the child routes
  return <Outlet />;
}