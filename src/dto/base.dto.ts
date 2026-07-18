export interface PaginationReq<T = any> {
  skip: number;
  take: number;
  where?: T;
}

export interface PaginationRes<T = any> {
  data: T[];
  total: number;
}
