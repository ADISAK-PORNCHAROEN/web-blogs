"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBlog,
  createComment,
  deleteBlog,
  publishBlog,
  updateBlog,
  uploadBlogImage,
} from "@/services/blogs/blog.service";
import type { BlogInput } from "@/types/blog";
import type { CommentInput } from "@/types/comment";
import { blogQueryKeys } from "./queryKeys";

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BlogInput) => createBlog(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: blogQueryKeys.all });
    },
  });
};

export const useUpdateBlog = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BlogInput) => updateBlog(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: blogQueryKeys.all });
    },
  });
};

export const usePublishBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) => publishBlog(id, published),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: blogQueryKeys.all });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: blogQueryKeys.all });
    },
  });
};

export const useCreateComment = (blogId: string, slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CommentInput) => createComment(blogId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: blogQueryKeys.detail(slug) });
    },
  });
};

export const useUploadBlogImage = () => {
  return useMutation({
    mutationFn: ({ file, blogId }: { file: File; blogId: string }) => uploadBlogImage(file, blogId),
  });
};
