import axiosInstance from "@/lib/axios";
import type { AdminComment } from "@/types/comment";

export const fetchAdminComments = async (): Promise<AdminComment[]> => {
  const response = await axiosInstance.get<AdminComment[]>("/api/comments");
  return response.data;
};

export const approveComment = async (commentId: string): Promise<void> => {
  await axiosInstance.patch(`/api/comments/${commentId}/approve`);
};

export const rejectComment = async (commentId: string): Promise<void> => {
  await axiosInstance.patch(`/api/comments/${commentId}/reject`);
};
