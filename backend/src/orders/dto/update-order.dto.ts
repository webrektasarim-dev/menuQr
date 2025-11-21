import { IsEnum, IsOptional, IsInt, IsString } from 'class-validator';
import { OrderStatus, PaymentMethod } from '@prisma/client';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsInt()
  estimatedTime?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

