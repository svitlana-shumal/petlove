'use client';

import { NewsItemType, NewsResponse } from '@/types/news';
import css from './NewsList.module.css';
import NewsItem from '../NewsItem/NewsItem';
import Loader from '../Loader/Loader';

interface NewsListProp {
  news: NewsResponse | null;
}

export default function NewsList({ news }: NewsListProp) {
  if (!news) return <Loader />;

  return (
    <ul className={css.list}>
      {news.results.map((item: NewsItemType) => (
        <NewsItem key={item._id} item={item} />
      ))}
    </ul>
  );
}
