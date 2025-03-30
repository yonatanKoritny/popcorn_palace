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
  endTime: Date;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;
}
