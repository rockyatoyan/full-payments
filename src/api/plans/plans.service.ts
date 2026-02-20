import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan) private planRepository: Repository<Plan>,
  ) {}

  async findAll() {
    const plans = await this.planRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return plans;
  }
}
