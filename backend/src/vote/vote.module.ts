import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentVote } from './comment-vote.entity';
import { PostVote } from './post-vote.entity';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';

@Module({
  imports: [TypeOrmModule.forFeature([CommentVote, PostVote, Comment, Post])],
  providers: [VoteService],
  controllers: [VoteController],
})
export class VoteModule {}
