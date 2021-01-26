import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubService } from './sub.service';
import { Sub } from './sub.entity';
import { SubController } from './sub.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sub])],
  providers: [SubService],
  controllers: [SubController],
})
export class SubModule {}
