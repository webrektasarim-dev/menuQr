import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { PlanType } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  businessName?: string;

  @IsOptional()
  @IsString()
  subdomain?: string;

  @IsOptional()
  @IsEnum(PlanType)
  plan?: PlanType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

