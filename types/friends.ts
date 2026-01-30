export type Friend = {
  _id: string;
  title: string;
  url: string;
  addressUrl: string | null;
  imageUrl: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  workDays: WorkDay[] | null;
};

type WorkDay = {
  _id: string;
  isOpen: boolean;
  from?: string;
  to?: string;
};

export type FetchFriendsResponse = Friend[];
