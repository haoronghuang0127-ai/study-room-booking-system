// Interface for user information
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'student' | 'admin';
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
