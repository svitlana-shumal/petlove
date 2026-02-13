'use client';

import Link from 'next/link';
import css from './AuthNav.module.css';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';

interface AuthNavProp {
  onClose?: () => void;
}

export default function AuthNav({ onClose }: AuthNavProp) {
  const pathname = usePathname();
  const isHome = pathname === '/home';

  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return null;

  return (
    <div className={css.auth}>
      <Link href="/login" className={isHome ? css.loginHome : css.login} onClick={onClose}>
        Log in
      </Link>
      <Link href="/register" className={isHome ? css.registerHome : css.register} onClick={onClose}>
        Registration
      </Link>
    </div>
  );
}
