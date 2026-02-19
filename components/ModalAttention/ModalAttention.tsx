'use client';

import { useEffect } from 'react';
import css from './ModalAttention.module.css';
import Container from '@/components/Container/Container';
import Image from 'next/image';
import Link from 'next/link';

type ModalAttentionProp = {
  onClose: () => void;
};

export default function ModalAttention({ onClose }: ModalAttentionProp) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Container>
      <div className={css.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
        <div className={css.modal}>
          <button className={css.close} onClick={onClose}>
            <svg width={24} height={24}>
              <use href="/symbol-defs.svg#icon-x" />
            </svg>
          </button>
          <div className={css.content}>
            <div className={css.imageCont}>
              <Image
                src="/dogModal.webp"
                alt="icon dog"
                width={44}
                height={44}
                className={css.image}
              />
            </div>
            <h3 className={css.title}>Attention</h3>
            <p className={css.desc}>
              We would like to remind you that certain functionality is available only to authorized
              users.If you have an account, please log in with your credentials. If you do not
              already have an account, you must register to access these features.
            </p>
            <div className={css.auth}>
              <Link href="/login" className={css.login}>
                Log In
              </Link>
              <Link href="/register" className={css.register}>
                Registration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
