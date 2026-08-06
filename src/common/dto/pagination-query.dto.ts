import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

const isBlank = (value: unknown): boolean =>
  value === '' || value === null || value === undefined;

/**
 * Normalises an optional numeric query param. A blank param becomes
 * `undefined` so `@IsOptional()` skips it; anything else is coerced so
 * `@IsInt()` can reject it with a 400 rather than letting `NaN` through.
 *
 * Use this instead of `@Type(() => Number)`, which would turn `?year=` into
 * `0` and apply the filter. Never use both — `@Type` runs first, so a later
 * `@Transform` could no longer tell `?year=` from `?year=0`.
 */
export const toOptionalNumber = ({ value }: TransformFnParams): unknown =>
  isBlank(value) ? undefined : Number(value);

/**
 * Same coercion, but a blank param falls back to `fallback`.
 *
 * Required for `page`/`limit`: `exposeDefaultValues` only preserves the field
 * initializer when the key is *absent*. When a frontend sends `?page=` the key
 * is present, so a transform returning `undefined` would overwrite the
 * initializer and send `NaN` into TypeORM's `skip`/`take` — a 500.
 */
export const toNumberWithDefault =
  (fallback: number) =>
  ({ value }: TransformFnParams): unknown =>
    isBlank(value) ? fallback : Number(value);

export class PaginationQueryDto {
  @ApiPropertyOptional({
    type: Number,
    default: DEFAULT_PAGE,
    minimum: 1,
    example: 1,
    description: 'Page number (1-based)',
  })
  @Transform(toNumberWithDefault(DEFAULT_PAGE))
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    type: Number,
    default: DEFAULT_LIMIT,
    minimum: 1,
    maximum: MAX_LIMIT,
    example: 10,
    description: `Items per page (max ${MAX_LIMIT})`,
  })
  @Transform(toNumberWithDefault(DEFAULT_LIMIT))
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  @IsOptional()
  limit: number = DEFAULT_LIMIT;
}
