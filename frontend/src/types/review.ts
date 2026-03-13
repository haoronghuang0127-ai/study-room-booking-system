
// Interface for review
export interface Review {
  id: number;
  student: number;
  student_username: string;
  room: number;
  booking?: number | null;
  rating: number;
  comment: string;
  created_at: string;
}

// Interface for creating a review
export interface ReviewCreatePayload {
  booking: number;
  rating: number;
  comment: string;
}
