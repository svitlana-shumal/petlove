'use client';

import css from './UserBlock.module.css';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/auth';

export default function UserBlock() {
  const { user } = useAuthStore();

  const displayName = user?.name || 'Name';
  const displayEmail = user?.email || 'Email';
  const displayPhone = user?.phone || 'Phone';

  return (
    <section className={css.userBlock}>
      <div className={css.userAvatar}>
        {user?.avatar ? (
          <Image
            src="user?.avatar"
            alt={displayName}
            width={94}
            height={94}
            className={css.avatar}
            priority
          />
        ) : (
          <div className={css.userDefault}>
            <Image
              src="/user-default.png"
              alt={displayName}
              width={94}
              height={94}
              className={css.avatar}
              priority
            />
            <button className={css.upload}>Upload photo</button>
          </div>
        )}
      </div>

      <div>
        <h3 className={css.info}>My information</h3>
        <div className={css.userInfo}>
          <div className={css.userName}>{displayName}</div>
          <div className={css.userEmail}>{displayEmail}</div>
          <div className={css.userPhone}>{displayPhone}</div>
        </div>
      </div>
    </section>
  );
}
