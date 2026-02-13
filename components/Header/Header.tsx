'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { usePathname } from 'next/navigation';
import css from './Header.module.css';
import Container from '@/components/Container/Container';
import MobileMenu from '@/components/MobileMenu/MobileMenu';
import Logo from '@/components/Logo/Logo';
import Nav from '@/components/Nav/Nav';
import AuthNav from '@/components/AuthNav/AuthNav';
import UserBar from '@/components/UserBar/UserBar';
import LogOutBtn from '@/components/LogOutBtn/LogOutBtn';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/home';
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();

  const isMobile = useMediaQuery('(max-width: 767px)');

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
          </nav>

          <div className={css.right}>
            {user ? (
              <div className={css.authUser}>
                {!isMobile && <LogOutBtn />}
                <UserBar onClose={() => setIsOpen(false)} />
              </div>
            ) : (
              !isMobile && <AuthNav onClose={() => setIsOpen(false)} />
            )}
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
          {isOpen && <MobileMenu onClose={() => setIsOpen(false)} />}
        </section>
      </header>
    </Container>
  );
}
