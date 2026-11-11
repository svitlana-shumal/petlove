import { create } from 'zustand';
import { addFavorites, removeFavorites, getCurrentFull } from '@/lib/clientApi';
import { useAuthStore } from './auth';

type State = {
  favorites: string[];
  loaded: boolean;

  setFavorites: (favorites: string[]) => void;
  reset: () => void;
  loadFavorites: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
};

export const useFavoritesStore = create<State>((set, get) => ({
  favorites: [],
  loaded: false,

  setFavorites: (favorites) => set({ favorites, loaded: true }),
  reset: () => set({ favorites: [], loaded: false }),

  isFavorite: (id) => get().favorites.includes(id),

  loadFavorites: async () => {
    const auth = useAuthStore.getState();
    if (!auth.isAuthenticated) {
      set({ favorites: [], loaded: false });
      return;
    }

    try {
      const data = auth.user ?? (await getCurrentFull());
      const ids = data?.noticesFavorites?.map((notice) => notice._id) ?? [];

      set({
        favorites: ids,
        loaded: true,
      });
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
  },

  toggleFavorite: async (id) => {
    if (!useAuthStore.getState().isAuthenticated) return;

    const { favorites } = get();
    const exists = favorites.includes(id);

    try {
      if (exists) {
        await removeFavorites(id);
        set({ favorites: favorites.filter((f) => f !== id) });
      } else {
        await addFavorites(id);
        set({ favorites: [...favorites, id] });
      }

      await useAuthStore.getState().refreshUser();
    } catch (e) {
      console.error('Favorite sync error', e);
    }
  },
}));
