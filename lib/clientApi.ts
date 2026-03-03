// import { isAxiosError } from 'axios';
// import { nextServer } from './api';
import { FetchFriendsResponse } from '@/types/friends';
import { NewsResponse } from '@/types/news';
import { AuthResponse, LoginValue, Register, User } from '@/types/users';
import { Category, City, NoticeResponse, NoticesQueryParams, Sex, Species } from '@/types/notices';
import { Pet } from '@/types/pets';

// helper
async function handleResponse<T>(res: Response): Promise<T> {
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    let msg = 'Request failed';
    if (typeof data === 'object' && data !== null) {
      const d = data as { message?: string; error?: string };
      msg = d.message || d.error || msg;
    }
    throw new Error(msg);
  }
  return data as T;
}

// // news

// export async function fetchNews(keyword?: string, page: number = 1): Promise<NewsResponse | null> {
//   try {
//     const url = keyword
//       ? `/api/news?keyword=${encodeURIComponent(keyword)}&page=${page}`
//       : `/api/news?page=${page}`;
//     const res = await fetch(url, { cache: 'no-store' });
//     return await handleResponse<NewsResponse>(res);
//   } catch (error) {
//     console.error('Error loading news:', error);
//     return null;
//   }
// }

// // notices

// export async function getNotices(params: NoticesQueryParams): Promise<NoticeResponse> {
//   try {
//     const { data } = await nextServer.get<NoticeResponse>('/notices', { params });

//     return data;
//   } catch (error) {
//     if (isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || 'Fetching pets failed');
//     }
//     throw new Error('Fetching pets failed');
//   }
// }

// // notices categories
// export async function getCategories(): Promise<Category[]> {
//   const { data } = await nextServer.get<Category[]>('/notices/categories');

//   return data;
// }

// // notices sex

// export async function getSex(): Promise<Sex[]> {
//   const { data } = await nextServer.get<Sex[]>('/notices/sex');
//   return data;
// }

// //  notices species
// export async function getSpecies(): Promise<Species[]> {
//   const { data } = await nextServer.get<Species[]>('/notices/species');
//   return data;
// }

// // notices favorites add {id}

// export async function addFavorites(id: string): Promise<string[]> {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`/api/notices/favorites/add/${id}`, {
//     method: 'POST',
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) {
//     const errorData = await res.json();
//     throw new Error(errorData.message || 'Failed to toggle favorite');
//   }
//   return res.json();
// }
// // notices favorites remove {id}

// export async function removeFavorites(id: string): Promise<string[]> {
//   const token = localStorage.getItem('token');
//   const res = await fetch(`/api/notices/favorites/remove/${id}`, {
//     method: 'DELETE',
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   if (!res.ok) {
//     const errorData = await res.json();
//     throw new Error(errorData.message || 'Failed to remove favorite');
//   }
//   return res.json();
// }

// // notices {id}
// export async function getNoticeById(id: string): Promise<NoticeResponse> {
//   try {
//     const { data } = await nextServer.get<NoticeResponse>(`/notices/${id}`);
//     return data;
//   } catch (error) {
//     if (isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || 'Fetching notice details failed');
//     }
//     throw new Error('Fetching notice details failed');
//   }
// }

// // locations

// export async function getAllLocations(): Promise<City[]> {
//   const { data } = await nextServer.get<City[]>('/cities/locations');
//   return data;
// }

// // location search

// export async function searchCities(keyword: string): Promise<City[]> {
//   if (keyword.length < 3) return [];
//   try {
//     const { data } = await nextServer.get<City[]>('/cities', {
//       params: { keyword },
//     });
//     return data;
//   } catch (error) {
//     console.error('Error fetching cities:', error);
//     return [];
//   }
// }

// // friends

// export async function fetchFriendsClient(): Promise<FetchFriendsResponse> {
//   try {
//     const { data } = await nextServer.get<FetchFriendsResponse>('/friends');
//     return data;
//   } catch (error) {
//     if (isAxiosError(error)) {
//       if (error.response?.status === 404) {
//         return [];
//       }

//       throw new Error(
//         error.response?.data?.error || error.response?.data?.message || 'Fetching friends failed'
//       );
//     }
//     throw new Error('Fetching friends failed');
//   }
// }

// // users signup
// export async function signUp(data: Register): Promise<AuthResponse> {
//   const res = await fetch('/api/users/signup', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     credentials: 'include',
//     body: JSON.stringify({
//       name: data.name,
//       email: data.email,
//       password: data.password,
//     }),
//   });

//   const result = await res.json();

//   if (!res.ok) {
//     throw new Error(result.error || 'Registration failed');
//   }

//   return result;
// }
// // users signin
// export async function signIn(data: LoginValue): Promise<AuthResponse> {
//   const res = await fetch('/api/users/signin', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     credentials: 'include',
//     body: JSON.stringify({ email: data.email, password: data.password }),
//   });
//   const result = await res.json();
//   if (!res.ok) {
//     throw new Error(result.error || 'Login failed');
//   }
//   return result;
// }

// // users current
// export async function getCurrentUser() {
//   const res = await fetch('/api/users/current', {
//     credentials: 'include',
//   });
//   if (!res.ok) return null;
//   return res.json();
// }

// // users current full

// export async function getCurrentFull() {
//   const res = await fetch('/api/users/current/full', {
//     credentials: 'include',
//   });
//   if (!res.ok) return null;
//   return res.json();
// }
// // users current edit

// export async function currentEdit(data: User) {
//   try {
//     const res = await fetch('/api/users/current/edit', {
//       method: 'PATCH',
//       credentials: 'include',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });

//     const result = await res.json();
//     if (!res.ok) {
//       throw new Error(result?.message ?? result?.error ?? 'Update failed');
//     }
//     return result;
//   } catch (err) {
//     throw err;
//   }
// }

// // users pets add

// export async function addPet(data: Pet) {
//   try {
//     const response = await fetch('/api/users/current/pets/add', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to add pet');
//     }

//     return await response.json();
//   } catch (error) {
//     if (error instanceof Error) {
//       throw error;
//     }
//     throw new Error('Something went wrong');
//   }
// }
// // users pets remove

// export async function removePet(id: string) {
//   const response = await fetch(`/api/users/current/pets/remove/${id}`, {
//     method: 'DELETE',
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || 'Failed to remove pet');
//   }

//   return response.json();
// }

// // users signout
// export async function logoutUser() {
//   try {
//     const res = await fetch('/api/users/signout', {
//       method: 'POST',
//       credentials: 'include',
//     });

//     if (!res.ok) {
//       const error = await res.json();
//       throw new Error(error.message || 'Logout failed');
//     }
//   } catch (err) {
//     throw err;
//   }
// }

// news

export async function fetchNews(keyword?: string, page: number = 1): Promise<NewsResponse | null> {
  try {
    const url = keyword
      ? `/api/news?keyword=${encodeURIComponent(keyword)}&page=${page}`
      : `/api/news?page=${page}`;
    const res = await fetch(url, { cache: 'no-store' });
    return await handleResponse<NewsResponse>(res);
  } catch (error) {
    console.error('Error loading news:', error);
    return null;
  }
}
// notices

export async function getNotices(params: NoticesQueryParams): Promise<NoticeResponse> {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
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
// favorites

export async function addFavorites(id: string, token: string): Promise<string[]> {
  const res = await fetch(`/api/notices/favorites/add/${id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<string[]>(res);
}

export async function removeFavorites(id: string, token: string): Promise<string[]> {
  const res = await fetch(`/api/notices/favorites/remove/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<string[]>(res);
}
// notice by id

export async function getNoticeById(id: string): Promise<NoticeResponse> {
  const res = await fetch(`/api/notices/${id}`);
  return handleResponse<NoticeResponse>(res);
}
// locations

export async function getAllLocations(): Promise<City[]> {
  const res = await fetch('/api/cities/locations');
  return handleResponse<City[]>(res);
}
export async function searchCities(keyword: string): Promise<City[]> {
  if (keyword.length < 3) return [];
  const res = await fetch(`/api/cities?keyword=${encodeURIComponent(keyword)}`);
  return handleResponse<City[]>(res);
}
// friends

export async function fetchFriendsClient(): Promise<FetchFriendsResponse> {
  const res = await fetch('/api/friends');
  return handleResponse<FetchFriendsResponse>(res);
}
// users

export async function signUp(data: Register): Promise<AuthResponse> {
  const res = await fetch('/api/users/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
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

export async function getCurrentUser() {
  const res = await fetch('/api/users/current', { credentials: 'include' });
  return res.ok ? res.json() : null;
}

export async function getCurrentFull() {
  const res = await fetch('/api/users/current/full', { credentials: 'include' });
  return res.ok ? res.json() : null;
}

export async function currentEdit(data: User) {
  const res = await fetch('/api/users/current/edit', {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
// pets

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
//logout

export async function logoutUser() {
  const res = await fetch('/api/users/signout', { method: 'POST', credentials: 'include' });
  return handleResponse(res);
}
