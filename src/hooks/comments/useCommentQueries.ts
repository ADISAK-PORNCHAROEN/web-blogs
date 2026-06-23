"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminComments } from "@/services/comments/comment.service";
import { commentQueryKeys } from "./queryKeys";

export const useAdminComments = () => {
  return useQuery({
    queryKey: commentQueryKeys.adminList,
    queryFn: fetchAdminComments,
  });
};
