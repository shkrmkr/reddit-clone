import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post as PostRoute,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CreateCommentDto } from '../comment/dto/create-comment.dto';
import { RequestWithUser } from '../auth/interface/request-with-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('posts')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(private postService: PostService) {}

  @PostRoute()
  @UseGuards(JwtAuthGuard)
  createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: RequestWithUser,
  ) {
    return this.postService.create(createPostDto, req.user);
  }

  @Get()
  getAllPosts() {
    return this.postService.readAll();
  }

  @Get(':identifier/:slug')
  getPost(
    @Param('identifier') identifier: string,
    @Param('slug') slug: string,
  ) {
    return this.postService.read(identifier, slug);
  }

  @PostRoute(':identifier/:slug/comments')
  @UseGuards(JwtAuthGuard)
  createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: RequestWithUser,
    @Param('identifier') identifier: string,
    @Param('slug') slug: string,
  ) {
    return this.postService.createComment(
      createCommentDto,
      identifier,
      slug,
      req.user,
    );
  }
}
