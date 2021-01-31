import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentVote } from './comment-vote.entity';
import { PostVote } from './post-vote.entity';
import { User } from '../user/user.entity';
import { VoteDto } from './dto/vote.dto';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(CommentVote)
    private commentVoteRepository: Repository<CommentVote>,
    @InjectRepository(PostVote)
    private postVoteRepository: Repository<PostVote>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async voteOnPost(voteDto: VoteDto, user: User): Promise<Post> {
    const { identifier, slug, value } = voteDto;
    let post = await this.postRepository.findOne({ identifier, slug });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let postVote = await this.postVoteRepository.findOne({
      username: user.username,
      post,
    });

    if (!postVote) {
      postVote = this.postVoteRepository.create({
        user,
        post,
        value,
      });
      await this.postVoteRepository.save(postVote);
    } else if (postVote.value === value) {
      await this.postVoteRepository.remove(postVote);
    } else {
      postVote.value = value;
      await this.postVoteRepository.save(postVote);
    }

    post = await this.postRepository.findOne(
      { identifier, slug },
      { relations: ['comments', 'comments.votes', 'sub', 'votes'] },
    );

    post.setUserVote(user);
    post.comments.forEach((comment) => comment.setUserVote(user));
    return post;
  }

  async voteOnComment(voteDto: VoteDto, user: User) {
    const { identifier, value, slug, commentIdentifier } = voteDto;
    let post = await this.postRepository.findOne(
      { identifier, slug },
      { relations: ['comments'] },
    );

    if (!post) {
      throw new NotFoundException('Post not found. Could not vote on comment.');
    }

    const comment = post.comments.find(
      (comment) => comment.identifier === commentIdentifier,
    );

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    let commentVote = await this.commentVoteRepository.findOne({
      username: user.username,
      comment,
    });

    if (!commentVote) {
      commentVote = this.commentVoteRepository.create({ user, value, comment });
      await this.commentVoteRepository.save(commentVote);
    } else if (commentVote.value === value) {
      await this.commentVoteRepository.remove(commentVote);
    } else {
      commentVote.value = value;
      await this.commentVoteRepository.save(commentVote);
    }

    post = await this.postRepository.findOne(
      { identifier, slug },
      { relations: ['comments', 'comments.votes', 'sub', 'votes'] },
    );
    post.setUserVote(user);
    post.comments.forEach((comment) => comment.setUserVote(user));
    return post;
  }
}
