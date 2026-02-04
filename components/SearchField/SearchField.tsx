'use client';

import { useState } from 'react';
import css from './SearchField.module.css';

interface SearchFieldProp {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchField({ onSearch, placeholder = 'Search' }: SearchFieldProp) {
  const [query, setQuery] = useState('');

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => setQuery('');

  return (
    <form className={css.searchCont} onSubmit={handleSubmit}>
      <input
        type="text"
        name="search"
        placeholder={placeholder}
        className={css.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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
          aria-label="Clear search"
        >
          <svg width={18} height={18}>
            <use href="/symbol-defs.svg#icon-x" />
          </svg>
        </button>
      )}
    </form>
  );
}
