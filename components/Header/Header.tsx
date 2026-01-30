"use client";

import { useState } from "react";
import css from "./Header.module.css";
import Link from "next/link";
import Container from "@/components/Container/Container";
import MobileMenu from "@/components/MobileMenu/MobileMenu";

export default function Header() {
  //   const pathname = usePathname();
  //   const [menuOpen, setMenuOpen] = useState(false);

  // тимчасові дані
  const isAuth = true;
  const user = { name: "Anna", avatar: "" };

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header className={css.header}>
      <Container>
        <section className={css.headerCont}>
          <div className={css.left}>
            <Link href="/" className={css.logo}>
              petl
              <span className={css.heart}>
                <svg width={17} height={17}>
                  <use href="/symbol-defs.svg#icon-heart" />
                </svg>
              </span>
              ve
            </Link>
          </div>

          {/* <nav className={`${css.nav} ${isOpen ? css.open : ""}`}>
          <Link
            href="/news"
            className={`${css.navList} ${pathname === "/news" ? css.active : ""}`}
            onClick={() => setIsOpen(false)}
          >
            News
          </Link>

          <Link
            href="/notices"
            className={`${css.navList} ${pathname === "/notices" ? css.active : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Find pet
          </Link>

          <Link
            href="/friends"
            className={`${css.navList} ${pathname === "/friends" ? css.active : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Our friends
          </Link>
        </nav> */}

          <div className={css.right}>
            {/* <button className={css.iconBtn}>
          <svg width={40} height={40} className={css.user}>
            <use href="/symbol-defs.svg#icon-user" />
          </svg>
        </button> */}
            <button
              className={css.menu}
              onClick={toggleMenu}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <svg width={32} height={32} className={css.menuBtn}>
                <use
                  href={`/symbol-defs.svg#${isOpen ? "icon-x" : "icon-menu"}`}
                />
              </svg>
            </button>
          </div>
        </section>
      </Container>

      {isOpen && (
        <MobileMenu
          isAuth={isAuth}
          user={user}
          onClose={() => setIsOpen(false)}
        />
      )}
    </header>
  );
}
