import apiClient from './client';
import type { Building, Room } from '../types';

// api functions for get all buildings (List)
export async function getBuildings() {
  const { data } = await apiClient.get<Building[]>('/api/rooms/buildings/');
  return data;
}

// api functions for get all rooms (List)
export async function getRooms() {
  const { data } = await apiClient.get<Room[]>('/api/rooms/');
  return data;
}

// api functions for get room detail
export async function getRoomDetail(id: number | string) {
  const { data } = await apiClient.get<Room>(`/api/rooms/${id}/`);
  return data;
}

// api functions for create room, using manual form
export async function createRoom(payload: {
  name: string;
  capacity: number;
  location: string;
  is_active: boolean;
  building: number;
  equipment: number[];
}) {
  const { data } = await apiClient.post('/api/rooms/admin/create/', payload);
  return data;
}

// api functions for update room, using manual form
export async function updateRoom(id: number, payload: {
  name: string;
  capacity: number;
  location: string;
  is_active: boolean;
  building: number;
  equipment: number[];
}) {
  const { data } = await apiClient.put(`/api/rooms/admin/${id}/update/`, payload);
  return data;
}

// api functions for delete room
export async function deleteRoom(id: number) {
  const { data } = await apiClient.delete(`/api/rooms/admin/${id}/delete/`);
  return data;
}
