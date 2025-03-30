import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { MoviesModule } from '../movies/movies.module';
import { ShowtimesModule } from '../showTimes/showtimes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), ShowtimesModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
