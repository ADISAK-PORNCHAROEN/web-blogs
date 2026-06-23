"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import { getApiErrorMessage } from "@/lib/apiError";
import { useCreateBlog } from "@/hooks/blogs/useBlogMutations";
import type { BlogInput } from "@/types/blog";

const CreateBlogPage = (): React.JSX.Element => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createBlogMutation = useCreateBlog();
  const [blogId] = useState(() => crypto.randomUUID());

  const handleCreateBlog = async (input: BlogInput): Promise<void> => {
    setErrorMessage(null);

    try {
      await createBlogMutation.mutateAsync({
        ...input,
        id: blogId,
      });
      router.push("/admin");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "เกิดข้อผิดพลาดในการสร้างบล็อก"));
    }
  };

  return (
    <BlogForm
      errorMessage={errorMessage}
      heading="สร้างบทความใหม่"
      blogId={blogId}
      initialValues={{
        title: "",
        content: "",
        slug: "",
        coverImage: "",
        additionalImages: [],
        published: false,
      }}
      isSubmitting={createBlogMutation.isPending}
      onSubmit={handleCreateBlog}
      submitLabel="บันทึกและสร้างบล็อก"
      submitPendingLabel="กำลังบันทึก..."
    />
  );
};

export default CreateBlogPage;
