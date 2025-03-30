import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { CreateShowTimeDto } from './dtos/create-showTime-dto';
import { UpdateShowTimeDto } from './dtos/update-showTime-dto';
import { ShowTime } from './entities/showTimes.entity';
import { ShowTimesService } from './showTimes.service';

@Controller('showTimes')
export class ShowTimesController {
  constructor(private readonly showTimesService: ShowTimesService) {}

  @Get(':showtimeId')
  async findById(@Param('showtimeId') showtimeId: number): Promise<ShowTime> {
    return this.showTimesService.findById(showtimeId);
  }

  @Post()
  async createShowTime(@Body() showTimes: CreateShowTimeDto): Promise<ShowTime> {
    return this.showTimesService.create(showTimes);
  }

  @Post('update/:showtimeId')
  updateShowTimes(
    @Param('showtimeId') showTimeId: number,
    @Body() updateData: UpdateShowTimeDto,
  ) {
    return this.showTimesService.update(showTimeId, updateData);
  }

  @Delete(':showtimeId')
  deleteShowTimes(@Param('showtimeId') showTimeId: number) {
    return this.showTimesService.delete(showTimeId);
  }
}
