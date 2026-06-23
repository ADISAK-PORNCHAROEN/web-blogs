"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveComment, rejectComment } from "@/services/comments/comment.service";
import { commentQueryKeys } from "./queryKeys";

export const useApproveComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => approveComment(commentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: commentQueryKeys.all });
    },
  });
};

export const useRejectComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => rejectComment(commentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: commentQueryKeys.all });
    },
  });
};
