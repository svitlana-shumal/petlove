import { isAxiosError } from 'axios';
import { nextServer } from './api';
import { FetchFriendsResponse } from '@/types/friends';
import { NewsResponse } from '@/types/news';
import { AuthResponse, LoginValue, Register, User } from '@/types/users';
import { Category, City, NoticeResponse, NoticesQueryParams, Sex, Species } from '@/types/notices';

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

// notices

export async function getNotices(params: NoticesQueryParams): Promise<NoticeResponse> {
  try {
    const { data } = await nextServer.get<NoticeResponse>('/notices', { params });

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Fetching pets failed');
    }
    throw new Error('Fetching pets failed');
  }
}

// notices categories
export async function getCategories(): Promise<Category[]> {
  const { data } = await nextServer.get<Category[]>('/notices/categories');

  return data;
}

// notices sex

export async function getSex(): Promise<Sex[]> {
  const { data } = await nextServer.get<Sex[]>('/notices/sex');
  return data;
}

// notices species
export async function getSpecies(): Promise<Species[]> {
  const { data } = await nextServer.get<Species[]>('/notices/species');
  return data;
}

// notices favorites add {id}
export async function addFavorites(id: string): Promise<string[]> {
  const res = await fetch(`/api/notices/favorites/add/${id}`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to toggle favorite');
  return res.json();
}

// notices favorites remove {id}

export async function removeFavorites(id: string): Promise<string[]> {
  const res = await fetch(`/api/notices/favorites/remove/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to remove favorite');
  return res.json();
}

// notices {id}
export async function getNoticeById(id: string): Promise<NoticeResponse> {
  try {
    const { data } = await nextServer.get<NoticeResponse>(`/notices/${id}`);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Fetching notice details failed');
    }
    throw new Error('Fetching notice details failed');
  }
}

// locations

export async function getAllLocations(): Promise<City[]> {
  const { data } = await nextServer.get<City[]>('/cities/locations');
  return data;
}

// location search

export async function searchCities(keyword: string): Promise<City[]> {
  if (keyword.length < 3) return [];
  try {
    const { data } = await nextServer.get<City[]>('/cities', {
      params: { keyword },
    });
    return data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

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
export async function logoutUser() {
  try {
    const res = await fetch('/api/users/signout', {
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

// users current full
// users current edit

export async function currentEdit(data: User) {
  try {
    const res = await fetch('/api/users/current/edit', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Update failed');
    }
    return result;
  } catch (err) {
    throw err;
  }
}
