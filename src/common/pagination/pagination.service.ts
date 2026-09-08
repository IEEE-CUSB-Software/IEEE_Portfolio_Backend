import { Injectable } from '@nestjs/common';
import {
  PaginationOptions,
  CursorPaginationOptions,
  PaginatedResult,
  CursorPaginatedResult,
} from './pagination.types';

@Injectable()
export class PaginationService {
  formatPaginatedResult<T>(
    data: T[],
    total: number,
    { limit, offset }: PaginationOptions,
  ): PaginatedResult<T> {
    return {
      data,
      total,
      limit,
      offset,
    };
  }

  generateNextCursor(
    lastItemId: string | number,
    sortField: number | string = lastItemId,
  ): string {
    const cursorData = { id: lastItemId, sort: sortField };
    return Buffer.from(JSON.stringify(cursorData)).toString('base64');
  }

  decodeCursor(cursor: string): { id: string | number; sort: number | string } | null {
    try {
      const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  formatCursorPaginatedResult<T>(
    data: T[],
    options: CursorPaginationOptions,
    lastItemId?: string | number,
  ): CursorPaginatedResult<T> {
    const nextCursor =
      data.length === options.limit && lastItemId
        ? this.generateNextCursor(lastItemId)
        : null;

    return {
      data,
      nextCursor,
      limit: options.limit,
    };
  }
}
