import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateShowTimeDto } from './dtos/create-showtime-dto';
import { UpdateShowTimeDto } from './dtos/update-showtime-dto';
import { ShowTime } from './entities/showtimes.entity';
import { ShowTimesService } from './showtimes.service';

@Controller('showtimes')
export class ShowTimesController {
  constructor(private readonly showtimesService: ShowTimesService) {}

  @Get(':showtimeId')
  async findById(@Param('showtimeId') showtimeId: number): Promise<ShowTime> {
    return this.showtimesService.findById(showtimeId);
  }

  @Post()
  async createShowTime(
    @Body() showtimes: CreateShowTimeDto,
  ): Promise<ShowTime> {
    return this.showtimesService.create(showtimes);
  }

  @Post('update/:showtimeId')
  updateShowTimes(
    @Param('showtimeId') showtimeId: number,
    @Body() updateData: UpdateShowTimeDto,
  ) {
    return this.showtimesService.update(showtimeId, updateData);
  }

  @Delete(':showtimeId')
  deleteShowTimes(@Param('showtimeId') showtimeId: number) {
    return this.showtimesService.delete(showtimeId);
  }
}
