'use client';

import { NoticeDetails } from '@/types/notices';
import css from './NoticesItem.module.css';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import ModalNotice from '@/components/ModalNotice/ModalNotice';
import { useAuthStore } from '@/lib/store/auth';
import ModalAttention from '../ModalAttention/ModalAttention';

type NoticesItemProp = { notice: NoticeDetails };

export default function NoticesItem({ notice }: NoticesItemProp) {
  const [isModalNoticeOpen, setIsModalNoticeOpen] = useState(false);
  const [isModalAttentionOpen, setIsModalAttentionOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(notice.isFavorite);
  const [formattedBirthday, setFormattedBirthday] = useState('');
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (notice.birthday) {
      const date = new Date(notice.birthday);
      setFormattedBirthday(date.toLocaleDateString('uk-UA'));
    }
  }, [notice.birthday]);
  useEffect(() => {});
  const handleFavorite = async () => {
    try {
      const endpoint = isFavorite
        ? `/api/notices/favorites/remove/${notice._id}`
        : `/api/notices/favorites/add/${notice._id}`;
      const res = await fetch(endpoint, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error('Failed to update favorite');
      const favorites: string[] = await res.json();
      const isFav = favorites.includes(notice._id);
      setIsFavorite(isFav);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLearnMore = () => {
    if (isAuthenticated) {
      setIsModalNoticeOpen(true);
    } else {
      setIsModalAttentionOpen(true);
    }
  };

  return (
    <>
      <li className={css.card}>
        <div className={css.contCard}>
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
        </div>
        <p className={css.price}>{notice.price ? `$${notice.price}` : 'Free'}</p>
        <div className={css.actions}>
          <button className={css.btn} onClick={handleLearnMore}>
            Learn more
          </button>
          <button className={css.btnFavorite} onClick={handleFavorite}>
            {isFavorite ? (
              <svg width={18} height={18} className={css.iconHeard}>
                <use href="/symbol-defs.svg#icon-heart" />
              </svg>
            ) : (
              <svg width={18} height={18} className={css.iconHeardFavor}>
                <use href="/symbol-defs.svg#icon-heart" />
              </svg>
            )}
          </button>
        </div>
      </li>
      {isModalNoticeOpen && (
        <ModalNotice notice={notice} onClose={() => setIsModalNoticeOpen(false)} />
      )}
      {isModalAttentionOpen && <ModalAttention onClose={() => setIsModalAttentionOpen(false)} />}
    </>
  );
}
