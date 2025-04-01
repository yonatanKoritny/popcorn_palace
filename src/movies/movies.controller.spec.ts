import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dtos/create-movie-dto';
import { UpdateMovieDto } from './dtos/update-movie-dto';

describe('MoviesController', () => {
  let controller: MoviesController;

  const mockMoviesService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    genre: 'Action',
    duration: 120,
    rating: 8.5,
    releaseYear: 2024,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      const movies = [mockMovie];
      mockMoviesService.findAll.mockResolvedValue(movies);

      const result = await controller.findAll();

      expect(result).toEqual(movies);
      expect(mockMoviesService.findAll).toHaveBeenCalled();
    });
  });

  describe('createMovie', () => {
    const createMovieDto: CreateMovieDto = {
      title: 'Test Movie',
      genre: 'Action',
      duration: 120,
      rating: 8.5,
      releaseYear: 2024,
    };

    it('should create a new movie', async () => {
      mockMoviesService.create.mockResolvedValue(mockMovie);

      const result = await controller.createMovie(createMovieDto);

      expect(result).toEqual(mockMovie);
      expect(mockMoviesService.create).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('updateMovie', () => {
    const updateMovieDto: UpdateMovieDto = {
      genre: 'Comedy',
      duration: 150,
    };

    it('should update an existing movie', async () => {
      const updatedMovie = { ...mockMovie, ...updateMovieDto };
      mockMoviesService.update.mockResolvedValue(updatedMovie);

      const result = await controller.updateMovie(
        'Test%20Movie',
        updateMovieDto,
      );

      expect(result).toEqual(updatedMovie);
      expect(mockMoviesService.update).toHaveBeenCalledWith(
        'Test Movie',
        updateMovieDto,
      );
    });

    it('should handle URL-encoded movie titles', async () => {
      const updatedMovie = { ...mockMovie, ...updateMovieDto };
      mockMoviesService.update.mockResolvedValue(updatedMovie);

      const result = await controller.updateMovie(
        'The%20Matrix%20%282021%29',
        updateMovieDto,
      );

      expect(result).toEqual(updatedMovie);
      expect(mockMoviesService.update).toHaveBeenCalledWith(
        'The Matrix (2021)',
        updateMovieDto,
      );
    });
  });

  describe('deleteMovie', () => {
    it('should delete an existing movie', async () => {
      mockMoviesService.delete.mockResolvedValue(undefined);

      await controller.deleteMovie('Test%20Movie');

      expect(mockMoviesService.delete).toHaveBeenCalledWith('Test Movie');
    });

    it('should handle URL-encoded movie titles', async () => {
      mockMoviesService.delete.mockResolvedValue(undefined);

      await controller.deleteMovie('The%20Matrix%20%282021%29');

      expect(mockMoviesService.delete).toHaveBeenCalledWith(
        'The Matrix (2021)',
      );
    });
  });
});
