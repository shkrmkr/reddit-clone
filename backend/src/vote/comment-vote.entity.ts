import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseContent } from '../base-content.entity';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';

@Entity('comment_votes')
export class CommentVote extends BaseContent {
  @Column()
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column()
  username: string;

  @ManyToOne(() => Comment)
  comment: Comment;
}
