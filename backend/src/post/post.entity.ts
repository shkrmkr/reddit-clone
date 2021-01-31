import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { BaseContent } from '../base-content.entity';
import { User } from '../user/user.entity';
import { Sub } from '../sub/sub.entity';
import { Comment } from '../comment/comment.entity';
import { PostVote } from '../vote/post-vote.entity';

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

  @Column()
  username: string;

  @Column({ nullable: true, type: 'text' })
  body: string;

  @Column()
  subName: string;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @ManyToOne(() => Sub)
  @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  sub: Sub;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Exclude()
  @OneToMany(() => PostVote, (vote) => vote.post)
  votes: PostVote[];

  @Expose()
  get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  @Expose()
  get commentCount(): number {
    return this.comments?.length;
  }

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
