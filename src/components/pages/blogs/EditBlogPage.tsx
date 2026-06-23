"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box } from "@mui/material";
import BlogForm from "@/components/admin/BlogForm";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAdminBlog } from "@/hooks/blogs/useBlogQueries";
import { useUpdateBlog } from "@/hooks/blogs/useBlogMutations";
import type { BlogInput } from "@/types/blog";

interface EditBlogPageProps {
  id: string;
}

const EditBlogPage = ({ id }: EditBlogPageProps): React.JSX.Element => {
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: blog, isLoading, isError } = useAdminBlog(id);
  const updateBlogMutation = useUpdateBlog(id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpdateBlog = async (input: BlogInput): Promise<void> => {
    setErrorMessage(null);

    try {
      await updateBlogMutation.mutateAsync(input);
      router.push("/admin");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "เกิดข้อผิดพลาดในการแก้ไขบล็อก"));
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Alert severity="error" sx={{ maxWidth: 520, mx: "auto" }}>
          ไม่พบบล็อกด้วยรหัสนี้ หรือเกิดข้อผิดพลาดในการเชื่อมต่อ
        </Alert>
      </Box>
    );
  }

  return (
    <BlogForm
      key={blog.id}
      errorMessage={errorMessage}
      heading="แก้ไขบทความ"
      blogId={id}
      initialValues={{
        title: blog.title,
        content: blog.content,
        slug: blog.slug,
        coverImage: blog.coverImage,
        additionalImages: blog.additionalImages || [],
        published: blog.published,
      }}
      isSubmitting={updateBlogMutation.isPending}
      onSubmit={handleUpdateBlog}
      submitLabel="บันทึกการแก้ไข"
      submitPendingLabel="กำลังบันทึก..."
    />
  );
};

export default EditBlogPage;
