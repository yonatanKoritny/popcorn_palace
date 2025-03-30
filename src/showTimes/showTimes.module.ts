import { TypeOrmModule } from "@nestjs/typeorm";
import { ShowTime } from "./entities/showTimes.entity";
import { Module } from "@nestjs/common";
import { ShowTimesController } from "./showTimes.controller";
import { ShowTimesService } from "./showTimes.service";


@Module({
  imports: [TypeOrmModule.forFeature([ShowTime])],
  controllers: [ShowTimesController],
  providers: [ShowTimesService],
})
export class ShowTimesModule {}
