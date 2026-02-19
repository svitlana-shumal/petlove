'use client';

import css from './News.module.css';
import Container from '@/components/Container/Container';
import Loader from '@/components/Loader/Loader';
import NewsList from '@/components/NewsList/NewsList';
import SearchField from '@/components/SearchField/SearchField';
import Title from '@/components/Title/Title';
import { NewsResponse } from '@/types/news';
import { useEffect, useState } from 'react';
import { fetchNews } from '@/lib/clientApi';
import Pagination from '@/components/Pagination/Pagination';

export default function News() {
  const [news, setNews] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [keyword, setKeyword] = useState<string | undefined>(undefined);

  const loadNews = async (keyword?: string, page: number = 1) => {
    setLoading(true);
    setNotFound(false);

    const data = await fetchNews(keyword, page);

    let results = data?.results ?? [];
    if (keyword) {
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword.toLowerCase()) ||
          item.text.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (data && results.length > 0) {
      setNews({
        results,
        page: data.page,
        perPage: data.perPage,
        totalPages: data.totalPages,
      });
    } else {
      setNotFound(true);
      setNews(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchInitialNews = async () => {
      await loadNews();
    };
    fetchInitialNews();
  }, []);

  return (
    <Container className={css.contNews}>
      <div className={css.titleCont}>
        <Title text="News" />
        <SearchField
          onSearch={(query) => {
            setKeyword(query);
            loadNews(query, 1);
          }}
        />
      </div>
      {loading && <Loader />}
      {!loading && notFound && (
        <>
          {keyword && (
            <div>
              <h2 className={css.notFound}>
                No <span className={css.word}>{keyword}</span> found.
              </h2>
              <p className={css.text}>Try changing your search parameters</p>
            </div>
          )}
        </>
      )}
      {!loading && !notFound && news && <NewsList news={news} />}
      {news && (
        <Pagination
          currentPage={news?.page ?? 1}
          totalPages={news?.totalPages ?? 1}
          onPageChange={(page) => loadNews(keyword, page)}
        />
      )}
    </Container>
  );
}
