'use client';

import Link from 'next/link';
import css from './AddPet.module.css';

export default function AddPet() {
  return (
    <div className={css.pets}>
      <p className={css.desc}>My pets</p>
      <Link href="/add-pet" className={css.addPet}>
        Add pet
        <svg width={18} height={18} className={css.icon}>
          <use href="/symbol-defs.svg#icon-plus" />
        </svg>
      </Link>
    </div>
  );
}
