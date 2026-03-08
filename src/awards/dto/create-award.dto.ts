import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateAwardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  image_url: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  won_count?: number;
}
