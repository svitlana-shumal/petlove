'use client';

import { useState } from 'react';
import css from './Header.module.css';
import Container from '@/components/Container/Container';
import MobileMenu from '@/components/MobileMenu/MobileMenu';
import Logo from '../Logo/Logo';
import Nav from '../Nav/Nav';

export default function Header() {
  //   const pathname = usePathname();
  //   const [menuOpen, setMenuOpen] = useState(false);

  // тимчасові дані
  const isAuth = false;
  const user = { name: 'Anna', avatar: '' };

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header className={css.header}>
      <Container>
        <section className={css.headerCont}>
          <div className={css.left}>
            <Logo />
          </div>

          {/* <Nav /> */}

          <div className={css.right}>
            {/* <button className={css.iconBtn}>
          <svg width={40} height={40} className={css.user}>
            <use href="/symbol-defs.svg#icon-user" />
          </svg>
        </button> */}
            <button
              className={css.menu}
              onClick={toggleMenu}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <svg width={32} height={32} className={css.menuBtn}>
                <use href={`/symbol-defs.svg#${isOpen ? 'icon-x' : 'icon-menu'}`} />
              </svg>
            </button>
          </div>
        </section>

        {isOpen && <MobileMenu isAuth={isAuth} user={user} onClose={() => setIsOpen(false)} />}
      </Container>
    </header>
  );
}
