import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { Showtime } from './entities/showtimes.entity';
import { CreateShowtimeDto } from './dtos/create-showtime-dto';
import { UpdateShowtimeDto } from './dtos/update-showtime-dto';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  let service: ShowtimesService;

  const mockShowtimesService = {
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
      controllers: [ShowtimesController],
      providers: [
        {
          provide: ShowtimesService,
          useValue: mockShowtimesService,
        },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    service = module.get<ShowtimesService>(ShowtimesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findById', () => {
    it('should return a showtime by id', async () => {
      mockShowtimesService.findById.mockResolvedValue(mockShowtime);

      const result = await controller.findById(1);

      expect(result).toEqual(mockShowtime);
      expect(mockShowtimesService.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('createShowtime', () => {
    const createShowtimeDto: CreateShowtimeDto = {
      movieId: 1,
      theater: 'Theater 1',
      startTime: new Date('2024-03-30T10:00:00'),
      endTime: new Date('2024-03-30T12:00:00'),
      price: 12.99,
    };

    it('should create a new showtime', async () => {
      mockShowtimesService.create.mockResolvedValue(mockShowtime);

      const result = await controller.createShowtime(createShowtimeDto);

      expect(result).toEqual(mockShowtime);
      expect(mockShowtimesService.create).toHaveBeenCalledWith(
        createShowtimeDto,
      );
    });
  });

  describe('updateShowtimes', () => {
    const updateShowtimeDto: UpdateShowtimeDto = {
      price: 14.99,
      theater: 'Theater 2',
    };

    it('should update an existing showtime', async () => {
      const updatedShowtime = { ...mockShowtime, ...updateShowtimeDto };
      mockShowtimesService.update.mockResolvedValue(updatedShowtime);

      const result = await controller.updateShowtimes(1, updateShowtimeDto);

      expect(result).toEqual(updatedShowtime);
      expect(mockShowtimesService.update).toHaveBeenCalledWith(
        1,
        updateShowtimeDto,
      );
    });
  });

  describe('deleteShowtimes', () => {
    it('should delete an existing showtime', async () => {
      mockShowtimesService.delete.mockResolvedValue(undefined);

      await controller.deleteShowtimes(1);

      expect(mockShowtimesService.delete).toHaveBeenCalledWith(1);
    });
  });
});
