export interface PaginationOptions {
  limit: number;
  offset: number;
}

export interface CursorPaginationOptions {
  limit: number;
  cursor?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface CursorPaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
  limit: number;
}
