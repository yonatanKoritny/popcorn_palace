import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dtos/create-booking-dto';
import { Booking } from './entities/booking.entity';
import { ShowtimesService } from 'src/showTimes/showtimes.service';
import { MoviesService } from 'src/movies/movies.service';
import { ResponseBookingDto } from './dtos/response-booking-dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private showtimesService: ShowtimesService,
  ) {}

  async create(bookingData: CreateBookingDto): Promise<ResponseBookingDto> {
    await this.showtimesService.findById(bookingData.showtimeId);

    const existingBooking = await this.findByShowtimeAndSeat(
      bookingData.showtimeId,
      bookingData.seatNumber,
    );
    if (existingBooking) {
      throw new ConflictException(
        `A booking already exists for showtime "${bookingData.showtimeId}" and seat "${bookingData.seatNumber}".`,
      );
    }

    const booking = this.bookingsRepository.create(bookingData);
    const savedBooking = await this.bookingsRepository.save(booking);
    return { bookingId: savedBooking.bookingId };
  }
  private findByShowtimeAndSeat(showtimeId: number, seatNumber: number) {
    return this.bookingsRepository.findOne({
      where: { showtimeId, seatNumber },
    });
  }
}
