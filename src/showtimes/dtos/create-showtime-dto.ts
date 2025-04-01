import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateIf,
  Length,
  Matches,
  IsDate,
} from 'class-validator';

export class CreateShowtimeDto {
  @IsNotEmpty({ message: 'Movie ID is required' })
  @IsInt({ message: 'Movie ID must be an integer' })
  @Min(1, { message: 'Movie ID must be at least 1' })
  movieId: number;

  @IsNotEmpty({ message: 'Theater name is required' })
  @IsString({ message: 'Theater name must be a string' })
  @Length(1, 50, {
    message: 'Theater name must be between 1 and 50 characters',
  })
  @Matches(/^[a-zA-Z0-9\s\-]+$/, {
    message:
      'Theater name can only contain letters, numbers, spaces, and hyphens',
  })
  theater: string;

  @IsNotEmpty({ message: 'Start time is required' })
  @IsDate()
  @ValidateIf((o) => new Date(o.startTime) > new Date(), {
    message: 'Start time must be in the future',
  })
  startTime: Date;

  @IsNotEmpty({ message: 'End time is required' })
  @IsDate()
  @ValidateIf((o) => new Date(o.endTime) > new Date(o.startTime), {
    message: 'End time must be after start time',
  })
  endTime: Date;

  @IsNotEmpty({ message: 'Price is required' })
  @IsPositive({ message: 'Price must be a positive number' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a valid number with up to 2 decimal places' },
  )
  @Min(1, { message: 'Price must be at least 1' })
  @Max(10000, { message: 'Price must not exceed 10000' })
  price: number;
}
