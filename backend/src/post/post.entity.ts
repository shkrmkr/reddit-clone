import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseContent } from '../base-content.entity';
import { User } from '../user/user.entity';

@Entity('posts')
export class Post extends BaseContent {
  @Column()
  identifier: string;

  @Index()
  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: 'text' })
  body: string;

  @Column()
  subName: string;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;
}
