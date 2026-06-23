import type { Blog } from "./blog";

export interface Comment {
  id: string;
  senderName: string;
  content: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CommentInput {
  senderName: string;
  content: string;
}

export interface AdminComment extends Comment {
  blog?: Blog;
}
