'use client';

import Container from '@/components/Container/Container';
import css from './Notices.module.css';
import Title from '@/components/Title/Title';
import Pagination from '@/components/Pagination/Pagination';
import NoticesFilter from '@/components/NoticesFilters/NoticesFilters';
import NoticesList from '@/components/NoticesList/NoticesList';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getNotices } from '@/lib/clientApi';
import { FiltersState, NoticeDetails } from '@/types/notices';

export default function Notices() {
  const [notices, setNotices] = useState<NoticeDetails[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const [filterResetKey, setFilterResetKey] = useState(0);

  const [filters, setFilters] = useState<FiltersState>({
    search: '',
    category: null,
    sex: null,
    species: null,
    locationId: null,
    sort: null,
  });
  const hasActiveFilters = Object.values(filters).some(Boolean);

  const loadNotices = useCallback(
    async (page: number = 1) => {
      const currentRequestId = ++requestId.current;
      setLoading(true);
      setError(null);
      try {
        const data = await getNotices({
          page,
          limit: 6,
          keyword: filters.search || undefined,
          category: filters.category ?? undefined,
          sex: filters.sex ?? undefined,
          species: filters.species ?? undefined,
          locationId: filters.locationId ?? undefined,
          sort: filters.sort ?? undefined,
        });
        if (currentRequestId === requestId.current) {
          setNotices(data.results);
          setPage(data.page);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        if (currentRequestId === requestId.current) {
          setNotices([]);
          setTotalPages(1);
          setError(error instanceof Error ? error.message : 'Unable to load notices.');
        }
      } finally {
        if (currentRequestId === requestId.current) {
          setLoading(false);
        }
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
        key={filterResetKey}
        onFilterChange={(newFilters) => {
          setFilters((prev) =>
            JSON.stringify(prev) === JSON.stringify(newFilters) ? prev : newFilters
          );
        }}
      />
      <NoticesList
        notices={notices}
        loading={loading}
        error={error}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={() => setFilterResetKey((key) => key + 1)}
      />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => loadNotices(newPage)}
      />
    </Container>
  );
}
