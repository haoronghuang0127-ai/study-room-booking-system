import apiClient from './client';
import type {
  Building,
  Equipment,
  Room,
  RoomPayload,
  BuildingPayload,
  EquipmentPayload,
} from '../types';

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



// api functions for get all equipments (List)
export async function getEquipments() {
  const { data } = await apiClient.get<Equipment[]>('/api/rooms/equipments/');
  return data;
}



// api functions for create building
export async function createBuilding(payload: BuildingPayload) {
  const { data } = await apiClient.post<Building>('/api/rooms/admin/buildings/create/', payload);
  return data;
}
// api functions for update building
export async function updateBuilding(id: number, payload: BuildingPayload) {
  const { data } = await apiClient.put<Building>(`/api/rooms/admin/buildings/${id}/update/`, payload);
  return data;
}
// api functions for delete building
export async function deleteBuilding(id: number) {
  const { data } = await apiClient.delete(`/api/rooms/admin/buildings/${id}/delete/`);
  return data;
}


// api functions for create equipment
export async function createEquipment(payload: EquipmentPayload) {
  const { data } = await apiClient.post<Equipment>('/api/rooms/admin/equipments/create/', payload);
  return data;
}
// api functions for update equipment
export async function updateEquipment(id: number, payload: EquipmentPayload) {
  const { data } = await apiClient.put<Equipment>(`/api/rooms/admin/equipments/${id}/update/`, payload);
  return data;
}
// api functions for delete equipment
export async function deleteEquipment(id: number) {
  const { data } = await apiClient.delete(`/api/rooms/admin/equipments/${id}/delete/`);
  return data;
}
