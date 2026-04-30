import { PaginationMeta } from './pagination-meta.interface';

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}
