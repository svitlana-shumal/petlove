// export interface User {
//   name: string;
//   avatar?: string | null;
// }

import { Notice, Pet } from './notices';

export interface Register {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface AuthResponse {
  email: string;
  name: string;
  token: string;
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
  token?: string;
  noticesViewed?: Notice[];
  noticesFavorites?: Notice[];
  pets?: Pet[];
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
  token?: string;
  noticesViewed?: Notice[];
};
