import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateShowtimeDto } from './dtos/create-showtime-dto';
import { UpdateShowtimeDto } from './dtos/update-showtime-dto';
import { ShowtimesService } from './showtimes.service';
import { Showtime } from './entities/showtimes.entity';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Get(':showtimeId')
  async findById(@Param('showtimeId') showtimeId: number): Promise<Showtime> {
    return this.showtimesService.findById(showtimeId);
  }

  @Post()
  async createShowtime(
    @Body() showtimes: CreateShowtimeDto,
  ): Promise<Showtime> {
    return this.showtimesService.create(showtimes);
  }

  @Post('update/:showtimeId')
  updateShowtimes(
    @Param('showtimeId') showtimeId: number,
    @Body() updateData: UpdateShowtimeDto,
  ): Promise<Showtime> {
    return this.showtimesService.update(showtimeId, updateData);
  }

  @Delete(':showtimeId')
  deleteShowtimes(@Param('showtimeId') showtimeId: number): Promise<void> {
    return this.showtimesService.delete(showtimeId);
  }
}
