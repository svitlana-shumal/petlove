// export interface User {
//   name: string;
//   avatar?: string | null;
// }

import { Notice } from './notices';
import { ProfilePet } from './pets';

export interface Register {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface AuthResponse {
  email: string;
  name: string;
}

export interface LoginValue {
  email: string;
  password: string;
}
export type User = {
  _id?: string;
  email?: string;
  name?: string;
  avatar?: string | null;
  phone?: string;
  noticesViewed?: Notice[];
  noticesFavorites?: Notice[];
  pets?: ProfilePet[];
  createdAt?: Date;
  updatedAt?: Date;
};

export interface EditUser {
  name?: string;
  email?: string;
  avatar?: string | null;
  phone?: string;
}

export type EditUserResponse = {
  _id: string;
  email?: string;
  name?: string;
  avatar?: string | null;
  phone?: string;
  noticesViewed?: Notice[];
};
