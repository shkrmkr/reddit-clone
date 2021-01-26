import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilService } from 'src/util/util.service';
import { Repository } from 'typeorm';

import { Sub } from '../sub/sub.entity';
import { User } from '../user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(Sub) private subRepository: Repository<Sub>,
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
    await this.postRepository.save(post);
    return post;
  }

  readAll(): Promise<Post[]> {
    return this.postRepository.find({ order: { createdAt: 'DESC' } });
  }

  async read(identifier: string, slug: string): Promise<Post> {
    const post = await this.postRepository.findOne({ identifier, slug });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
}
