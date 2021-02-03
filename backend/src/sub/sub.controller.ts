import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RequestWithUser } from '../auth/interface/request-with-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSubDto } from './dto/create-sub.dto';
import { SubService } from './sub.service';

@Controller('subs')
@UseInterceptors(ClassSerializerInterceptor)
export class SubController {
  constructor(private subService: SubService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createSub(@Body() createSubDto: CreateSubDto, @Req() req: RequestWithUser) {
    return this.subService.create(createSubDto, req.user);
  }

  @Get(':name')
  @UseGuards(AuthGuard(['jwt', 'anonymous']))
  getSub(@Param('name') name: string, @Req() req: RequestWithUser) {
    return this.subService.read(name, req.user);
  }
}
