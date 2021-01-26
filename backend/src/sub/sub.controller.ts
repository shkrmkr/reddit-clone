import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { RequestWithUser } from '../auth/interface/request-with-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSubDto } from './dto/create-sub.dto';
import { SubService } from './sub.service';

@Controller('subs')
export class SubController {
  constructor(private subService: SubService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createSub(@Body() createSubDto: CreateSubDto, @Req() req: RequestWithUser) {
    return this.subService.create(createSubDto, req.user);
  }
}
