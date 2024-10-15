import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  image: string;
}

export class UpdateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  image: string;
}

export class GetListCategoryDto {
  @IsOptional()
  @IsNumber()
  page: number;

  @IsNumber()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  q?: string;
}
