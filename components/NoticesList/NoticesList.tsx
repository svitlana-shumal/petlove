'use client';

import Loader from '@/components/Loader/Loader';
import css from './NoticesList.module.css';
import { NoticeDetails } from '@/types/notices';
import NoticesItem from '../NoticesItem/NoticesItem';

type NoticesListProp = {
  notices: NoticeDetails[];
  loading: boolean;
  error?: string | null;
};

export default function NoticesList({ notices, loading, error }: NoticesListProp) {
  return (
    <section className={css.notices}>
      {loading && notices.length === 0 && <Loader />}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && notices.length === 0 && <p>No notices found</p>}
      <ul className={css.list}>
        {notices.map((notice) => (
          <NoticesItem key={notice._id} notice={notice} />
        ))}
      </ul>
      {loading && notices.length > 0 && <Loader />}
    </section>
  );
}
