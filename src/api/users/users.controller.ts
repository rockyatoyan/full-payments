import { Controller, Get, Patch, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { Auth } from '@/api/auth/decorators/auth.decorator';
import { RenewalDto } from './dto/renewal.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth()
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }

  @Auth()
  @Patch('renewal')
  toggleRenewal(@Req() req: Request, dto: RenewalDto) {
    const userId = req.user!.id;
    return this.usersService.toggleRenewal(userId, dto);
  }
}
