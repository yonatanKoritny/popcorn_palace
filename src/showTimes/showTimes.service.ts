import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateShowTimeDto } from "./dtos/create-showTime-dto";
import { UpdateShowTimeDto } from "./dtos/update-showTime-dto";
import { ShowTime } from "./entities/showTimes.entity";

@Injectable()
export class ShowTimesService {
  constructor(
    @InjectRepository(ShowTime)
    private showTimesRepository: Repository<ShowTime>,
  ) {}

  async findAll(): Promise<ShowTime[]> {
    return this.showTimesRepository.find();
  }

  async findAllShowTimesInTheater(theater: string): Promise<ShowTime[]> {
    return this.showTimesRepository.find({where: { theater }});
  }

  async findById(id: number): Promise<ShowTime> {
    return this.showTimesRepository.findOne({ where: { id } });
  } 

  async create(showTimeData: CreateShowTimeDto): Promise<ShowTime> {
    await this.checkShowTimesConflict(showTimeData);

    const showTime = this.showTimesRepository.create(showTimeData); 
    return this.showTimesRepository.save(showTime); 
  }

  private async checkShowTimesConflict(showTimeData: CreateShowTimeDto) {
    const existingShowTimesInTheater = await this.findAllShowTimesInTheater(showTimeData.theater);
    if (this._checkForConflicts(existingShowTimesInTheater, showTimeData)) {
      throw new Error("ShowTime conflict detected.");
    }
  }

  async update(showTimeId: number , showTime: UpdateShowTimeDto): Promise<ShowTime> {
    const showTimeToUpdate = await this.findById(showTimeId)
    if (!showTimeToUpdate) throw new NotFoundException(`ShowTime "${showTimeId}" not found.`);
    await this.showTimesRepository.update(showTimeToUpdate.id, showTime); 
    return this.findById(showTimeToUpdate.id);
  }
  async delete(id: number): Promise<void> {
    await this.showTimesRepository.delete(id);
  }

  _checkForConflicts(
    existingShowTimes: ShowTime[],
    newShowTime: CreateShowTimeDto,
  ): boolean {
    return existingShowTimes.some(existing => {
      const existingStart = new Date(existing.startTime).getTime();
      const existingEnd = new Date(existing.endTime).getTime();
      const newStart = new Date(newShowTime.startTime).getTime();
      const newEnd = new Date(newShowTime.endTime).getTime();

      return (
      (newStart >= existingStart && newStart < existingEnd) || 
      (newEnd > existingStart && newEnd <= existingEnd) || 
      (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  }
}
