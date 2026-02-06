'use client';

import Container from '@/components/Container/Container';
import Loader from '@/components/Loader/Loader';
import NewsList from '@/components/NewsList/NewsList';
import SearchField from '@/components/SearchField/SearchField';
import Title from '@/components/Title/Title';
import { NewsResponse } from '@/types/news';
import { useEffect, useState } from 'react';
import NotFound from '../not-found';
import { fetchNews } from '@/lib/clientApi';
import Pagination from '@/components/Pagination/Pagination';

export default function News() {
  const [news, setNews] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const loadNews = async (keyword?: string, page: number = 1) => {
    setLoading(true);
    setNotFound(false);

    const data = await fetchNews(keyword, page);

    if (!data || !data.results || data.results.length === 0) {
      setNotFound(true);
      setNews(null);
    } else {
      setNews(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      loadNews();
    }, 0);
  }, []);

  return (
    <Container>
      <Title text="News" />
      <SearchField onSearch={loadNews} />
      {loading && <Loader />}
      {!loading && notFound && <NotFound />}
      {!loading && !notFound && news && <NewsList news={news} />}
      {news && (
        <Pagination
          currentPage={news?.page ?? 1}
          totalPages={news?.totalPages ?? 1}
          onPageChange={(page) => loadNews(undefined, page)}
        />
      )}
    </Container>
  );
}
