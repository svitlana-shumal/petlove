'use client';

import Container from '@/components/Container/Container';
import PetBlock from '@/components/PetBlock/PetBlock';
import css from './AddPet.module.css';
import AddPetForm from '@/components/AddPetForm/AddPetForm';

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
        <AddPetForm />
      </section>
    </Container>
  );
}
