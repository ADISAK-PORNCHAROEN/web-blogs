import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import backendAxios from "@/lib/backendAxios";
import type { PaginatedBlogs } from "@/types/blog";

interface CustomSession {
  user: {
    accessToken: string;
  };
}

interface BlogsApiEnvelope {
  success: boolean;
  message: string;
  data: PaginatedBlogs;
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isPaginatedBlogs = (value: unknown): value is PaginatedBlogs => {
  return (
    isRecord(value) &&
    Array.isArray(value.data) &&
    typeof value.total === "number" &&
    typeof value.page === "number" &&
    typeof value.limit === "number" &&
    typeof value.lastPage === "number"
  );
};

const normalizePaginatedBlogs = (value: unknown): PaginatedBlogs => {
  if (isPaginatedBlogs(value)) {
    return value;
  }

  if (isRecord(value) && isPaginatedBlogs(value.data)) {
    return value.data;
  }

  throw new Error("Unexpected blogs response shape");
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const all = searchParams.get("all") || "false";

  try {
    const response = await backendAxios.get<BlogsApiEnvelope>("/blogs", {
      params: { page, search, all },
    });
    return NextResponse.json(normalizePaginatedBlogs(response.data));
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
    console.error("API GET /blogs error:", err.response?.data || err.message);
    return NextResponse.json(
      { message: err.response?.data?.message || "Failed to fetch blogs" },
      { status: err.response?.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  if (!session || !session.user?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const response = await backendAxios.post("/blogs", body, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
    console.error("API POST /blogs error:", err.response?.data || err.message);
    return NextResponse.json(
      { message: err.response?.data?.message || "Failed to create blog" },
      { status: err.response?.status || 500 }
    );
  }
}
