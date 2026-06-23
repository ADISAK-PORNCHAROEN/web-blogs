import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import backendAxios from "@/lib/backendAxios";
import type { Comment } from "@/types/comment";

interface CustomSession {
  user: {
    accessToken: string;
  };
}

interface CommentsApiEnvelope {
  success: boolean;
  message: string;
  data: Comment[];
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const normalizeComments = (value: unknown): Comment[] => {
  if (Array.isArray(value)) {
    return value as Comment[];
  }

  if (isRecord(value) && Array.isArray(value.data)) {
    return value.data as Comment[];
  }

  throw new Error("Unexpected comments response shape");
};

export async function GET() {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  if (!session || !session.user?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await backendAxios.get<CommentsApiEnvelope>("/blogs/admin/comments", {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    return NextResponse.json(normalizeComments(response.data));
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
    console.error("API GET /comments error:", err.response?.data || err.message);
    return NextResponse.json(
      { message: err.response?.data?.message || "Failed to fetch comments" },
      { status: err.response?.status || 500 }
    );
  }
}
