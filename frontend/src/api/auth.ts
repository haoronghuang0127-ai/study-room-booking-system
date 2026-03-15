import apiClient from './client';
import type {
  AdminUser,
  AdminUserPayload,
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  TokenResponse,
  User,
} from '../types';

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


export async function changePassword(payload: ChangePasswordPayload) {
  const { data } = await apiClient.post<{ detail: string }>('/api/auth/change-password/', payload);
  return data;
}


// Function to fetch all users for admin user management
export async function getAdminUsers() {
  const { data } = await apiClient.get<AdminUser[]>('/api/auth/admin/');
  return data;
}


// Function to create a new user from the admin page
export async function createAdminUser(payload: AdminUserPayload) {
  const { data } = await apiClient.post<User>('/api/auth/admin/create/', payload);
  return data;
}


// Function to update an existing user from the admin page
export async function updateAdminUser(id: number, payload: AdminUserPayload) {
  const { data } = await apiClient.put<User>(`/api/auth/admin/${id}/update/`, payload);
  return data;
}


// Function to delete a user from the admin page
export async function deleteAdminUser(id: number) {
  const { data } = await apiClient.delete(`/api/auth/admin/${id}/delete/`);
  return data;
}
