import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { CommentVote } from '../vote/comment-vote.entity';
import { BaseContent } from '../base-content.entity';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';

@Entity('comments')
export class Comment extends BaseContent {
  @Index()
  @Column()
  identifier: string;

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  post: Post;

  @Exclude()
  @OneToMany(() => CommentVote, (vote) => vote.comment)
  votes: CommentVote[];

  @Expose()
  get voteScore(): number {
    return this.votes?.reduce((acc, cur) => acc + cur.value, 0) || 0;
  }

  protected userVote: number;
  setUserVote(user: User) {
    const vote = this.votes?.find((vote) => vote.username === user.username);
    this.userVote = vote?.value || 0;
  }
}
