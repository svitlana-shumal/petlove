'use client';

import Container from '@/components/Container/Container';
import UserCard from '@/components/UserCard/UserCard';
import MyNotices from '@/components/MyNotices/MyNotices';
import css from './Profile.module.css';

export default function Profile() {
  return (
    <Container className={css.container}>
      <UserCard />
      <MyNotices />
    </Container>
  );
}
