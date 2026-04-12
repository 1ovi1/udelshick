import { PaginationMeta } from './pagination-meta';

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}
