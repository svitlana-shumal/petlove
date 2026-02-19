export interface NewsResponse {
  page: number;
  perPage: number;
  totalPages: number;
  results: NewsItemType[];
}
export interface NewsItemType {
  _id: string;
  imgUrl: string;
  title: string;
  text: string;
  date: string;
  url: string;
  id: string;
}
export type FetchNewsParams = {
  keyword?: string;
  page?: number;
  limit?: number;
};
