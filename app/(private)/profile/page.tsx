'use client';

import Container from '@/components/Container/Container';
import css from './Profile.module.css';

export default function Profile() {
  return (
    <section className={css.profile}>
      <Container>
        <div className={css.profileInfo}>
          <h3 className={css.title}>My information</h3>
          <form></form>
        </div>
      </Container>
    </section>
  );
}
