import { isAxiosError } from 'axios';
import { nextServer } from './api';
import { FetchFriendsResponse } from '@/types/friends';
import { NewsResponse } from '@/types/news';

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
    console.log('Помилка завантаження новин:', error);
    return null;
  }
};

// users signin
export async function signIn(email: string, password: string) {
  try {
    const res = await fetch(nextServer + '/users/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    throw err;
  }
}

// users signup
export async function signUp(name: string, email: string, password: string) {
  try {
    const res = await fetch(nextServer + '/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    throw err;
  }
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
