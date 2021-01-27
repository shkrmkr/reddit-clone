import { IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @MinLength(3, { message: 'Must be at least 3 characters long' })
  username: string;

  @IsEmail(undefined, { message: 'Must be a valid email address' })
  email: string;

  @MinLength(6, { message: 'Must be at least 6 characters long' })
  password: string;
}
