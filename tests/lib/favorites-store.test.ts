import { beforeEach, describe, expect, it } from 'vitest';
import { useFavoritesStore } from '@/lib/store/favoritesStore';

beforeEach(() => {
  useFavoritesStore.setState({ favorites: [], loaded: false });
});

describe('favorites store profile state', () => {
  it('stores the latest favorites returned from the backend', () => {
    useFavoritesStore.getState().setFavorites(['notice-1', 'notice-2']);

    expect(useFavoritesStore.getState()).toMatchObject({
      favorites: ['notice-1', 'notice-2'],
      loaded: true,
    });
  });

  it('clears favorites and loaded state on logout', () => {
    useFavoritesStore.getState().setFavorites(['notice-1']);
    useFavoritesStore.getState().reset();

    expect(useFavoritesStore.getState()).toMatchObject({
      favorites: [],
      loaded: false,
    });
  });
});
