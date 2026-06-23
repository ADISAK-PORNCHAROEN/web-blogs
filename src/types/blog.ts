import { Comment } from "./comment";

export interface Blog {
  id: string;
  title: string;
  content: string;
  slug: string;
  coverImage: string;
  additionalImages: string[] | null;
  views: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  comments?: Comment[];
}

export interface BlogInput {
  id?: string;
  title: string;
  content: string;
  slug: string;
  coverImage: string;
  additionalImages?: string[];
  published?: boolean;
}

export interface BlogImageUploadResponse {
  url: string;
}

export interface BlogListParams {
  page: number;
  search: string;
  all?: boolean;
}

export interface PaginatedBlogs {
  data: Blog[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}
