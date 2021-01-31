import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RequestWithUser } from '../auth/interface/request-with-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VoteDto } from './dto/vote.dto';
import { VoteService } from './vote.service';

@Controller('votes')
@UseInterceptors(ClassSerializerInterceptor)
export class VoteController {
  constructor(private voteService: VoteService) {}

  @Post('post')
  @UseGuards(JwtAuthGuard)
  voteOnPost(@Body() voteDto: VoteDto, @Req() req: RequestWithUser) {
    return this.voteService.voteOnPost(voteDto, req.user);
  }

  @Post('comment')
  @UseGuards(JwtAuthGuard)
  voteOnComment(@Body() voteDto: VoteDto, @Req() req: RequestWithUser) {
    return this.voteService.voteOnComment(voteDto, req.user);
  }
}
