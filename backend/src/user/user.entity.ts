import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseContent } from '../base-content.entity';
import { Post } from '../post/post.entity';
import { CommentVote } from '../vote/comment-vote.entity';
import { PostVote } from '../vote/post-vote.entity';

@Entity('users')
export class User extends BaseContent {
  constructor(params: Partial<User>) {
    super();
    Object.keys((key: string) => {
      this[key] = params[key];
    });
  }

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => CommentVote, (commentVote) => commentVote.user)
  commentVotes: CommentVote[];

  @OneToMany(() => PostVote, (postVote) => postVote.user)
  postVotes: PostVote[];
}
