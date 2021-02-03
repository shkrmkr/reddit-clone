import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubService } from './sub.service';
import { Sub } from './sub.entity';
import { SubController } from './sub.controller';
import { Post } from '../post/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sub, Post])],
  providers: [SubService],
  controllers: [SubController],
})
export class SubModule {}
