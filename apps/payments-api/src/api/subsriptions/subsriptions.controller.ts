import { Controller } from '@nestjs/common';
import { SubsriptionsService } from './subsriptions.service';

@Controller('subsriptions')
export class SubsriptionsController {
  constructor(private readonly subsriptionsService: SubsriptionsService) {}
}
