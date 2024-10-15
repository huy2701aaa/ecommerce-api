import { IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  fromId: number;

  @IsNumber()
  toId: number;

  @IsString()
  @ValidateIf((o) => !o.image)
  content: string;

  @IsString()
  @ValidateIf((o) => !o.content)
  image: string;
}

export class UpdateChatDto {
  @IsNumber()
  fromId: number;

  @IsNumber()
  toId: number;

  @IsString()
  @ValidateIf((o) => !o.image)
  content: string;

  @IsString()
  @ValidateIf((o) => !o.content)
  image: string;
}

export class GetListChatDto {
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
