import { Notice } from '@/types/notices';
import { User } from '@/types/users';
import { create } from 'zustand';
import { getCurrentFull } from '@/lib/clientApi';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (user: User) => void;
  syncFavorite: (notice: Notice, isFavorite: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,
  setUser: (user) => set({ user, isAuthenticated: true, isAuthLoading: false }),
  clearIsAuthenticated: () => set({ user: null, isAuthenticated: false, isAuthLoading: false }),
  refreshUser: async () => {
    set({ isAuthLoading: true });
    try {
      const user = await getCurrentFull();
      set({ user, isAuthenticated: user !== null });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
      throw error;
    } finally {
      set({ isAuthLoading: false });
    }
  },
  updateUser: (user) => set({ user }),
  syncFavorite: (notice, isFavorite) =>
    set((state) => {
      if (!state.user) return state;

      const favorites = state.user.noticesFavorites ?? [];
      return {
        user: {
          ...state.user,
          noticesFavorites: isFavorite
            ? [...favorites.filter((item) => item._id !== notice._id), notice]
            : favorites.filter((item) => item._id !== notice._id),
        },
      };
    }),
}));
