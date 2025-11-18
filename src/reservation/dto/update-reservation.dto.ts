import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class UpdateReservationDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  timeSlot?: string;

  @IsOptional()
  @IsNumber()
  partySize?: number;
}
