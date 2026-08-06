import { SelectQueryBuilder } from 'typeorm';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Applies `skip`/`take` to a query builder and returns the page plus its
 * metadata.
 *
 * Always `skip`/`take`, never `offset`/`limit`: the latter are raw SQL and
 * bypass TypeORM's join-aware pagination (the DISTINCT-ids strategy that keeps
 * `leftJoinAndSelect` from multiplying rows).
 */
export async function paginate<T extends object>(
  qb: SelectQueryBuilder<T>,
  { page, limit }: PaginationParams,
): Promise<PaginatedResult<T>> {
  const [items, total] = await qb
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    items,
    total,
    page,
    limit,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  };
}

/**
 * Wraps a paginated result in the list-endpoint envelope, keyed by the
 * endpoint's own collection name (`committees`, `members`, ...).
 *
 * `count` is the total number of matched rows, not the length of this page.
 */
export function paginatedResponse<K extends string, T>(
  key: K,
  result: PaginatedResult<T>,
): Record<K, T[]> &
  Omit<PaginatedResult<T>, 'items' | 'total'> & { count: number } {
  return {
    [key]: result.items,
    count: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  } as Record<K, T[]> &
    Omit<PaginatedResult<T>, 'items' | 'total'> & { count: number };
}
