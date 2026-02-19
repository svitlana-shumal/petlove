'use client';

import Container from '@/components/Container/Container';
import css from './Notices.module.css';
import Title from '@/components/Title/Title';
import Pagination from '@/components/Pagination/Pagination';
import NoticesFilter from '@/components/NoticesFilters/NoticesFilters';
import NoticesList from '@/components/NoticesList/NoticesList';
import { useEffect, useState } from 'react';
import { getNotices } from '@/lib/clientApi';
import { NoticeDetails } from '@/types/notices';

export default function Notices() {
  const [notices, setNotices] = useState<NoticeDetails[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadNotices = async (page: number = 1) => {
    setLoading(true);
    try {
      const data = await getNotices({ page, limit: 6 });
      setNotices(data.results);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadNotices();
  }, []);

  return (
    <Container className={css.cont}>
      <Title text="Find your favorite pet" />
      <NoticesFilter onFilterChange={(filters) => console.log(filters)} />
      <NoticesList notices={notices} loading={loading} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => loadNotices(newPage)}
      />
    </Container>
  );
}
