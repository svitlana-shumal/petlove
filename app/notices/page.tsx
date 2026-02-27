'use client';

import Container from '@/components/Container/Container';
import css from './Notices.module.css';
import Title from '@/components/Title/Title';
import Pagination from '@/components/Pagination/Pagination';
import NoticesFilter from '@/components/NoticesFilters/NoticesFilters';
import NoticesList from '@/components/NoticesList/NoticesList';
import { useCallback, useEffect, useState } from 'react';
import { getNotices } from '@/lib/clientApi';
import { FiltersState, NoticeDetails } from '@/types/notices';

export default function Notices() {
  const [notices, setNotices] = useState<NoticeDetails[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    search: '',
    category: null,
    sex: null,
    species: null,
    locationId: null,
    sort: null,
  });

  function sortNotices(notices: NoticeDetails[], sort: FiltersState['sort']) {
    switch (sort) {
      case 'popular':
        return [...notices].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
      case 'unpopular':
        return [...notices].sort((a, b) => (a.popularity ?? 0) - (b.popularity ?? 0));
      case 'cheap':
        return [...notices].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      case 'expensive':
        return [...notices].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      default:
        return notices;
    }
  }

  const loadNotices = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      try {
        const data = await getNotices({
          page,
          limit: 6,
          keyword: filters.search || undefined,
          category: filters.category ?? undefined,
          sex: filters.sex ?? undefined,
          species: filters.species ?? undefined,
          locationId: filters.locationId ?? undefined,
        });
        const sortedResults = sortNotices(data.results, filters.sort);
        setNotices(sortedResults);
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching notices:', error);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    loadNotices(1);
  }, [loadNotices]);

  return (
    <Container className={css.cont}>
      <Title text="Find your favorite pet" />
      <NoticesFilter
        onFilterChange={(newFilters) => {
          setFilters((prev) =>
            JSON.stringify(prev) === JSON.stringify(newFilters) ? prev : newFilters
          );
        }}
      />
      <NoticesList notices={notices} loading={loading} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => loadNotices(newPage)}
      />
    </Container>
  );
}
