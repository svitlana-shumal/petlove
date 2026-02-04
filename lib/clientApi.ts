import { isAxiosError } from 'axios';
import { nextServer } from './api';
import { FetchFriendsResponse } from '@/types/friends';
import { NewsResponse } from '@/types/news';

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

// export async function fetchNews(keyword?: string, page = 1, perPage = 6): Promise<NewsResponse> {
//   try {
//     const params: FetchNewsParams = {
//       page,
//       limit: perPage,
//       ...(keyword ? { keyword: keyword.trim() } : {}),
//     };

//     const { data } = await nextServer.get<NewsResponse>('/news', {
//       params,
//     });

//     return data;
//   } catch (error) {
//     if (isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || 'Fetching news failed');
//     }
//     throw new Error('Fetching news failed');
//   }
// }
