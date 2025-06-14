import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class InstallmentItemDto {
  @IsNumber()
  amount: number;

  @IsString()
  date: string; // ISO date string (e.g., '2025-07-01')
}

export class UpdateLendBorrowDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstallmentItemDto)
  installment?: InstallmentItemDto[];
}
