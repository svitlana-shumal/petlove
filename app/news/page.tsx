'use client';

import css from './News.module.css';
import Container from '@/components/Container/Container';
import Loader from '@/components/Loader/Loader';
import NewsList from '@/components/NewsList/NewsList';
import SearchField from '@/components/SearchField/SearchField';
import Title from '@/components/Title/Title';
import { NewsResponse } from '@/types/news';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchNews } from '@/lib/clientApi';
import Pagination from '@/components/Pagination/Pagination';

export default function News() {
  const [news, setNews] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string | undefined>(undefined);
  const [searchResetKey, setSearchResetKey] = useState(0);
  const requestId = useRef(0);

  const loadNews = useCallback(async (keyword?: string, page: number = 1) => {
    const currentRequestId = ++requestId.current;
    setLoading(true);
    setNotFound(false);
    setError(null);

    try {
      const data = await fetchNews(keyword, page);
      if (currentRequestId === requestId.current) {
        setNews(data);
        setNotFound(data.results.length === 0);
      }
    } catch (error) {
      if (currentRequestId === requestId.current) {
        setNews(null);
        setError(error instanceof Error ? error.message : 'Unable to load news. Please try again.');
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadNews();
  }, [loadNews]);

  const handleSearch = (query: string) => {
    const searchQuery = query || undefined;
    setKeyword(searchQuery);
    void loadNews(searchQuery, 1);
  };

  return (
    <Container className={css.contNews}>
      <div className={css.titleCont}>
        <Title text="News" />
        <SearchField key={searchResetKey} onSearch={handleSearch} />
      </div>
      {loading && <Loader variant="inline" />}
      {!loading && error && (
        <p className={css.error} role="alert">
          {error}
        </p>
      )}
      {!loading && notFound && (
        <div className={css.emptyState} role="status">
          <h2 className={css.emptyTitle}>
            {keyword ? (
              <>
                No results for <span className={css.word}>“{keyword}”</span>
              </>
            ) : (
              'No news available yet'
            )}
          </h2>
          <p className={css.emptyText}>
            {keyword
              ? 'Try a different search term, or clear your search.'
              : 'Please check back later.'}
          </p>
          {keyword && (
            <button
              type="button"
              className={css.clearSearchButton}
              onClick={() => {
                setKeyword(undefined);
                setSearchResetKey((key) => key + 1);
                void loadNews();
              }}
            >
              Clear search
            </button>
          )}
        </div>
      )}
      {!notFound && news && <NewsList news={news} />}
      {!loading && !error && !notFound && news && (
        <Pagination
          currentPage={news?.page ?? 1}
          totalPages={news?.totalPages ?? 1}
          onPageChange={(page) => loadNews(keyword, page)}
        />
      )}
    </Container>
  );
}
