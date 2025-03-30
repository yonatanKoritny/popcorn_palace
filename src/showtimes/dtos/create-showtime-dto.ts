import {
  isDate,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  isPositive,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateShowtimeDto {
  @IsNotEmpty()
  @IsInt()
  movieId: number;

  @IsNotEmpty()
  @IsString()
  theater: string;

  @IsNotEmpty()
  @IsDateString()
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
  price: number;
}
