'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './Nav.module.css';

interface NavProp {
  onClose: () => void;
}

export default function Nav({ onClose }: NavProp) {
  const pathname = usePathname();
  const isHome = pathname === '/home';

  return (
    <nav className={isHome ? css.navHome : css.nav}>
      <Link
        href="/news"
        onClick={onClose}
        className={`${css.navList} ${isHome ? css.navListHome : ''} ${pathname === '/news' ? css.active : ''}`}
      >
        News
      </Link>
      <Link
        href="/notices"
        onClick={onClose}
        className={`${css.navList} ${isHome ? css.navListHome : ''} ${pathname === '/notices' ? css.active : ''}`}
      >
        Find pet
      </Link>
      <Link
        href="/friends"
        onClick={onClose}
        className={`${css.navList} ${isHome ? css.navListHome : ''} ${pathname === '/friends' ? css.active : ''}`}
      >
        Our friends
      </Link>
    </nav>
  );
}
