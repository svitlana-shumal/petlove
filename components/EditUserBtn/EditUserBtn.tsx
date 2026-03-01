'use client';

import { useState } from 'react';
import css from './EditUserBtn.module.css';
import ModalEditUser from '../ModalEditUser/ModalEditUser';
import { useAuthStore } from '@/lib/store/auth';

export default function EditUserBtn() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className={css.editInfo}>
      <div className={css.editUser}>
        <span className={css.userName}>{user?.name || 'User'}</span>
        <svg width={18} height={18} className={css.user}>
          <use href={'/symbol-defs.svg#icon-user'} />
        </svg>
      </div>

      <button className={css.btnEdit} onClick={() => setIsModalOpen(true)}>
        <svg width={18} height={18} className={css.edit}>
          <use href={'/symbol-defs.svg#icon-edit'} />
        </svg>
      </button>
      {isModalOpen && <ModalEditUser onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
