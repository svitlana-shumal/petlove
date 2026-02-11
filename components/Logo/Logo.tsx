'use client';

import Link from 'next/link';
import css from './Logo.module.css';
import { usePathname } from 'next/navigation';

export default function Logo() {
  const pathname = usePathname();
  const isHome = pathname === '/home';

  return (
    <div className={css.headerLogo}>
      <Link href="/" className={css.logo}>
        <svg className={css.logoIcon} width="76" height="20">
          <use href={`/symbol-defs.svg#${isHome ? 'icon-logo1' : 'icon-logo2'}`} />
        </svg>
      </Link>
    </div>
  );
}
