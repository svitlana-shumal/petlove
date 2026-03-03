'use client';

import css from './UserCard.module.css';
import EditUserBtn from '@/components/EditUserBtn/EditUserBtn';
import UserBlock from '@/components/UserBlock/UserBlock';
import LogOutBtn from '@/components/LogOutBtn/LogOutBtn';
import PetsBlock from '../PetsBlock/PetsBlock';
export default function UserCard() {
  return (
    <section className={css.profile}>
      <div className={css.profileInfo}>
        <EditUserBtn />
        <UserBlock />
        <PetsBlock />
        <LogOutBtn />
      </div>
    </section>
  );
}
