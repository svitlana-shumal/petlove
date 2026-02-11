'use client';

import Link from 'next/link';
import css from './AuthNav.module.css';
import { usePathname } from 'next/navigation';

interface AuthNavProp {
  onClose?: () => void;
  isAuth: boolean;
}

export default function AuthNav({ onClose, isAuth }: AuthNavProp) {
  const pathname = usePathname();
  const isHome = pathname === '/home';

  if (isAuth) return null;

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
