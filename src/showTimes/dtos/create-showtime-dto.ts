import {
  IsDateString,
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
} from 'class-validator';

export class CreateShowtimeDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  movieId: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Matches(/^[a-zA-Z0-9\s\-]+$/, {
    message:
      'Theater name can only contain letters, numbers, spaces, and hyphens',
  })
  theater: string;

  @IsNotEmpty()
  @IsDateString()
  @ValidateIf((o) => new Date(o.startTime) > new Date(), {
    message: 'Start time must be in the future',
  })
  startTime: Date;

  @IsNotEmpty()
  @IsDateString()
  @ValidateIf((o) => new Date(o.endTime) > new Date(o.startTime), {
    message: 'End time must be after start time',
  })
  endTime: Date;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(10000)
  price: number;
}
