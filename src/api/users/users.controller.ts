import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { Auth } from '@/api/auth/decorators/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth()
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }
}
