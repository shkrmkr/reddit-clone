import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private async validatePassword(
    givenPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordCorrect = await bcrypt.compare(
      givenPassword,
      hashedPassword,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException('Incorrect email or password');
    }
  }

  async register(registerUserDto: RegisterDto): Promise<User> {
    const { email, password, username } = registerUserDto;

    const errors: any = {};

    const userWithGivenEmail = await this.userService.findOneByEmail(email);
    const userWithGivenUsername = await this.userService.findOneByUsername(
      username,
    );

    if (userWithGivenEmail) {
      errors.email = 'Email already taken';
    }

    if (userWithGivenUsername) {
      errors.username = 'Username already taken';
    }

    if (Object.keys(errors).length > 0) {
      throw new ConflictException(errors);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userService.create({
      ...registerUserDto,
      password: hashedPassword,
    });

    return newUser;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Incorrect email or password');
    }

    await this.validatePassword(password, user.password);

    return user;
  }

  generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
