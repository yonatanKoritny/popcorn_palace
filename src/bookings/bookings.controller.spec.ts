import { TestingModule, Test } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dtos/create-booking-dto';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  const mockBookingsService = {
    create: jest.fn(),
  };

  const mockBooking = {
    bookingId: '123e4567-e89b-12d3-a456-426614174000',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createBooking', () => {
    const createBookingDto: CreateBookingDto = {
      showtimeId: 1,
      seatNumber: 5,
      userId: '123e4567-e89b-12d3-a456-426614174001',
    };

    it('should create a new booking', async () => {
      mockBookingsService.create.mockResolvedValue(mockBooking);

      const result = await controller.createBooking(createBookingDto);

      expect(result).toEqual(mockBooking);
      expect(mockBookingsService.create).toHaveBeenCalledWith(createBookingDto);
    });
  });
});
