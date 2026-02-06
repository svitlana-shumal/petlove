import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './Nav.module.css';

interface NavProp {
  onClose: () => void;
}

export default function Nav({ onClose }: NavProp) {
  const pathname = usePathname();

  return (
    <nav className={css.nav}>
      <Link
        href="/news"
        onClick={onClose}
        className={`${css.navList} ${pathname === '/news' ? css.active : ''}`}
      >
        News
      </Link>
      <Link
        href="/notices"
        onClick={onClose}
        className={`${css.navList} ${pathname === '/notices' ? css.active : ''}`}
      >
        Find pet
      </Link>
      <Link
        href="/friends"
        onClick={onClose}
        className={`${css.navList} ${pathname === '/friends' ? css.active : ''}`}
      >
        Our friends
      </Link>
    </nav>
  );
}
