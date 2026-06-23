import { NextRequest, NextResponse } from "next/server";
import backendAxios from "@/lib/backendAxios";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const response = await backendAxios.get(`/blogs/detail/${slug}`);
    const blogData = response.data && typeof response.data === "object" && "data" in response.data ? response.data.data : response.data;
    return NextResponse.json(blogData);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
    console.error(`API GET /blogs/detail/${slug} error:`, err.response?.data || err.message);
    return NextResponse.json(
      { message: err.response?.data?.message || "Failed to fetch blog details" },
      { status: err.response?.status || 500 }
    );
  }
}
