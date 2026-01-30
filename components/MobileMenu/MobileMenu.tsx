"use client";

import Link from "next/link";
import css from "./MobileMenu.module.css";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";

type User = { name: string; avatar?: string };

type MobileMenuProps = {
  isAuth: boolean;
  user?: User | null;
  onClose: () => void;
};

export default function MobileMenu({ isAuth, user, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.menu} onClick={(e) => e.stopPropagation()}>
        <nav className={css.nav}>
          <Link
            href="/news"
            className={`${css.navList} ${pathname === "/news" ? css.active : ""}`}
          >
            <span onClick={onClose}>News</span>
          </Link>
          <Link
            href="/notices"
            className={`${css.navList} ${pathname === "/notices" ? css.active : ""}`}
          >
            <span onClick={onClose}>Find pet</span>
          </Link>
          <Link
            href="/friends"
            className={`${css.navList} ${pathname === "/friends" ? css.active : ""}`}
          >
            <span onClick={onClose}>Our friends</span>
          </Link>
        </nav>

        {!isAuth ? (
          <div className={css.auth}>
            <Link href="/login" className={css.login}>
              <span onClick={onClose}>Log in</span>
            </Link>
            <Link href="/register" className={css.register}>
              <span onClick={onClose}>Registration</span>
            </Link>
          </div>
        ) : (
          <div className={css.user}>
            <Link href="/profile" className={css.profi}>
              <span onClick={onClose}>
                <Image
                  src={user?.avatar || "/user-default.png"}
                  alt="avatar"
                  width={40}
                  height={40}
                  className={css.avatar}
                />
                <span>{user?.name}</span>
              </span>
            </Link>
            <button className={css.logout} onClick={onClose}>
              Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
