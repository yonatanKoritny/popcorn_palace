import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShowtimesService } from './showtimes.service';
import { Showtime } from './entities/showtimes.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateShowtimeDto } from './dtos/create-showtime-dto';
import { UpdateShowtimeDto } from './dtos/update-showtime-dto';
import { MoviesService } from '../movies/movies.service';

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let repository: Repository<Showtime>;
  let moviesService: MoviesService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockMoviesService = {
    findById: jest.fn(),
  };

  const mockMovie = {
    id: 1,
    title: 'Test Movie',
    genre: 'Action',
    duration: 120,
    rating: 8.5,
    releaseYear: 2024,
  };

  const mockShowtime: Showtime = {
    id: 1,
    movieId: 1,
    theater: 'Theater 1',
    startTime: new Date('2024-03-30T10:00:00'),
    endTime: new Date('2024-03-30T12:00:00'),
    price: 12.99,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        {
          provide: getRepositoryToken(Showtime),
          useValue: mockRepository,
        },
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
    repository = module.get<Repository<Showtime>>(getRepositoryToken(Showtime));
    moviesService = module.get<MoviesService>(MoviesService);
    mockRepository.findOne.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByTheater', () => {
    it('should return all showtimes for a theater', async () => {
      const showtimes = [mockShowtime];
      mockRepository.find.mockResolvedValue(showtimes);

      const result = await service.findByTheater('Theater 1');

      expect(result).toEqual(showtimes);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { theater: 'Theater 1' },
      });
    });
  });

  describe('findById', () => {
    it('should return a showtime by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockShowtime);

      const result = await service.findById(1);

      expect(result).toEqual(mockShowtime);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException when showtime is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createShowtimeDto: CreateShowtimeDto = {
      movieId: 1,
      theater: 'Theater 1',
      startTime: new Date('2024-03-30T10:00:00'),
      endTime: new Date('2024-03-30T12:00:00'),
      price: 12.99,
    };

    it('should create a new showtime', async () => {
      mockMoviesService.findById.mockResolvedValue(mockMovie);
      mockRepository.find.mockResolvedValue([]);
      mockRepository.create.mockReturnValue(mockShowtime);
      mockRepository.save.mockResolvedValue(mockShowtime);

      const result = await service.create(createShowtimeDto);

      expect(result).toEqual(mockShowtime);
      expect(mockMoviesService.findById).toHaveBeenCalledWith(
        createShowtimeDto.movieId,
      );
      expect(mockRepository.create).toHaveBeenCalledWith(createShowtimeDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when movie is not found', async () => {
      mockMoviesService.findById.mockRejectedValue(
        new NotFoundException('Movie not found'),
      );

      await expect(service.create(createShowtimeDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when there is a time conflict', async () => {
      const conflictingShowtime = {
        ...mockShowtime,
        startTime: new Date('2024-03-30T11:00:00'),
        endTime: new Date('2024-03-30T13:00:00'),
      };

      mockMoviesService.findById.mockResolvedValue(mockMovie);
      mockRepository.find.mockResolvedValue([conflictingShowtime]);

      await expect(service.create(createShowtimeDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    const updateShowtimeDto: UpdateShowtimeDto = {
      price: 14.99,
      theater: 'Theater 2',
    };

    it('should update an existing showtime', async () => {
      const updatedShowtime = { ...mockShowtime, ...updateShowtimeDto };

      mockRepository.findOne.mockResolvedValueOnce(mockShowtime);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValueOnce(updatedShowtime);

      const result = await service.update(1, updateShowtimeDto);

      expect(result).toEqual(updatedShowtime);
      expect(mockRepository.update).toHaveBeenCalledWith(
        mockShowtime.id,
        updateShowtimeDto,
      );
      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException when showtime to update is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updateShowtimeDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing showtime', async () => {
      mockRepository.findOne.mockResolvedValue(mockShowtime);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when showtime to delete is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
