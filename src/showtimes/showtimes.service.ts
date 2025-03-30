import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateShowtimeDto } from './dtos/create-showtime-dto';
import { UpdateShowtimeDto } from './dtos/update-showtime-dto';
import { Showtime } from './entities/showtimes.entity';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private showtimesRepository: Repository<Showtime>,
    private moviesService: MoviesService,
  ) {}

  async findByTheater(theater: string): Promise<Showtime[]> {
    return this.showtimesRepository.find({ where: { theater } });
  }

  async findById(id: number): Promise<Showtime> {
    const showtime = await this.showtimesRepository.findOne({ where: { id } });
    if (!showtime) throw new NotFoundException(`Showtime "${id}" not found.`);
    return showtime;
  }

  async create(showtimeData: CreateShowtimeDto): Promise<Showtime> {
    await this.moviesService.findById(showtimeData.movieId);

    await this.checkShowtimesConflict(showtimeData);

    const showtime = this.showtimesRepository.create(showtimeData);
    return this.showtimesRepository.save(showtime);
  }

  private async checkShowtimesConflict(showtimeData: CreateShowtimeDto) {
    const existingShowtimesInTheater = await this.findByTheater(
      showtimeData.theater,
    );
    if (this.checkForConflicts(existingShowtimesInTheater, showtimeData)) {
      throw new ConflictException(
        `In theater "${showtimeData.theater}" a showtime already exists in the same time slot.`,
      );
    }
  }

  async update(
    showtimeId: number,
    showtime: UpdateShowtimeDto,
  ): Promise<Showtime> {
    const showtimeToUpdate = await this.findById(showtimeId);
    if (!showtimeToUpdate)
      throw new NotFoundException(`Showtime "${showtimeId}" not found.`);
    await this.showtimesRepository.update(showtimeToUpdate.id, showtime);
    return this.findById(showtimeToUpdate.id);
  }

  async delete(id: number): Promise<void> {
    const showtime = await this.findById(id);
    if (!showtime) throw new NotFoundException(`Showtime "${id}" not found.`);
    await this.showtimesRepository.delete(id);
  }

  private checkForConflicts(
    existingShowtimes: Showtime[],
    newShowtime: CreateShowtimeDto,
  ): boolean {
    return existingShowtimes.some((existing) => {
      const existingStart = new Date(existing.startTime).getTime();
      const existingEnd = new Date(existing.endTime).getTime();
      const newStart = new Date(newShowtime.startTime).getTime();
      const newEnd = new Date(newShowtime.endTime).getTime();

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  }
}
