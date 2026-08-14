import { applyDecorators } from '@nestjs/common';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

/**
 * Requires at least two Unicode letters somewhere in the string (in order,
 * across lines), blocking pure punctuation/digit/whitespace junk while
 * allowing any script (Arabic, Latin, etc).
 */
export const CONTAINS_LETTERS_REGEX = /\p{L}[\s\S]*\p{L}/u;

interface HumanTextOptions {
  minLength: number;
  maxLength: number;
  fieldLabel: string;
}

/** Free-text field (title/name/description/...): required, non-empty, bounded, must contain letters. */
export const IsHumanText = ({
  minLength,
  maxLength,
  fieldLabel,
}: HumanTextOptions) =>
  applyDecorators(
    IsString(),
    IsNotEmpty(),
    MinLength(minLength),
    MaxLength(maxLength),
    Matches(CONTAINS_LETTERS_REGEX, {
      message: `${fieldLabel} must contain at least two letters`,
    }),
  );

/**
 * Free-text field that is optional: skips all checks when the value is
 * undefined, null, or '' (plain @IsOptional() only skips undefined/null,
 * so it would otherwise reject an intentionally-blank optional field).
 */
export const IsOptionalHumanText = ({
  minLength,
  maxLength,
  fieldLabel,
}: HumanTextOptions) =>
  applyDecorators(
    IsString(),
    ValidateIf(
      (_object: unknown, value: unknown) =>
        value !== undefined && value !== null && value !== '',
    ),
    MinLength(minLength),
    MaxLength(maxLength),
    Matches(CONTAINS_LETTERS_REGEX, {
      message: `${fieldLabel} must contain at least two letters`,
    }),
  );
