import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class IdentifyUserIdDTO {
  @IsNumber()
  @Type(() => Number)
  id: number;
}
