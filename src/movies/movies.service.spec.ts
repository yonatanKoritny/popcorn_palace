import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dtos/create-movie-dto';
import { UpdateMovieDto } from './dtos/update-movie-dto';
import { ValidationError } from 'class-validator';

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: Repository<Movie>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
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
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    mockRepository.findOne.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      const movies = [mockMovie];
      mockRepository.find.mockResolvedValue(movies);

      const result = await service.findAll();

      expect(result).toEqual(movies);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a movie by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockMovie);

      const result = await service.findById(1);

      expect(result).toEqual(mockMovie);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when movie is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createMovieDto: CreateMovieDto = {
      title: 'Test Movie',
      genre: 'Action',
      duration: 120,
      rating: 8.5,
      releaseYear: 2024,
    };

    it('should create a new movie', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockMovie);
      mockRepository.save.mockResolvedValue(mockMovie);

      const result = await service.create(createMovieDto);

      expect(result).toEqual(mockMovie);
      expect(mockRepository.create).toHaveBeenCalledWith(createMovieDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateMovieDto: UpdateMovieDto = {
      genre: 'Comedy',
      duration: 150,
    };

    it('should update an existing movie', async () => {
      const updatedMovie = { ...mockMovie, ...updateMovieDto };

      mockRepository.findOne.mockResolvedValueOnce(mockMovie);
      mockRepository.findOne.mockResolvedValueOnce(updatedMovie);

      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update('Test Movie', updateMovieDto);

      expect(result).toEqual(updatedMovie);
      expect(mockRepository.update).toHaveBeenCalledWith(
        mockMovie.id,
        updateMovieDto,
      );
      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException when movie to update is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('Non-existent Movie', updateMovieDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an existing movie', async () => {
      mockRepository.findOne.mockResolvedValue(mockMovie);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete('Test Movie');

      expect(mockRepository.delete).toHaveBeenCalledWith(mockMovie.id);
    });

    it('should throw NotFoundException when movie to delete is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('Non-existent Movie')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
