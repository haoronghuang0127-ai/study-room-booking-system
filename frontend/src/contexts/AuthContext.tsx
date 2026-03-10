/*
createContext is used to create a context object that can be shared across components without prop drilling.

useContext is a hook that allows components to consume the context value provided by a Context.Provider.

useEffect is a hook that allows you to perform side effects in function components, such as fetching data 
or subscribing to events.

useMemo is a hook that memoizes a value, recomputing it only when its dependencies change, 
which can help optimize performance by avoiding unnecessary calculations.

useState is a hook that allows you to add state to function components, 
providing a way to manage and update stateful values.
*/
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { fetchCurrentUser, loginUser, registerUser } from '../api/auth';
import type { LoginPayload, RegisterPayload, User } from '../types';

import { clearTokens, getAccessToken, getStoredUser, setStoredUser, setTokens } from '../utils/auth';

interface AuthContextValue {
  user: User | null; // The currently authenticated user, or null if not authenticated
  loading: boolean; // Indicates whether the authentication status is being checked 
  isAuthenticated: boolean; // A boolean indicating if the user is authenticated 
  login: (payload: LoginPayload) => Promise<void>; // Function to log in 
  register: (payload: RegisterPayload) => Promise<void>; // Function to register a new user
  logout: () => void; // Function to log out the user
  refreshProfile: () => Promise<void>; // Function to refresh the user's profile information from the server
}

// Create the AuthContext with an undefined default value
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    const profile = await fetchCurrentUser();
    setUser(profile);
    setStoredUser(profile);
  };

  useEffect(() => {
    const init = async () => {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await refreshProfile();
      } catch {
        clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, []);

  // Function to log in
  const login = async (payload: LoginPayload) => {
    // Call the login function from the API and get the access and refresh tokens
    const tokens = await loginUser(payload);
    // Set the access and refresh tokens in localStorage
    setTokens(tokens.access, tokens.refresh);
    // Refresh the user's profile information
    await refreshProfile();
  };

  const register = async (payload: RegisterPayload) => {
    await registerUser(payload);
    await login({ username: payload.username, password: payload.password });
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to consume the AuthContext, ensuring it's used within an AuthProvider
export function useAuth() {
  // Get the context value from AuthContext
  const context = useContext(AuthContext);

  // If the context is undefined, it means useAuth is being called outside of an AuthProvider, which is an error
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  // Return the context value, which includes user information and authentication functions
  return context;
}
