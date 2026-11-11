import { FetchFriendsResponse } from '@/types/friends';
import { NewsResponse } from '@/types/news';
import { AuthResponse, EditUser, LoginValue, Register, User } from '@/types/users';
import {
  Category,
  City,
  NoticeDetails,
  NoticeResponse,
  NoticesQueryParams,
  Sex,
  Species,
} from '@/types/notices';
import { Pet } from '@/types/pets';

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    let message = 'Request failed';
    if (typeof data === 'string') {
      message = data;
    } else if (data && typeof data === 'object') {
      const body = data as { message?: string; error?: string };
      message = body.message || body.error || message;
    }
    throw new Error(message);
  }

  if (data === null) {
    return {} as T;
  }

  return data as T;
}

export async function fetchNews(
  keyword?: string,
  page: number = 1,
  perPage: number = 6
): Promise<NewsResponse> {
  const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
  if (keyword?.trim()) params.set('query', keyword.trim());

  const res = await fetch(`/api/news?${params.toString()}`, { cache: 'no-store' });
  return handleResponse<NewsResponse>(res);
}

export async function getNotices(params: NoticesQueryParams): Promise<NoticeResponse> {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)])
  ).toString();
  const res = await fetch(`/api/notices?${query}`, { cache: 'no-store' });
  return handleResponse<NoticeResponse>(res);
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch('/api/notices/categories');
  return handleResponse<Category[]>(res);
}

export async function getSex(): Promise<Sex[]> {
  const res = await fetch('/api/notices/sex');
  return handleResponse<Sex[]>(res);
}

export async function getSpecies(): Promise<Species[]> {
  const res = await fetch('/api/notices/species');
  return handleResponse<Species[]>(res);
}

export async function addFavorites(id: string): Promise<string[]> {
  const res = await fetch(`/api/notices/favorites/add/${id}`, { method: 'POST' });
  return handleResponse<string[]>(res);
}

export async function removeFavorites(id: string): Promise<string[]> {
  const res = await fetch(`/api/notices/favorites/remove/${id}`, { method: 'DELETE' });
  return handleResponse<string[]>(res);
}

export async function getNoticeById(id: string): Promise<NoticeDetails> {
  const res = await fetch(`/api/notices/${id}`);
  return handleResponse<NoticeDetails>(res);
}

export async function getAllLocations(): Promise<City[]> {
  const res = await fetch('/api/cities/locations');
  return handleResponse<City[]>(res);
}

export async function searchCities(keyword: string): Promise<City[]> {
  if (keyword.length < 3) return [];
  const res = await fetch(`/api/cities?keyword=${encodeURIComponent(keyword)}`);
  return handleResponse<City[]>(res);
}

export async function fetchFriendsClient(): Promise<FetchFriendsResponse> {
  const res = await fetch('/api/friends');
  return handleResponse<FetchFriendsResponse>(res);
}

export async function signUp(data: Register): Promise<AuthResponse> {
  const { name, email, password } = data;
  const res = await fetch('/api/users/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function signIn(data: LoginValue): Promise<AuthResponse> {
  const res = await fetch('/api/users/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse<AuthResponse>(res);
}

export async function getCurrentUser(): Promise<User | null> {
  const res = await fetch('/api/users/current', { credentials: 'include' });
  if (res.status === 401) return null;
  return handleResponse<User>(res);
}

export async function getCurrentFull(): Promise<User | null> {
  const res = await fetch('/api/users/current/full', { credentials: 'include' });
  if (res.status === 401) return null;
  return handleResponse<User>(res);
}

export async function currentEdit(data: EditUser): Promise<User> {
  const res = await fetch('/api/users/current/edit', {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<User>(res);
}

export async function addPet(data: Pet) {
  const res = await fetch('/api/users/current/pets/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function removePet(id: string) {
  const res = await fetch(`/api/users/current/pets/remove/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}

export async function logoutUser() {
  const res = await fetch('/api/users/signout', {
    method: 'POST',
    credentials: 'include',
  });
  return handleResponse(res);
}
