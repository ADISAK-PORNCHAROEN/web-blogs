"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminBlog, fetchBlogDetail, fetchBlogs } from "@/services/blogs/blog.service";
import type { BlogListParams } from "@/types/blog";
import { blogQueryKeys } from "./queryKeys";

export const useBlogList = (params: BlogListParams) => {
  return useQuery({
    queryKey: blogQueryKeys.publicList(params),
    queryFn: () => fetchBlogs(params),
  });
};

export const useAdminBlogList = (params: BlogListParams) => {
  return useQuery({
    queryKey: blogQueryKeys.adminList(params),
    queryFn: () =>
      fetchBlogs({
        ...params,
        all: true,
      }),
  });
};

export const useBlogDetail = (slug: string) => {
  return useQuery({
    queryKey: blogQueryKeys.detail(slug),
    queryFn: () => fetchBlogDetail(slug),
    enabled: slug.length > 0,
  });
};

export const useAdminBlog = (id: string) => {
  return useQuery({
    queryKey: blogQueryKeys.adminDetail(id),
    queryFn: () => fetchAdminBlog(id),
    enabled: id.length > 0,
  });
};
