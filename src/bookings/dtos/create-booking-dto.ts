import { IsInt, IsNotEmpty, IsUUID, Min, Max } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'Showtime ID is required.' })
  @IsInt({ message: 'Showtime ID must be an integer.' })
  @Min(1, { message: 'Showtime ID must be at least 1.' })
  showtimeId: number;

  @IsNotEmpty({ message: 'Seat number is required.' })
  @IsInt({ message: 'Seat number must be an integer.' })
  @Min(1, { message: 'Seat number must be at least 1.' })
  @Max(100000, { message: 'Seat number must not exceed 100,000.' })
  seatNumber: number;

  @IsNotEmpty({ message: 'User ID is required.' })
  @IsUUID('4', { message: 'User ID must be a valid UUID version 4.' })
  userId: string;
}
