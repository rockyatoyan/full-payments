import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  signIn(@Res({ passthrough: true }) res: Response, @Body() dto: SignInDto) {
    return this.authService.signIn(res, dto);
  }

  @Post('sign-out')
  signOut(@Res({ passthrough: true }) res: Response) {
    return this.authService.signOut(res);
  }

  @Get('refresh')
  refresh(@Req() req: Request) {
    return this.authService.refreshTokens(req);
  }
}
