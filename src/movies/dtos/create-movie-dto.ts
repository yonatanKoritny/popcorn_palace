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
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Matches(/^[a-zA-Z0-9\s\-.,!?()]+$/, {
    message:
      'Title can only contain letters, numbers, spaces, and basic punctuation',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Matches(/^[a-zA-Z\s\-]+$/, {
    message: 'Genre can only contain letters, spaces, and hyphens',
  })
  genre: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(1000)
  duration: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(10)
  rating: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1850)
  releaseYear: number;
}
