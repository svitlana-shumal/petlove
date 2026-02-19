'use client';

import { useState } from 'react';
import css from './LogOutBtn.module.css';
import ModalApproveAction from '@/components/ModalApproveAction/ModalApproveAction';
import { usePathname } from 'next/navigation';

export default function LogOutBtn() {
  const pathname = usePathname();
  const isHome = pathname === '/home';
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className={isHome ? css.log : css.logout} onClick={() => setIsModalOpen(true)}>
        Log out
      </button>

      {isModalOpen && <ModalApproveAction onCancel={() => setIsModalOpen(false)} />}
    </>
  );
}
