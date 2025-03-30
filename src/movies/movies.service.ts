import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { Repository } from 'typeorm';
import { UpdateMovieDto } from './dtos/update-movie-dto';
import { CreateMovieDto } from './dtos/create-movie-dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async findAll(): Promise<Movie[]> {
    return this.moviesRepository.find();
  }

  async findById(id: number): Promise<Movie> {
    return this.moviesRepository.findOne({ where: { id } });
  }

  async findByTitle(title: string): Promise<Movie> {
    return this.moviesRepository.findOne({ where: { title } });
  }
  async create(movieData: CreateMovieDto): Promise<Movie> {
    const existingMovie = await this.moviesRepository.findOne({ where: movieData });
    if (existingMovie) {
      throw new Error('Movie with the same details already exists.');
    }
    const movie = this.moviesRepository.create(movieData); 
    return this.moviesRepository.save(movie); 
  }
  async update(title: string, movie: UpdateMovieDto): Promise<Movie> {
    const movieToUpdate = await this.moviesRepository.findOne({ where: { title } }); 
    if (!movieToUpdate) throw new NotFoundException(`Movie "${title}" not found.`);
    await this.moviesRepository.update(movieToUpdate.id, movie); 
    return this.findById(movieToUpdate.id);
  }
  async delete(title: string): Promise<void> {
    await this.moviesRepository.delete({ title });
  }
}
