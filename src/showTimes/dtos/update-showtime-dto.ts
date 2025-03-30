import { PartialType } from '@nestjs/mapped-types';
import { CreateShowTimeDto as CreateShowTimeDto } from './create-showtime-dto';

export class UpdateShowTimeDto extends PartialType(CreateShowTimeDto) {}
