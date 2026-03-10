import apiClient from './client';
import type { Booking, BookingCreatePayload } from '../types';

// api functions for create booking
export async function createBooking(payload: BookingCreatePayload) {
  const { data } = await apiClient.post('/api/bookings/', payload);
  return data;
}

// api functions for get my bookings (List)
export async function getMyBookings() {
  const { data } = await apiClient.get<Booking[]>('/api/bookings/my/');
  return data;
}

// api functions for cancel booking
export async function cancelBooking(id: number) {
  const { data } = await apiClient.patch(`/api/bookings/${id}/cancel/`);
  return data;
}

// api functions for get all bookings (List) for admin
export async function getAllBookings() {
  const { data } = await apiClient.get<Booking[]>('/api/bookings/admin/all/');
  return data;
}

// api functions for approve booking for admin
export async function approveBooking(id: number) {
  const { data } = await apiClient.patch(`/api/bookings/admin/${id}/approve/`);
  return data;
}


// api functions for reject booking for admin
export async function rejectBooking(id: number) {
  const { data } = await apiClient.patch(`/api/bookings/admin/${id}/reject/`);
  return data;
}

