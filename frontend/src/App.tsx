// Context provider for authentication state
import { AuthProvider } from './contexts/AuthContext';

// sets up the router for the application
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}