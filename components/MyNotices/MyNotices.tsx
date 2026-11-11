'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { useFavoritesStore } from '@/lib/store/favoritesStore';
import { removeFavorites } from '@/lib/clientApi';
import { Notice } from '@/types/notices';
import NoticesItem from '@/components/NoticesItem/NoticesItem';
import toast from 'react-hot-toast';
import css from './MyNotices.module.css';

type ActiveTab = 'favorites' | 'viewed';

export default function MyNotices() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const setFavorites = useFavoritesStore((state) => state.setFavorites);
  const [activeTab, setActiveTab] = useState<ActiveTab>('favorites');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const notices: Notice[] =
    activeTab === 'favorites' ? (user?.noticesFavorites ?? []) : (user?.noticesViewed ?? []);

  const removeFavorite = async (noticeId: string) => {
    if (!user || removingId) return;
    setRemovingId(noticeId);
    try {
      const favorites = await removeFavorites(noticeId);
      updateUser({
        ...user,
        noticesFavorites: (user.noticesFavorites ?? []).filter((notice) => notice._id !== noticeId),
      });
      setFavorites(favorites);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove favorite');
    } finally {
      setRemovingId(null);
    }
  };

  const handleFavoriteChange = (notice: Notice, isFavorite: boolean) => {
    if (!user) return;
    updateUser({
      ...user,
      noticesFavorites: isFavorite
        ? [
            ...(user.noticesFavorites ?? []).filter((item) => item._id !== notice._id),
            { ...notice, isFavorite: true },
          ]
        : (user.noticesFavorites ?? []).filter((item) => item._id !== notice._id),
    });
    const currentFavorites = useFavoritesStore.getState().favorites;
    setFavorites(
      isFavorite
        ? [...new Set([...currentFavorites, notice._id])]
        : currentFavorites.filter((id) => id !== notice._id)
    );
  };

  return (
    <section className={css.myNotices}>
      <div className={css.tabs} role="tablist" aria-label="My notices">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'favorites'}
          className={`${css.tab} ${activeTab === 'favorites' ? css.active : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          My favorite pets
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'viewed'}
          className={`${css.tab} ${activeTab === 'viewed' ? css.active : ''}`}
          onClick={() => setActiveTab('viewed')}
        >
          Viewed
        </button>
      </div>
      {isAuthLoading ? (
        <p className={css.empty}>Loading your notices...</p>
      ) : notices.length > 0 ? (
        <ul className={css.list}>
          {notices.map((notice) => (
            <NoticesItem
              key={notice._id}
              notice={notice}
              showRemoveButton={activeTab === 'favorites'}
              hideFavoriteButton={activeTab === 'viewed'}
              onRemoveFavorite={() => removeFavorite(notice._id)}
              onFavoriteChange={(isFavorite) => handleFavoriteChange(notice, isFavorite)}
              isRemoving={removingId === notice._id}
            />
          ))}
        </ul>
      ) : (
        <p className={css.empty}>
          {activeTab === 'favorites'
            ? "Oops, looks like there aren't any furries on our adorable page yet. Do not worry! View your pets on the “find your favorite pet” page and add them to your favorites."
            : 'You have not viewed any notices yet.'}
        </p>
      )}
    </section>
  );
}