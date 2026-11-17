'use client';

import Loader from '@/components/Loader/Loader';
import css from './NoticesList.module.css';
import { NoticeDetails } from '@/types/notices';
import NoticesItem from '../NoticesItem/NoticesItem';

type NoticesListProp = {
  notices: NoticeDetails[];
  loading: boolean;
  error?: string | null;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
};

export default function NoticesList({
  notices,
  loading,
  error,
  hasActiveFilters,
  onResetFilters,
}: NoticesListProp) {
  return (
    <section className={css.notices}>
      {loading && notices.length === 0 && <Loader variant="inline" />}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && notices.length === 0 && (
        <div className={css.emptyState} role="status">
          <h2 className={css.emptyTitle}>
            {hasActiveFilters ? 'No pets found with these filters' : 'No notices available yet'}
          </h2>
          <p className={css.emptyText}>
            {hasActiveFilters
              ? 'Try changing your search or resetting the filters.'
              : 'Please check back later.'}
          </p>
          {hasActiveFilters && (
            <button type="button" className={css.resetButton} onClick={onResetFilters}>
              Reset filters
            </button>
          )}
        </div>
      )}
      <ul className={css.list}>
        {notices.map((notice) => (
          <NoticesItem key={notice._id} notice={notice} />
        ))}
      </ul>
      {loading && notices.length > 0 && <Loader variant="inline" />}
    </section>
  );
}
