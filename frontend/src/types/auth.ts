// Interface for user information
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'student' | 'admin';
  is_active?: boolean;
}

// Interface for login payload
export interface LoginPayload {
  username: string;
  password: string;
}

// Interface for register payload
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
}

// Interface for token response
export interface TokenResponse {
  access: string;
  refresh: string;
}


export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}


// Interface for admin user management list item
export interface AdminUser extends User {
  is_active: boolean;
  booking_count: number;
  review_count: number;
  processed_booking_count: number;
}


// Interface for admin user management payload
export interface AdminUserPayload {
  username: string;
  email: string;
  password?: string;
  role: 'student' | 'admin';
  is_active: boolean;
}
