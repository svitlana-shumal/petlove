'use client';

import Image from 'next/image';
import { ProfilePet } from '@/types/pets';
import css from './PetsItem.module.css';

type PetsItemProps = {
  pet: ProfilePet;
  onRemove: () => void;
  isRemoving: boolean;
};

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function PetsItem({ pet, onRemove, isRemoving }: PetsItemProps) {
  return (
    <li className={css.item}>
      <Image
        src={pet.imgURL}
        alt={pet.name}
        width={80}
        height={80}
        className={css.image}
        unoptimized
      />
      <div className={css.info}>
        <h3 className={css.title}>{pet.title}</h3>
        <dl className={css.details}>
          <div>
            <dt>Name</dt>
            <dd>{pet.name}</dd>
          </div>
          <div>
            <dt>Birthday</dt>
            <dd>{new Date(pet.birthday).toLocaleDateString('uk-UA')}</dd>
          </div>
          <div>
            <dt>Sex</dt>
            <dd>{capitalize(pet.sex)}</dd>
          </div>
          <div>
            <dt>Species</dt>
            <dd>{capitalize(pet.species)}</dd>
          </div>
        </dl>
      </div>
      <button
        type="button"
        className={css.remove}
        onClick={onRemove}
        disabled={isRemoving}
        aria-label={`Remove ${pet.name}`}
      >
        <svg width={18} height={18} aria-hidden="true">
          <use href="/symbol-defs.svg#icon-trash" />
        </svg>
      </button>
    </li>
  );
}
