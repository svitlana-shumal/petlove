'use client';

import Container from '@/components/Container/Container';
import FriendsList from '@/components/FriendsList/FrientsList';
import Title from '@/components/Title/Title';
import css from './Friends.module.css';

export default function Friends() {
  return (
    <Container className={css.contFriend}>
      <div>
        <Title text="Our friends" />
        <FriendsList />
      </div>
    </Container>
  );
}
