'use client';

import css from './Login.module.css';
import Container from '@/components/Container/Container';
import LoginForm from '@/components/LoginForm/LoginForm';
import PetBlock from '@/components/PetBlock/PetBlock';
// import Title from '@/components/Title/Title';

export default function Registration() {
  return (
    <Container>
      <section className={css.page}>
        <PetBlock
          alt="Happy dog"
          images={{
            mobile: '/login/dog-mobile.webp',
            tablet: '/login/dog-tablet.webp',
            desktop: '/login/dog-desktop.webp',
          }}
        />
        {/* <Title text="Log in" /> */}
        <LoginForm />
      </section>
    </Container>
  );
}
