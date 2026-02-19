'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import css from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const isTablet = useMediaQuery('(min-width: 768px)');

  if (!totalPages || totalPages <= 1) return null;

  const pages: (number | string)[] = [];

  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (isTablet) {
      if (currentPage <= 2) {
        pages.push(1, 2, 3, '...');
      } else if (currentPage >= totalPages - 1) {
        pages.push('...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2);
        pages.push('...');
      } else if (currentPage >= totalPages - 1) {
        pages.push('...');
        pages.push(totalPages - 1, totalPages);
      } else {
        pages.push('...');
        pages.push(currentPage);
        pages.push('...');
      }
    }
  }

  return (
    <nav className={css.pagination} aria-label="Pagination">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={css.circle}
        aria-label="First page"
      >
        <svg width={20} height={20} className={css.right}>
          <use href="/symbol-defs.svg#icon-left" />
        </svg>
        <svg width={20} height={20} className={css.icon}>
          <use href="/symbol-defs.svg#icon-left" />
        </svg>
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={css.circle}
      >
        <svg width={20} height={20} className={css.icon}>
          <use href="/symbol-defs.svg#icon-left" />
        </svg>
      </button>

      <div className={css.numbers}>
        {pages.map((p, idx) =>
          typeof p === 'number' ? (
            <button
              key={idx}
              onClick={() => onPageChange(p)}
              disabled={p === currentPage}
              className={`${css.circle} ${p === currentPage ? css.active : ''}`}
            >
              {p}
            </button>
          ) : (
            <span key={idx} className={css.ellipsis}>
              {p}
            </span>
          )
        )}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={css.circle}
      >
        <svg width={20} height={20} className={css.icon}>
          <use href="/symbol-defs.svg#icon-rigth" />
        </svg>
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={css.circle}
      >
        <svg width={20} height={20} className={css.right}>
          <use href="/symbol-defs.svg#icon-rigth" />
        </svg>
        <svg width={20} height={20} className={css.icon}>
          <use href="/symbol-defs.svg#icon-rigth" />
        </svg>
      </button>
    </nav>
  );
}
