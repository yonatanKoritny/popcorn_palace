import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  Length,
  Matches,
} from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @Length(2, 30, { message: 'Title must be between 2 and 30 characters' })
  @Matches(/^[a-zA-Z0-9\s\-.,!?()]+$/, {
    message:
      'Title can only contain letters, numbers, spaces, and basic punctuation',
  })
  @Transform(({ value }) => value.trim())
  title: string;

  @IsNotEmpty({ message: 'Genre is required' })
  @IsString({ message: 'Genre must be a string' })
  @Length(1, 50, { message: 'Genre must be between 1 and 50 characters' })
  @Matches(/^[a-zA-Z\s\-]+$/, {
    message: 'Genre can only contain letters, spaces, and hyphens',
  })
  genre: string;

  @IsNotEmpty({ message: 'Duration is required' })
  @IsInt({ message: 'Duration must be an integer' })
  @Min(1, { message: 'Duration must be at least 1 minute' })
  @Max(1000, { message: 'Duration cannot exceed 1000 minutes' })
  duration: number;

  @IsNotEmpty({ message: 'Rating is required' })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    { message: 'Rating must be a number with up to 1 decimal place' },
  )
  @Min(0, { message: 'Rating must be at least 0' })
  @Max(10, { message: 'Rating cannot exceed 10' })
  rating: number;

  @IsNotEmpty({ message: 'Release year is required' })
  @IsInt({ message: 'Release year must be an integer' })
  @Min(1850, { message: 'Release year must be no earlier than 1850' })
  releaseYear: number;
}
