import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostController } from './post.controller';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { UtilModule } from '../util/util.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UtilModule],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
