import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  showtimeId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  seatNumber: number;

  @IsNotEmpty()
  @IsUUID('4')
  userId: string;
}
