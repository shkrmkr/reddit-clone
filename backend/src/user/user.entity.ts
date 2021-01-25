import { Column, Entity, OneToMany } from 'typeorm';

import { BaseContent } from '../base-content.entity';
import { Post } from '../post/post.entity';

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

  @Column()
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
