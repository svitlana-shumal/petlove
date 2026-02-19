'use client';

import Image from 'next/image';
import css from './ModalNotice.module.css';
import { useEffect, useState } from 'react';
import { NoticeDetails } from '@/types/notices';
import { addFavorites, removeFavorites } from '@/lib/clientApi';
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react';
import { createPortal } from 'react-dom';

type ModalNoticeProp = { notice: NoticeDetails; onClose: () => void };

export default function ModalNotice({ notice, onClose }: ModalNoticeProp) {
  const [isFavorite, setIsFavorite] = useState(notice.isFavorite);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleToggleFavorite = async () => {
    try {
      let favorites: string[];
      if (isFavorite) {
        favorites = await removeFavorites(notice._id);
      } else {
        favorites = await addFavorites(notice._id);
      }
      const isFav = favorites.includes(notice._id);
      setIsFavorite(isFav);
      toast.success(isFav ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className={css.modal}>
        <button className={css.close} onClick={onClose}>
          <svg width={24} height={24}>
            <use href="/symbol-defs.svg#icon-x" />
          </svg>
        </button>
        <div className={css.contCard}>
          <div className={css.categ}>
            <Image
              src={notice.imgURL}
              alt={notice.name}
              width={120}
              height={120}
              className={css.image}
            />
            <p className={css.category}>{notice.category}</p>
          </div>
          <div className={css.titleCont}>
            <h3 className={css.subtitle}>{notice.title}</h3>
            <p className={css.popularity}>
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width={16}
                  height={16}
                  className={css.icon}
                  style={{ fill: i < notice.popularity ? 'var(--primary-orange)' : 'gray' }}
                >
                  <use href="/symbol-defs.svg#icon-star" />
                </svg>
              ))}
              {notice.popularity}
            </p>
          </div>
          <ul className={css.details}>
            <li>
              <p className={css.desc}>Name</p> <p className={css.value}>{notice.name}</p>
            </li>
            <li>
              <p className={css.desc}>Birthday</p>
              <p className={css.value}>{new Date(notice.birthday).toLocaleDateString('uk-UA')}</p>
            </li>
            <li>
              <p className={css.desc}>Sex</p> <p className={css.value}>{notice.sex}</p>
            </li>
            <li>
              <p className={css.desc}>Species</p> <p className={css.value}>{notice.species}</p>
            </li>
          </ul>
          <p className={css.comment}>{notice.comment}</p>
        </div>
        <p className={css.price}>{notice.price ? `$${notice.price}` : 'Free'}</p>
        <div className={css.buttons}>
          <button onClick={handleToggleFavorite} className={css.favoriteBtn}>
            {isFavorite ? 'Remove from' : 'Add to'}
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          {notice.user?.email ? (
            <a href={`mailto:${notice.user.email}`} className={css.contact}>
              Contact
            </a>
          ) : notice.user?.phone ? (
            <a href={`tel:${notice.user.phone}`} className={css.contact}>
              Contact
            </a>
          ) : (
            <button className={css.contact} disabled>
              Contact
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
