'use client';

import { useState } from 'react';
import css from './EditUserBtn.module.css';
import ModalEditUser from '../ModalEditUser/ModalEditUser';

export default function EditUserBtn() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className={css.btnEdit} onClick={() => setIsModalOpen(true)}>
        <svg width={18} height={18} className={css.edit}>
          <use href={'/symbol-defs.svg#icon-edit'} />
        </svg>
      </button>

      {isModalOpen && <ModalEditUser onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
