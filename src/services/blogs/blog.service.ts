import axiosInstance from "@/lib/axios";
import type {
  Blog,
  BlogImageUploadResponse,
  BlogInput,
  BlogListParams,
  PaginatedBlogs,
} from "@/types/blog";
import type { CommentInput } from "@/types/comment";

export const fetchBlogs = async (params: BlogListParams): Promise<PaginatedBlogs> => {
  const response = await axiosInstance.get<PaginatedBlogs>("/api/blogs", {
    params,
  });

  return response.data;
};

export const fetchAdminBlog = async (id: string): Promise<Blog> => {
  const response = await axiosInstance.get<Blog>(`/api/blogs/${id}`);
  return response.data;
};

export const fetchBlogDetail = async (slug: string): Promise<Blog> => {
  const response = await axiosInstance.get<Blog>(`/api/blogs/detail/${slug}`);
  return response.data;
};

export const createBlog = async (input: BlogInput): Promise<void> => {
  await axiosInstance.post("/api/blogs", input);
};

export const updateBlog = async (id: string, input: BlogInput): Promise<void> => {
  await axiosInstance.patch(`/api/blogs/${id}`, input);
};

export const publishBlog = async (id: string, published: boolean): Promise<void> => {
  await axiosInstance.patch(`/api/blogs/${id}/publish`, { published });
};

export const deleteBlog = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/api/blogs/${id}`);
};

export const createComment = async (blogId: string, input: CommentInput): Promise<void> => {
  await axiosInstance.post(`/api/blogs/${blogId}/comments`, input);
};

export const uploadBlogImage = async (file: File, blogId: string): Promise<BlogImageUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post<BlogImageUploadResponse>(
    `/api/uploads/blog-images?blogId=${blogId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
