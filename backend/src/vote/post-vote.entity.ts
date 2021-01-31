import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseContent } from '../base-content.entity';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Entity('post_votes')
export class PostVote extends BaseContent {
  @Column()
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column()
  username: string;

  @ManyToOne(() => Post)
  post: Post;
}
