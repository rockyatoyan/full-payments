import { IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @MinLength(2)
  name: string;

  @MinLength(3)
  password: string;
}
