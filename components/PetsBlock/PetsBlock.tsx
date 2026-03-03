'use client';

import AddPet from '../AddPet/AddPet';
import PetsList from '../PetsList/PetsList';
import css from './PetsBlock.module.css';

export default function PetsBlock() {
  return (
    <div className={css.petsBlock}>
      <AddPet />
      <PetsList />
    </div>
  );
}
