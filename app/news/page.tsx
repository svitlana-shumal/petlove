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
  const requestId = useRef(0);

  const loadNews = useCallback(async (keyword?: string, page: number = 1) => {
    const currentRequestId = ++requestId.current;
    setLoading(true);
    setNotFound(false);
    setError(null);
    setNews(null);

    try {
      const data = await fetchNews(keyword, page);
      if (currentRequestId === requestId.current) {
        setNews(data);
        setNotFound(data.results.length === 0);
      }
    } catch (error) {
      if (currentRequestId === requestId.current) {
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
        <SearchField onSearch={handleSearch} />
      </div>
      {loading && <Loader />}
      {!loading && error && (
        <p className={css.error} role="alert">
          {error}
        </p>
      )}
      {!loading && notFound && (
        <div>
          <h2 className={css.notFound}>
            {keyword ? (
              <>
                No <span className={css.word}>{keyword}</span> found.
              </>
            ) : (
              'No news available.'
            )}
          </h2>
          {keyword && <p className={css.text}>Try changing your search parameters</p>}
        </div>
      )}
      {!loading && !notFound && news && <NewsList news={news} />}
      {!loading && !error && news && (
        <Pagination
          currentPage={news?.page ?? 1}
          totalPages={news?.totalPages ?? 1}
          onPageChange={(page) => loadNews(keyword, page)}
        />
      )}
    </Container>
  );
}
