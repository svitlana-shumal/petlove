'use client';

import { useRef, useState } from 'react';
import css from './SearchField.module.css';

interface SearchFieldProp {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchField({ onSearch, placeholder = 'Search' }: SearchFieldProp) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <form className={css.searchCont} onSubmit={handleSubmit}>
      <input
        type="text"
        name="search"
        placeholder={placeholder}
        className={css.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search query"
      />
      <button className={css.inputBtn} type="submit" aria-label="Search">
        <svg width={18} height={18}>
          <use href="/symbol-defs.svg#icon-search" />
        </svg>
      </button>
      {query && (
        <button
          className={css.clearBtn}
          type="button"
          onClick={handleClear}
          aria-label="Clear search query"
        >
          <svg width={18} height={18}>
            <use href="/symbol-defs.svg#icon-x" />
          </svg>
        </button>
      )}
    </form>
  );
}
