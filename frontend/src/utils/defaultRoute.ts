import type { User } from '../types';

// Function to get the default route based on user role
export function getDefaultRouteByRole(role: User['role']) {
  return role === 'admin' ? '/admin' : '/student';
}

// Function to get the profile route based on user role
export function getProfileRouteByRole(role: User['role']) {
  return role === 'admin' ? '/admin/profile' : '/student/profile';
}
