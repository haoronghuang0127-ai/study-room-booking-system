// Interface for room
export interface Building {
  id: number;
  name: string;
  campus_area: string;
  opening_hours: string;
}

// Interface for equipment
export interface Equipment {
  id: number;
  name: string;
  status: string;
}

// Interface for room
export interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string;
  is_active: boolean;
  building: Building;
  equipment: Equipment[];
}


// Interface for create/update room payload
export interface RoomPayload {
  name: string;
  capacity: number;
  location: string;
  is_active: boolean;
  building: number;
  equipment: number[];
}

// Interface for create building payload
export interface BuildingPayload {
  name: string;
  campus_area: string;
  opening_hours: string;
}

// Interface for create equipment payload
export interface EquipmentPayload {
  name: string;
  status: string;
}
