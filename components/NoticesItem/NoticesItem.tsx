'use client';

import { Notice, NoticeDetails } from '@/types/notices';
import css from './NoticesItem.module.css';
import { useState } from 'react';
import Image from 'next/image';
import ModalNotice from '@/components/ModalNotice/ModalNotice';
import { useAuthStore } from '@/lib/store/auth';
import ModalAttention from '../ModalAttention/ModalAttention';
import { addFavorites, getNoticeById, removeFavorites } from '@/lib/clientApi';
import toast from 'react-hot-toast';
import { useFavoritesStore } from '@/lib/store/favoritesStore';

type NoticesItemProp = {
  notice: Notice | NoticeDetails;
  showRemoveButton?: boolean;
  hideFavoriteButton?: boolean;
  onRemoveFavorite?: () => Promise<void>;
  onFavoriteChange?: (isFavorite: boolean) => void;
  isRemoving?: boolean;
};

export default function NoticesItem({
  notice,
  showRemoveButton = false,
  hideFavoriteButton = false,
  onRemoveFavorite,
  onFavoriteChange,
  isRemoving = false,
}: NoticesItemProp) {
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetails | null>(null);
  const [isModalAttentionOpen, setIsModalAttentionOpen] = useState(false);
  const [isLoadingNotice, setIsLoadingNotice] = useState(false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const syncFavorite = useAuthStore((state) => state.syncFavorite);
  const favoriteIds = useFavoritesStore((state) => state.favorites);
  const favoritesLoaded = useFavoritesStore((state) => state.loaded);
  const setFavorites = useFavoritesStore((state) => state.setFavorites);
  const isFavorite = favoritesLoaded
    ? favoriteIds.includes(notice._id)
    : notice.isFavorite;

  const formattedBirthday = notice.birthday
    ? new Date(notice.birthday).toLocaleDateString('uk-UA')
    : '';

  const handleFavorite = async () => {
    if (isAuthLoading || isUpdatingFavorite) return;

    if (!isAuthenticated) {
      setIsModalAttentionOpen(true);
      return;
    }

    setIsUpdatingFavorite(true);
    try {
      if (showRemoveButton && onRemoveFavorite) {
        await onRemoveFavorite();
        return;
      }

      const favorites = isFavorite
        ? await removeFavorites(notice._id)
        : await addFavorites(notice._id);

      const nextIsFavorite = favorites.includes(notice._id);
      setFavorites(favorites);
      syncFavorite(
        {
          _id: notice._id,
          species: notice.species,
          category: notice.category,
          price: notice.price === undefined ? undefined : String(notice.price),
          title: notice.title,
          name: notice.name,
          birthday: notice.birthday,
          sex: notice.sex,
          imgURL: notice.imgURL,
          popularity: notice.popularity,
          comment: notice.comment,
          isFavorite: nextIsFavorite,
        },
        nextIsFavorite
      );
      onFavoriteChange?.(nextIsFavorite);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update favorites');
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  const handleLearnMore = async () => {
    if (isAuthLoading || isLoadingNotice) return;

    if (isAuthenticated) {
      setIsLoadingNotice(true);
      try {
        const details = await getNoticeById(notice._id);
        setSelectedNotice(details);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load notice details');
      } finally {
        setIsLoadingNotice(false);
      }
    } else {
      setIsModalAttentionOpen(true);
    }
  };

  return (
    <>
      <li className={css.card}>
        <Image
          src={notice.imgURL}
          alt={notice.name}
          width={287}
          height={178}
          className={css.image}
        />
        <div className={css.titleCont}>
          <h3 className={css.subtitle}>{notice.title}</h3>
          <p className={css.popularity}>
            <svg width={16} height={16} className={css.icon}>
              <use href="/symbol-defs.svg#icon-star" />
            </svg>
            {notice.popularity}
          </p>
        </div>
        <ul className={css.details}>
          <li>
            <p className={css.desc}>Name</p> <p className={css.value}>{notice.name}</p>
          </li>
          <li>
            <p className={css.desc}>Birthday</p>
            <p className={css.value}>{formattedBirthday}</p>
          </li>
          <li>
            <p className={css.desc}>Sex</p> <p className={css.value}>{notice.sex}</p>
          </li>
          <li>
            <p className={css.desc}>Species</p> <p className={css.value}>{notice.species}</p>
          </li>
          <li>
            <p className={css.desc}>Category</p>
            <p className={css.value}>{notice.category}</p>
          </li>
        </ul>
        <p className={css.comment}>{notice.comment}</p>

        <p className={css.price}>{notice.price ? `$${notice.price}` : 'Free'}</p>
        <div
          className={`${css.actions} ${hideFavoriteButton ? css.actionsWithoutFavorite : ''}`}
        >
          <button
            className={css.btn}
            onClick={handleLearnMore}
            disabled={isAuthLoading || isLoadingNotice}
          >
            {isLoadingNotice ? 'Loading...' : 'Learn more'}
          </button>
          {!hideFavoriteButton && (
            <button
              className={`${css.btnFavorite} ${showRemoveButton ? css.removeFavorite : ''}`}
              onClick={handleFavorite}
              disabled={isAuthLoading || isRemoving || isUpdatingFavorite}
              aria-label={
                showRemoveButton
                  ? `Remove ${notice.name} from favorites`
                  : isFavorite
                    ? 'Remove from favorites'
                    : 'Add to favorites'
              }
            >
              {showRemoveButton ? (
                <svg
                  width={16}
                  height={16}
                  className={css.iconTrash}
                  aria-hidden="true"
                >
                  <use href="/symbol-defs.svg#icon-trash" />
                </svg>
              ) : isFavorite ? (
                <svg width={18} height={18} className={css.iconHeard}>
                  <use href="/symbol-defs.svg#icon-heart" />
                </svg>
              ) : (
                <svg width={18} height={18} className={css.iconHeardFavor}>
                  <use href="/symbol-defs.svg#icon-heart" />
                </svg>
              )}
            </button>
          )}
        </div>
      </li>
      {selectedNotice && (
        <ModalNotice
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
          onFavoriteChange={(nextIsFavorite) => {
            syncFavorite(
              {
                _id: notice._id,
                species: notice.species,
                category: notice.category,
                price: notice.price === undefined ? undefined : String(notice.price),
                title: notice.title,
                name: notice.name,
                birthday: notice.birthday,
                sex: notice.sex,
                imgURL: notice.imgURL,
                popularity: notice.popularity,
                comment: notice.comment,
                isFavorite: nextIsFavorite,
              },
              nextIsFavorite
            );
            onFavoriteChange?.(nextIsFavorite);
          }}
        />
      )}
      {isModalAttentionOpen && <ModalAttention onClose={() => setIsModalAttentionOpen(false)} />}
    </>
  );
}
