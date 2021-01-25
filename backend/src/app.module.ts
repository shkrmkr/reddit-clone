import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, AuthModule, PostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
