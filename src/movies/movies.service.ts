import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { UpdateMovieDto } from './dtos/update-movie-dto';
import { CreateMovieDto } from './dtos/create-movie-dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  private async findByTitle(title: string): Promise<Movie> {
    return this.moviesRepository.findOne({ where: { title } });
  }

  async findById(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException(`Movie with ID "${id}" not found.`);
    }
    return movie;
  }

  async findAll(): Promise<Movie[]> {
    return this.moviesRepository.find();
  }

  async create(movieData: CreateMovieDto): Promise<Movie> {
    const movie = this.moviesRepository.create(movieData);
    return this.moviesRepository.save(movie);
  }

  async update(title: string, movie: UpdateMovieDto): Promise<Movie> {
    const movieToUpdate = await this.findByTitle(title);
    if (!movieToUpdate)
      throw new NotFoundException(`Movie "${title}" not found.`);
    await this.moviesRepository.update(movieToUpdate.id, movie);
    return this.findByTitle(movieToUpdate.title);
  }

  async delete(title: string): Promise<void> {
    const movieToDelete = await this.findByTitle(title);
    if (!movieToDelete)
      throw new NotFoundException(`Movie "${title}" not found.`);
    await this.moviesRepository.delete(movieToDelete.id);
  }
}
