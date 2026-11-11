import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getCurrentFullMock } = vi.hoisted(() => ({
  getCurrentFullMock: vi.fn(),
}));

vi.mock('@/lib/clientApi', () => ({ getCurrentFull: getCurrentFullMock }));

import { useAuthStore } from '@/lib/store/auth';

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isAuthLoading: true,
  });
  getCurrentFullMock.mockReset();
});

describe('auth store session restoration', () => {
  it('restores an authenticated user from the full-profile endpoint', async () => {
    const user = { _id: 'user-id', name: 'Test User', pets: [] };
    getCurrentFullMock.mockResolvedValue(user);

    await useAuthStore.getState().refreshUser();

    expect(useAuthStore.getState()).toMatchObject({
      user,
      isAuthenticated: true,
      isAuthLoading: false,
    });
  });

  it('sets the user as unauthenticated when no session exists', async () => {
    getCurrentFullMock.mockResolvedValue(null);

    await useAuthStore.getState().refreshUser();

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isAuthenticated: false,
      isAuthLoading: false,
    });
  });

  it('clears auth state and ends loading when session restoration fails', async () => {
    getCurrentFullMock.mockRejectedValue(new Error('Backend unavailable'));

    await expect(useAuthStore.getState().refreshUser()).rejects.toThrow('Backend unavailable');

    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      isAuthenticated: false,
      isAuthLoading: false,
    });
  });

  it('updates the profile favorites immediately after a favorite change', () => {
    const notice = {
      _id: 'notice-id',
      species: 'cat' as const,
      category: 'Free' as const,
      title: 'Find a home',
      name: 'Milo',
      birthday: '2022-01-01',
      sex: 'male' as const,
      imgURL: 'https://example.com/cat.jpg',
      popularity: 0,
      comment: 'Friendly cat',
      isFavorite: true,
    };
    useAuthStore.setState({
      user: { _id: 'user-id', noticesFavorites: [] },
      isAuthenticated: true,
      isAuthLoading: false,
    });

    useAuthStore.getState().syncFavorite(notice, true);

    expect(useAuthStore.getState().user?.noticesFavorites).toEqual([notice]);
    useAuthStore.getState().syncFavorite(notice, false);
    expect(useAuthStore.getState().user?.noticesFavorites).toEqual([]);
  });
});
