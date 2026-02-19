'use client';

import Container from '@/components/Container/Container';
import css from './Profile.module.css';
import EditUserBtn from '@/components/EditUserBtn/EditUserBtn';

export default function Profile() {
  return (
    <section className={css.profile}>
      <Container>
        <div className={css.profileInfo}>
          <EditUserBtn />
          <h3 className={css.title}>My information</h3>

          <form></form>
        </div>
      </Container>
    </section>
  );
}
