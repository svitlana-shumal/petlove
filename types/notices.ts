export type Pet = {
  _id: string;
  species: Species;
  category: Category;
  price?: number;
  title: string;
  name: string;
  birthday: string;
  comment: string;
  sex: Sex;
  location: string;
  imgURL: string;
  createdAt: string;
  updatedAt?: string;
  user: string;
  popularity: number;
};

export type FetchPetsResponse = {
  page: number;
  perPage: number;
  totalPages: number;
  results: Pet[];
};
export type PetsFilters = {
  keyword?: string;
  category?: Category;
  species?: Species;
  locationId?: string;

  byPopularity?: boolean;
  byPrice?: boolean;
  sex?: Sex;

  page?: number;
  limit?: number;
};
export type NoticesQueryParams = {
  keyword?: string;
  category?: Category;
  species?: Species;
  locationId?: string;

  buDate?: boolean;
  byPopularity?: boolean;
  byPrice?: boolean;

  page?: number;
  limit?: number;
  sex?: Sex;
};
export type NoticeResponse = {
  results: NoticeDetails[];
  page: number;
  perPage: number;
  totalPages: number;
};
export type Notice = {
  _id: string;
  species: Species;
  category: Category;
  price?: string;
  title: string;
  name: string;
  birthday: string;
  sex: Sex;
  imgURL: string;
  popularity: number;
  comment: string;
  isFavorite: boolean;
};
export type NoticeDetails = {
  _id: string;
  species: Species;
  category: Category;
  price?: number;
  title: string;
  name: string;
  birthday: string;
  comment: string;
  sex: Sex;
  location: City;
  imgURL: string;
  createdAt: string;
  updatedAt?: string;
  user: {
    _id: string;
    email: string;
    phone?: string;
  };
  popularity: number;
  isFavorite: boolean;
};

export type Category = 'Sell' | 'Free' | 'Lost' | 'Found';

export type Sex = 'unknown' | 'female' | 'male' | 'multiple';

export type Species =
  | 'dog'
  | 'cat'
  | 'monkey'
  | 'bird'
  | 'snake'
  | 'turtle'
  | 'lizard'
  | 'frog'
  | 'fish'
  | 'ants'
  | 'bees'
  | 'butterfly'
  | 'spider'
  | 'scorpion';

export type City = {
  _id: string;
  useCounty: string;
  stateEn: string;
  cityEn: string;
  countyEn: string;
};

export interface FiltersState {
  search: string;
  category: Category;
  sex: Sex;
  species: Species;
  location: City;
  sort: 'popularity' | 'price';
}
