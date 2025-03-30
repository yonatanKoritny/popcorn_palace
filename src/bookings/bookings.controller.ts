import { Body, Controller, Post } from '@nestjs/common';

import { CreateBookingDto } from './dtos/create-booking-dto';
import { BookingsService } from './bookings.service';
import { ResponseBookingDto } from './dtos/response-booking-dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(
    @Body() bookings: CreateBookingDto,
  ): Promise<ResponseBookingDto> {
    return this.bookingsService.create(bookings);
  }
}
