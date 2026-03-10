// interface for booking
export interface Booking {
  id: number;
  student?: number;
  student_username?: string;
  room: number;
  room_name?: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  processed_by?: number | null;
  created_at?: string;
}

// interface for creating a booking
export interface BookingCreatePayload {
  room: number;
  booking_date: string;
  start_time: string;
  end_time: string;
}
