import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetUserListDto {
  @IsString()
  @IsOptional()
  q?: string;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  page?: number;
}

export class UpdateUserInfo {
  @IsString()
  @IsOptional()
  userName: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
