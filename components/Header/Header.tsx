'use client';

import { useEffect, useState } from 'react';
import css from './Header.module.css';
import Container from '@/components/Container/Container';
import MobileMenu from '@/components/MobileMenu/MobileMenu';
import Logo from '../Logo/Logo';
import Nav from '@/components/Nav/Nav';
import AuthNav from '@/components/AuthNav/AuthNav';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import UserNav from '@/components/UserNav/UserNav';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/home';
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <Container className={css.container}>
      <header className={isHome ? css.headerHome : css.headerDefault}>
        <section className={css.headerCont}>
          <div className={css.left}>
            <Logo />
          </div>
          <nav className={css.desktopNav}>
            <Nav onClose={() => setIsOpen(false)} />
            {isAuthenticated ? (
              <UserNav onClose={() => setIsOpen(false)} />
            ) : (
              <AuthNav isAuth={isAuthenticated} onClose={() => setIsOpen(false)} />
            )}
          </nav>

          <div className={css.right}>
            <button
              className={isHome ? css.menu : css.menuDef}
              onClick={toggleMenu}
              aria-label={'Open menu'}
            >
              <svg width={32} height={32} className={css.menuBtn}>
                <use href={'/symbol-defs.svg#icon-menu'} />
              </svg>
            </button>
          </div>

          {isOpen && <MobileMenu isAuth={isAuthenticated} onClose={() => setIsOpen(false)} />}
        </section>
      </header>
    </Container>
  );
}
