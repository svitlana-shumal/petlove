'use client';

import css from './MobileMenu.module.css';
import { useEffect } from 'react';
import Nav from '@/components/Nav/Nav';
import AuthNav from '@/components/AuthNav/AuthNav';
// import UserBar from '../UserBar/UserBar';
import LogOutBtn from '../LogOutBtn/LogOutBtn';
import { useAuthStore } from '@/lib/store/auth';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';

type MobileMenuProps = {
  onClose: () => void;
};

export default function MobileMenu({ onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const isHome = pathname === '/home';

  const { user } = useAuthStore();
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

  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Modal menu"
    >
      <div className={isHome ? css.menuHome : css.menu}>
        <button className={css.btn} onClick={onClose} aria-label={'Close menu'}>
          <svg width={32} height={32} className={isHome ? css.close : css.closeBtn}>
            <use href={'/symbol-defs.svg#icon-x'} />
          </svg>
        </button>
        <Nav onClose={onClose} />
        {user ? <LogOutBtn /> : <AuthNav onClose={onClose} />}
      </div>
    </div>,
    document.body
  );
}
