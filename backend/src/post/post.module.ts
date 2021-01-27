import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostController } from './post.controller';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { UtilModule } from '../util/util.module';
import { Sub } from '../sub/sub.entity';
import { Comment } from '../comment/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Sub, Comment]), UtilModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
