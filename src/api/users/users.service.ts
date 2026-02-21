import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { RenewalDto } from './dto/renewal.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async toggleRenewal(userId: string, dto: RenewalDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isAllowedAutoRenewal = dto.renewal;
    await this.userRepository.save(user);

    return { renewal: user.isAllowedAutoRenewal };
  }
}
