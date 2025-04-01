import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dtos/create-movie-dto';
import { UpdateMovieDto } from './dtos/update-movie-dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('/all')
  async findAll(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Post()
  async createMovie(@Body() movie: CreateMovieDto): Promise<Movie> {
    return this.moviesService.create(movie);
  }

  @Post('update/:movieTitle')
  updateMovie(
    @Param('movieTitle') rawTitle: string,
    @Body() updateData: UpdateMovieDto,
  ) {
    const decodedTitle = decodeURIComponent(rawTitle);
    return this.moviesService.update(decodedTitle, updateData);
  }

  @Delete(':movieTitle')
  deleteMovie(@Param('movieTitle') rawTitle: string) {
    const decodedTitle = decodeURIComponent(rawTitle);
    return this.moviesService.delete(decodedTitle);
  }
}
