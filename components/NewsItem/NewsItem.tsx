'use client';

import Image from 'next/image';
import css from './NewsItem.module.css';
import { NewsItemType } from '@/types/news';
import Link from 'next/link';
import { formatDate } from '@/utils/truncate';

interface NewsItemProp {
  item: NewsItemType;
}

export default function NewsItem({ item }: NewsItemProp) {
  return (
    <li className={css.itemCont}>
      <Image
        src={item.imgUrl}
        alt={`Image to ${item.title}`}
        width={335}
        height={190}
        className={css.newsPhoto}
        loading="lazy"
      />
      <div className={css.content}>
        <h3 className={css.title}>{item.title}</h3>
        <p className={css.desc}>{item.text}</p>
        <div className={css.dateInfo}>
          <p className={css.date}>{formatDate(item.date)}</p>
          <Link href={item.url} target="_blank" rel="noopener noreferrer" className={css.link}>
            Read more
          </Link>
        </div>
      </div>
    </li>
  );
}
