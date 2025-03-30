import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowTime } from './entities/showtimes.entity';
import { Module } from '@nestjs/common';
import { ShowTimesController } from './showtimes.controller';
import { ShowTimesService } from './showtimes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShowTime])],
  controllers: [ShowTimesController],
  providers: [ShowTimesService],
})
export class ShowTimesModule {}
