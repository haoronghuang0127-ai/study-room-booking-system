import apiClient from './client';
import type { LoginPayload, RegisterPayload, TokenResponse, User } from '../types';

export async function registerUser(payload: RegisterPayload) {
  const { data } = await apiClient.post<User>('/api/auth/register/', payload);
  return data;
}

// Function to log in and get the access and refresh tokens from the API, using the login payload
export async function loginUser(payload: LoginPayload) {
  const { data } = await apiClient.post<TokenResponse>('/api/auth/login/', payload);
  return data;
}

// Function to get a new access token using the refresh token
export async function refreshToken(refresh: string) {
  const { data } = await apiClient.post<{ access: string }>('/api/auth/refresh/', { refresh });
  return data;
}

// Function to fetch the current user's profile
export async function fetchCurrentUser() {
  const { data } = await apiClient.get<User>('/api/auth/me/');
  return data;
}