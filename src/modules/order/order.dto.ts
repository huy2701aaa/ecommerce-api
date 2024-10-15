import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ORDER_STATUS, PAYMENT_TYPE } from 'src/common/enums';

export class CreateOrderDto {
  @IsString()
  totalMoney: string;

  @IsEnum(PAYMENT_TYPE)
  paymentType: PAYMENT_TYPE;

  @IsString()
  @IsOptional()
  userNote: string;
}

export class UpdateOrderDto {
  @IsString()
  orderStatus: ORDER_STATUS;
}

export class GetListOrderDto {
  @IsOptional()
  @IsNumber()
  page: number;

  @IsNumber()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  q?: string;

  @IsEnum(ORDER_STATUS)
  @IsOptional()
  orderStatus: ORDER_STATUS;
}
