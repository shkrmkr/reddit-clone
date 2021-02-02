import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from '../comment/comment.entity';
import { UtilService } from '../util/util.service';
import { Sub } from '../sub/sub.entity';
import { User } from '../user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Sub) private subRepository: Repository<Sub>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private utilService: UtilService,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const sub = await this.subRepository.findOne({
      name: createPostDto.subName,
    });

    if (!sub) {
      throw new NotFoundException(`Sub '${createPostDto.subName}' not found`);
    }

    const identifier = this.utilService.getIdentifier(7);
    const slug = this.utilService.slugify(createPostDto.title);

    const post = this.postRepository.create({
      ...createPostDto,
      slug,
      identifier,
      user,
      sub,
    });
    return this.postRepository.save(post);
  }

  async readAll(user: User): Promise<Post[]> {
    const posts = await this.postRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['votes', 'comments'],
    });

    console.log(user);

    if (user.username) {
      posts.forEach((post) => post.setUserVote(user));
    }

    return posts;
  }

  async read(identifier: string, slug: string): Promise<Post> {
    const post = await this.postRepository.findOne(
      { identifier, slug },
      { relations: ['sub', 'votes', 'comments'] },
    );

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    identifier: string,
    slug: string,
    user: User,
  ): Promise<Comment> {
    const post = await this.postRepository.findOne({ identifier, slug });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const commentIdentifier = this.utilService.getIdentifier(8);

    const comment = await this.commentRepository.create({
      ...createCommentDto,
      identifier: commentIdentifier,
      post,
      user,
    });

    return this.commentRepository.save(comment);
  }
}
