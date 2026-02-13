'use client';

import Image from 'next/image';
import Link from 'next/link';
import css from './UserBar.module.css';
import { useAuthStore } from '@/lib/store/auth';
import { usePathname } from 'next/navigation';

interface UserBarProp {
  onClose?: () => void;
}

export default function UserBar({ onClose }: UserBarProp) {
  const pathname = usePathname();
  const isHome = pathname === '/home';
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) return null;
  return (
    <div className={css.userBar}>
      <Link href="/profile" className={css.user} onClick={onClose}>
        <Image
          src={user.avatar || '/user-default.png'}
          alt={user.name || 'User avatar'}
          width={40}
          height={40}
          className={css.avatar}
        />
        <span className={isHome ? css.nameHome : css.name}>{user.name}</span>
      </Link>
    </div>
  );
}
