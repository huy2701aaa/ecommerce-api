import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  productId: number;

  @IsString()
  @ValidateIf((o) => !o.image)
  content: string;

  @IsString()
  @ValidateIf((o) => !o.content)
  image: string;
}

export class UpdateCommentDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  userId: number;

  @IsString()
  @ValidateIf((o) => !o.image)
  content: string;

  @IsString()
  @ValidateIf((o) => !o.content)
  image: string;
}

export class GetListCommentDto {
  @IsOptional()
  @IsNumber()
  page: number;

  @IsNumber()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  q?: string;

  @IsNumberString()
  @IsOptional()
  productId?: number;
}
