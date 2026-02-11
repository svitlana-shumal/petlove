// export interface User {
//   name: string;
//   avatar?: string | null;
// }

import { Pet } from './pet';

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
  _id: string;
  email: string;
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
export type Notice = {
  _id: string;
  species: string;
  category: string;
  price?: string;
  title: string;
  name: string;
  birthday: string;
  sex: string;
  imgURL: string;
  popularity: number;
  comment: string;
};

export type NoticeResponse = {
  results: Notice[];
  page: number;
  perPage: number;
  totalPages: number;
};
