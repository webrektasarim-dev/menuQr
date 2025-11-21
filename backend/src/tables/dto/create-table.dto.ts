import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTableDto {
  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

