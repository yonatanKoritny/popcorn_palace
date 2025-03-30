import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dtos/create-booking-dto';
import { ShowtimesService } from '../showtimes/showtimes.service';

describe('BookingsService', () => {
  let service: BookingsService;
  let repository: Repository<Booking>;
  let showtimesService: ShowtimesService;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockShowtimesService = {
    findById: jest.fn(),
  };

  const mockShowtime = {
    id: 1,
    movieId: 1,
    theater: 'Theater 1',
    startTime: new Date('2024-03-30T10:00:00'),
    endTime: new Date('2024-03-30T12:00:00'),
    price: 12.99,
  };

  const mockBooking: Booking = {
    bookingId: '123e4567-e89b-12d3-a456-426614174000',
    showtimeId: 1,
    seatNumber: 5,
    userId: '123e4567-e89b-12d3-a456-426614174001',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockRepository,
        },
        {
          provide: ShowtimesService,
          useValue: mockShowtimesService,
        },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    repository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
    showtimesService = module.get<ShowtimesService>(ShowtimesService);
    mockRepository.findOne.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createBookingDto: CreateBookingDto = {
      showtimeId: 1,
      seatNumber: 5,
      userId: '123e4567-e89b-12d3-a456-426614174001',
    };

    it('should create a new booking', async () => {
      mockShowtimesService.findById.mockResolvedValue(mockShowtime);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockBooking);
      mockRepository.save.mockResolvedValue(mockBooking);

      const result = await service.create(createBookingDto);

      expect(result).toEqual({ bookingId: mockBooking.bookingId });
      expect(mockShowtimesService.findById).toHaveBeenCalledWith(createBookingDto.showtimeId);
      expect(mockRepository.create).toHaveBeenCalledWith(createBookingDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when showtime is not found', async () => {
      mockShowtimesService.findById.mockRejectedValue(new NotFoundException('Showtime not found'));

      await expect(service.create(createBookingDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when seat is already booked', async () => {
      mockShowtimesService.findById.mockResolvedValue(mockShowtime);
      mockRepository.findOne.mockResolvedValue(mockBooking);

      await expect(service.create(createBookingDto)).rejects.toThrow(ConflictException);
    });
  });
});
