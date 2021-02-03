import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { CreateSubDto } from './dto/create-sub.dto';
import { Sub } from './sub.entity';

@Injectable()
export class SubService {
  constructor(
    @InjectRepository(Sub) private subRepository: Repository<Sub>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  private async validateSubName(subName: string): Promise<void> {
    const sub = await this.subRepository
      .createQueryBuilder('sub')
      .where('lower(sub.name)=:name', { name: subName.toLocaleLowerCase() })
      .getOne();

    if (sub) {
      throw new ConflictException('Sub name already taken');
    }
  }

  async create(createSubDto: CreateSubDto, user: User): Promise<Sub> {
    await this.validateSubName(createSubDto.name);
    const sub = this.subRepository.create({ ...createSubDto, user });
    return this.subRepository.save(sub);
  }

  async read(name: string, user: User) {
    const sub = await this.subRepository.findOne({ name });

    if (!sub) {
      throw new NotFoundException('Sub not found');
    }

    const posts = await this.postRepository.find({
      where: { sub },
      order: { createdAt: 'DESC' },
      relations: ['comments', 'votes'],
    });

    sub.posts = posts;

    if (user.username) {
      sub.posts.forEach((post) => post.setUserVote(user));
    }

    return sub;
  }
}
