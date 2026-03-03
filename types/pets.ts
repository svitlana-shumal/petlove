import { Sex, Species } from './notices';

export type Pet = {
  name: string;
  title: string;
  imgURL: string;
  species: Species;
  birthday: string;
  sex: Sex;
};

export type PetFormValues = Pet;

export const speciesOptions: Species[] = [
  'dog',
  'cat',
  'monkey',
  'bird',
  'snake',
  'turtle',
  'lizard',
  'frog',
  'fish',
  'ants',
  'bees',
  'butterfly',
  'spider',
  'scorpion',
];

export const sexOptions: Sex[] = ['unknown', 'female', 'male', 'multiple'];
