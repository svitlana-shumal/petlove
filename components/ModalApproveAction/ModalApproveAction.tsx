'use client';

import { useEffect } from 'react';
import css from './ModalApproveAction.module.css';
import Container from '../Container/Container';
import Image from 'next/image';

type ModalApproveActionProps = {
  onConfirm: () => void;
  onCancel: () => void;
};
export default function ModalApproveAction({ onConfirm, onCancel }: ModalApproveActionProps) {
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
            <button className={css.confirm} onClick={onConfirm}>
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
