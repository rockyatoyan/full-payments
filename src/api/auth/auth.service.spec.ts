import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from '@/configs';
import { SignUpDto } from './dto/sign-up.dto';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: getJwtConfig,
          inject: [ConfigService],
        }),
      ],
      providers: [
        AuthService,
        {
          provide: 'UserRepository',
          useClass: jest.fn(() => ({
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          })),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign up a new user', async () => {
    const dto: SignUpDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    };

    const user = {
      id: '1',
      email: dto.email,
      name: dto.name,
      password: dto.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(service['userRepository'], 'findOneBy').mockResolvedValue(null);
    jest.spyOn(service['userRepository'], 'create').mockReturnValue(user);
    jest.spyOn(service['userRepository'], 'save').mockResolvedValue(user);

    const result = await service.signUp(dto);
    
    expect({
      id: result.id,
      email: result.email,
      name: result.name,
    }).toEqual({
      id: user.id,
      email: dto.email,
      name: dto.name,
    });
  });
});
