'use client';

import Container from '@/components/Container/Container';
import PetBlock from '@/components/PetBlock/PetBlock';
import css from './AddPet.module.css';

export default function AddPet() {
  return (
    <Container>
      <section className={css.page}>
        <PetBlock
          alt="Happy dog"
          images={{
            mobile: '/dogPet/dogPet-mobile2x.webp',
            tablet: '/dogPet/dogPet-tablet2x.webp',
            desktop: '/dogPet/dogPet-desktop2x.webp',
          }}
        />
        <div className={css.contPage}>
          <h2 className={css.title}>
            Add my pet / <span className={css.subtitle}>personal details</span>
          </h2>
        </div>
      </section>
    </Container>
  );
}
