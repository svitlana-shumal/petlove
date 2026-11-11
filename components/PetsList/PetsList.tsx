'use client';

import { removePet } from '@/lib/clientApi';
import { useAuthStore } from '@/lib/store/auth';
import toast from 'react-hot-toast';
import { useState } from 'react';
import css from './PetsList.module.css';
import PetsItem from '../PetsItem/PetsItem';

export default function PetsList() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const [removingPetId, setRemovingPetId] = useState<string | null>(null);
  const pets = user?.pets ?? [];

  const handleRemove = async (petId: string) => {
    if (!user || removingPetId) return;
    setRemovingPetId(petId);
    try {
      await removePet(petId);
      updateUser({ ...user, pets: pets.filter((pet) => pet._id !== petId) });
      toast.success('Pet removed successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove pet');
    } finally {
      setRemovingPetId(null);
    }
  };

  if (isAuthLoading) return <p className={css.empty}>Loading your pets...</p>;
  if (pets.length === 0) return <p className={css.empty}>You haven&apos;t added any pets yet.</p>;

  return (
    <ul className={css.list}>
      {pets.map((pet) => (
        <PetsItem
          key={pet._id}
          pet={pet}
          onRemove={() => handleRemove(pet._id)}
          isRemoving={removingPetId === pet._id}
        />
      ))}
    </ul>
  );
}
