import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from './constants';
import type { User } from '../types';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

// Get the refresh token from localStorage
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// Set the access and refresh tokens in localStorage
export function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

// Clear all authentication-related tokens and user information from localStorage
export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Store the user information in localStorage as a JSON string
export function setStoredUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Retrieve the user information from localStorage and parse it as a User object
export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw){
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}