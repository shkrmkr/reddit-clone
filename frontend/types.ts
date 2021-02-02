export interface Post {
  identifier: string;
  id: number;
  updatedAt: string;
  cretaedAt: string;
  slug: string;
  body?: string;
  subName: string;
  title: string;
  url: string;
  username: string;
  voteScore?: number;
  commentCount?: number;
  userVote?: number;
}

export interface User {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
