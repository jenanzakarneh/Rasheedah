import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsDateString()
  date: string;

  @IsString()
  timeSlot: string;

  @IsNumber()
  partySize: number;
}
