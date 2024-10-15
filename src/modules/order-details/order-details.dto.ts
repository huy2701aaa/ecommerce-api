import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDetailsDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsString()
  color: string;

  @IsString()
  size: string;
}

export class UpdateOrderDetailsDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;
}

export class GetListOrderDetailsDto {
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
