import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class ResponseBookingDto {
  @IsNotEmpty()
  @IsUUID('4')
  bookingId: string;
}
