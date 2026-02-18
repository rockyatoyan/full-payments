import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { hash, verify } from 'argon2';
import { Request, Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/jwt.interface';
import { isDev } from '@/utils';

@Injectable()
export class AuthService {
  private ACCESS_TOKEN_TTL: number;
  private REFRESH_TOKEN_TTL: number;

  private REFRESH_TOKEN_COOKIE_NAME = 'payments_refresh_token';

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.ACCESS_TOKEN_TTL = this.configService.getOrThrow<number>(
      'ACCESS_TOKEN_EXPIRATION',
    );
    this.REFRESH_TOKEN_TTL = this.configService.getOrThrow<number>(
      'REFRESH_TOKEN_EXPIRATION',
    );
  }

  async signUp(dto: SignUpDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: dto.email,
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await hash(dto.password);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const { password, ...result } = await this.userRepository.save(user);

    return result;
  }

  async signIn(res: Response, dto: SignInDto) {
    const user = await this.userRepository.findOneBy({ email: dto.email });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await verify(user.password, dto.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);

    this.setRefreshTokenCookie(res, refreshToken);

    const { password, ...result } = user;

    return { user: result, accessToken };
  }

  async signOut(res: Response) {
    res.clearCookie(this.REFRESH_TOKEN_COOKIE_NAME);
    return { ok: true };
  }

  async refreshTokens(req: Request) {
    const refreshToken = req.cookies[this.REFRESH_TOKEN_COOKIE_NAME];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload =
        await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
      const user = await this.userRepository.findOneBy({ id: payload.userId });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const { accessToken } = await this.generateTokens(user);

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.getOrThrow<string>('COOKIE_DOMAIN'),
      secure: !isDev(this.configService),
    });
  }

  private async generateTokens(user: User) {
    const payload: JwtPayload = { userId: user.id };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.ACCESS_TOKEN_TTL,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.REFRESH_TOKEN_TTL,
    });

    return { accessToken, refreshToken };
  }
}
