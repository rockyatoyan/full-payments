import { Module } from '@nestjs/common';
import { SubsriptionsService } from './subsriptions.service';
import { SubsriptionsController } from './subsriptions.controller';

@Module({
  controllers: [SubsriptionsController],
  providers: [SubsriptionsService],
})
export class SubsriptionsModule {}
