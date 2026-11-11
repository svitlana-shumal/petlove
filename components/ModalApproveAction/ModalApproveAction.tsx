'use client';

import { useEffect } from 'react';
import css from './ModalApproveAction.module.css';
import Container from '../Container/Container';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/auth';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/clientApi';
import toast from 'react-hot-toast';
import { useFavoritesStore } from '@/lib/store/favoritesStore';

type ModalApproveActionProps = {
  onCancel: () => void;
};
export default function ModalApproveAction({ onCancel }: ModalApproveActionProps) {
  const { clearIsAuthenticated } = useAuthStore();
  const resetFavorites = useFavoritesStore((state) => state.reset);
  const router = useRouter();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onCancel]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleConfirm = async () => {
    let logoutSucceeded = false;
    try {
      await logoutUser();
      logoutSucceeded = true;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message || 'Logout failed');
    } finally {
      clearIsAuthenticated();
      resetFavorites();
      try {
        localStorage.removeItem('auth');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to clear local session data');
      }
      router.push('/home');
    }
    if (logoutSucceeded) toast.success('You have logged out successfully');
  };

  return (
    <Container>
      <div className={css.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
        <div className={css.modal}>
          <button className={css.close} onClick={onCancel} aria-label="Close modal">
            <svg width={24} height={24}>
              <use href={'/symbol-defs.svg#icon-x'} />
            </svg>
          </button>
          <div className={css.imageCat}>
            <Image alt="Cat" src="/catModal.webp" width={44} height={44} className={css.photo} />
          </div>
          <p className={css.text}>Already leaving?</p>
          <div className={css.actions}>
            <button className={css.confirm} onClick={handleConfirm}>
              Yes
            </button>
            <button className={css.cancel} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
