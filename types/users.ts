export interface User {
  name: string;
  avatar?: string | null;
}

export interface Register {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginValue {
  email: string;
  password: string;
}
