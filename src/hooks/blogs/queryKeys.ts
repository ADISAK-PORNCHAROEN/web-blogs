import type { BlogListParams } from "@/types/blog";

export const blogQueryKeys = {
  all: ["blogs"] as const,
  publicList: (params: BlogListParams) => ["blogs", "public-list", params] as const,
  adminList: (params: BlogListParams) => ["blogs", "admin-list", params] as const,
  detail: (slug: string) => ["blogs", "detail", slug] as const,
  adminDetail: (id: string) => ["blogs", "admin-detail", id] as const,
};
