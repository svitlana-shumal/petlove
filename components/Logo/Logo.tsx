import Link from 'next/link';
import css from './Logo.module.css';

export default function Logo() {
  return (
    <>
      <Link href="/" className={css.logo}>
        petl
        <span className={css.heart}>
          <svg width={17} height={17}>
            <use href="/symbol-defs.svg#icon-heart" />
          </svg>
        </span>
        ve
      </Link>
    </>
  );
}
