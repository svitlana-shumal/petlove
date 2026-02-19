// import { create } from 'zustand';
// import {
//   addNoticeToFavorites,
//   removeNoticeFromFavorites,
//   getCurrentUserFull,
// } from '@/lib/clientApi';
// import { useAuthStore } from './auth';

// type State = {
//   favorites: string[];
//   loaded: boolean;

//   loadFavorites: () => Promise<void>;
//   toggleFavorite: (id: string) => Promise<void>;
//   isFavorite: (id: string) => boolean;
// };

// export const useFavoritesStore = create<State>((set, get) => ({
//   favorites: [],
//   loaded: false,

//   /* ---------- CHECK ---------- */
//   isFavorite: (id) => get().favorites.includes(id),

//   /* ---------- LOAD FROM SERVER ---------- */
//   loadFavorites: async () => {
//     const token = useAuthStore.getState().token;
//     if (!token) return;

//     try {
//       const data = await getCurrentUserFull(token);

//       const ids = data.noticesFavorites.map((n) => n._id);

//       set({
//         favorites: ids,
//         loaded: true,
//       });
//     } catch (e) {
//       console.error('Failed to load favorites', e);
//     }
//   },

//   /* ---------- TOGGLE ---------- */
//   toggleFavorite: async (id) => {
//     const token = useAuthStore.getState().token;
//     if (!token) return;

//     const { favorites } = get();
//     const exists = favorites.includes(id);

//     try {
//       if (exists) {
//         await removeNoticeFromFavorites(id, token);
//         set({ favorites: favorites.filter((f) => f !== id) });
//       } else {
//         await addNoticeToFavorites(id, token);
//         set({ favorites: [...favorites, id] });
//       }

//       await useAuthStore.getState().refreshUser();
//     } catch (e) {
//       console.error('Favorite sync error', e);
//     }
//   },
// }));
