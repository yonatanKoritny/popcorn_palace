import { IsInt, IsNotEmpty, IsNumber, isPositive, IsString, Max, Min } from "class-validator";

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString() 
  title: string;

  @IsNotEmpty()
  @IsString()
  genre: string;

  @IsNotEmpty()
  @IsInt()
  duration: number; 

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(10)
  rating: number;

  @IsNotEmpty()
  @IsInt()
  releaseYear: number;

} 