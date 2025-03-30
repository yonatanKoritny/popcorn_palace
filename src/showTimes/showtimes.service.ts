import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShowTimeDto } from './dtos/create-showtime-dto';
import { UpdateShowTimeDto } from './dtos/update-showtime-dto';
import { ShowTime } from './entities/showtimes.entity';

@Injectable()
export class ShowTimesService {
  constructor(
    @InjectRepository(ShowTime)
    private showtimesRepository: Repository<ShowTime>,
  ) {}

  async findAll(): Promise<ShowTime[]> {
    return this.showtimesRepository.find();
  }

  async findAllShowTimesInTheater(theater: string): Promise<ShowTime[]> {
    return this.showtimesRepository.find({ where: { theater } });
  }

  async findById(id: number): Promise<ShowTime> {
    return this.showtimesRepository.findOne({ where: { id } });
  }

  async create(showtimeData: CreateShowTimeDto): Promise<ShowTime> {
    await this.checkShowTimesConflict(showtimeData);

    const showtime = this.showtimesRepository.create(showtimeData);
    return this.showtimesRepository.save(showtime);
  }

  private async checkShowTimesConflict(showtimeData: CreateShowTimeDto) {
    const existingShowTimesInTheater = await this.findAllShowTimesInTheater(
      showtimeData.theater,
    );
    if (this._checkForConflicts(existingShowTimesInTheater, showtimeData)) {
      throw new Error('ShowTime conflict detected.');
    }
  }

  async update(
    showtimeId: number,
    showtime: UpdateShowTimeDto,
  ): Promise<ShowTime> {
    const showtimeToUpdate = await this.findById(showtimeId);
    if (!showtimeToUpdate)
      throw new NotFoundException(`ShowTime "${showtimeId}" not found.`);
    await this.showtimesRepository.update(showtimeToUpdate.id, showtime);
    return this.findById(showtimeToUpdate.id);
  }
  async delete(id: number): Promise<void> {
    await this.showtimesRepository.delete(id);
  }

  _checkForConflicts(
    existingShowTimes: ShowTime[],
    newShowTime: CreateShowTimeDto,
  ): boolean {
    return existingShowTimes.some((existing) => {
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
