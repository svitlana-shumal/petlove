'use client';

import css from './MobileMenu.module.css';
import { useEffect } from 'react';
import Nav from '../Nav/Nav';
import AuthNav from '../AuthNav/AuthNav';
import UserBar from '../UserBar/UserBar';
import { User } from '@/types/users';

type MobileMenuProps = {
  isAuth: boolean;
  user?: User | null;
  onClose: () => void;
};

export default function MobileMenu({ isAuth, user, onClose }: MobileMenuProps) {
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

  return (
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Modal menu"
    >
      <div className={css.menu} onClick={(e) => e.stopPropagation()}>
        <button className={css.btn} onClick={onClose} aria-label={'Close menu'}>
          <svg width={32} height={32} className={css.close}>
            <use href={'/symbol-defs.svg#icon-x'} />
          </svg>
        </button>
        <Nav onClose={onClose} />
        {isAuth && user ? (
          <UserBar user={user} onClose={onClose} />
        ) : (
          <AuthNav isAuth={false} onClose={onClose} />
        )}
      </div>
    </div>
  );
}
