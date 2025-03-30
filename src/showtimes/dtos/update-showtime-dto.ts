import { PartialType } from '@nestjs/mapped-types';
import { CreateShowtimeDto as CreateShowtimeDto } from './create-showtime-dto';

export class UpdateShowtimeDto extends PartialType(CreateShowtimeDto) {}
