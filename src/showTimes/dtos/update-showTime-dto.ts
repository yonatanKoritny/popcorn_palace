import { PartialType } from '@nestjs/mapped-types';
import { CreateShowTimeDto as CreateShowTimeDto } from './create-showTime-dto';


export class UpdateShowTimeDto extends PartialType(CreateShowTimeDto) {}
