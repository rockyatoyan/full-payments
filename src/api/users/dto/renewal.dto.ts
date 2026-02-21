import { IsBoolean } from 'class-validator';

export class RenewalDto {
  @IsBoolean()
  renewal: boolean;
}
