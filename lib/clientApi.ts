import { isAxiosError } from 'axios';
import { nextServer } from './api';
import { FetchFriendsResponse } from '@/types/friends';
import { NewsResponse } from '@/types/news';
import { AuthResponse, LoginValue, Register } from '@/types/users';

// friends

export async function fetchFriendsClient(): Promise<FetchFriendsResponse> {
  try {
    const { data } = await nextServer.get<FetchFriendsResponse>('/friends');
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404) {
        return [];
      }

      throw new Error(
        error.response?.data?.error || error.response?.data?.message || 'Fetching friends failed'
      );
    }
    throw new Error('Fetching friends failed');
  }
}

// news

export const fetchNews = async (
  keyword?: string,
  page: number = 1
): Promise<NewsResponse | null> => {
  try {
    const url = keyword
      ? `/api/news?keyword=${encodeURIComponent(keyword)}&page=${page}`
      : `/api/news?page=${page}`;
    const res = await fetch(url, { cache: 'no-store' });
    const data: NewsResponse = await res.json();
    return data;
  } catch (error) {
    console.log('Error loading news:', error);
    return null;
  }
};

// users signup
export async function signUp(data: Register): Promise<AuthResponse> {
  const res = await fetch('/api/users/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || 'Registration failed');
  }

  return result;
}
// users signin
export async function signIn(data: LoginValue): Promise<AuthResponse> {
  const res = await fetch('/api/users/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email: data.email, password: data.password }),
  });
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || 'Login failed');
  }
  return result;
}

// users current
export async function getCurrentUser() {
  const res = await fetch('/api/users/current', {
    credentials: 'include',
  });
  if (!res.ok) return null;
  return res.json();
}
// users signout
export async function signOut() {
  try {
    const res = await fetch(nextServer + '/users/signout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Logout failed');
    }
  } catch (err) {
    throw err;
  }
}
