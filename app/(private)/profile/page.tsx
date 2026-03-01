'use client';

import Container from '@/components/Container/Container';
import css from './Profile.module.css';
import EditUserBtn from '@/components/EditUserBtn/EditUserBtn';
import UserBlock from '@/components/UserBlock/UserBlock';
import LogOutBtn from '@/components/LogOutBtn/LogOutBtn';

export default function Profile() {
  return (
    <Container>
      <section className={css.profile}>
        <div className={css.profileInfo}>
          <EditUserBtn />
          <UserBlock />
          <div className={css.logOut}>
            <LogOutBtn />
          </div>
        </div>
      </section>
    </Container>
  );
}
