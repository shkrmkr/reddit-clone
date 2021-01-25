import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RequestWithUser } from './interface/request-with-user.interface';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    const user = await this.authService.register(registerDto);
    const token = this.authService.generateToken({
      sub: user.id,
      username: user.username,
    });

    req.res
      .cookie('Authentication', token, {
        httpOnly: true,
        path: '/',
        // TODO: (DEPLOY) SSL 적용 후 `secure: true`로 변경 (또는 environment에 따라 true 또는 false를 반환하는 코드 작성)
        secure: false,
        maxAge: this.configService.get('JWT_EXPIRES_IN') * 1000,
      })
      .send();
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: RequestWithUser) {
    const { user } = req;

    const token = this.authService.generateToken({
      sub: user.id,
      username: user.username,
    });

    req.res
      .cookie('Authentication', token, {
        httpOnly: true,
        path: '/',
        // TODO: (DEPLOY) SSL 적용 후 `secure: true`로 변경 (또는 environment에 따라 true 또는 false를 반환하는 코드 작성)
        secure: false,
        maxAge: this.configService.get('JWT_EXPIRES_IN') * 1000,
      })
      .send();
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request) {
    req.res.cookie('Authentication', '', { maxAge: 0 }).send();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: RequestWithUser): User {
    return req.user;
  }
}
